var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('lodash');


var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var usersList = [];
var userServer = {};

//设置端口号
app.set('port',process.env.PORT || 5000);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//远程验证用户名是否可用
app.post('/nickname',function(req,res){
    if(_.indexOf(usersList,req.body.nickname) === -1){
        res.send({
            msg:1
        });
    }else{
        res.send({
            msg:0
        });
    }
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});


io.on('connection',function(socket){
    socket.on('newUser',function(data){
        socket.username = data.username;
        usersList.push(data.username);
        userServer[data.username] = socket;
        io.emit('addCount',usersList);
    });
    // console.log(socket.request.headers.cookie);
    // console.log(socket.id);
    socket.on('disconnect',function(){
        console.log('disconnect');
        _.remove(usersList,function(n){
            return  n === socket.username;
        })
    });
});



http.listen(app.get('port'),function(){
    console.log('your webapp is running in port:' + app.get('port'));
});
