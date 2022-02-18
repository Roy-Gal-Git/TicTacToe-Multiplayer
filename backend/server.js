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
    // Preventing new connections if 2 players are already playing the game
    if (io.engine.clientsCount > connectionLimit) {
      const index = connections.indexOf(socket);
      if (index !== -1) {
        connections.splice(index, 1);
      }
      socket.emit("err", { error: true, message: "The game is full." });
      socket.disconnect();
      console.log(socket.id, "Disconnected...");
    }

    // If there is only one player connected, show a waiting message
    if (io.engine.clientsCount === 1) {
      connections[0].emit("err", {
        error: true,
        message: "Waiting for another player to join...",
      });
    }
    // If 2 players are connected, reset their game boards
    // and set the first player to X and the second to O
    else if (io.engine.clientsCount === 2) {
      handlePlayer(connections[0], [...emptyTable], "X");
      handlePlayer(connections[1], [...emptyTable], "O");
    }
  } catch (err) {
    console.log(err.message);
  }

  // echo the last play
  socket.on("turn", (payload) => {
    io.emit("turn", payload);
  });

  // handle disconnection of a client by removing his socket from the connections array
  // and sending the remaining player a waiting message
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
