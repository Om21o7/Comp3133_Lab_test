
const socket = io('http://localhost:3000');  


const messageInput = document.getElementById('messageInput');
const messagesDiv = document.getElementById('messages');
const leaveRoomButton = document.getElementById('leaveRoom');
const roomSelect = document.getElementById('rooms');

let currentRoom = '';


const from_user = localStorage.getItem('username') || 'Anonymous';  

function sendMessage() {
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.emit('chatMessage', { room: currentRoom, message, from_user });
        messageInput.value = '';  
    }
}


function joinRoom() {
    const selectedRoom = roomSelect.value;

    if (currentRoom) {
        socket.emit('leaveRoom', { room: currentRoom, from_user }); 
    }

    currentRoom = selectedRoom;

  
    messagesDiv.innerHTML = '';

    socket.emit('joinRoom', { room: selectedRoom, from_user });

    document.getElementById('chatRoomTitle').textContent = `Chat Room: ${selectedRoom}`;


    document.getElementById('roomSelection').style.display = 'none';
    document.getElementById('chatBox').style.display = 'block';
}


function leaveRoom() {
    socket.emit('leaveRoom', { room: currentRoom, from_user });

    


    document.getElementById('roomSelection').style.display = 'block';
    document.getElementById('chatBox').style.display = 'none';

    document.getElementById('chatRoomTitle').textContent = 'Chat Room';


    messagesDiv.innerHTML = '';

    currentRoom = ''; 
}


function displayMessage(from_user, message) {
    const msgElement = document.createElement('div');
    msgElement.textContent = `${from_user}: ${message}`;
    messagesDiv.appendChild(msgElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;  
}
function logout() {
    fetch('/logout', {
        method: 'POST', 
    })
    .then(response => response.text())
    .then(message => {
        console.log(message); 
        window.location.href = '/login.html';  
    })
    .catch(error => {
        console.error('Error logging out:', error);
    });
}

socket.on('message', (data) => {
    displayMessage(data.from_user, data.message);
});

socket.on('previousMessages', (messages) => {
    messages.forEach(message => {
        displayMessage(message.from_user, message.message);
    });
});

socket.on('systemMessage', (message) => {
    displayMessage("System", message);
});

document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});


leaveRoomButton.addEventListener('click', leaveRoom);


document.getElementById('roomSelection').querySelector('button').addEventListener('click', joinRoom);

document.addEventListener('DOMContentLoaded', function () {


    const logoutButton = document.getElementById('logoutButton');  
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    } else {
        console.error('Logout button not found');
    }
});

const logoutButton = document.getElementById('logoutButton');  

logoutButton.addEventListener('click', logout);