const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("[server] connected");

  console.log("[server] emiting socketId(me)");

  // providing an id to the client which just connected
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    console.log("[server] disconnected");
    socket.broadcast.emit("callEnded");
  });

  // expecting client to emit callUser event with needed data
  socket.on("callUser", (data) => {
    console.log("[server] callingUser", data);
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  // recieving data from client and sending it back.
  socket.on("answerCall", (data) => {
    console.log("[server] answering call", data);
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

const PORT = 8000;

server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
