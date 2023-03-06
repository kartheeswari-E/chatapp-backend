require('dotenv').config();
const express = require('express');
const db = require('./db/connection');

const http = require('http');
const { Server } = require('socket.io');

const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
app.use(cors());
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin:'https://symphonious-kulfi-6dd775.netlify.app/api',
        credentials:true, 
        methods: ['GET', 'POST']
    }
})

//Importing routes
const authRoutes = require('./routes/auth.routes'); //custom middleware
// const chatRoutes = require('./routes/chat.routes');
const userRoutes = require('./routes/user.routes');

//Connecting DB.
db();

app.use(express.json());
app.use(cookieParser());




app.use('/api',authRoutes);
app.use('/api', userRoutes);

// on -> receiving side.
// emit -> sending side.

io.on('connection', (socket) => {

    socket.on('join-room', (data) => {
        socket.join(data);
        console.log(`user ${socket.id} has joined the room ${data}`);
    });

    socket.on('send-message', (data) => {
        console.log('Data: ', data );
        socket.to(data.room).emit('receive-message', data);
    } );

    socket.on('disconnect', () => {
        console.log('User Disconnected: ', socket.id);
    })
})


const PORT = process.env.PORT || 5000;
app.get("/", (request, response) => {
    response.send("hai hellow welcome");
  });
server.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
})

