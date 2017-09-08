/**
 * Created by kerlw on 2017/9/8.
 */
var fm = require('framework');

var apid = function() {
    if (!(this instanceof apid))
        return new apid();
}

function onActionQueryStatus(session, param) {
    return JSON.stringify({ 'code' : 200, 'body' : {'hb_status' : global.HB_ENGINE.desc() }});
}

apid.prototype.onAction = function(action, session, param) {
    switch (action) {
        case 'status':
            return onActionQueryStatus(session, param);
    }
    return JSON.stringify({ 'code':200, 'body':{} });
}

module.exports = apid;