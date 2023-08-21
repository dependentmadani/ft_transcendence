const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require('cors')

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors({
    origin: ['http://localhost:5173/chat']
}))

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chatMessage", (data) => {
    io.emit("chatMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(8000, () => {
  console.log("Server is running on port 8000");
});


// const express = require('express')
// const path = require('path')

// const app = express()

// const server = require('http').createServer(app)

// const socketIO = require('socket.io')
// const io = socketIO(server)

// io.on('connection', socket => {
//     console.log(`${socket.id} just connected!`)
// })

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'))
// })

// app.listen(3000, () => console.log('listining on port 3000..'))