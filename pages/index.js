import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

const colors = ["#fef3bd", "#ffd6d6", "#d6f5d6", "#a6e0ff", "#ffffb5", "#f0f0ff"];
const fonts = ["monospace", "cursive", "serif", "Press Start 2P", "Orbitron", "Pixelify Sans"];

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
    setModalData({ row, col, size: 1, type: "texto", value: "", styleMode: "aleatorio", bgColor: "", font: "" });
    setShowModal(true);
  };

  const isOccupied = (row, col, size) => {
    return blocks.some(block => {
      return (
        row < block.row + block.size &&
        row + size > block.row &&
        col < block.col + block.size &&
        col + size > block.col
      );
    });
  };

  const handleModalSubmit = () => {
    const { row, col, size, type, value, styleMode, bgColor, font } = modalData;

    if (type === "imagen" && size < 2) {
      alert("Para subir una imagen necesitas mínimo 2x2 bloques");
      return;
    }

    if (!value) {
      alert("Contenido vacío.");
      return;
    }

    if (isOccupied(row, col, size)) {
      alert("Ya hay algo en esta posición.");
      return;
    }

    let style = {};

    if (type === "texto") {
      if (styleMode === "aleatorio") {
        style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
      } else {
        style.backgroundColor = bgColor || "#fff";
        style.fontFamily = font || "sans-serif";
      }
    }

    const newBlock = { row, col, size, type, value, style };
    setBlocks([...blocks, newBlock]);
    setShowModal(false);
  };

  const isLight = (bg) => {
    if (!bg) return false;
    const c = bg.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 186;
  };

  return (
    <div style={{ fontFamily: "monospace", background: "radial-gradient(#061a28, #0b1d2a)", color: "#fff", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", fontSize: "24px", paddingTop: "20px" }}>🎮 ONEPIXELWALL</h1>
      <p style={{ textAlign: "center", marginBottom: "20px" }}>Leave your mark on the internet. $1 per pixel.</p>

      <div
        style={{
          position: "relative",
          width: GRID_WIDTH * BLOCK_SIZE,
          height: GRID_HEIGHT * BLOCK_SIZE,
          margin: "0 auto",
          backgroundSize: `${BLOCK_SIZE}px ${BLOCK_SIZE}px`,
          backgroundImage: "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)"
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = Math.floor((e.clientX - rect.left) / BLOCK_SIZE);
          const y = Math.floor((e.clientY - rect.top) / BLOCK_SIZE);
          openModal(y, x);
        }}
      >
        {blocks.map((block, i) => {
          const backgroundColor = block.type === "texto" ? block.style.backgroundColor : "transparent";
          const fontFamily = block.style.fontFamily;
          const fontColor = block.type === "texto" ? (isLight(backgroundColor) ? "#000" : "#fff") : "transparent";
          const fontSize = Math.max(8, Math.min(block.size * 4, 18));

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: block.row * BLOCK_SIZE,
                left: block.col * BLOCK_SIZE,
                width: block.size * BLOCK_SIZE,
                height: block.size * BLOCK_SIZE,
                backgroundColor,
                fontFamily,
                color: fontColor,
                fontSize,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                overflow: "hidden",
                whiteSpace: "pre-wrap",
                padding: "2px",
                wordWrap: "break-word",
                border: "1px solid #333",
                boxSizing: "border-box"
              }}
            >
              {block.type === "imagen" ? (
                <img
                  src={block.value}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                block.value
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", background: "#fff", color: "#000", padding: "20px", borderRadius: "8px", zIndex: 10 }}>
          <label>Cantidad de bloques: </label>
          <input
            type="number"
            min="1"
            max="10"
            value={modalData.size}
            onChange={(e) => setModalData({ ...modalData, size: parseInt(e.target.value) })}
          />
          <br />
          <label>Tipo: </label>
          <select value={modalData.type} onChange={(e) => setModalData({ ...modalData, type: e.target.value })}>
            <option value="texto">Texto</option>
            <option value="imagen">Imagen</option>
          </select>
          <br />
          <label>{modalData.type === "imagen" ? "URL Imagen: " : "Mensaje: "}</label>
          <input
            type="text"
            value={modalData.value}
            onChange={(e) => setModalData({ ...modalData, value: e.target.value })}
          />
          <br />
          {modalData.type === "texto" && (
            <>
              <label>Estilo: </label>
              <select
                value={modalData.styleMode}
                onChange={(e) => setModalData({ ...modalData, styleMode: e.target.value })}
              >
                <option value="aleatorio">Aleatorio</option>
                <option value="personalizado">Elegir estilo</option>
              </select>
              <br />
              {modalData.styleMode === "personalizado" && (
                <>
                  <label>Color de fondo: </label>
                  <input
                    type="color"
                    value={modalData.bgColor}
                    onChange={(e) => setModalData({ ...modalData, bgColor: e.target.value })}
                  />
                  <br />
                  <label>Fuente: </label>
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
          <button onClick={() => setShowModal(false)} style={{ marginLeft: "1rem" }}>Cancelar</button>
        </div>
      )}
    </div>
  );
}
