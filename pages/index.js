import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

const colors = ["#fef3bd", "#ffd6d6", "#d6f5d6", "#a6dcf0", "#fff0f5", "#e0f8ff"];
const fonts = ["monospace", "cursive", "serif", "Press Start 2P", "VT323", "Orbitron", "Pixelify Sans"];

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
      alert("Para subir una imagen necesitas mínimo 10x10 bloques.");
      return;
    }

    if (!value) {
      alert("Contenido vacío.");
      return;
    }

    // Colisión
    const collision = blocks.some(b =>
      b.row < row + size &&
      b.row + b.size > row &&
      b.col < col + size &&
      b.col + b.size > col
    );

    if (collision) {
      alert("Esta zona ya está ocupada.");
      return;
    }

    let style = {};
    if (type === "texto") {
      if (styleMode === "aleatorio") {
        style = {
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          fontFamily: fonts[Math.floor(Math.random() * fonts.length)]
        };
      } else {
        style = {
          backgroundColor: bgColor,
          fontFamily: font
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
    <div style={{ fontFamily: "monospace", background: "linear-gradient(to bottom, #002b36, #5c1e1e)", color: "white", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", padding: "1rem" }}>
        <h1>🎮 ONEPIXELWALL</h1>
        <p>Leave your mark on the internet. $1 per pixel.</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_WIDTH}, ${BLOCK_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, ${BLOCK_SIZE}px)`,
          justifyContent: "center",
          backgroundColor: "#333",
          margin: "0 auto",
          width: `${GRID_WIDTH * BLOCK_SIZE}px`
        }}
      >
        {[...Array(GRID_HEIGHT)].map((_, row) =>
          [...Array(GRID_WIDTH)].map((_, col) => (
            <div
              key={`${row}-${col}`}
              onClick={() => openModal(row, col)}
              style={{
                width: `${BLOCK_SIZE}px`,
                height: `${BLOCK_SIZE}px`,
                border: "1px solid rgba(255,255,255,0.05)",
                boxSizing: "border-box"
              }}
            />
          ))
        )}
        {blocks.map((block, idx) => (
          <div
            key={idx}
            style={{
              gridColumn: `${block.col + 1} / span ${block.size}`,
              gridRow: `${block.row + 1} / span ${block.size}`,
              backgroundColor: block.type === "imagen" ? "transparent" : block.style.backgroundColor,
              fontFamily: block.style.fontFamily,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden"
            }}
          >
            {block.type === "imagen" ? (
              <img src={block.value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: `${block.size * 3}px`, textAlign: "center", padding: "2px" }}>{block.value}</span>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", background: "white", color: "black", padding: "1rem", borderRadius: "8px", zIndex: 10 }}>
          <div>
            <label>Cantidad de bloques: </label>
            <input type="number" min="1" max="50" value={modalData.size} onChange={e => setModalData({ ...modalData, size: parseInt(e.target.value) })} />
          </div>
          <div>
            <label>Tipo: </label>
            <select value={modalData.type} onChange={e => setModalData({ ...modalData, type: e.target.value })}>
              <option value="texto">Texto</option>
              <option value="imagen">Imagen</option>
            </select>
          </div>
          <div>
            <label>{modalData.type === "imagen" ? "URL Imagen:" : "Mensaje:"}</label>
            <input type="text" value={modalData.value} onChange={e => setModalData({ ...modalData, value: e.target.value })} />
          </div>
          {modalData.type === "texto" && (
            <>
              <div>
                <label>Estilo:</label>
                <select value={modalData.styleMode} onChange={e => setModalData({ ...modalData, styleMode: e.target.value })}>
                  <option value="aleatorio">Aleatorio</option>
                  <option value="personalizado">Elegir estilo</option>
                </select>
              </div>
              {modalData.styleMode === "personalizado" && (
                <>
                  <div>
                    <label>Color de fondo:</label>
                    <input type="color" value={modalData.bgColor} onChange={e => setModalData({ ...modalData, bgColor: e.target.value })} />
                  </div>
                  <div>
                    <label>Fuente:</label>
                    <select value={modalData.font} onChange={e => setModalData({ ...modalData, font: e.target.value })}>
                      {fonts.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </>
          )}
          <div style={{ marginTop: "1rem" }}>
            <button onClick={handleModalSubmit}>Agregar</button>
            <button onClick={() => setShowModal(false)} style={{ marginLeft: "1rem" }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
