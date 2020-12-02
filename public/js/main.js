const chatForm = document.getElementById('chat-form');
const socket = io();
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get userName and room from URL Params
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join Chatroom
socket.emit('joinRoom', { username, room});

// Get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll Down to last message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message Submit
chatForm.addEventListener('submit', e =>{
    e.preventDefault();

    // Fetching value of message entered in the form with id=msg in chat.html
    const msg = e.target.elements.msg.value;

    // Emit message to Server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM
const outputMessage = message => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.userName} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
const outputRoomName = room => {
    roomName.innerText = room;
}

// Add users to DOM
const outputUsers = users => {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}