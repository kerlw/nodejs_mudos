process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

global.__BASE_PATH = __dirname;
global.__config = require('./config.json');
require('globals');

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jqy = require('jquery');
var path = require('path');
var fm = require('framework');
var db = require('db');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(__dirname + '/public'));
//io.set('heartbeats', false);
//io.set('heartbeats timeout', 50);
//io.set('heartbeats interval', 20);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname,'/index.htm'));
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
    console.log(req.body);
    var user = new db.User();
    user.findUser(req.body.name, req.body.password, function(err, loginUser) {
        console.log('err=' + err);
        console.log('loginUser=' + loginUser);
        if(loginUser){
            console.log(req.body.name + ": 登陆成功 " + new Date());
            var data = {'code':200,'msg':'login succeed!'};
            res.end(JSON.stringify(data));
        }else{
            console.log(req.body.name + ": 登陆失败 " + new Date());
            res.redirect('/');
        }
    });
});