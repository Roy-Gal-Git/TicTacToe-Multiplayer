const app = require("express")();

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  io.emit("turn", [null, null, null, null, null, null, null, null, null]);
  socket.on("turn", (payload) => {
    io.emit("turn", payload);
  });
});

server.listen(3001, () => {
  console.log("Server is listening at port 3001...");
});
