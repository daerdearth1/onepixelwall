import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

const colors = ["#fef3bd", "#ffd6d6", "#d6f5d6", "#d6e0ff", "#ffffb5", "#f0f8ff"];
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
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          fontFamily: fonts[Math.floor(Math.random() * fonts.length)],
        };
      } else {
        style = {
          backgroundColor: bgColor,
          fontFamily: font,
        };
      }
    }

    const newBlock = { row, col, size, type, value, style };
    setBlocks([...blocks, newBlock]);
    setShowModal(false);
  };

  return (
    <div style={{ padding: "1rem", background: "#f5f0e1", fontFamily: "monospace" }}>
      <div style={{ textAlign: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>
        🎮 <span style={{ fontFamily: "'Press Start 2P'", color: "#0044cc" }}>ONEPIXELWALL</span>
        <p style={{ fontSize: "0.75rem" }}>Leave your mark on the internet. $1 per pixel.</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_WIDTH}, ${BLOCK_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, ${BLOCK_SIZE}px)`,
          gap: "1px",
          justifyContent: "center",
          margin: "0 auto",
          backgroundColor: "#ccc",
        }}
      >
        {[...Array(GRID_HEIGHT)].map((_, row) =>
          [...Array(GRID_WIDTH)].map((_, col) => {
            const block = blocks.find(
              (b) =>
                row >= b.row &&
                row < b.row + b.size &&
                col >= b.col &&
                col < b.col + b.size
            );
            if (block) {
              if (row === block.row && col === block.col) {
                return (
                  <div
                    key={`${row}-${col}`}
                    style={{
                      gridColumn: `span ${block.size}`,
                      gridRow: `span ${block.size}`,
                      background: block.type === "imagen" ? `url(${block.value}) center/cover` : block.style.backgroundColor,
                      fontFamily: block.style.fontFamily,
                      fontSize: `${block.size * 2}px`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      color: "#000",
                      border: "1px solid #999",
                    }}
                  >
                    {block.type === "texto" ? block.value : ""}
                  </div>
                );
              } else {
                return null;
              }
            }
            return (
              <div
                key={`${row}-${col}`}
                style={{
                  width: BLOCK_SIZE,
                  height: BLOCK_SIZE,
                  background: "#fff",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                }}
                onClick={() => openModal(row, col)}
              />
            );
          })
        )}
      </div>

      {showModal && (
        <div style={{ padding: "1rem", marginTop: "1rem", background: "#fff7d1", border: "2px solid #000", maxWidth: 300, margin: "2rem auto" }}>
          <h3>Nuevo Bloque</h3>
          <label>Tamaño:</label>
          <input type="number" min="1" max="50" value={modalData.size} onChange={(e) => setModalData({ ...modalData, size: parseInt(e.target.value) })} />
          <br />
          <label>Tipo:</label>
          <select value={modalData.type} onChange={(e) => setModalData({ ...modalData, type: e.target.value })}>
            <option value="texto">Texto</option>
            <option value="imagen">Imagen</option>
          </select>
          <br />
          <label>{modalData.type === "imagen" ? "URL Imagen:" : "Mensaje:"}</label>
          <input type="text" value={modalData.value} onChange={(e) => setModalData({ ...modalData, value: e.target.value })} />
          {modalData.type === "texto" && (
            <>
              <br />
              <label>Estilo:</label>
              <select value={modalData.styleMode} onChange={(e) => setModalData({ ...modalData, styleMode: e.target.value })}>
                <option value="aleatorio">Aleatorio</option>
                <option value="personalizado">Elegir estilo</option>
              </select>
              {modalData.styleMode === "personalizado" && (
                <>
                  <br />
                  <label>Color de fondo:</label>
                  <input type="color" value={modalData.bgColor} onChange={(e) => setModalData({ ...modalData, bgColor: e.target.value })} />
                  <br />
                  <label>Fuente:</label>
                  <select value={modalData.font} onChange={(e) => setModalData({ ...modalData, font: e.target.value })}>
                    {fonts.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </>
          )}
          <br />
          <button onClick={handleModalSubmit}>Agregar</button>
          <button onClick={() => setShowModal(false)} style={{ marginLeft: "1rem" }}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
