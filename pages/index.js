import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

const colors = ["#ff3b3f", "#23a6d5", "#4caf50", "#f9a825", "#e91e63"];
const fonts = ["monospace", "serif", "cursive", "Orbitron", "VT323"];

export default function OnePixelWall() {
  const [grid, setGrid] = useState(
    Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(null))
  );
  const [blocks, setBlocks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    row: 0, col: 0, size: 1, type: "texto", value: "",
    styleMode: "aleatorio", bgColor: "", font: ""
  });

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
          background: colors[Math.floor(Math.random() * colors.length)],
          color: "#fff",
          fontSize: `${size * 4}px`,
          fontFamily: fonts[Math.floor(Math.random() * fonts.length)],
          padding: "4px"
        };
      } else {
        style = {
          background: bgColor,
          fontFamily: font,
          fontSize: `${size * 4}px`,
          padding: "4px"
        };
      }
    }

    const newBlock = {
      row,
      col,
      size,
      type,
      value,
      style
    };
    setBlocks([...blocks, newBlock]);
    setShowModal(false);
  };

  return (
    <div style={{ padding: "1rem", background: "linear-gradient(to bottom, #002f4b, #dc4225)", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", fontSize: "24px", color: "#fff" }}>🎮 ONEPIXELWALL</h1>
      <p style={{ textAlign: "center", color: "#fff" }}>Leave your mark on the internet. $1 per pixel.</p>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${GRID_WIDTH}, ${BLOCK_SIZE}px)`, justifyContent: "center" }}>
        {Array(GRID_HEIGHT).fill(null).map((_, row) =>
          Array(GRID_WIDTH).fill(null).map((_, col) => {
            const block = blocks.find(b =>
              row >= b.row && row < b.row + b.size &&
              col >= b.col && col < b.col + b.size
            );

            return (
              <div key={`${row}-${col}`} onClick={() => openModal(row, col)}
                style={{
                  width: BLOCK_SIZE,
                  height: BLOCK_SIZE,
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  ...(block && block.row === row && block.col === col ? {
                    gridColumn: `span ${block.size}`,
                    gridRow: `span ${block.size}`,
                    backgroundColor: "#333",
                    color: "#fff",
                    ...block.style
                  } : {})
                }}>
                {(block && block.row === row && block.col === col) && (
                  block.type === "texto"
                    ? <span>{block.value}</span>
                    : <img src={block.value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div style={{
          position: "fixed", top: "20%", left: "50%", transform: "translate(-50%, -20%)",
          backgroundColor: "white", padding: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", zIndex: 1000, borderRadius: "10px"
        }}>
          <label>Cantidad de bloques: </label>
          <input type="number" min="1" max="50" value={modalData.size}
            onChange={(e) => setModalData({ ...modalData, size: parseInt(e.target.value) })} />
          <br />
          <label>Texto o Imagen: </label>
          <input type="text" placeholder="texto o imagen"
            value={modalData.type}
            onChange={(e) => setModalData({ ...modalData, type: e.target.value })} />
          <br />
          <label>{modalData.type === "imagen" ? "URL Imagen:" : "Mensaje:"}</label>
          <input type="text" value={modalData.value}
            onChange={(e) => setModalData({ ...modalData, value: e.target.value })} />
          <br />
          {modalData.type === "texto" && (
            <>
              <label>Estilo:</label>
              <select value={modalData.styleMode}
                onChange={(e) => setModalData({ ...modalData, styleMode: e.target.value })}>
                <option value="aleatorio">Aleatorio</option>
                <option value="personalizado">Elegir estilo</option>
              </select>
              {modalData.styleMode === "personalizado" && (
                <>
                  <label>Color de fondo:</label>
                  <input type="color" value={modalData.bgColor}
                    onChange={(e) => setModalData({ ...modalData, bgColor: e.target.value })} />
                  <label>Fuente:</label>
                  <select value={modalData.font}
                    onChange={(e) => setModalData({ ...modalData, font: e.target.value })}>
                    {fonts.map(f => (
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
