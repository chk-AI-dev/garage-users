import React from 'react';
import './Modal.css';
// Modal component to display content in a modal dialog
const Modal = ({ isOpen, title, onClose, children, onSubmit, submitText = 'Submit' }) => {
  if (!isOpen) return null;
  // Modal component to display content in a modal dialog
  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {onSubmit && (
          <div className="modal-footer">
            <button onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button onClick={onSubmit} className="btn btn-primary">{submitText}</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Modal;
