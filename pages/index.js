import { useState, useEffect } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

const colors = ["#fef3c7", "#fca5a5", "#6ee7b7", "#93c5fd", "#fcd34d"];
const fonts = ["monospace", "cursive", "serif", "Press Start 2P", "VT323"];

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
    font: "",
  });

  const openModal = (row, col) => {
    setModalData({ ...modalData, row, col });
    setShowModal(true);
  };

  const isOccupied = (row, col, size) => {
    return blocks.some((b) => {
      const rowEnd = b.row + b.size;
      const colEnd = b.col + b.size;
      return (
        row < rowEnd &&
        row + size > b.row &&
        col < colEnd &&
        col + size > b.col
      );
    });
  };

  const handleModalSubmit = () => {
    const { row, col, size, type, value, styleMode, bgColor, font } = modalData;

    if (!value) {
      alert("Contenido vacío.");
      return;
    }

    if (type === "imagen" && size < 2) {
      alert("Para subir una imagen necesitas mínimo 2x2 bloques.");
      return;
    }

    if (isOccupied(row, col, size)) {
      alert("Ya hay contenido en esta área.");
      return;
    }

    let finalStyle = {};
    if (type === "texto") {
      if (styleMode === "aleatorio") {
        finalStyle = {
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          fontFamily: fonts[Math.floor(Math.random() * fonts.length)],
          fontSize: `${Math.max(10, size * 4)}px`,
          color: "#fff",
          fontWeight: "bold",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        };
      } else {
        finalStyle = {
          backgroundColor: bgColor || "#000",
          fontFamily: font || "sans-serif",
          fontSize: `${Math.max(10, size * 4)}px`,
          color: "#fff",
          fontWeight: "bold",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        };
      }
    }

    const newBlock = {
      row,
      col,
      size,
      type,
      value,
      style: finalStyle,
    };

    setBlocks([...blocks, newBlock]);
    setShowModal(false);
  };

  return (
    <div style={{ fontFamily: "monospace", background: "#111827", color: "#fff" }}>
      <div style={{ textAlign: "center", padding: "1rem", background: "#0f172a", color: "#fff" }}>
        <h1 style={{ fontSize: "1.5rem" }}>🎮 ONEPIXELWALL</h1>
        <p>Leave your mark on the internet. $1 per pixel.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${GRID_WIDTH}, ${BLOCK_SIZE}px)`, width: GRID_WIDTH * BLOCK_SIZE, margin: "0 auto" }}>
        {Array.from({ length: GRID_HEIGHT }).map((_, row) =>
          Array.from({ length: GRID_WIDTH }).map((_, col) => {
            const block = blocks.find((b) => row >= b.row && row < b.row + b.size && col >= b.col && col < b.col + b.size);
            if (block && (row !== block.row || col !== block.col)) return null;

            return (
              <div
                key={`${row}-${col}`}
                onClick={() => openModal(row, col)}
                style={{
                  width: BLOCK_SIZE * (block?.size || 1),
                  height: BLOCK_SIZE * (block?.size || 1),
                  border: "1px solid #374151",
                  boxSizing: "border-box",
                  gridColumn: `${col + 1} / span ${block?.size || 1}`,
                  gridRow: `${row + 1} / span ${block?.size || 1}`,
                  overflow: "hidden",
                  backgroundColor: block ? block.style?.backgroundColor : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: block?.style?.fontFamily,
                  fontSize: block?.style?.fontSize,
                  color: block?.style?.color,
                }}
              >
                {block?.type === "texto" ? block.value : block?.type === "imagen" ? (
                  <img src={block.value} alt="pixel" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : null}
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 8, width: 300 }}>
            <label>Cantidad de bloques:</label>
            <input
              type="number"
              min={1}
              max={10}
              value={modalData.size}
              onChange={(e) => setModalData({ ...modalData, size: parseInt(e.target.value) })}
              style={{ width: "100%", marginBottom: 10 }}
            />

            <label>Tipo:</label>
            <select
              value={modalData.type}
              onChange={(e) => setModalData({ ...modalData, type: e.target.value })}
              style={{ width: "100%", marginBottom: 10 }}
            >
              <option value="texto">Texto</option>
              <option value="imagen">Imagen</option>
            </select>

            <label>{modalData.type === "imagen" ? "URL de imagen:" : "Mensaje:"}</label>
            <input
              type="text"
              value={modalData.value}
              onChange={(e) => setModalData({ ...modalData, value: e.target.value })}
              style={{ width: "100%", marginBottom: 10 }}
            />

            {modalData.type === "texto" && (
              <>
                <label>Estilo:</label>
                <select
                  value={modalData.styleMode}
                  onChange={(e) => setModalData({ ...modalData, styleMode: e.target.value })}
                  style={{ width: "100%", marginBottom: 10 }}
                >
                  <option value="aleatorio">Aleatorio</option>
                  <option value="personalizado">Personalizado</option>
                </select>

                {modalData.styleMode === "personalizado" && (
                  <>
                    <label>Color de fondo:</label>
                    <input
                      type="color"
                      value={modalData.bgColor}
                      onChange={(e) => setModalData({ ...modalData, bgColor: e.target.value })}
                      style={{ width: "100%", marginBottom: 10 }}
                    />

                    <label>Fuente:</label>
                    <select
                      value={modalData.font}
                      onChange={(e) => setModalData({ ...modalData, font: e.target.value })}
                      style={{ width: "100%", marginBottom: 10 }}
                    >
                      {fonts.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </>
                )}
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
