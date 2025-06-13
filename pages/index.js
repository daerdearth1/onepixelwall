import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

const colors = ["#ffb3c6", "#b3ffd9", "#ffffb3", "#b3d9ff", "#e0b3ff"];
const fonts = ["monospace", "cursive", "serif", "Orbitron", "Pixelify Sans"];

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

    const newBlocks = [];
    for (let r = row; r < row + size; r++) {
      for (let c = col; c < col + size; c++) {
        const occupied = blocks.some(b =>
          r >= b.row && r < b.row + b.size && c >= b.col && c < b.col + b.size
        );
        if (occupied) {
          alert("Ya hay contenido en la zona seleccionada.");
          return;
        }
        newBlocks.push({ row: r, col: c, occupied: true });
      }
    }

    let style = {};
    if (type === "texto") {
      if (styleMode === "aleatorio") {
        style = {
          bgColor: colors[Math.floor(Math.random() * colors.length)],
          font: fonts[Math.floor(Math.random() * fonts.length)],
          color: "#000"
        };
      } else {
        style = { bgColor, font, color: "#000" };
      }
    }

    setBlocks([
      ...blocks,
      {
        row,
        col,
        size,
        type,
        value,
        ...style
      }
    ]);
    setShowModal(false);
  };

  return (
    <div style={{ background: "#061a2d", minHeight: "100vh", color: "white", fontFamily: "monospace", textAlign: "center" }}>
      <h1 style={{ fontSize: "2em", padding: "1em" }}>🎮 ONEPIXELWALL</h1>
      <p>Leave your mark on the internet. $1 per pixel.</p>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_WIDTH}, ${BLOCK_SIZE}px)`,
        gridTemplateRows: `repeat(${GRID_HEIGHT}, ${BLOCK_SIZE}px)`,
        gap: "1px",
        backgroundColor: "#111",
        width: `${GRID_WIDTH * (BLOCK_SIZE + 1)}px`,
        height: `${GRID_HEIGHT * (BLOCK_SIZE + 1)}px`,
        margin: "2em auto",
        overflow: "hidden",
        border: "2px solid black",
        position: "relative"
      }}>
        {Array.from({ length: GRID_HEIGHT }).map((_, row) =>
          Array.from({ length: GRID_WIDTH }).map((_, col) => {
            const block = blocks.find(b =>
              row >= b.row &&
              row < b.row + b.size &&
              col >= b.col &&
              col < b.col + b.size
            );

            return (
              <div
                key={`${row}-${col}`}
                onClick={() => !block && openModal(row, col)}
                style={{
                  width: BLOCK_SIZE,
                  height: BLOCK_SIZE,
                  backgroundColor: block ? block.bgColor || "#000" : "#222",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: block ? `${block.size * 4}px` : "6px",
                  fontFamily: block?.font || "monospace",
                  color: block?.color || "#fff",
                  overflow: "hidden",
                  gridColumn: col + 1,
                  gridRow: row + 1,
                  position: block ? "absolute" : "relative",
                  top: block ? block.row * (BLOCK_SIZE + 1) : undefined,
                  left: block ? block.col * (BLOCK_SIZE + 1) : undefined,
                  width: block ? block.size * (BLOCK_SIZE + 1) - 1 : BLOCK_SIZE,
                  height: block ? block.size * (BLOCK_SIZE + 1) - 1 : BLOCK_SIZE
                }}
              >
                {block?.type === "texto" && block.value}
                {block?.type === "imagen" && (
                  <img
                    src={block.value}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          padding: "1em",
          color: "#000",
          borderRadius: "8px",
          zIndex: 1000,
          width: "300px"
        }}>
          <p><strong>⚠️ Advertencia:</strong> El texto puede verse incompleto si el tamaño de bloques es muy pequeño. Usa al menos 2x2 para mensajes más largos.</p>
          <label>
            Cantidad de bloques:
            <input type="number" min="1" max="10" value={modalData.size}
              onChange={(e) => setModalData({ ...modalData, size: parseInt(e.target.value) })}
            />
          </label>
          <br />
          <label>
            Tipo:
            <select value={modalData.type} onChange={(e) => setModalData({ ...modalData, type: e.target.value })}>
              <option value="texto">Texto</option>
              <option value="imagen">Imagen</option>
            </select>
          </label>
          <br />
          <label>
            {modalData.type === "imagen" ? "URL Imagen:" : "Mensaje:"}
            <input type="text" value={modalData.value} onChange={(e) => setModalData({ ...modalData, value: e.target.value })} />
          </label>
          <br />
          {modalData.type === "texto" && (
            <>
              <label>Estilo:</label>
              <select value={modalData.styleMode} onChange={(e) => setModalData({ ...modalData, styleMode: e.target.value })}>
                <option value="aleatorio">Aleatorio</option>
                <option value="personalizado">Elegir estilo</option>
              </select>
              {modalData.styleMode === "personalizado" && (
                <>
                  <br />
                  <label>Color de fondo:</label>
                  <input type="color" value={modalData.bgColor} onChange={(e) => setModalData({ ...modalData, bgColor: e.target.value })} />
                  <br />
                  <label>Fuente:</label>
                  <select value={modalData.font} onChange={(e) => setModalData({ ...modalData, font: e.target.value })}>
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
