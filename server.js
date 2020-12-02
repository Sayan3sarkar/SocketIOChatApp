const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { formatMessage } = require('./utils/messages');
const { getCurrentUser, userJoin, userLeave, getRoomUsers } = require('./utils/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;


//Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

const chatBot = 'ChatApp Bot';

// Run when client connects
io.on('connection', socket => {

    socket.on('joinRoom', ({username, room}) => {
        
        const user = userJoin(socket.id, username, room);
        socket.join(user.room); // User joins room returned by userJoin()

        //Welcome current user
        socket.emit('message', formatMessage( chatBot, 'Welcome to ChatApp!!')); // emits to a single client which connected

        // Broadcast when a user connects
        socket.broadcast.to(user.room)
        .emit('message', formatMessage(chatBot, `${user.username} has joined the chat`)); // emits to all clients except the one that connected

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen for chatMessage emitted from client
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //Runs when client disconnects
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has left the chat`)); // Emit to all connected clients
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
})

server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));