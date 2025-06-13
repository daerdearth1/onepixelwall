
import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

export default function OnePixelWall() {
  const [grid, setGrid] = useState(
    Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(null))
  );

  const handleClick = (row, col) => {
    const size = parseInt(prompt("¿Cuántos bloques quieres ocupar (mínimo 1)?"));
    if (isNaN(size) || size < 1 || row + size > GRID_HEIGHT || col + size > GRID_WIDTH) return;

    const type = prompt("¿Texto o Imagen? (escribe 'texto' o 'imagen')").toLowerCase();

    const newGrid = [...grid];
    if (type === "texto") {
      const message = prompt("Escribe tu mensaje:");
      for (let r = row; r < row + size; r++) {
        for (let c = col; c < col + size; c++) {
          newGrid[r][c] = { type: "text", value: message };
        }
      }
    } else if (type === "imagen" && size >= 10) {
      const imageUrl = prompt("Pega la URL de tu imagen (PNG, JPG, GIF):");
      for (let r = row; r < row + size; r++) {
        for (let c = col; c < col + size; c++) {
          newGrid[r][c] = { type: "image", value: imageUrl };
        }
      }
    } else {
      alert("Para subir una imagen necesitas mínimo 10x10 bloques");
      return;
    }
    setGrid(newGrid);
  };

  return (
    <div style={{ padding: '1rem', background: '#f3f1e7', fontFamily: 'monospace' }}>
      <h1 style={{ textAlign: 'center', fontSize: '24px', color: '#2f4f90' }}>ONEPIXELWALL</h1>
      <p style={{ textAlign: 'center' }}>Leave your mark on the internet. $1 per pixel.</p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_WIDTH}, ${BLOCK_SIZE}px)`
      }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
                border: '1px solid #ccc',
                background: cell ? "#ddd" : "#fff",
                fontSize: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onClick={() => handleClick(rowIndex, colIndex)}
              title={cell?.value || ""}
            >
              {cell?.type === "text" ? cell.value : cell?.type === "image" ? (
                <img src={cell.value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
