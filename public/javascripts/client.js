

var socket = null;

$(function() {
    socket = io.connect('http://localhost');
    
    socket.on('connect', function (data) {
        console.log('connected');
        socket.emit('join', 'teambob', 'Robin');
    });
    
    socket.on('join', function(data) {
        console.log(data);
    })
    
    socket.on('privmsg', function(data) {
        console.log(data);
    });
    
    socket.on('leave', function(data) {
        console.log(data);
    });
});

window.onbeforeunload = function() {
    return "Are you sure you want to leave?";
};

window.onunload = function() {
    socket.emit('leave', 'teambob', 'Robin');
    console.log('Leaving teambob');
};