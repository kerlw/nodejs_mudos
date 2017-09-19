/**
 * Created by kerlw on 2017/9/8.
 */
var fm = require('framework'),
    fs = require('fs'),
    path = require('path');

var apid = function() {
    if (!(this instanceof apid))
        return new apid();
}

function onActionQueryStatus(session, param) {
    return JSON.stringify({ 'code' : 200, 'body' : {'hb_status' : global.HB_ENGINE.desc() }});
}

function onActionQuery(session, param) {
    console.log(param);
    if (!param || !param.type)
        return JSON.stringify({ 'code' : 101});

    switch (param.type) {
        case 'area_list':
            var areas = queryAreaList(global.MAP_PATH);
            return JSON.stringify({ 'code' : 200, 'areas' : areas });
        case 'room_list':
            var rooms = queryRoomList(global.MAP_PATH);
            return JSON.stringify({ 'code' : 200, 'rooms' : rooms });
        case 'obj_list':
            var objs = queryObjList(global.DATA_PATH, false);
            return JSON.stringify({ 'code' : 200, 'objs' : objs });

        default:
            return JSON.stringify({ 'code' : 101, 'msg' : param.type });
    }
}

function queryAreaList(basePath) {
    var dir = path.normalize(basePath);

    var result = [];

    var files = fs.readdirSync(dir);
    files.forEach(function(file) {
        var pathname = path.join(dir, file),
            stat = fs.lstatSync(pathname),
            fname = path.parse(file).name;

        if (!stat.isDirectory() || fname === 'item' || fname === 'npc' || fname === 'skill' || fname === 'fun')
            return;

        var area = {'name' : fname, 'pathname' : path.relative(global.DATA_PATH, pathname), 'children' : queryAreaList(pathname)};
        result.push(area);
    });

    return result;
}

function queryRoomList(basePath) {
    var dir = path.normalize(basePath);

    var result = [];

    var files = fs.readdirSync(dir);
    files.forEach(function(file) {
        var pathname = path.join(dir, file),
            stat = fs.lstatSync(pathname),
            fname = path.parse(file).name;

        if (stat.isDirectory()) {
            if (fname === 'item' || fname === 'npc' || fname === 'skill' || fname === 'fun') {
                return;
            } else {
                var area = {'name' : fname, 'pathname' : path.relative(global.DATA_PATH, pathname), 'type' : 'folder', 'children' : queryRoomList(pathname)};
                result.push(area);
            }
        } else {
            var room = {'name' : fname, 'pathname' : path.join(path.relative(global.DATA_PATH, dir), fname), 'type' : 'file' };
            result.push(room);
        }
    });

    return result;
}

function queryObjList(basePath, isInObjFolder) {
    var dir = path.normalize(basePath);

    var result = [];

    var files = fs.readdirSync(dir);
    files.forEach(function(file) {
        var pathname = path.join(dir, file),
            stat = fs.lstatSync(pathname),
            fname = path.parse(file).name,
            extname = path.extname(file);
        console.log("extname " + extname + " " + file + ": " + pathname);

        if (stat.isDirectory()) {
            var isIn = (isInObjFolder || fname === 'item' || fname === 'npc');
            var children = queryObjList(pathname, isIn);
            if (children.length > 0) {
                var folder;
                //合并只有一个folder子节点的节点
                if (children.length === 1 && children[0].type === 'folder') {
                    folder = {'name' : fname + "/" + children[0].name, 'pathname' : children[0].pathname, 'type' : 'folder', 'children' : children[0].children };
                } else
                    folder = {'name' : fname, 'pathname' : path.relative(global.DATA_PATH, pathname), 'type' : 'folder', 'children' : children};
                result.push(folder);
            } else {
                return;
            }
        } else if (isInObjFolder && (extname === '.js' || extname === '.json')) {
            var obj = {'name' : fname, 'pathname' : path.join(path.relative(global.DATA_PATH, dir), fname), 'type' : 'file' };
            result.push(obj);
        }
    });

    return result;
}

apid.prototype.onAction = function(action, session, param) {
    switch (action) {
        case 'status':
            return onActionQueryStatus(session, param);
        case 'query':
            return onActionQuery(session, param);
    }
    return JSON.stringify({ 'code':200, 'body':{} });
}

module.exports = apid;