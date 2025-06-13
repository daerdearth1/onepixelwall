
import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

export default function OnePixelWall() {
  const [grid, setGrid] = useState(
    Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(null))
  );
  const [blocks, setBlocks] = useState([]);

  const handleClick = (row, col) => {
    const size = parseInt(prompt("¿Cuántos bloques quieres ocupar (mínimo 1)?"));
    if (isNaN(size) || size < 1 || row + size > GRID_HEIGHT || col + size > GRID_WIDTH) return;

    const type = prompt("¿Texto o Imagen? (escribe 'texto' o 'imagen')").toLowerCase();
    const newBlock = { row, col, size, type };

    if (type === "texto") {
      newBlock.value = prompt("Escribe tu mensaje:");
    } else if (type === "imagen" && size >= 10) {
      newBlock.value = prompt("Pega la URL de tu imagen (PNG, JPG, GIF):");
    } else {
      alert("Para subir una imagen necesitas mínimo 10x10 bloques");
      return;
    }

    setBlocks([...blocks, newBlock]);
  };

  return (
    <div style={{ padding: '1rem', background: '#f3f1e7', fontFamily: 'monospace' }}>
      <h1 style={{ textAlign: 'center', fontSize: '24px', color: '#2f4f90' }}>ONEPIXELWALL</h1>
      <p style={{ textAlign: 'center' }}>Leave your mark on the internet. $1 per pixel.</p>
      <div style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_WIDTH}, ${BLOCK_SIZE}px)`
      }}>
        {Array(GRID_HEIGHT).fill(null).map((_, rowIndex) =>
          Array(GRID_WIDTH).fill(null).map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleClick(rowIndex, colIndex)}
              style={{
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
                border: '1px solid #ccc',
                background: '#fff',
              }}
            />
          ))
        )}

        {blocks.map((block, i) => (
          <div
            key={i}
            onClick={() => alert(block.type === 'texto' ? block.value : 'Imagen')}
            style={{
              position: 'absolute',
              left: block.col * BLOCK_SIZE,
              top: block.row * BLOCK_SIZE,
              width: block.size * BLOCK_SIZE,
              height: block.size * BLOCK_SIZE,
              backgroundColor: '#ddd',
              border: '2px solid #999',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            title={block.value}
          >
            {block.type === 'texto' ? (
              <span style={{ padding: 2, textAlign: 'center' }}>{block.value}</span>
            ) : (
              <img src={block.value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
