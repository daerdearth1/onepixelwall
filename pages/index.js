import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

const colors = ["#e63946", "#f1fa8c", "#a8dadc", "#457b9d", "#ff79c6", "#8ecae6"];
const fonts = ["monospace", "cursive", "Press Start 2P", "VT323", "Orbitron"];

export default function OnePixelWall() {
  const [grid] = useState(
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
    font: "",
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
      font: "",
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
    const newBlock = { row, col, size, type, value, styleMode, bgColor, font };
    setBlocks([...blocks, newBlock]);
    setShowModal(false);
  };

  const renderBlock = (block, index) => {
    const { row, col, size, type, value, styleMode, bgColor, font } = block;
    const top = row * BLOCK_SIZE;
    const left = col * BLOCK_SIZE;
    const dimension = size * BLOCK_SIZE;
    const style = {
      position: "absolute",
      top,
      left,
      width: dimension,
      height: dimension,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      textAlign: "center",
      padding: "2px",
      fontSize: `${BLOCK_SIZE}px`,
      fontFamily: styleMode === "personalizado" ? font : fonts[Math.floor(Math.random() * fonts.length)],
      backgroundColor: styleMode === "personalizado" ? bgColor : colors[Math.floor(Math.random() * colors.length)],
      color: "#fff",
      borderRadius: "4px",
    };

    return (
      <div key={index} style={style}>
        {type === "texto" ? value : <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      </div>
    );
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "monospace", background: "linear-gradient(to bottom, #003049, #d62828)", minHeight: "100vh", color: "white" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", margin: "0.5rem 0" }}>🎮 ONEPIXELWALL</h1>
      <p style={{ textAlign: "center", marginBottom: "1rem" }}>
        Leave your mark on the internet. $1 per pixel.
      </p>

      <div
        style={{
          position: "relative",
          width: GRID_WIDTH * BLOCK_SIZE,
          height: GRID_HEIGHT * BLOCK_SIZE,
          margin: "0 auto",
          backgroundSize: `${BLOCK_SIZE}px ${BLOCK_SIZE}px`,
          backgroundImage:
            "linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)",
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const col = Math.floor(x / BLOCK_SIZE);
          const row = Math.floor(y / BLOCK_SIZE);
          openModal(row, col);
        }}
      >
        {blocks.map(renderBlock)}
      </div>

      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10
        }}>
          <div style={{
            background: "#fff", color: "#000", padding: "1rem", borderRadius: "8px", minWidth: "300px"
          }}>
            <label>Cantidad de bloques: </label>
            <input
              type="number"
              min="1"
              value={modalData.size}
              onChange={(e) =>
                setModalData({ ...modalData, size: parseInt(e.target.value) })
              }
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />

            <label>Texto o Imagen:</label>
            <input
              type="text"
              placeholder="texto o imagen"
              value={modalData.type}
              onChange={(e) =>
                setModalData({ ...modalData, type: e.target.value.toLowerCase() })
              }
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />

            <label>{modalData.type === "imagen" ? "URL Imagen:" : "Mensaje:"}</label>
            <input
              type="text"
              value={modalData.value}
              onChange={(e) =>
                setModalData({ ...modalData, value: e.target.value })
              }
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />

            <label>Estilo:</label>
            <select
              value={modalData.styleMode}
              onChange={(e) =>
                setModalData({ ...modalData, styleMode: e.target.value })
              }
              style={{ width: "100%", marginBottom: "0.5rem" }}
            >
              <option value="aleatorio">Aleatorio</option>
              <option value="personalizado">Elegir estilo</option>
            </select>

            {modalData.styleMode === "personalizado" && (
              <>
                <label>Color de fondo:</label>
                <input
                  type="color"
                  value={modalData.bgColor}
                  onChange={(e) =>
                    setModalData({ ...modalData, bgColor: e.target.value })
                  }
                  style={{ width: "100%", marginBottom: "0.5rem" }}
                />

                <label>Fuente:</label>
                <select
                  value={modalData.font}
                  onChange={(e) =>
                    setModalData({ ...modalData, font: e.target.value })
                  }
                  style={{ width: "100%", marginBottom: "0.5rem" }}
                >
                  {fonts.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </>
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={handleModalSubmit}>Agregar</button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
