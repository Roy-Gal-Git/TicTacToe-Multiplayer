import "./App.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";

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

  const playTurn = (e) => {
    e.preventDefault();
    if (table[e.currentTarget.id]) {
      console.log("[ERROR]: a player already used this spot");
    } else {
      socket.emit("turn", { player, index: e.currentTarget.id });
      player === "X" ? setPlayer("O") : setPlayer("X");
    }
  };

  useEffect(() => {
    socket.on("turn", (payload) => {
      const tableCopy = [...table];
      tableCopy[payload.index] = payload.player;
      setTable(tableCopy);
    });
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tic Tac Toe</h1>
        {table.map((player, index) => {
          return (
            <button
              key={index}
              id={index}
              onClick={playTurn}
              className="btn btn-light m-2"
            >
              {player}
            </button>
          );
        })}
        <button onClick={playTurn} className="btn btn-sm btn-primary">
          Press Me
        </button>
      </header>
    </div>
  );
}

export default App;
