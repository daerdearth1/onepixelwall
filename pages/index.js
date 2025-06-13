import { useState, useEffect, useRef } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

const colors = ["#fef3bd", "#ff6d6d", "#d6f5d6", "#a6d6ff", "#ffff99", "#ff80b3"];
const fonts = ["monospace", "cursive", "serif", "Press Start 2P", "VT323", "Orbitron"];

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

  const wallRef = useRef(null);

  const openModal = (row, col) => {
    setModalData({ row, col, size: 1, type: "texto", value: "", styleMode: "aleatorio", bgColor: "", font: "" });
    setShowModal(true);
  };

  const isOccupied = (row, col, size) => {
    return blocks.some((block) =>
      row < block.row + block.size &&
      row + size > block.row &&
      col < block.col + block.size &&
      col + size > block.col
    );
  };

  const handleModalSubmit = () => {
    const { row, col, size, type, value, styleMode, bgColor, font } = modalData;

    if (type === "imagen" && size < 2) {
      alert("Para subir una imagen necesitas mínimo 2x2 bloques.");
      return;
    }

    if (!value) {
      alert("Contenido vacío.");
      return;
    }

    if (isOccupied(row, col, size)) {
      alert("Ya hay un bloque en esa posición.");
      return;
    }

    let style = {};
    if (type === "texto") {
      if (styleMode === "aleatorio") {
        style = {
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          fontFamily: fonts[Math.floor(Math.random() * fonts.length)],
        };
      } else {
        style = { backgroundColor: bgColor || "#fff", fontFamily: font || "sans-serif" };
      }
    }

    const newBlock = { ...modalData, style };
    setBlocks([...blocks, newBlock]);
    setShowModal(false);
  };

  return (
    <div style={{ fontFamily: "monospace", background: "linear-gradient(#002233, #1a001a)", minHeight: "100vh", color: "#fff", overflow: "hidden" }}>
      <div style={{ textAlign: "center", padding: "1rem" }}>
        <h1 style={{ fontSize: "2rem" }}>🎮 ONEPIXELWALL</h1>
        <p>Leave your mark on the internet. $1 per pixel.</p>
      </div>

      <div
        ref={wallRef}
        style={{
          position: "relative",
          width: GRID_WIDTH * BLOCK_SIZE,
          height: GRID_HEIGHT * BLOCK_SIZE,
          margin: "0 auto",
          backgroundSize: `${BLOCK_SIZE}px ${BLOCK_SIZE}px`,
          backgroundImage: "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)",
        }}
        onClick={(e) => {
          const rect = wallRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const col = Math.floor(x / BLOCK_SIZE);
          const row = Math.floor(y / BLOCK_SIZE);
          openModal(row, col);
        }}
      >
        {blocks.map((block, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: block.row * BLOCK_SIZE,
              left: block.col * BLOCK_SIZE,
              width: block.size * BLOCK_SIZE,
              height: block.size * BLOCK_SIZE,
              backgroundColor: block.type === "texto" ? block.style.backgroundColor : "transparent",
              fontFamily: block.style.fontFamily,
              fontSize: `${block.size * 4}px`,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              textAlign: "center",
              border: "1px solid #444",
              padding: "2px",
            }}
          >
            {block.type === "imagen" ? (
              <img
                src={block.value}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              block.value
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%",
          height: "100%", backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10
        }}>
          <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", color: "#000", minWidth: "300px" }}>
            <div style={{ marginBottom: "0.5rem" }}>
              <label>Cantidad de bloques: </label>
              <input type="number" min={1} max={20} value={modalData.size}
                onChange={(e) => setModalData({ ...modalData, size: parseInt(e.target.value) })} />
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <label>Tipo: </label>
              <select
                value={modalData.type}
                onChange={(e) => setModalData({ ...modalData, type: e.target.value })}
              >
                <option value="texto">Texto</option>
                <option value="imagen">Imagen</option>
              </select>
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <label>{modalData.type === "imagen" ? "URL Imagen: " : "Mensaje: "}</label>
              <input type="text" value={modalData.value}
                onChange={(e) => setModalData({ ...modalData, value: e.target.value })} />
            </div>
            {modalData.type === "texto" && (
              <>
                <div style={{ marginBottom: "0.5rem" }}>
                  <label>Estilo: </label>
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
                    <div style={{ marginBottom: "0.5rem" }}>
                      <label>Color de fondo: </label>
                      <input type="color" value={modalData.bgColor}
                        onChange={(e) => setModalData({ ...modalData, bgColor: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                      <label>Fuente: </label>
                      <select value={modalData.font}
                        onChange={(e) => setModalData({ ...modalData, font: e.target.value })}>
                        {fonts.map((f) => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </>
            )}
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
              <button onClick={handleModalSubmit}>Agregar</button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
