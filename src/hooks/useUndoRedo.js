import { useState, useCallback } from "react";

export default function useUndoRedo(initialText = "") {
  const [history, setHistory] = useState([initialText]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const text = history[currentIndex] || "";

  const setText = (newText) => {
    const updatedHistory = history.slice(0, currentIndex + 1);
    setHistory([...updatedHistory, newText]);
    setCurrentIndex(updatedHistory.length);
  };

  const recordChange = useCallback((newText) => {
    if (newText === history[currentIndex]) return;
    setText(newText);
  }, [history, currentIndex]);

  const undo = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const redo = () => {
    if (currentIndex < history.length - 1) setCurrentIndex(currentIndex + 1);
  };

  return { text, setText, undo, redo, recordChange };
}

