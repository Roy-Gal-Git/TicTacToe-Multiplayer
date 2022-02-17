const app = require("express")();

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`Client connected on socket: ${socket.id}`);
});

server.listen(3001, () => {
  console.log("Server is listening at port 3001...");
});
