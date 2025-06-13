import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

const colors = ["#fef3bd", "#ffd6d6", "#d6f5d6", "#ade6ff", "#ffff95", "#ff80bf"];
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
    font: "",
  });

  const openModal = (row, col) => {
    setModalData({ row, col, size: 1, type: "texto", value: "", styleMode: "aleatorio", bgColor: "", font: "" });
    setShowModal(true);
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

    const maxChars = size * size;
    if (type === "texto" && value.length > maxChars) {
      alert(`Tu mensaje es demasiado largo para ${size} bloque(s). Usa máximo ${maxChars} caracteres.`);
      return;
    }

    let style = {};
    if (type === "texto") {
      if (styleMode === "aleatorio") {
        style = {
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          fontFamily: fonts[Math.floor(Math.random() * fonts.length)],
          fontSize: `${BLOCK_SIZE * size * 0.6}px`,
          color: "#fff",
          textAlign: "center",
          padding: "2px",
        };
      } else {
        style = {
          backgroundColor: bgColor,
          fontFamily: font,
          fontSize: `${BLOCK_SIZE * size * 0.6}px`,
          color: "#fff",
          textAlign: "center",
          padding: "2px",
        };
      }
    }

    const newBlock = {
      row,
      col,
      size,
      type,
      value,
      style,
    };

    const overlap = blocks.some(
      (b) =>
        row < b.row + b.size &&
        row + size > b.row &&
        col < b.col + b.size &&
        col + size > b.col
    );

    if (overlap) {
      alert("Esta zona ya está ocupada.");
      return;
    }

    setBlocks([...blocks, newBlock]);
    setShowModal(false);
  };

  const renderBlock = (block, index) => {
    const style = {
      position: "absolute",
      top: block.row * BLOCK_SIZE,
      left: block.col * BLOCK_SIZE,
      width: block.size * BLOCK_SIZE,
      height: block.size * BLOCK_SIZE,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...block.style,
    };

    return (
      <div key={index} style={style}>
        {block.type === "imagen" ? (
          <img
            src={block.value}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {block.value}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        fontFamily: "monospace",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#0a1d33",
          borderBottom: "1px solid #444",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>
          🎮 ONEPIXELWALL
        </h1>
        <p style={{ fontSize: "0.8rem", margin: 0 }}>
          Leave your mark on the internet. $1 per pixel.
        </p>
      </div>

      <div
        style={{
          position: "relative",
          width: GRID_WIDTH * BLOCK_SIZE,
          height: GRID_HEIGHT * BLOCK_SIZE,
          margin: "0 auto",
          backgroundImage:
            "linear-gradient(to bottom, #0a1d33, #0d0d0d)",
        }}
      >
        {[...Array(GRID_HEIGHT)].map((_, row) =>
          [...Array(GRID_WIDTH)].map((_, col) => (
            <div
              key={`${row}-${col}`}
              onClick={() => openModal(row, col)}
              style={{
                position: "absolute",
                top: row * BLOCK_SIZE,
                left: col * BLOCK_SIZE,
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
                border: "1px solid #222",
                boxSizing: "border-box",
              }}
            ></div>
          ))
        )}
        {blocks.map(renderBlock)}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            color: "#000",
            padding: "1rem",
            borderRadius: "8px",
            zIndex: 1000,
            fontSize: "0.9rem",
          }}
        >
          <div>
            <label>Cantidad de bloques:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={modalData.size}
              onChange={(e) =>
                setModalData({ ...modalData, size: parseInt(e.target.value) })
              }
            />
            <br />
            <label>Tipo:</label>
            <select
              value={modalData.type}
              onChange={(e) =>
                setModalData({ ...modalData, type: e.target.value })
              }
            >
              <option value="texto">Texto</option>
              <option value="imagen">Imagen</option>
            </select>
            <br />
            <label>{modalData.type === "imagen" ? "URL Imagen:" : "Mensaje:"}</label>
            <input
              type="text"
              value={modalData.value}
              onChange={(e) =>
                setModalData({ ...modalData, value: e.target.value })
              }
            />
            {modalData.type === "texto" && (
              <>
                <br />
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

                {modalData.styleMode === "personalizado" && (
                  <>
                    <br />
                    <label>Color de fondo:</label>
                    <input
                      type="color"
                      value={modalData.bgColor}
                      onChange={(e) =>
                        setModalData({ ...modalData, bgColor: e.target.value })
                      }
                    />
                    <br />
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
        </div>
      )}
    </div>
  );
}
