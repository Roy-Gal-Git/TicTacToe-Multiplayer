import "./App.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import Board from "./components/board";

const socket = io.connect("http://localhost:3001");

function App() {
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

  const handleTurn = (e) => {
    e.preventDefault();
    const index = e.currentTarget.id;

    if (table[index]) {
      alert("[ERROR]: a player already used this spot");
    } else {
      const tableCopy = [...table];
      tableCopy[index] = player;
      socket.emit("turn", tableCopy);
      player === "X" ? setPlayer("O") : setPlayer("X");
    }
  };

  useEffect(() => {
    socket.on("turn", (payload) => {
      setTable(payload);
    });
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tic Tac Toe</h1>
        <Board onTurn={handleTurn} table={table} />
      </header>
    </div>
  );
}

export default App;
