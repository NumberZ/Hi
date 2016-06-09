var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('lodash');


var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var usersList = ['vinnie'];

//设置端口号
app.set('port',process.env.PORT || 5000);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//远程验证用户名
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
    console.log(socket.request.headers.cookie);
    console.log(socket.id);
    socket.broadcast.emit('hi');
    socket.on('chat message',function(msg){
        io.emit('chat message',msg);
    });
    console.log('a user has connect');
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});




http.listen(app.get('port'),function(){
    console.log('your webapp is running in port:' + app.get('port'));
});
