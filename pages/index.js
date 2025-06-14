import React, { useState, useEffect } from "react";

const GRID_SIZE = 100;
const CELL_SIZE = 20;
const MAX_COLUMNS = 50;

export default function OnePixelWall() {
  const [pixels, setPixels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    x: 0,
    y: 0,
    value: "",
    type: "texto",
    styleMode: "aleatorio",
    bgColor: "#ffff99",
    font: "Arial",
    blocks: 1,
  });

  const fonts = ["Arial", "Verdana", "Georgia", "Courier New", "Times New Roman"];
  const getRandomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16);

  const handleCellClick = (x, y) => {
    setModalData({ ...modalData, x, y });
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    const { value, x, y, type, styleMode, bgColor, font, blocks } = modalData;

    if (type === "texto") {
      const totalBlocks = parseInt(blocks);
      if (value.length > totalBlocks) {
        alert("Advertencia: Tu mensaje es más largo que la cantidad de bloques seleccionados y podría no mostrarse completo.");
      }

      const newPixels = [];
      for (let i = 0; i < totalBlocks; i++) {
        if (x + i >= GRID_SIZE) break;

        newPixels.push({
          x: x + i,
          y,
          color: styleMode === "aleatorio" ? getRandomColor() : bgColor,
          font: font,
          text: value[i] || "",
          type: "texto",
        });
      }

      const collision = newPixels.some(p => pixels.find(existing => existing.x === p.x && existing.y === p.y));
      if (collision) {
        alert("Error: No puedes colocar texto sobre píxeles ya ocupados.");
        return;
      }

      setPixels([...pixels, ...newPixels]);
    }

    if (type === "imagen") {
      const imageSize = Math.ceil(Math.sqrt(modalData.blocks));
      const newPixels = [];

      for (let dx = 0; dx < imageSize; dx++) {
        for (let dy = 0; dy < imageSize; dy++) {
          const px = x + dx;
          const py = y + dy;

          if (px >= GRID_SIZE || py >= GRID_SIZE) continue;

          newPixels.push({
            x: px,
            y: py,
            type: "imagen",
            url: value,
            size: imageSize,
          });
        }
      }

      const collision = newPixels.some(p => pixels.find(existing => existing.x === p.x && existing.y === p.y));
      if (collision) {
        alert("Error: No puedes colocar una imagen sobre píxeles ya ocupados.");
        return;
      }

      setPixels([...pixels, ...newPixels]);
    }

    setShowModal(false);
  };

  return (
    <div style={{ fontFamily: "monospace", background: "#0d1117", minHeight: "100vh", overflow: "hidden" }}>
      <div style={{ padding: "20px", textAlign: "center", color: "#fff" }}>
        <h1 style={{ fontSize: "24px" }}>🎮 ONEPIXELWALL</h1>
        <p>Leave your mark on the internet. $1 per pixel.</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${MAX_COLUMNS}, ${CELL_SIZE}px)`,
          justifyContent: "start",
          backgroundColor: "#1e1e1e",
          margin: "0 auto",
          padding: "10px",
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const pixel = pixels.find(p => p.x === x && p.y === y);

          let content = null;
          let style = {
            width: CELL_SIZE,
            height: CELL_SIZE,
            border: "1px solid #333",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            overflow: "hidden",
          };

          if (pixel) {
            if (pixel.type === "texto") {
              style.backgroundColor = pixel.color;
              style.fontFamily = pixel.font;
              style.color = "#fff";
              style.fontSize = `${CELL_SIZE * 0.6}px`;
              content = pixel.text;
            }

            if (pixel.type === "imagen") {
              if (pixel.x === modalData.x && pixel.y === modalData.y) {
                style.gridColumn = `span ${pixel.size}`;
                style.gridRow = `span ${pixel.size}`;
                content = <img src={pixel.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
              } else {
                return null;
              }
            }
          }

          return (
            <div key={`${x}-${y}`} style={style} onClick={() => handleCellClick(x, y)}>
              {content}
            </div>
          );
        })}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            zIndex: 1000,
          }}
        >
          <label>
            Cantidad de bloques:
            <input
              type="number"
              min="1"
              max="100"
              value={modalData.blocks}
              onChange={e => setModalData({ ...modalData, blocks: e.target.value })}
            />
          </label>
          <br />

          <label>
            Tipo de contenido:
            <select
              value={modalData.type}
              onChange={e => setModalData({ ...modalData, type: e.target.value })}
            >
              <option value="texto">Texto</option>
              <option value="imagen">Imagen</option>
            </select>
          </label>
          <br />

          <label>Mensaje o URL:</label>
          <input
            type="text"
            value={modalData.value}
            onChange={e => setModalData({ ...modalData, value: e.target.value })}
          />
          <br />

          {modalData.type === "texto" && (
            <>
              <label>Estilo:</label>
              <select
                value={modalData.styleMode}
                onChange={e => setModalData({ ...modalData, styleMode: e.target.value })}
              >
                <option value="aleatorio">Aleatorio</option>
                <option value="personalizado">Elegir estilo</option>
              </select>
              <br />
              {modalData.styleMode === "personalizado" && (
                <>
                  <label>Color de fondo:</label>
                  <input
                    type="color"
                    value={modalData.bgColor}
                    onChange={e => setModalData({ ...modalData, bgColor: e.target.value })}
                  />
                  <br />
                  <label>Fuente:</label>
                  <select
                    value={modalData.font}
                    onChange={e => setModalData({ ...modalData, font: e.target.value })}
                  >
                    {fonts.map(f => (
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
          <button onClick={() => setShowModal(false)} style={{ marginLeft: "10px" }}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
