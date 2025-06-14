// pages/index.js

import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

const fonts = [
  "Press Start 2P",
  "VT323",
  "Orbitron",
  "Bungee",
  "Silkscreen",
  "Pixelify Sans",
];

export default function Home() {
  const gridRef = useRef(null);
  const [pixels, setPixels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    text: "",
    type: "text",
    bgColor: "#ffcc00",
    font: fonts[0],
    fontColor: "#000000",
    blocks: 1,
    imageUrl: "",
    styleMode: "random",
  });
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    const storedPixels = JSON.parse(localStorage.getItem("pixels") || "[]");
    setPixels(storedPixels);
  }, []);

  useEffect(() => {
    localStorage.setItem("pixels", JSON.stringify(pixels));
  }, [pixels]);

  const handlePixelClick = (x, y) => {
    setSelectedPosition({ x, y });
    setShowModal(true);
  };

  const isOccupied = (x, y) => {
    return pixels.some(p => {
      for (let dx = 0; dx < p.blocks; dx++) {
        if (p.x + dx === x && p.y === y) return true;
      }
      return false;
    });
  };

  const handleModalSubmit = () => {
    if (!selectedPosition) return;

    const messageLength = modalData.text.trim().length;
    if (modalData.type === "text" && messageLength > modalData.blocks) {
      alert("Warning: Your message might be longer than the available blocks. Please increase the block count.");
    }

    const newPixel = {
      ...modalData,
      x: selectedPosition.x,
      y: selectedPosition.y,
    };

    // Avoid overlapping
    for (let i = 0; i < newPixel.blocks; i++) {
      if (isOccupied(newPixel.x + i, newPixel.y)) {
        alert("This block overlaps with an existing one.");
        return;
      }
    }

    setPixels([...pixels, newPixel]);
    setShowModal(false);
    setModalData({
      text: "",
      type: "text",
      bgColor: "#ffcc00",
      font: fonts[0],
      fontColor: "#000000",
      blocks: 1,
      imageUrl: "",
      styleMode: "random",
    });
  };

  const renderPixel = (pixel, i) => {
    const size = 20;
    const style = {
      position: "absolute",
      left: pixel.x * size,
      top: pixel.y * size,
      width: pixel.blocks * size,
      height: size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "10px",
      overflow: "hidden",
      textAlign: "center",
      padding: "2px",
      border: "1px solid #333",
      backgroundColor: pixel.bgColor,
      color: pixel.fontColor,
      fontFamily: pixel.styleMode === "random"
        ? fonts[Math.floor(Math.random() * fonts.length)]
        : pixel.font,
    };

    return (
      <div key={i} style={style}>
        {pixel.type === "text" ? pixel.text : (
          <img src={pixel.imageUrl} alt="pixel" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>
    );
  };

  const grid = [];
  const cols = 60;
  const rows = 40;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid.push(
        <div
          key={`${x}-${y}`}
          onClick={() => handlePixelClick(x, y)}
          style={{
            width: 20,
            height: 20,
            border: "1px solid #222",
            boxSizing: "border-box",
            cursor: "pointer",
          }}
        />
      );
    }
  }

  return (
    <div style={{ fontFamily: "monospace", backgroundColor: "#0b0f1a", minHeight: "100vh", color: "#fff" }}>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Press Start 2P', sans-serif", color: "#00ffe1" }}>🕹 ONEPIXELWALL</h1>
        <p style={{ fontSize: "12px", color: "#aaa" }}>Leave your mark on the internet. $1 per pixel.</p>
      </div>

      <div
        ref={gridRef}
        style={{
          position: "relative",
          width: cols * 20,
          height: rows * 20,
          margin: "0 auto",
          backgroundColor: "#111",
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 20px)`,
          gridTemplateRows: `repeat(${rows}, 20px)`,
        }}
      >
        {grid}
        {pixels.map((pixel, i) => renderPixel(pixel, i))}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -30%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            zIndex: 1000,
            width: "300px",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          <label>Pixel Type:</label>
          <select value={modalData.type} onChange={e => setModalData({ ...modalData, type: e.target.value })}>
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>

          {modalData.type === "text" && (
            <>
              <label>Message:</label>
              <input
                type="text"
                value={modalData.text}
                onChange={e => setModalData({ ...modalData, text: e.target.value })}
                style={{ width: "100%" }}
              />

              <label>Blocks:</label>
              <input
                type="number"
                value={modalData.blocks}
                min="1"
                onChange={e => setModalData({ ...modalData, blocks: parseInt(e.target.value) })}
                style={{ width: "100%" }}
              />

              <label>Background Color:</label>
              <input
                type="color"
                value={modalData.bgColor}
                onChange={e => setModalData({ ...modalData, bgColor: e.target.value })}
              />

              <label>Font Color:</label>
              <input
                type="color"
                value={modalData.fontColor}
                onChange={e => setModalData({ ...modalData, fontColor: e.target.value })}
              />

              <label>Font Style:</label>
              <select value={modalData.styleMode} onChange={e => setModalData({ ...modalData, styleMode: e.target.value })}>
                <option value="random">Random</option>
                <option value="custom">Choose</option>
              </select>

              {modalData.styleMode === "custom" && (
                <select value={modalData.font} onChange={e => setModalData({ ...modalData, font: e.target.value })}>
                  {fonts.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              )}
            </>
          )}

          {modalData.type === "image" && (
            <>
              <label>Image URL:</label>
              <input
                type="text"
                value={modalData.imageUrl}
                onChange={e => setModalData({ ...modalData, imageUrl: e.target.value })}
                style={{ width: "100%" }}
              />
              <label>Blocks (Width):</label>
              <input
                type="number"
                value={modalData.blocks}
                min="1"
                onChange={e => setModalData({ ...modalData, blocks: parseInt(e.target.value) })}
              />
            </>
          )}

          <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
            <button onClick={handleModalSubmit}>✅ Submit</button>
            <button onClick={() => setShowModal(false)}>❌ Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
