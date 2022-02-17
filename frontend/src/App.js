import "./App.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  const [turn, setTurn] = useState("x");

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tic Tac Toe</h1>
        <p>{turn}</p>
      </header>
    </div>
  );
}

export default App;
