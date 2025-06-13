import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

const colors = ["#fef3bd", "#ffd6d6", "#d6f5d6", "#d6e0ff", "#fff0f5", "#f0f8ff"];
const fonts = ["monospace", "cursive", "serif", "'Press Start 2P'", "'VT323'", "'Orbitron'", "'Pixelify Sans'"];

export default function OnePixelWall() {
  const [blocks, setBlocks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ row: 0, col: 0, size: 1, type: "texto", value: "", styleMode: "aleatorio", bgColor: "", font: "" });

  const openModal = (row, col) => {
    setModalData({ row, col, size: 1, type: "texto", value: "", styleMode: "aleatorio", bgColor: "", font: "" });
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    const { row, col, size, type, value, styleMode, bgColor, font } = modalData;
    if (type === "imagen" && size < 10) {
      alert("Para subir una imagen necesitas mínimo 10x10 bloques");
      return;
    }
    if (!value) {
      alert("Contenido vacío.");
      return;
    }

    let style = {};
    if (type === "texto") {
      if (styleMode === "aleatorio") {
        style = {
          bgColor: colors[Math.floor(Math.random() * colors.length)],
          font: fonts[Math.floor(Math.random() * fonts.length)]
        };
      } else {
        style = { bgColor, font };
      }
    }

    setBlocks([...blocks, { row, col, size, type, value, style }]);
    setShowModal(false);
  };

  return (
    <div style={{
      padding: '1rem',
      background: '#f0e8d9',
      fontFamily: '"Press Start 2P", monospace',
      color: '#333',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '20px', color: '#0044cc', marginBottom: '0.5rem' }}>🎮 ONEPIXELWALL</h1>
      <p style={{ marginBottom: '1rem' }}>Leave your mark on the internet. $1 per pixel.</p>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}>
        <div style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_WIDTH}, ${BLOCK_SIZE}px)`,
          backgroundColor: '#fffbe6',
          boxShadow: '0 0 10px #aaa',
        }}>
          {Array(GRID_HEIGHT).fill(null).map((_, rowIndex) =>
            Array(GRID_WIDTH).fill(null).map((_, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => openModal(rowIndex, colIndex)}
                style={{
                  width: BLOCK_SIZE,
                  height: BLOCK_SIZE,
                  border: '1px solid #ddd',
                  background: '#fafafa',
                  cursor: 'pointer'
                }}
              />
            ))
          )}
