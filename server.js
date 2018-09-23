var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server Running......');


app.get('/',(req,res)=>{

    res.sendFile(__dirname + '/index.html');

});


io.sockets.on('connection', (socket)=>{

    connections.push(socket);
    console.log('Connected : %s sockets connected', connections.length);

    //Disconnect
    socket.on('disconnect',(data)=>{
        if(!socket.username) return;
        users.splice(users.indexOf(socket.username), 1);
        updateUserNames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected : %s sockets disconnected', connections.length);
    });
    
    //current user
    socket.on('current user', (name)=>{
        console.log(name);
        io.sockets.emit('curr user', {user:socket.username});
    });


    //send message
    socket.on('send message', (data)=>{
        console.log(data);
        io.sockets.emit('new message', {msg:data, user:socket.username});
    });

    //new user
    socket.on('new user', (data, callback)=>{
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUserNames();
    });

    function updateUserNames(){
        io.sockets.emit('get users', users);
    }
});