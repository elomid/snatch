import React, { useState, useEffect, useRef } from "react";

function ConfirmationModal({
  onCancel,
  onConfirm,
  title,
  message,
  buttonText
}) {
  const modalRef = useRef();
  const backdropRef = useRef();

  useEffect(() => {
    const handleClick = e => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onCancel();
      }
    };

    const backdrop = backdropRef.current;

    backdrop.addEventListener("click", handleClick);
    return () => {
      backdrop.removeEventListener("click", handleClick);
    };
  }, [onCancel]);
  return (
    <div className="modal-backdrop" ref={backdropRef}>
      <div className="modal-body" ref={modalRef}>
        <div className="modal-content">
          <h2 className="modal-title">{title}</h2>
          <p className="modal-message">{message}</p>
        </div>
        <div className="modal-actions">
          <button onClick={onCancel} className="button button-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="button button-primary">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
