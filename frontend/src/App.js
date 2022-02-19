import "./App.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import Board from "./components/board";

// ! ! ! ! IMPORTANT ! ! ! !

// Change the host here

const HOST = "192.168.1.105";

// Change the host here

// ! ! ! ! IMPORTANT ! ! ! !

const socket = io.connect(`http://${HOST}:3001`);

function App() {
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(false);
  const [player, setPlayer] = useState("X");
  const [table, setTable] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState();

  const handleTurn = (e) => {
    e.preventDefault();
    const index = e.currentTarget.id;

    if (table[index]) {
      alert("[ERROR]: a player already used this spot");
    } else {
      const tableCopy = [...table];
      tableCopy[index] = player;
      socket.emit("turn", { table: tableCopy, player });
    }
  };

  useEffect(() => {
    socket.on("newConnection", (payload) => {
      setTable(payload.table);
      setPlayer(payload.player);
      setError(payload.error);
      setWinner(false);
      setTurn("X");
    });

    socket.on("err", (payload) => {
      setError(payload.error);
      setMessage(payload.message);
    });

    socket.on("turn", (payload) => {
      setTable(payload.table);
      payload.player === "X" ? setTurn("O") : setTurn("X");
    });

    socket.on("win", (payload) => {
      setWinner(payload);
    });
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tic Tac Toe</h1>
        {error ? (
          <p>{message}</p>
        ) : (
          <Board
            onTurn={handleTurn}
            table={table}
            player={player}
            winner={winner}
            turn={turn}
          />
        )}
      </header>
    </div>
  );
}

export default App;
