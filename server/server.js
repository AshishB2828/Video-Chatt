const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server,{
    cors:{
        origin:'*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());


const PORT =  process.env.PORT || 5000;

app.get('/',(req,res) => {
    res.send("server is running")
});



io.on('connection', socket=>{

    socket.emit('me',socket.id);
    socket.on('disconnect',()=>{
        socket.broadcast.emit("callEnded")
    })

    socket.on("calluser", ({ userToCall, signalData, from ,name })=>{
        io.to(userToCall).emit("callUser",{signal: signalData, from, name});
    })

    socket.on("answerCall", (data)=>{
        io.to(data.to).emit("callAccepted",data.signal)
    })
})



app.listen(PORT, ()=> console.log(`listening on port ${PORT}`));

