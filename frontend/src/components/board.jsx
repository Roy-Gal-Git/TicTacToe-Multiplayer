import React from "react";

const Board = ({ table, onTurn, player, winner, turn }) => {
  // Handle disabling the buttons when it is not a player's
  // turn or on a win / tie
  let isDisabled;
  player === turn ? (isDisabled = false) : (isDisabled = true);
  if (winner) isDisabled = true;

  // Return a header with a message when the game ends
  // if the game did not end, return null
  const handleGameEnd = () => {
    if (winner === "X") {
      return <h2>Player X Won!</h2>;
    } else if (winner === "O") {
      return <h2>Player O Won!</h2>;
    } else if (winner === "Tie") {
      return <h2>It's a Tie!</h2>;
    } else return null;
  };

  return (
    <div>
      {handleGameEnd()}
      <h3>You're Player {player}</h3>
      {winner ? null : <h6>{turn}'s turn:</h6>}
      <div className="container">
        <div className="col">
          {table.slice(0, 3).map((player, index) => (
            <button
              disabled={isDisabled}
              onClick={onTurn}
              key={index}
              id={index}
              style={{ height: "90px", width: "90px" }}
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
              style={{ height: "90px", width: "90px" }}
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
              style={{ height: "90px", width: "90px" }}
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
