// Connect to the server with Socket.io
const socket = io('http://localhost:3000');  // Ensure your backend is running on this port

// Elements
const messageInput = document.getElementById('messageInput');
const messagesDiv = document.getElementById('messages');
const leaveRoomButton = document.getElementById('leaveRoom');
const roomSelect = document.getElementById('rooms');

// Room information
let currentRoom = '';

// Get the username (Replace with actual authentication logic)
const from_user = localStorage.getItem('username') || 'Anonymous';  // Example username

// Handle message sending
function sendMessage() {
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.emit('chatMessage', { room: currentRoom, message, from_user });
        messageInput.value = '';  // Clear input field
    }
}

// Handle joining a room
function joinRoom() {
    const selectedRoom = roomSelect.value;

    if (currentRoom) {
        socket.emit('leaveRoom', { room: currentRoom, from_user }); // Notify server about leaving
    }

    currentRoom = selectedRoom;

    // Clear previous messages before loading new room messages
    messagesDiv.innerHTML = '';

    // Emit event to join room with username
    socket.emit('joinRoom', { room: selectedRoom, from_user });

    // Update chat room heading dynamically
    document.getElementById('chatRoomTitle').textContent = `Chat Room: ${selectedRoom}`;


    // Show the chat box and hide room selection
    document.getElementById('roomSelection').style.display = 'none';
    document.getElementById('chatBox').style.display = 'block';
}

// Handle leaving the room
function leaveRoom() {
    socket.emit('leaveRoom', { room: currentRoom, from_user });

    

    // Reset UI
    document.getElementById('roomSelection').style.display = 'block';
    document.getElementById('chatBox').style.display = 'none';

    // Reset the chat room title
    document.getElementById('chatRoomTitle').textContent = 'Chat Room';

    // Clear messages when leaving
    messagesDiv.innerHTML = '';

    currentRoom = ''; 
}

// Display a message in the chat box
function displayMessage(from_user, message) {
    const msgElement = document.createElement('div');
    msgElement.textContent = `${from_user}: ${message}`;
    messagesDiv.appendChild(msgElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;  // Auto-scroll
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
// Socket event listeners
socket.on('message', (data) => {
    displayMessage(data.from_user, data.message);
});

// Display previous messages when the user joins a room
socket.on('previousMessages', (messages) => {
    messages.forEach(message => {
        displayMessage(message.from_user, message.message);
    });
});

// System messages (User joined/left notifications)
socket.on('systemMessage', (message) => {
    displayMessage("System", message);
});

// Event listener for sending messages
document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Event listener for leaving the room
leaveRoomButton.addEventListener('click', leaveRoom);

// Ensure the user joins the room after selecting a room
document.getElementById('roomSelection').querySelector('button').addEventListener('click', joinRoom);

document.addEventListener('DOMContentLoaded', function () {
    // All your existing code goes here...

    const logoutButton = document.getElementById('logoutButton');  
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    } else {
        console.error('Logout button not found');
    }
});

const logoutButton = document.getElementById('logoutButton');  

logoutButton.addEventListener('click', logout);