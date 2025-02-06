const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

const User = require('./models/User');
const Message = require('./models/Message');
const GroupMessage = require('./models/GroupMessage');  

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

// MongoDB Atlas Connection
const MONGO_URI = "mongodb+srv://ommakwana1825:RQEoabuSC9IndGiK@cluster0.ef2mn.mongodb.net/ChatApp?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.use(express.static('frontend'));


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);


    socket.on('joinRoom', ({ room, from_user }) => {
        socket.join(room);
        console.log(`${from_user} joined room: ${room}`);
    

        socket.to(room).emit('systemMessage', `${from_user} joined ${room}`);

        GroupMessage.find({ room }).then(messages => {
            socket.emit('previousMessages', messages);
        });
    });

    socket.on('chatMessage', async ({ room, message, from_user }) => {
        const newMessage = new GroupMessage({ from_user, room, message, date_sent: new Date() });
        await newMessage.save();  

        
        io.to(room).emit('message', { from_user, message });
    });

    socket.on('leaveRoom', (room) => {
        socket.leave(room);
        console.log(`User ${socket.id} left room: ${room}`);

        io.to(room).emit('message', { from_user: 'System', message: `${socket.id} left the room` });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
