import React, { useState, useEffect } from "react";

const BLOCK_SIZE = 20;
const BLOCKS_PER_ROW = 100;
const BLOCKS_PER_COLUMN = 50;
const TOTAL_BLOCKS = BLOCKS_PER_ROW * BLOCKS_PER_COLUMN;

const randomColors = ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF"];
const fonts = ["Arial", "Verdana", "Georgia", "Courier New", "Trebuchet MS"];

export default function OnePixelWall() {
  const [pixels, setPixels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [modalData, setModalData] = useState({
    quantity: 1,
    type: "texto",
    value: "",
    styleMode: "aleatorio",
    bgColor: "#ffffff",
    font: "Arial",
  });

  useEffect(() => {
    const savedPixels = JSON.parse(localStorage.getItem("pixels")) || [];
    setPixels(savedPixels);
  }, []);

  useEffect(() => {
    localStorage.setItem("pixels", JSON.stringify(pixels));
  }, [pixels]);

  const handleBlockClick = (index) => {
    setSelectedIndex(index);
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    const { quantity, type, value, styleMode, bgColor, font } = modalData;

    if (type === "texto" && value.length > quantity) {
      alert("Advertencia: El texto es más largo que los bloques seleccionados. Parte del mensaje no se mostrará.");
    }

    const newPixels = [...pixels];
    for (let i = 0; i < quantity; i++) {
      const targetIndex = selectedIndex + i * BLOCKS_PER_ROW;
      if (
        targetIndex < TOTAL_BLOCKS &&
        !newPixels.some((p) =>
          Array.from({ length: p.quantity }).some((_, j) => p.index + j * BLOCKS_PER_ROW === targetIndex)
        )
      ) {
        newPixels.push({
          index: targetIndex,
          ...modalData,
          styleMode,
          bgColor: styleMode === "aleatorio" ? randomColors[Math.floor(Math.random() * randomColors.length)] : bgColor,
          font: styleMode === "aleatorio" ? fonts[Math.floor(Math.random() * fonts.length)] : font,
        });
      }
    }
    setPixels(newPixels);
    setShowModal(false);
  };

  const renderBlockContent = (index) => {
    const pixel = pixels.find((p) =>
      Array.from({ length: p.quantity }).some((_, i) => p.index + i * BLOCKS_PER_ROW === index)
    );
    if (!pixel) return null;

    const position = index - pixel.index;
    if (position % BLOCKS_PER_ROW !== 0) return null;

    const height = BLOCK_SIZE * pixel.quantity;
    const style = {
      backgroundColor: pixel.bgColor,
      color: "#fff",
      fontFamily: pixel.font,
      fontSize: `${BLOCK_SIZE}px`,
      height: `${height}px`,
      lineHeight: `${BLOCK_SIZE}px`,
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      flexDirection: "column",
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
    };

    return (
      <div style={style}>
        {pixel.type === "texto"
          ? pixel.value.split("").slice(0, pixel.quantity).join("\n")
          : (
            <img
              src={pixel.value}
              alt="img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "monospace", backgroundColor: "#0f1c2e", minHeight: "100vh", overflowX: "hidden" }}>
      <div style={{
        backgroundColor: "#111827",
        padding: "1rem",
        textAlign: "center",
        color: "white"
      }}>
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>🎮 ONEPIXELWALL</h1>
        <p style={{ fontSize: "0.85rem", margin: 0 }}>Leave your mark on the internet. $1 per pixel.</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BLOCKS_PER_ROW}, ${BLOCK_SIZE}px)`,
          gridAutoRows: `${BLOCK_SIZE}px`,
          justifyContent: "center",
          backgroundColor: "#1f2937",
        }}
      >
        {Array.from({ length: TOTAL_BLOCKS }).map((_, index) => (
          <div
            key={index}
            onClick={() => handleBlockClick(index)}
            style={{
              width: `${BLOCK_SIZE}px`,
              height: `${BLOCK_SIZE}px`,
              border: "1px solid #374151",
              boxSizing: "border-box",
              cursor: "pointer",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              backgroundColor: pixels.some((p) =>
                Array.from({ length: p.quantity }).some((_, i) => p.index + i * BLOCKS_PER_ROW === index)
              ) ? "transparent" : "#1f2937",
            }}
          >
            {renderBlockContent(index)}
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%",
          height: "100%", backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{ backgroundColor: "white", padding: 20, borderRadius: 8 }}>
            <label>Cantidad de bloques:</label>
            <input
              type="number"
              value={modalData.quantity}
              onChange={(e) => setModalData({ ...modalData, quantity: parseInt(e.target.value) })}
              min="1"
              max="10"
              style={{ display: "block", marginBottom: 10 }}
            />

            <label>Tipo:</label>
            <select
              value={modalData.type}
              onChange={(e) => setModalData({ ...modalData, type: e.target.value })}
              style={{ display: "block", marginBottom: 10 }}
            >
              <option value="texto">Texto</option>
              <option value="imagen">Imagen</option>
            </select>

            <label>{modalData.type === "imagen" ? "URL Imagen:" : "Mensaje:"}</label>
            <input
              type="text"
              value={modalData.value}
              onChange={(e) => setModalData({ ...modalData, value: e.target.value })}
              style={{ display: "block", marginBottom: 10 }}
            />

            <label>Estilo:</label>
            <select
              value={modalData.styleMode}
              onChange={(e) => setModalData({ ...modalData, styleMode: e.target.value })}
              style={{ display: "block", marginBottom: 10 }}
            >
              <option value="aleatorio">Aleatorio</option>
              <option value="personalizado">Elegir estilo</option>
            </select>

            {modalData.styleMode === "personalizado" && (
              <>
                <label>Color de fondo:</label>
                <input
                  type="color"
                  value={modalData.bgColor}
                  onChange={(e) => setModalData({ ...modalData, bgColor: e.target.value })}
                  style={{ display: "block", marginBottom: 10 }}
                />

                <label>Fuente:</label>
                <select
                  value={modalData.font}
                  onChange={(e) => setModalData({ ...modalData, font: e.target.value })}
                  style={{ display: "block", marginBottom: 10 }}
                >
                  {fonts.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </>
            )}

            <button onClick={handleModalSubmit}>Agregar</button>
            <button onClick={() => setShowModal(false)} style={{ marginLeft: 10 }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
