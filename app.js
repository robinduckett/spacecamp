
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http');
  
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

var server = http.createServer(app);

var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var rooms = {};

var md = require("node-markdown").Markdown;

io.sockets.on('connection', function(socket) {
    console.log('connection established');

    socket.on('join', function(data) {
        console.log('joining %s to %s', data.nickname, data.room);
        
        socket.join(data.room);

        if (typeof rooms[data.room] === "undefined") {
            rooms[data.room] = {};
        }

        rooms[data.room].count ++;

        if (typeof rooms[data.room].users === "undefined") {
            rooms[data.room].users = [];
        }   

        if (rooms[data.room].users.indexOf(data.nickname) === -1) {
            rooms[data.room].users.push(md(data.nickname, true, 'strong'));
            rooms[data.room].users.sort();
        }

        socket.emit('names', {
            room: data.room,
            names: rooms[data.room].users
        });

        console.log('emitting names: %s', rooms[data.room].users);
        
        socket.broadcast.to(data.room).emit('join', {
            room: data.room,
            nickname: md(data.nickname, true, 'strong')
        });
    });
    
    socket.on('privmsg', function(data) {    
        console.log('privmsg %s %s: %s', data.room, data.nickname, data.message);

        var message = {
            room: data.room,
            nickname: md(data.nickname, true, 'strong'),
            message: md(data.message, true)
        };
        
        socket.broadcast.to(data.room).emit('privmsg', message);

        socket.emit('privmsg', message);
    });
    
    socket.on('leave', function(data) {
        console.log('leaving %s, %s', data.room, data.nickname);

        if (rooms[data.room].users.indexOf(data.nickname) > -1) {
            rooms[data.room].users.splice(rooms[data.room].users.indexOf(data.nickname), 1);
            rooms[data.room].users.sort();
        }
        
        socket.broadcast.to(data.room).emit('leave', {
            room: data.room,
            nickname: md(data.nickname, true, 'strong')
        });
    });
});