import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

const colors = ["#e63946", "#f1fa8c", "#a8dadc", "#ff79c6", "#50fa7b", "#ffd6a5"];
const fonts = ["monospace", "cursive", "Press Start 2P", "VT323", "Orbitron", "Pixelify Sans"];

export default function OnePixelWall() {
  const [grid, setGrid] = useState(
    Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(null))
  );
  const [blocks, setBlocks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    row: 0,
    col: 0,
    size: 1,
    type: "texto",
    value: "",
    styleMode: "aleatorio",
    bgColor: "",
    font: ""
  });

  const openModal = (row, col) => {
    setModalData({
      row,
      col,
      size: 1,
      type: "texto",
      value: "",
      styleMode: "aleatorio",
      bgColor: "",
      font: ""
    });
    setShowModal(true);
  };

  const isOccupied = (row, col, size) => {
    for (let r = row; r < row + size; r++) {
      for (let c = col; c < col + size; c++) {
        if (r >= GRID_HEIGHT || c >= GRID_WIDTH) return true;
        if (grid[r][c] !== null) return true;
      }
    }
    return false;
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
    if (isOccupied(row, col, size)) {
      alert("Los bloques seleccionados ya están ocupados.");
      return;
    }

    const newBlock = {
      row,
      col,
      size,
      type,
      value,
      bgColor: styleMode === "aleatorio" ? colors[Math.floor(Math.random() * colors.length)] : bgColor,
      font: styleMode === "aleatorio" ? fonts[Math.floor(Math.random() * fonts.length)] : font
    };

    const updatedGrid = [...grid];
    for (let r = row; r < row + size; r++) {
      for (let c = col; c < col + size; c++) {
        updatedGrid[r][c] = true;
      }
    }

    setGrid(updatedGrid);
    setBlocks([...blocks, newBlock]);
    setShowModal(false);
  };

  return (
    <div style={{ fontFamily: "monospace", background: "linear-gradient(to bottom, #002233, #441111)", minHeight: "100vh", padding: "1rem", color: "white" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem" }}>🎮 ONEPIXELWALL</h1>
      <p style={{ textAlign: "center", marginBottom: "1rem" }}>Leave your mark on the internet. $1 per pixel.</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_WIDTH}, ${BLOCK_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, ${BLOCK_SIZE}px)`,
          gap: "1px",
          backgroundColor: "#333",
          width: GRID_WIDTH * BLOCK_SIZE,
          height: GRID_HEIGHT * BLOCK_SIZE,
          margin: "0 auto",
          position: "relative"
        }}
      >
        {blocks.map((block, i) => (
          <div
            key={i}
            style={{
              gridColumn: `${block.col + 1} / span ${block.size}`,
              gridRow: `${block.row + 1} / span ${block.size}`,
              backgroundColor: block.type === "texto" ? block.bgColor : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: block.font,
              fontSize: `${block.size * 3}px`,
              color: "white",
              overflow: "hidden",
              border: block.type === "imagen" ? "1px solid #ccc" : "none"
            }}
          >
            {block.type === "texto" ? block.value : (
              <img src={block.value} alt="block" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </div>
        ))}
        {grid.map((row, rIdx) =>
          row.map((_, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              onClick={() => openModal(rIdx, cIdx)}
              style={{
                width: `${BLOCK_SIZE}px`,
                height: `${BLOCK_SIZE}px`,
                backgroundColor: "transparent",
                cursor: "pointer"
              }}
            />
          ))
        )}
      </div>

      {showModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{ background: "white", color: "black", padding: "1rem", borderRadius: "8px", minWidth: "300px" }}>
            <label>Cantidad de bloques: </label>
            <input type="number" min="1" value={modalData.size}
              onChange={(e) => setModalData({ ...modalData, size: parseInt(e.target.value) })}
              style={{ width: "100%" }} />
            <br /><br />
            <label>Texto o Imagen: </label>
            <select
              value={modalData.type}
              onChange={(e) => setModalData({ ...modalData, type: e.target.value })}
              style={{ width: "100%" }}
            >
              <option value="texto">Texto</option>
              <option value="imagen">Imagen</option>
            </select>
            <br /><br />
            <label>{modalData.type === "imagen" ? "URL Imagen:" : "Mensaje:"}</label>
            <input
              type="text"
              value={modalData.value}
              onChange={(e) => setModalData({ ...modalData, value: e.target.value })}
              style={{ width: "100%" }}
            />
            <br /><br />
            <label>Estilo: </label>
            <select
              value={modalData.styleMode}
              onChange={(e) => setModalData({ ...modalData, styleMode: e.target.value })}
              style={{ width: "100%" }}
            >
              <option value="aleatorio">Aleatorio</option>
              <option value="personalizado">Elegir estilo</option>
            </select>

            {modalData.styleMode === "personalizado" && (
              <>
                <br /><br />
                <label>Color de fondo: </label>
                <input
                  type="color"
                  value={modalData.bgColor}
                  onChange={(e) => setModalData({ ...modalData, bgColor: e.target.value })}
                  style={{ width: "100%" }}
                />
                <br /><br />
                <label>Fuente: </label>
                <select
                  value={modalData.font}
                  onChange={(e) => setModalData({ ...modalData, font: e.target.value })}
                  style={{ width: "100%" }}
                >
                  {fonts.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </>
            )}
            <br /><br />
            <button onClick={handleModalSubmit} style={{ marginRight: "1rem" }}>Agregar</button>
            <button onClick={() => setShowModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
