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

// Checks the game table for a win, if there is a winner - return the player
// If there is no winner - return false
checkWin = (table) => {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winningCombos.length; i++) {
    let checkCombo = [];

    winningCombos[i].forEach((index) => {
      checkCombo.push(table[index]);
    });

    if (
      checkCombo.every((player) => player === "X") ||
      checkCombo.every((player) => player === "O")
    ) {
      return checkCombo[0] === "X" ? "X" : "O";
    }
  }

  if (!table.includes(null)) return "Tie"
  
  return false;
};

// Handle reseting the board when the game starts
function handlePlayer(socket, table, player = "") {
  socket.emit("newConnection", { table, player, error: false });
}

// Connection handler
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

  // Check for a win and echo the last play
  socket.on("turn", (payload) => {
    const winner = checkWin(payload.table);
    io.emit("turn", payload);
    if (winner) io.emit("win", winner);
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
