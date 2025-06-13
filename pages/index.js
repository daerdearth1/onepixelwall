
import { useState } from "react";

const GRID_WIDTH = 250;
const GRID_HEIGHT = 200;
const BLOCK_SIZE = 10;

export default function OnePixelWall() {
  const [blocks, setBlocks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ row: 0, col: 0, size: 1, type: "texto", value: "" });

  const openModal = (row, col) => {
    setModalData({ row, col, size: 1, type: "texto", value: "" });
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    const { row, col, size, type, value } = modalData;
    if (type === "imagen" && size < 10) {
      alert("Para subir una imagen necesitas mínimo 10x10 bloques");
      return;
    }
    if (!value) {
      alert("Contenido vacío.");
      return;
    }
    setBlocks([...blocks, { row, col, size, type, value }]);
    setShowModal(false);
  };

  return (
    <div style={{ padding: '1rem', background: '#f3f1e7', fontFamily: 'monospace', textAlign: 'center' }}>
      <h1 style={{ fontSize: '24px', color: '#2f4f90' }}>ONEPIXELWALL</h1>
      <p>Leave your mark on the internet. $1 per pixel.</p>
      <div style={{
        display: 'inline-block',
        transform: 'scale(0.65)',
        transformOrigin: 'top center',
        margin: '0 auto',
        border: '1px solid #ccc'
      }}>
        <div style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_WIDTH}, ${BLOCK_SIZE}px)`
        }}>
          {Array(GRID_HEIGHT).fill(null).map((_, rowIndex) =>
            Array(GRID_WIDTH).fill(null).map((_, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => openModal(rowIndex, colIndex)}
                style={{
                  width: BLOCK_SIZE,
                  height: BLOCK_SIZE,
                  border: '1px solid #ccc',
                  background: '#fff',
                }}
              />
            ))
          )}

          {blocks.map((block, i) => (
            <div
              key={i}
              onClick={() => alert(block.type === 'texto' ? block.value : 'Imagen')}
              style={{
                position: 'absolute',
                left: block.col * BLOCK_SIZE,
                top: block.row * BLOCK_SIZE,
                width: block.size * BLOCK_SIZE,
                height: block.size * BLOCK_SIZE,
                backgroundColor: '#ddd',
                border: '2px solid #999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              title={block.value}
            >
              {block.type === 'texto' ? (
                <span style={{ padding: 2, textAlign: 'center' }}>{block.value}</span>
              ) : (
                <img src={block.value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{ background: '#fff', padding: 20, borderRadius: 8, width: 300 }}>
            <h3>Agregar contenido</h3>
            <label>Tamaño del bloque (ej: 10):</label>
            <input type="number" value={modalData.size} min={1} max={50} onChange={e => setModalData({ ...modalData, size: parseInt(e.target.value) })} style={{ width: '100%', marginBottom: 10 }} />
            <label>Tipo:</label>
            <select value={modalData.type} onChange={e => setModalData({ ...modalData, type: e.target.value })} style={{ width: '100%', marginBottom: 10 }}>
              <option value="texto">Texto</option>
              <option value="imagen">Imagen</option>
            </select>
            <label>{modalData.type === 'texto' ? "Mensaje:" : "URL de la imagen:"}</label>
            <input type="text" value={modalData.value} onChange={e => setModalData({ ...modalData, value: e.target.value })} style={{ width: '100%', marginBottom: 10 }} />
            <button onClick={handleModalSubmit} style={{ marginRight: 10 }}>Confirmar</button>
            <button onClick={() => setShowModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
