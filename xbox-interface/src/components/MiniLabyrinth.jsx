import React, { useEffect, useState } from "react";
import "../assets/laberintostilo.css";

const cellSize = 50;

const generateLabyrinth = (difficulty) => {
  let size, complexity;
  switch (difficulty) {
    case "facil":
      size = 7;
      complexity = 0.2;
      break;
    case "medio":
      size = 9;
      complexity = 0.35;
      break;
    case "dificil":
      size = 13;
      complexity = 1;
      break;
    default:
      size = 8;
      complexity = 0.2;
  }

  const maze = Array(size)
    .fill()
    .map(() => Array(size).fill(1));

  const start = { row: 1, col: 1 };
  const end = { row: size - 2, col: size - 2 };

  const carve = (row, col) => {
    const directions = [
      [0, 2], [0, -2], [2, 0], [-2, 0]
    ].sort(() => Math.random() - 0.5);

    for (let [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow > 0 && newRow < size - 1 &&
        newCol > 0 && newCol < size - 1 &&
        maze[newRow][newCol] === 1
      ) {
        maze[row + dr / 2][col + dc / 2] = 0;
        maze[newRow][newCol] = 0;
        carve(newRow, newCol);
      }
    }
  };

  maze[start.row][start.col] = 0;
  carve(start.row, start.col);
  maze[end.row][end.col] = 2;
  return maze;
};

const MiniLabyrinth = () => {
  const [difficulty, setDifficulty] = useState("facil");
  const [labyrinthMap, setLabyrinthMap] = useState(() => generateLabyrinth("facil"));
  const [playerPos, setPlayerPos] = useState({ row: 1, col: 1 });
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);

  const movePlayer = (direction) => {
    if (won || timeLeft <= 0) return;

    let { row, col } = playerPos;
    if (direction === "ArrowUp") row--;
    else if (direction === "ArrowDown") row++;
    else if (direction === "ArrowLeft") col--;
    else if (direction === "ArrowRight") col++;

    if (
      row >= 0 && row < labyrinthMap.length &&
      col >= 0 && col < labyrinthMap[0].length &&
      labyrinthMap[row][col] !== 1
    ) {
      setPlayerPos({ row, col });
      setMoves((prev) => prev + 1);
      if (labyrinthMap[row][col] === 2) {
        setWon(true);
        setTimeout(() => {
          alert("¡Ganaste!");
          resetGame();
        }, 200);
      }
    }
  };

  const resetGame = () => {
    const newMaze = generateLabyrinth(difficulty);
    setLabyrinthMap(newMaze);
    setPlayerPos({ row: 1, col: 1 });
    setWon(false);
    setMoves(0);
    setTimeLeft(45);
  };

  const handleKeyDown = (e) => {
    movePlayer(e.key);
  };

  const handleDifficultyChange = (e) => {
    const value = e.target.value;
    setDifficulty(value);
    const newMaze = generateLabyrinth(value);
    setLabyrinthMap(newMaze);
    setPlayerPos({ row: 1, col: 1 });
    setMoves(0);
    setTimeLeft(45);
    setWon(false);
  };

  // Escucha de teclado
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPos, won, timeLeft, labyrinthMap]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 || won) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, won]);

  return (
    <div className="labyrinth-container">
      <button className="back-button" onClick={() => window.history.back()}>
        ⬅ Regresar
      </button>

      <div className="labyrinth-controls">
        <label htmlFor="difficulty">Dificultad: </label>
        <select id="difficulty" value={difficulty} onChange={handleDifficultyChange}>
          <option value="facil">Fácil</option>
          <option value="medio">Medio</option>
          <option value="dificil">Difícil</option>
        </select>
      </div>

      <div className="labyrinth-stats">
        <p>🧭 Movimientos: {moves}</p>
        <p>⏳ Tiempo: {timeLeft}s</p>
      </div>

      <div
        className="labyrinth-grid"
        style={{
          width: labyrinthMap[0].length * cellSize,
          height: labyrinthMap.length * cellSize,
        }}
      >
        {labyrinthMap.map((rowArr, rowIdx) => (
          <div key={rowIdx} className="labyrinth-row">
            {rowArr.map((cell, colIdx) => {
              const isPlayer = playerPos.row === rowIdx && playerPos.col === colIdx;
              let cellClass = cell === 1
                ? "cell-wall"
                : cell === 2
                ? "cell-exit"
                : "cell-path";
              if (isPlayer) cellClass += " player-cell";

              return (
                <div
                  key={colIdx}
                  className={cellClass}
                  style={{ width: cellSize, height: cellSize }}
                >
                  {isPlayer && <span className="player-icon">🚶‍♂️</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {won && <div className="win-banner">🎉 ¡Victoria! 🎉</div>}
      {timeLeft <= 0 && <div className="lose-banner">⏱ Tiempo agotado</div>}

      <div className="mobile-controls">
        <div className="arrow-row">
          <button onClick={() => movePlayer("ArrowUp")}>⬆️</button>
        </div>
        <div className="arrow-row">
          <button onClick={() => movePlayer("ArrowLeft")}>⬅️</button>
          <button onClick={() => movePlayer("ArrowDown")}>⬇️</button>
          <button onClick={() => movePlayer("ArrowRight")}>➡️</button>
        </div>
      </div>
    </div>
  );
};

export default MiniLabyrinth;
