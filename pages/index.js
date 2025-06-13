import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

const colors = ["#ffeb3b", "#4caf50", "#2196f3", "#ff5722", "#e91e63", "#9c27b0"];
const fonts = ["monospace", "cursive", "serif", "Press Start 2P", "VT323", "Orbitron", "Pixelify Sans"];

function getContrastColor(bgColor) {
  // Convert HEX to RGB
  const r = parseInt(bgColor.substr(1, 2), 16);
  const g = parseInt(bgColor.substr(3, 2), 16);
  const b = parseInt(bgColor.substr(5, 2), 16);
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000" : "#fff"; // black or white
}

export default function OnePixelWall() {
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
        const bg = colors[Math.floor(Math.random() * colors.length)];
        style = {
          backgroundColor: bg,
          fontFamily: fonts[Math.floor(Math.random() * fonts.length)],
          color: getContrastColor(bg)
        };
      } else {
        style = {
          backgroundColor: bgColor,
          fontFamily: font,
          color: getContrastColor(bgColor || "#ffffff")
        };
      }
    }

    // Check for collision
    const overlap = blocks.some(
      (b) =>
        row < b.row + b.size &&
        row + size > b.row &&
        col < b.col + b.size &&
        col + size > b.col
    );
    if (overlap) {
      alert("Ya hay contenido en esa área.");
      return;
    }

    const newBlock = { row, col, size, type, value, style };
    setBlocks([...blocks, newBlock]);
    setShowModal(false);
  };

  return (
    <div style={{ fontFamily: "monospace", background: "linear-gradient(#002f4b, #41295a)", minHeight: "100vh", paddingBottom: "50px" }}>
      <h1 style={{ textAlign: "center", color: "#fff", padding: "1rem" }}>🎮 ONEPIXELWALL</h1>
      <p style={{ textAlign: "center", color: "#ccc", marginTop: "-1rem" }}>
        Leave your mark on the internet. $1 per pixel.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${GRID_WIDTH}, ${BLOCK_SIZE}px)`, width: GRID_WIDTH * BLOCK_SIZE, margin: "2rem auto", position: "relative" }}>
        {Array.from({ length: GRID_HEIGHT }).map((_, row) =>
          Array.from({ length: GRID_WIDTH }).map((_, col) => {
            const block = blocks.find(
              (b) =>
                row >= b.row &&
                row < b.row + b.size &&
                col >= b.col &&
                col < b.col + b.size
            );

            if (block && row === block.row && col === block.col) {
              return (
                <div
                  key={`${row}-${col}`}
                  style={{
                    width: block.size * BLOCK_SIZE,
                    height: block.size * BLOCK_SIZE,
                    gridColumn: col + 1,
                    gridRow: row + 1,
                    backgroundColor: block.style?.backgroundColor || "transparent",
                    color: block.style?.color || "#000",
                    fontFamily: block.style?.fontFamily || "sans-serif",
                    fontSize: "8px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    border: "1px solid #333"
                  }}
                >
                  {block.type === "texto" ? (
                    <div style={{ padding: 2, wordBreak: "break-word" }}>{block.value}</div>
                  ) : (
                    <img src={block.value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
              );
            }

            if (!block) {
              return (
                <div
                  key={`${row}-${col}`}
                  onClick={() => openModal(row, col)}
                  style={{
                    width: BLOCK_SIZE,
                    height: BLOCK_SIZE,
                    gridColumn: col + 1,
                    gridRow: row + 1,
                    border: "1px solid #444",
                    backgroundColor: "transparent"
                  }}
                />
              );
            }

            return null;
          })
        )}
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", background: "#fff", padding: "1rem", borderRadius: "5px", zIndex: 10 }}>
          <label>
            Cantidad de bloques:
            <input
              type="number"
              min="1"
              value={modalData.size}
              onChange={(e) => setModalData({ ...modalData, size: parseInt(e.target.value) })}
            />
          </label>
          <br />
          <label>
            Tipo:
            <select
              value={modalData.type}
              onChange={(e) => setModalData({ ...modalData, type: e.target.value })}
            >
              <option value="texto">Texto</option>
              <option value="imagen">Imagen</option>
            </select>
          </label>
          <br />
          <label>
            {modalData.type === "imagen" ? "URL Imagen:" : "Mensaje:"}
            <input
              type="text"
              value={modalData.value}
              onChange={(e) => setModalData({ ...modalData, value: e.target.value })}
            />
          </label>
          {modalData.type === "texto" && (
            <>
              <br />
              <label>Estilo:</label>
              <select
                value={modalData.styleMode}
                onChange={(e) => setModalData({ ...modalData, styleMode: e.target.value })}
              >
                <option value="aleatorio">Aleatorio</option>
                <option value="personalizado">Elegir estilo</option>
              </select>
              {modalData.styleMode === "personalizado" && (
                <>
                  <br />
                  <label>Color de fondo:</label>
                  <input
                    type="color"
                    value={modalData.bgColor}
                    onChange={(e) => setModalData({ ...modalData, bgColor: e.target.value })}
                  />
                  <br />
                  <label>Fuente:</label>
                  <select
                    value={modalData.font}
                    onChange={(e) => setModalData({ ...modalData, font: e.target.value })}
                  >
                    {fonts.map((f) => (
                      <option key={f} value={f}>{f}</option>
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
