import React, { useEffect, useRef, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function SuggestionPopup({ synonyms, position, onSelect, onClose }) {
  const itemsRef = useRef([]);
  const closeBtnRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, synonyms.length);
    if (itemsRef.current[0]) {
      itemsRef.current[0].focus();
    }
  }, [synonyms]);

  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < itemsRef.current.length) {
        itemsRef.current[nextIndex].focus();
        setFocusedIndex(nextIndex);
      } else {
        closeBtnRef.current?.focus(); // Focus close button
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index === 0) {
        closeBtnRef.current?.focus(); // Go to close
      } else {
        const prevIndex = index - 1;
        itemsRef.current[prevIndex].focus();
        setFocusedIndex(prevIndex);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      onSelect(synonyms[index]);
    }
  };

  const handleCloseKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (itemsRef.current[0]) {
        itemsRef.current[0].focus();
        setFocusedIndex(0);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="absolute bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 border rounded shadow p-3 z-50 w-64"
      style={{ top: position.top, left: position.left }}
    >
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Synonyms:</p>
        <button
          ref={closeBtnRef}
          onClick={onClose}
          onKeyDown={handleCloseKey}
          className="text-red-600 hover:text-red-800 text-sm"
          title="Close"
          aria-label="Close suggestions"
        >
          <FaTimes />
        </button>
      </div>
      <ul role="listbox" aria-label="Synonym suggestions" className="space-y-2">
        {synonyms.map((syn, index) => (
          <li
            key={syn}
            className="flex justify-between items-center px-2 py-1 bg-purple-100 dark:bg-purple-700 dark:text-white text-purple-900 rounded-full hover:bg-purple-200 dark:hover:bg-purple-600 transition"
          >
            <span>{syn}</span>
            <button
              ref={(el) => (itemsRef.current[index] = el)}
              role="option"
              tabIndex={0}
              onClick={() => onSelect(syn)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="text-green-600 hover:text-green-800"
              title="Accept synonym"
              aria-label={`Accept synonym ${syn}`}
            >
              <FaCheck />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


