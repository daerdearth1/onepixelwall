import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

const colors = ["#fef3bd", "#ffd6d6", "#d6f5d6", "#ade6ff", "#ffff95", "#fef0ff"];
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
      alert("Para subir una imagen necesitas mínimo 10x10 bloques");
      return;
    }

    if (!value.trim()) {
      alert("Contenido vacío.");
      return;
    }

    // Check for collisions
    const hasCollision = blocks.some(block => {
      const x = block.col;
      const y = block.row;
      return (
        x >= col &&
        x < col + size &&
        y >= row &&
        y < row + size
      );
    });

    if (hasCollision) {
      alert("Los bloques seleccionados ya están ocupados.");
      return;
    }

    let backgroundColor = bgColor;
    let fontFamily = font;

    if (type === "texto" && styleMode === "aleatorio") {
      backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
    }

    const newBlocks = [];

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        newBlocks.push({
          row: row + y,
          col: col + x,
          type,
          value,
          bgColor: backgroundColor,
          font: fontFamily,
          isTopLeft: x === 0 && y === 0,
          size
        });
      }
    }

    setBlocks([...blocks, ...newBlocks]);
    setShowModal(false);
  };

  const grid = [];
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      grid.push({ row, col });
    }
  }

  return (
    <div style={{ background: "linear-gradient(to bottom, #002233, #330000)", minHeight: "100vh", padding: "20px" }}>
      <div style={{ textAlign: "center", color: "white", marginBottom: "20px" }}>
        <h1 style={{ fontFamily: "monospace" }}>🎮 ONEPIXELWALL</h1>
        <p style={{ fontFamily: "monospace" }}>Leave your mark on the internet. $1 per pixel.</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_WIDTH}, ${BLOCK_SIZE}px)`,
        gridTemplateRows: `repeat(${GRID_HEIGHT}, ${BLOCK_SIZE}px)`,
        gap: "1px",
        backgroundColor: "#333"
      }}>
        {grid.map(({ row, col }) => {
          const block = blocks.find(b => b.row === row && b.col === col);
          if (block) {
            if (!block.isTopLeft) return null;

            const style = {
              gridColumn: `span ${block.size}`,
              gridRow: `span ${block.size}`,
              backgroundColor: block.bgColor,
              fontFamily: block.font,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #111",
              overflow: "hidden",
              fontSize: `${Math.min(block.size * 4, 18)}px`,
              textAlign: "center"
            };

            return (
              <div key={`${block.row}-${block.col}`} style={style}>
                {block.type === "texto" ? (
                  <div style={{
                    padding: "4px",
                    wordWrap: "break-word",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: `${Math.min(block.size * 4, 18)}px`,
                    lineHeight: "1.2"
                  }}>
                    {block.value}
                  </div>
                ) : (
                  <img
                    src={block.value}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </div>
            );
          }

          return (
            <div
              key={`${row}-${col}`}
              onClick={() => openModal(row, col)}
              style={{
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
                backgroundColor: "#1a1a1a",
                cursor: "pointer"
              }}
            />
          );
        })}
      </div>

      {showModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "300px"
          }}>
            <div style={{ marginBottom: "10px" }}>
              <label>Cantidad de bloques:</label>
              <input
                type="number"
                min="1"
                max="50"
                value={modalData.size}
                onChange={e => setModalData({ ...modalData, size: parseInt(e.target.value) })}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Tipo:</label>
              <select
                value={modalData.type}
                onChange={e => setModalData({ ...modalData, type: e.target.value })}
              >
                <option value="texto">Texto</option>
                <option value="imagen">Imagen</option>
              </select>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>{modalData.type === "imagen" ? "URL Imagen:" : "Mensaje:"}</label>
              <input
                type="text"
                value={modalData.value}
                onChange={e => setModalData({ ...modalData, value: e.target.value })}
              />
            </div>
            {modalData.type === "texto" && (
              <>
                <div style={{ marginBottom: "10px" }}>
                  <label>Estilo:</label>
                  <select
                    value={modalData.styleMode}
                    onChange={e => setModalData({ ...modalData, styleMode: e.target.value })}
                  >
                    <option value="aleatorio">Aleatorio</option>
                    <option value="personalizado">Elegir estilo</option>
                  </select>
                </div>
                {modalData.styleMode === "personalizado" && (
                  <>
                    <div style={{ marginBottom: "10px" }}>
                      <label>Color de fondo:</label>
                      <input
                        type="color"
                        value={modalData.bgColor}
                        onChange={e => setModalData({ ...modalData, bgColor: e.target.value })}
                      />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <label>Fuente:</label>
                      <select
                        value={modalData.font}
                        onChange={e => setModalData({ ...modalData, font: e.target.value })}
                      >
                        {fonts.map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </>
            )}
            <p style={{ fontSize: "12px", color: "gray" }}>
              ⚠️ Si usas pocos bloques, el texto puede cortarse. Usa un tamaño acorde al contenido.
            </p>
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
