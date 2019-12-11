import React, { useState, useEffect, useRef } from "react";

function ComposeList({ onCancel, onSubmit }) {
  const [input, setInput] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    inputRef && inputRef.current.focus();
  }, []);

  const handleInputChange = event => {
    setInput(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (input) {
      onSubmit(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="compose-list">
      <input
        onChange={handleInputChange}
        className="compose-input"
        type="text"
        placeholder="Enter list title..."
        value={input}
        ref={inputRef}
      />
      <div className="compose-actions">
        <button
          onClick={onCancel}
          type="button"
          className="button button-secondary"
        >
          Cancel
        </button>
        <button type="submit" className="button button-primary">
          Add list
        </button>
      </div>
    </form>
  );
}

export default ComposeList;
