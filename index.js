process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

global.__BASE_PATH = __dirname;
global.__config = require('./config.json');
require('globals');

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jqy = require('jquery');
var path = require('path');
var fm = require('framework');
var db = require('db');

app.use(cookieParser(__config.cookie_secret));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(__dirname + '/public'));
//io.set('heartbeats', false);
//io.set('heartbeats timeout', 50);
//io.set('heartbeats interval', 20);

app.get('/', function(req, res) {
    if (req.signedCookies) {
        if (req.signedCookies.sessionId) {
            console.log('sessionId is ' + req.signedCookies.sessionId);
            res.sendFile(path.join(__dirname,'/index.html'));
            return;
        }   
    }

    res.sendFile(path.join(__dirname,'/login.html'));
});

io.on('connection', function(socket) {
    var player = new fm.Player(socket);
    FUNCTIONS.move_object(player, _objs.rooms['softwarepark/office']);
    player.command('look');
    player.command('hp');
});

http.listen(__config.port, function() {
    console.log('listening on *:' + __config.port);
    global.HB_ENGINE.start();
});

app.post('/ucenter', function(req, res) {
    var action = req.query.action;
    switch (action) {
    case 'login':
        var user = new db.User();
        user.findOne(req.body.passport, function(err, loginUser) {
            if (err) {
                console.log('err=' + err);
                res.send(JSON.stringify({'code':500,'msg':'Server error! err = ' + err}));
				return;
            }

            if (!loginUser || loginUser.password != req.body.password) {
                res.send(JSON.stringify({'code':401,'msg':'User not exist or password error! passport = ' + req.body.passport}));
				return;
            }

            console.log(req.body.passport + " login succeed " + new Date());
            var sessionId = req.body.passport + req.socket.remoteAddress + new Date();
            res.cookie('sessionId', sessionId, { signed : true}).redirect('/');
			return;
        });
        break;
    case 'register':
        var user = new db.User();
        var character = new db.Character();
        user.findOne(req.body.passport, function(err, oldUser) {
            if (err) {
                console.log('err=' + err);
                res.send(JSON.stringify({'code':500,'msg':'Server error! err = ' + err}));
				return;
            }

            if (oldUser) {
                res.send(JSON.stringify({'code':400,'msg':'User already exist! passport = ' + req.body.passport}));
				return;
            }

            user.add(req.body.passport, req.body.password, function(err) {
                if (err) {
                    console.log('err=' + err);
                    res.send(JSON.stringify({'code':500,'msg':'Server error! err = ' + err}));
                }
            });

            character.add(req.body.passport, req.body.nickname, req.body.str, req.body.con, req.body.int, req.body.apc, req.body.lck, req.body.cor, function(err) {
                if (err) {
                    console.log('err=' + err);
                    res.send(JSON.stringify({'code':500,'msg':'Server error! err = ' + err}));
                }
            });

            console.log(req.body.passport + " register succeed " + new Date());
            var sessionId = req.body.passport + req.socket.remoteAddress + new Date();
            res.cookie('sessionId', sessionId , { signed : true}).redirect('/');
			return;
        });
        break;
    default:
        console.log("Unknown action requested " + action);
        break;
    }
    
});