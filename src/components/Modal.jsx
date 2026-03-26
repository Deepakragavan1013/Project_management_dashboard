import React from 'react';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    // clicking the dark overlay closes the modal
    <div style={styles.overlay} onClick={onClose}>
      {/* stop click from bubbling to overlay */}
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    width: '500px',
    maxWidth: '95vw',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#666',
  },
};

export default Modal;