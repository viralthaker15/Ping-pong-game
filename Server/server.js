const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname , '../Client')

app.use(express.static(publicDirectoryPath))

app.get('/' , (req , res) => {
    res.sendFile(path.join(publicDirectoryPath , "/index.html"))
})

server.listen(port , () => {
    console.log("Server is up on port :"+port)
})