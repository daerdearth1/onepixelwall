import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

const colors = ["#fef3bd", "#ffd6d6", "#d6f5d6", "#a6dcff", "#ffb3ff", "#e0f8ff"];
const fonts = ["monospace", "cursive", "serif", "Press Start 2P", "Orbitron", "Pixelify Sans"];

export default function OnePixelWall() {
  const [blocks, setBlocks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    row: 0, col: 0, size: 1, type: "texto", value: "", styleMode: "aleatorio", bgColor: "", font: ""
  });

  const openModal = (row, col) => {
    setModalData({ row, col, size: 1, type: "texto", value: "", styleMode: "aleatorio", bgColor: "", font: "" });
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    const { row, col, size, type, value, styleMode, bgColor, font } = modalData;

    if (type === "imagen" && size < 2) {
      alert("Para subir una imagen necesitas mínimo 10x10 bloques");
      return;
    }

    if (!value) {
      alert("Contenido vacío.");
      return;
    }

    if (type === "texto" && value.length > 12 && size < 2) {
      alert("El mensaje es demasiado largo para un solo bloque. Usa más bloques.");
      return;
    }

    let style = {};
    if (type === "texto") {
      if (styleMode === "aleatorio") {
        style = {
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          fontFamily: fonts[Math.floor(Math.random() * fonts.length)],
          color: "#fff"
        };
      } else {
        style = {
          backgroundColor: bgColor,
          fontFamily: font,
          color: "#fff"
        };
      }
    }

    const newBlock = { row, col, size, type, value, style };

    const collision = blocks.some(b => {
      for (let i = 0; i < b.size; i++) {
        for (let j = 0; j < b.size; j++) {
          for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
              if (b.row + i === row + x && b.col + j === col + y) {
                return true;
              }
            }
          }
        }
      }
      return false;
    });

    if (collision) {
      alert("Esa área ya está ocupada.");
      return;
    }

    setBlocks([...blocks, newBlock]);
    setShowModal(false);
  };

  return (
    <div style={{ background: "linear-gradient(to bottom, #001f3f, #002b45)", minHeight: "100vh", color: "#fff" }}>
      <div style={{ textAlign: "center", padding: "1rem" }}>
        <h1 style={{ fontFamily: "monospace", fontSize: "2rem" }}>🎮 ONEPIXELWALL</h1>
        <p>Leave your mark on the internet. $1 per pixel.</p>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_WIDTH}, ${BLOCK_SIZE}px)`,
        gridTemplateRows: `repeat(${GRID_HEIGHT}, ${BLOCK_SIZE}px)`,
        justifyContent: "center"
      }}>
        {Array.from({ length: GRID_HEIGHT }).map((_, row) =>
          Array.from({ length: GRID_WIDTH }).map((_, col) => {
            const block = blocks.find(b =>
              row >= b.row && row < b.row + b.size &&
              col >= b.col && col < b.col + b.size
            );
            if (block) {
              const style = {
                gridColumn: `${block.col + 1} / span ${block.size}`,
                gridRow: `${block.row + 1} / span ${block.size}`,
                ...block.style,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: `${block.size * 5}px`,
                border: "1px solid #222"
              };

              return (
                <div key={`${block.row}-${block.col}`} style={style}>
                  {block.type === "texto" ? block.value : (
                    <img src={block.value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
              );
            } else {
              return (
                <div key={`${row}-${col}`} onClick={() => openModal(row, col)} style={{
                  width: BLOCK_SIZE,
                  height: BLOCK_SIZE,
                  border: "1px solid #444",
                  boxSizing: "border-box",
                }} />
              );
            }
          })
        )}
      </div>

      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 10
        }}>
          <div style={{ background: "#fff", padding: "1rem", borderRadius: "8px", color: "#000" }}>
            <label>Cantidad de bloques: </label>
            <input
              type="number"
              value={modalData.size}
              min={1}
              max={10}
              onChange={(e) => setModalData({ ...modalData, size: parseInt(e.target.value) })}
            /><br /><br />

            <label>Tipo: </label>
            <select
              value={modalData.type}
              onChange={(e) => setModalData({ ...modalData, type: e.target.value })}
            >
              <option value="texto">Texto</option>
              <option value="imagen">Imagen</option>
            </select><br /><br />

            <label>{modalData.type === "imagen" ? "URL Imagen:" : "Mensaje:"}</label>
            <input
              type="text"
              value={modalData.value}
              onChange={(e) => setModalData({ ...modalData, value: e.target.value })}
            /><br /><br />

            {modalData.type === "texto" && (
              <>
                <label>Estilo:</label>
                <select
                  value={modalData.styleMode}
                  onChange={(e) => setModalData({ ...modalData, styleMode: e.target.value })}
                >
                  <option value="aleatorio">Aleatorio</option>
                  <option value="personalizado">Elegir estilo</option>
                </select><br /><br />

                {modalData.styleMode === "personalizado" && (
                  <>
                    <label>Color de fondo:</label>
                    <input
                      type="color"
                      value={modalData.bgColor}
                      onChange={(e) => setModalData({ ...modalData, bgColor: e.target.value })}
                    /><br /><br />

                    <label>Fuente:</label>
                    <select
                      value={modalData.font}
                      onChange={(e) => setModalData({ ...modalData, font: e.target.value })}
                    >
                      {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                    </select><br /><br />
                  </>
                )}
              </>
            )}

            <button onClick={handleModalSubmit}>Agregar</button>
            <button onClick={() => setShowModal(false)} style={{ marginLeft: "1rem" }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
