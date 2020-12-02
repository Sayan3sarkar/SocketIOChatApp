const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

// Run when client connects
io.on('connection', socket => {
    
    //Welcome current user
    socket.emit('message', 'Welcome to ChatApp!!'); // emits to a single client which connected

    // Broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joined the chat'); // emits to all clients except the one that connected

    //Runs when client disconnects
    socket.on('disconnect', ()=>{
        io.emit('message', 'A user has left the chat'); // Emit to all connected clients
    })

    // Listen for chatMessage emitted from client
    socket.on('chatMessage', msg => {
        io.emit('message', msg);
    })
})

//Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));