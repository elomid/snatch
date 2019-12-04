import React, { useState, useEffect } from "react";

function ComposeList({ onCancel, onSubmit }) {
  const [input, setInput] = useState("");

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
