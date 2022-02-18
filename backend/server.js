const app = require("express")();

const server = require("http").createServer(app);

const connections = [];
const connectionLimit = 2;
const emptyTable = [null, null, null, null, null, null, null, null, null];

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    header: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
    },
  },
});

function handlePlayer(socket, table, player = "") {
  socket.emit("newConnection", { table, player, error: false });
}

io.on("connection", (socket) => {
  console.log("Client connected on:", socket.id);
  connections.push(socket);

  try {
    if (io.engine.clientsCount > connectionLimit) {
      const index = connections.indexOf(socket);
      if (index !== -1) {
        connections.splice(index, 1);
      }
      socket.emit("err", { error: true, message: "The game is full." });
      socket.disconnect();
      console.log(socket.id, "Disconnected...");
    }

    if (io.engine.clientsCount === 1) {
      connections[0].emit("err", {
        error: true,
        message: "Waiting for another player to join...",
      });
    } else if (io.engine.clientsCount === 2) {
      handlePlayer(connections[0], [...emptyTable], "X");
      handlePlayer(connections[1], [...emptyTable], "O");
    }
  } catch (err) {
    console.log(err.message);
  }

  socket.on("turn", (payload) => {
    io.emit("turn", payload);
  });

  socket.on("disconnect", (payload) => {
    const index = connections.indexOf(socket);
    if (index !== -1) {
      connections.splice(index, 1);
    }
    if (io.engine.clientsCount > 0) {
      connections[0].emit("err", {
        error: true,
        message: "Waiting for another player to join...",
      });
      console.log(socket.id, "Disconnected...");
      socket.disconnect();
    }
  });
});

server.listen(3001, () => {
  console.log("Server is listening at port 3001...");
});
