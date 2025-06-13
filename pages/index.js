import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

const colors = ["#fef3bd", "#ffd6d6", "#d6f5d6", "#a6c0ff", "#fff0f5", "#f0f8ff"];
const fonts = ["monospace", "cursive", "serif", "Press Start 2P", "VT323", "Orbitron", "Pixelify Sans"];

export default function OnePixelWall() {
  const [grid, setGrid] = useState(
    Array(GRID_HEIGHT)
      .fill(null)
      .map(() => Array(GRID_WIDTH).fill(null))
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
        if (r >= GRID_HEIGHT || c >= GRID_WIDTH || grid[r][c]) return true;
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
      alert("Ya hay un bloque en ese espacio.");
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

    const newGrid = [...grid];
    for (let r = row; r < row + size; r++) {
      for (let c = col; c < col + size; c++) {
        newGrid[r][c] = true;
      }
    }
    setGrid(newGrid);

    setShowModal(false);
  };

  return (
    <div style={{ padding: "1rem", background: "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)", fontFamily: "monospace" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", color: "#fff" }}>
        🎮 ONEPIXELWALL
      </h1>
      <p style={{ textAlign: "center", color: "#ccc", marginBottom: "1rem" }}>
        Leave your mark on the internet. $1 per pixel.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_WIDTH}, ${BLOCK_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, ${BLOCK_SIZE}px)`,
          gap: "1px",
          backgroundColor: "#444",
          margin: "0 auto",
          width: GRID_WIDTH * BLOCK_SIZE,
          height: GRID_HEIGHT * BLOCK_SIZE,
          position: "relative"
        }}
      >
        {blocks.map((block, idx) => (
          <div
            key={idx}
            style={{
              gridColumn: `${block.col + 1} / span ${block.size}`,
              gridRow: `${block.row + 1} / span ${block.size}`,
              backgroundColor: block.type === "imagen" ? "transparent" : block.style.backgroundColor,
              fontFamily: block.style.fontFamily,
              fontSize: `${block.size * 1.5}px`,
              color: "#000",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              border: "1px solid #ccc",
              textAlign: "center",
              padding: "2px"
            }}
          >
            {block.type === "texto" ? (
              <span>{block.value}</span>
            ) : (
              <img
                src={block.value}
                alt="img"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
        ))}

        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              style={{
                width: `${BLOCK_SIZE}px`,
                height: `${BLOCK_SIZE}px`,
                backgroundColor: "transparent",
                cursor: "pointer"
              }}
              onClick={() => openModal(rIdx, cIdx)}
            />
          ))
        )}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fff",
            padding: "1rem",
            border: "2px solid #333",
            borderRadius: "8px",
            zIndex: 1000
          }}
        >
          <div>
            <label>Cantidad de bloques: </label>
            <input
              type="number"
              value={modalData.size}
              onChange={(e) =>
                setModalData({ ...modalData, size: parseInt(e.target.value) })
              }
              min={1}
              max={Math.min(GRID_WIDTH, GRID_HEIGHT)}
            />
          </div>

          <div>
            <label>Tipo de contenido: </label>
            <select
              value={modalData.type}
              onChange={(e) =>
                setModalData({ ...modalData, type: e.target.value })
              }
            >
              <option value="texto">Texto</option>
              <option value="imagen">Imagen</option>
            </select>
          </div>

          <div>
            <label>{modalData.type === "imagen" ? "URL Imagen:" : "Mensaje:"}</label>
            <input
              type="text"
              value={modalData.value}
              onChange={(e) =>
                setModalData({ ...modalData, value: e.target.value })
              }
            />
          </div>

          {modalData.type === "texto" && (
            <>
              <div>
                <label>Estilo:</label>
                <select
                  value={modalData.styleMode}
                  onChange={(e) =>
                    setModalData({ ...modalData, styleMode: e.target.value })
                  }
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
                      onChange={(e) =>
                        setModalData({ ...modalData, bgColor: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label>Fuente:</label>
                    <select
                      value={modalData.font}
                      onChange={(e) =>
                        setModalData({ ...modalData, font: e.target.value })
                      }
                    >
                      {fonts.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </>
          )}

          <div style={{ marginTop: "1rem" }}>
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
