/**
 * Created by kerlw on 2017/9/8.
 */

var path = require('path'),
    fm = require('framework'),
    StringBuilder = require('stringbuilder'),
    fs = require('fs');

var room_builder = function() {
    if (!(this instanceof room_builder))
        return new room_builder();
}

room_builder.prototype.build = function(data) {
    if (data.type != 'room')
        throw "Trying to build room code with non room type data. Data is " + data;

    var oldfile = fm.find_file(data.save_path, data.filename);
    //如果已经存在
    if (oldfile) {
        //进行覆盖确认流程
        if (data.overwrite === null) {
            //TODO send response to user to confirm overwrite
            return;
        } else if (!data.overwrite) {
            return;
        }
    }

    var filename = oldfile || path.join(path.join(global.DATA_PATH, data.save_path), data.filename).toString() + ".js";
    fs.writeFileSync(filename, build_code(data.code_json));
}

room_builder.prototype.build_code = function(src) {
    var sb = new StringBuilder();
    sb.appendLine('var fm = require(\'framework\');').appendLine('');
    sb.appendLine('var {0} = fm.extends(function() {', src.filename);
    sb.appendLine('\tif (!(this instanceof {0})) return new {0}', src.filename);
    sb.appendLine('\tthis.name = \'{0}\';', src.name);
    sb.appendLine('\tthis.desc = \'{0}\';', src.desc);

    //objects of this room
    var first = true;
    if (src.objs) {
        sb.appendLine('\tthis.objs = {');
        first = true;
        for (var key in src.objs) {
            if (!first)
                sb.appendLine(',');
            sb.append('\t\t{0} : {1}', key, src.objs[key]);

        }
        sb.appendLine('\t}');
    }

    //exits of this room
    if (src.exits) {
        sb.appendLine('\tthis.exits = {');
        first = true;
        for (var key in src.exits) {
            if (!first)
                sb.appendLine(',');
            sb.appendLine('\t\t{0} : {1}', key, src.exits[key]);
        }
        sb.appendLine('\t}');
    }

    //special flags of this room
    if (src.kvs) {
        sb.appendLine('\tthis.kvs = {');
        first = true;
        for (var key in src.kvs) {
            if (!first)
                sb.appendLine(',');
            sb.appendLine('\t\t{0} : {1}', key, src.kvs[key]);
        }
    }

    sb.appendLine('').appendLine('\tthis.setup();');

    if (src.resetable) {
        sb.appendLine('').appendLine('\tthis.set_resetable({"timeout":{0},"repeat":{1}});', src.resetable.timeout, src.resetable.repeat);
    }

    //end line of definition
    sb.appendLine('').appendLine('}, fm.ROOM);');
    ////////////////////////////////////////////////////////////////

    if (src.funcs) {

    }

    //export define
    sb.appendLine('module.exports = {0};', src.filename);
}