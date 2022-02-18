const Board = ({ table, onTurn }) => {
  return (
    <div className="container">
      <div className="col">
        {table.slice(0, 3).map((player, index) => (
          <button
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
  );
};

export default Board;
