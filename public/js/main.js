const chatForm = document.getElementById('chat-form');
const socket = io();
const chatMessages = document.querySelector('.chat-messages');

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
    <p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">
        ${message}
    </p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}