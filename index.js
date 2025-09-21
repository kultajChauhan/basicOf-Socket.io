const express = require('express')
const {createServer}= require('http')
const path=require('path')
const {Server}=require('socket.io')

const app = express()
app.use(express.static(path.join(__dirname,'./frontend')))
const PORT=3000
const server=createServer(app)
const io=new Server(server)

io.on("connection",(socket)=>{
    console.log(`new user ${socket.id} connected`)

    socket.on('chat message',({room,msg})=>{
        console.log('message : ',msg)
        console.log('room : ',room)
        socket.to(room).emit('chat message',{room,msg})
        // io.emit('chat message',msg)
        socket.emit('chat message',{room,msg})
    })

    socket.on('join-Room',(room)=>{
        console.log('user join ',room)
        socket.join(room)
    })

    socket.emit('myRoom-id',socket.id)

     socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected`);
  });

})

app.get('/',(req,res)=>{
    return res.sendFile('index.html')
})

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})