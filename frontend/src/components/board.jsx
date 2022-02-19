import React from "react";

const Board = ({ table, onTurn, player, winner, turn }) => {
  let isDisabled;
  player === turn ? (isDisabled = false) : (isDisabled = true);
  if (winner) isDisabled = true;

  const handleGameEnd = () => {
    if (winner === "X") {
      return <h2>Player X won!</h2>;
    } else if (winner === "O") {
      return <h2>Player O won!</h2>;
    } else if (winner === "Tie") {
      return <h2>It's a tie!</h2>;
    } else return null;
  };

  return (
    <div>
      {handleGameEnd()}
      <h3>Player {player}</h3>
      <h6>{turn}'s turn:</h6>
      <div className="container">
        <div className="col">
          {table.slice(0, 3).map((player, index) => (
            <button
              disabled={isDisabled}
              onClick={onTurn}
              key={index}
              id={index}
              style={{ height: "100px", width: "100px" }}
              className="btn btn-danger m-2"
            >
              {player}
            </button>
          ))}
        </div>
        <div className="col">
          {table.slice(3, 6).map((player, index) => (
            <button
              disabled={isDisabled}
              onClick={onTurn}
              key={index + 3}
              id={index + 3}
              style={{ height: "100px", width: "100px" }}
              className="btn btn-danger m-2"
            >
              {player}
            </button>
          ))}
        </div>
        <div className="col">
          {table.slice(6, 9).map((player, index) => (
            <button
              disabled={isDisabled}
              onClick={onTurn}
              key={index + 6}
              id={index + 6}
              style={{ height: "100px", width: "100px" }}
              className="btn btn-danger m-2"
            >
              {player}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
