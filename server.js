const path = require('path')
const http = require('http')
const express = require('express')
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser ,userLeft, getRoomUsers} = require('./utils/users')
const socketio = require('socket.io');

const app = express();
const PORT = 3000;
const server = http.createServer(app)
const io = socketio(server);

app.use(express.static(path.join(__dirname,'public')));
const appname = " letsChat "

io.on('connection', socket =>{
    let username2 ="";
    socket.on('joinRoom', ({username, room})=>
    {
        const user = userJoin(socket.id,username, room);
        socket.join(user.room);
        username2 = user.username;

        console.log('New Web Secket connection...')
        
        socket.emit('message',formatMessage(appname,'Welcome !!'))    
        socket.broadcast.to(user.room).emit('message',formatMessage(appname, `A "${user.username}" joined the Room`));

        io.to(user.room).emit('roomUsers',{
            room : user.room, 
            users : getRoomUsers(user.room)
        })
    })
    
    socket.on('chatMessage',msg=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username, msg));
    })
    socket.on('disconnect', ()=>{
        const user = userLeft(socket.io);
        if(user)
        {
            io.to(user.room).emit('message',formatMessage(appname,`${username2} has left the chat`));    
        }
    })
})


server.listen(PORT, ()=>{
    console.log(`Server running on ${PORT} `)
})