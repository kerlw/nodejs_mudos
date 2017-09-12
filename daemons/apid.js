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
    if (!param || !param.type)
        return JSON.stringify({ 'code' : 101});

    switch (param.type) {
        case 'area_list':
            var areas = queryAreaList(global.MAP_PATH);
            break;
    }
}

function queryAreaList(basePath) {
    var dir = path.normalize(basePath);

    var result = {};

    var files = fs.readdirSync(dir);
    files.forEach(function(file) {
        var pathname = path.join(dir, file),
            stat = fs.lstatSync(pathname),
            fname = path.parse(file).name;

        if (!stat.isDirectory() || fname === 'item' || fname === 'npc' || fname === 'skill' || fname === 'fun')
            return;

        // var area = {'name' : fname, 'path' : }
    });
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