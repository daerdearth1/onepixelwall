import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

const colors = ["#e63946", "#f1fa8c", "#06d6a0", "#118ab2", "#9b5de5", "#ff6b6b"];
const fonts = ["monospace", "cursive", "serif", "Pixelify Sans", "Orbitron", "VT323"];

export default function OnePixelWall() {
  const [grid] = useState(Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(null)));
  const [blocks, setBlocks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    row: 0, col: 0, size: 1, type: "texto", value: "",
    styleMode: "aleatorio", bgColor: "", font: ""
  });

  const openModal = (row, col) => {
    setModalData({
      row, col, size: 1, type: "texto", value: "",
      styleMode: "aleatorio", bgColor: "", font: ""
    });
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    const { row, col, size, type, value, styleMode, bgColor, font } = modalData;

    const collision = blocks.some((b) => {
      const bEndRow = b.row + b.size;
      const bEndCol = b.col + b.size;
      const thisEndRow = row + size;
      const thisEndCol = col + size;
      return (
        row < bEndRow &&
        row + size > b.row &&
        col < bEndCol &&
        col + size > b.col
      );
    });

    if (collision) {
      alert("Ese espacio ya está ocupado por otro bloque.");
      return;
    }

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

  const renderBlock = (block, i) => {
    const px = BLOCK_SIZE * block.size;
    const top = block.row * BLOCK_SIZE;
    const left = block.col * BLOCK_SIZE;

    let style = {
      position: "absolute",
      top,
      left,
      width: px,
      height: px,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: Math.max(8, px / 5),
      color: "white",
      overflow: "hidden",
      textAlign: "center",
      padding: 2,
      boxShadow: "0 0 2px #000",
      border: "1px solid #888",
      borderRadius: 3,
    };

    if (block.type === "texto") {
      if (block.styleMode === "aleatorio") {
        style.background = colors[i % colors.length];
        style.fontFamily = fonts[i % fonts.length];
      } else {
        style.background = block.bgColor;
        style.fontFamily = block.font;
      }
      return (
        <div key={i} style={style}>
          {block.value}
        </div>
      );
    } else if (block.type === "imagen") {
      return (
        <img
          key={i}
          src={block.value}
          alt=""
          style={{
            ...style,
            objectFit: "cover",
            border: "2px solid white",
            background: "#222"
          }}
        />
      );
    }
  };

  return (
    <div style={{
      fontFamily: "monospace",
      background: "linear-gradient(to bottom, #002d43, #4b1d2f)",
      color: "#fff",
      minHeight: "100vh",
      margin: 0,
      padding: 0
    }}>
      <div style={{
        textAlign: "center",
        padding: "1rem",
        fontSize: "1.5rem"
      }}>
        <div style={{ fontSize: "2rem", fontWeight: "bold" }}>🎮 ONEPIXELWALL</div>
        <div style={{ fontSize: "0.9rem", marginTop: 4 }}>
          Leave your mark on the internet. $1 per pixel.
        </div>
      </div>

      <div style={{
        position: "relative",
        width: GRID_WIDTH * BLOCK_SIZE,
        height: GRID_HEIGHT * BLOCK_SIZE,
        margin: "auto",
        backgroundImage:
          "linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: `${BLOCK_SIZE}px ${BLOCK_SIZE}px`
      }}>
        {Array(GRID_HEIGHT).fill(0).map((_, row) =>
          Array(GRID_WIDTH).fill(0).map((_, col) => (
            <div
              key={`${row}-${col}`}
              onClick={() => openModal(row, col)}
              style={{
                position: "absolute",
                top: row * BLOCK_SIZE,
                left: col * BLOCK_SIZE,
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
                cursor: "pointer",
                opacity: 0
              }}
            />
          ))
        )}
        {blocks.map(renderBlock)}
      </div>

      {showModal && (
        <div style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#f8f8f8",
          color: "#000",
          padding: "1rem",
          borderRadius: "8px",
          boxShadow: "0 0 15px rgba(0,0,0,0.4)",
          zIndex: 1000,
          minWidth: 280
        }}>
          <div>
            <label>Cantidad de bloques: </label>
            <input
              type="number"
              min={1}
              max={50}
              value={modalData.size}
              onChange={(e) => setModalData({ ...modalData, size: parseInt(e.target.value) })}
              style={{ width: "60px" }}
            />
          </div>
          <div>
            <label>Texto o Imagen: </label>
            <input
              value={modalData.type}
              onChange={(e) => setModalData({ ...modalData, type: e.target.value })}
              placeholder="texto o imagen"
            />
          </div>
          <div>
            <label>{modalData.type === "imagen" ? "URL Imagen" : "Mensaje"}:</label>
            <input
              type="text"
              value={modalData.value}
              onChange={(e) => setModalData({ ...modalData, value: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>
          {modalData.type === "texto" && (
            <>
              <div>
                <label>Estilo:</label>
                <select
                  value={modalData.styleMode}
                  onChange={(e) => setModalData({ ...modalData, styleMode: e.target.value })}
                >
                  <option value="aleatorio">Aleatorio</option>
                  <option value="personalizado">Elegir estilo</option>
                </select>
              </div>
              {modalData.styleMode === "personalizado" && (
                <>
                  <div>
                    <label>Color de fondo:</label>
                    <input
                      type="color"
                      value={modalData.bgColor}
                      onChange={(e) => setModalData({ ...modalData, bgColor: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Fuente:</label>
                    <select
                      value={modalData.font}
                      onChange={(e) => setModalData({ ...modalData, font: e.target.value })}
                    >
                      {fonts.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
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
