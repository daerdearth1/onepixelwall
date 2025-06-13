import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

const colors = ["#fef3bd", "#ffd6d6", "#d6f5d6", "#d6ecff", "#fff0f5", "#f0f8ff"];
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
          fontFamily: fonts[Math.floor(Math.random() * fonts.length)]
        };
      } else {
        style = {
          backgroundColor: bgColor || "#fff",
          fontFamily: font || "monospace"
        };
      }
    }

    const newBlock = { row, col, size, type, value, style };
    setBlocks([...blocks, newBlock]);
    setShowModal(false);
  };

  return (
    <div style={{ fontFamily: "monospace", backgroundColor: "#f7f1e7", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", padding: "1rem" }}>
        <h1 style={{ fontSize: "24px", color: "#224f90" }}>🎮 ONEPIXELWALL</h1>
        <p>Leave your mark on the internet. $1 per pixel.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${GRID_WIDTH}, ${BLOCK_SIZE}px)` }}>
        {Array.from({ length: GRID_HEIGHT }).flatMap((_, row) =>
          Array.from({ length: GRID_WIDTH }).map((_, col) => {
            const block = blocks.find(
              (b) => row >= b.row && row < b.row + b.size && col >= b.col && col < b.col + b.size
            );
            const isTopLeft = block && row === block.row && col === block.col;

            return (
              <div
                key={`${row}-${col}`}
                onClick={() => !block && openModal(row, col)}
                style={{
                  width: BLOCK_SIZE,
                  height: BLOCK_SIZE,
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                  backgroundColor: block ? block.style?.backgroundColor || "#ccc" : "transparent",
                  gridColumnStart: col + 1,
                  gridRowStart: row + 1,
                  overflow: "hidden",
                  display: isTopLeft ? "flex" : undefined,
                  alignItems: isTopLeft ? "center" : undefined,
                  justifyContent: isTopLeft ? "center" : undefined,
                  fontSize: isTopLeft ? "6px" : undefined,
                  fontFamily: block?.style?.fontFamily
                }}
              >
                {isTopLeft &&
                  (block.type === "texto" ? (
                    <span style={{ fontSize: `${block.size * 2}px` }}>{block.value}</span>
                  ) : (
                    <img
                      src={block.value}
                      alt=""
                      style={{
                        width: block.size * BLOCK_SIZE,
                        height: block.size * BLOCK_SIZE,
                        objectFit: "cover"
                      }}
                    />
                  ))}
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 100,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "1rem",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            zIndex: 1000
          }}
        >
          <div style={{ fontFamily: "monospace", fontSize: "14px" }}>
            <label>{modalData.type === "imagen" ? "URL Imagen: " : "Mensaje:"}</label>
            <input
              type="text"
              value={modalData.value}
              onChange={(e) => setModalData({ ...modalData, value: e.target.value })}
            />
            <br />
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
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </>
            )}
            <br />
            <button onClick={handleModalSubmit}>Agregar</button>
            <button onClick={() => setShowModal(false)} style={{ marginLeft: "1rem" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
