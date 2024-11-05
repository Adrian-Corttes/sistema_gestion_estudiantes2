// Modal.jsx

import './Modal.css'; // Importa el archivo CSS para los estilos del modal

export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // No renderiza nada si la modal no está abierta

  return (
    <div className="modal-overlay" onClick={onClose}> {/* Cierra al hacer clic en el overlay */}
      <div className="modal-content" onClick={e => e.stopPropagation()}> {/* Evita que el clic en el contenido cierre el modal */}
        <button className="modal-close" onClick={onClose}>
          &times; {/* Botón para cerrar el modal */}
        </button>
        {children} {/* Contenido de la modal */}
      </div>
    </div>
  );
};
