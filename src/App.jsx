import React, { useRef, useState, useEffect } from "react";
import { fetchSynonyms } from "./utils/api";
import { rewriteSentence } from "./utils/groq";
import { saveAs } from "file-saver";
import SuggestionPopup from "./components/SuggestionPopup";
import Navbar from "./components/Navbar";
import useUndoRedo from "./hooks/useUndoRedo";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";
import Footer from "./components/Footer";

export default function App() {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const editorRef = useRef(null);
  const [synonyms, setSynonyms] = useState([]);
  const [selectedWord, setSelectedWord] = useState("");
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const [rewritten, setRewritten] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const {
    text,
    setText,
    undo,
    redo,
    recordChange
  } = useUndoRedo("Select a word or sentence to test rewriting.");

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerText !== text) {
      editorRef.current.innerText = text;
    }
  }, [text]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleEditorInput = (e) => {
    handleInput(); // synonym logic
    recordChange(editorRef.current.innerText); // undo/redo logic
  };


  const handleInput = async () => {
    const sel = window.getSelection();
    if (!sel || !sel.focusNode || !sel.anchorNode) return;

    const node = sel.focusNode;
    const textUpToCursor = node.textContent?.slice(0, sel.focusOffset) || "";
    const word = textUpToCursor.split(/\s+/).pop();

    if (word && word.length > 2) {
      setSelectedWord(word);
      const data = await fetchSynonyms(word);
      setSynonyms(data);

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setPopupPos({ top: rect.top + 25 + window.scrollY, left: rect.left + window.scrollX });
    } else {
      setSynonyms([]);
    }

    // Record the change
    recordChange(editorRef.current.innerText);
  };

  const replaceWord = (newWord) => {
    const sel = window.getSelection();
    if (!sel || !sel.focusNode) return;

    const node = sel.focusNode;
    const text = node.textContent || "";
    const before = text.slice(0, sel.focusOffset);
    const after = text.slice(sel.focusOffset);
    const words = before.split(/\s+/);
    words.pop();
    const newText = words.concat(newWord).join(" ") + after;

    node.textContent = newText;
    setText(newText);
    setSynonyms([]);

    // ✅ Refocus editor after replacing word
    setTimeout(() => {
      editorRef.current?.focus();

      // Optionally, move cursor to end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }, 0);
  };



  const handleRewrite = async () => {
    if (text.length > 5) {
      const result = await rewriteSentence(text);
      setRewritten(result);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".relative")) {
        setShowExportOptions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const exportPdf = async () => {
    const input = document.getElementById("outputBox");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("rewritten.pdf");
  };

  const exportDocx = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun(rewritten)],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "rewritten.docx");
    });
  };

  const exportTxt = () => {
    const blob = new Blob([rewritten], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "rewritten.txt");
  };



  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-purple-500 text-black dark:bg-gray-900 dark:text-white`}>
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
        <Navbar isDark={darkMode} toggleTheme={toggleDarkMode} />
        <div className="flex flex-col md:flex-row  h-full p-6 gap-4">
          {/* Left side: Input */}
          <div className="flex-1 ">
            <h2 className="text-xl mt-[24px] font-semibold mb-2">✍️ Your Input</h2>

            <div className="mb-2 flex ml-3 gap-2"
              aria-labelledby="input-heading"
              role="region"
              tabIndex="0">
              <button
                onClick={undo}
                className="bg-gray-600 ml-[530px] hover:bg-gray-700 text-white px-3 py-1 rounded"
              >
                ⬅️ Undo
              </button>
              <button
                onClick={redo}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
              >
                ➡️ Redo
              </button>
            </div>

            <div
              id="outputBox"
              ref={editorRef}
              tabIndex="0"
              role="textbox"
              aria-multiline="true"
              aria-label="Editable text area"
              contentEditable
              suppressContentEditableWarning
              onInput={handleEditorInput}
              className="border p-4 rounded min-h-[200px] bg-[rgb(192,170,212)] whitespace-pre-wrap text-black dark:bg-[rgb(51,20,81)] dark:text-white"
            >
            </div>
            <div className="mt-4 flex gap-4 items-center">
              <button
                onClick={handleRewrite}
                className="mt-[5px] bg-purple-600 mr-4 hover:bg-purple-700 text-white px-4 py-3 rounded"
              >
                ✨ Rewrite Full Text
              </button>
              <div className="relative">
                <button
                  aria-haspopup="true"
                  aria-expanded={showExportOptions}
                  aria-label="Export rewritten text"
                  onClick={() => setShowExportOptions(!showExportOptions)}
                  className="bg-gray-800 text-white px-4 py-3 rounded"
                >
                  ⬇️ Export
                </button>

                {showExportOptions && (
                  <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-md z-10">
                    <button
                      onClick={exportTxt}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      📄 TXT
                    </button>
                    <button
                      onClick={exportPdf}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      📄 PDF
                    </button>
                    <button
                      onClick={exportDocx}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      📄 DOCX
                    </button>
                  </div>
                )}
              </div>
            </div>

            {synonyms.length > 0 && (
              <SuggestionPopup
                synonyms={synonyms}
                position={popupPos}
                onSelect={replaceWord}
                onClose={() => setSynonyms([])}
              />
            )}
          </div>

          {/* Right side: Output */}
          <div className="flex-1 mt-16">
            <h2 className="text-xl font-semibold mb-2">🪄 Rewritten Output</h2>
            <div className="border p-4 rounded min-h-[200px] whitespace-pre-wrap bg-[rgb(192,170,212)] text-black dark:bg-[rgb(51,20,81)] dark:text-white">
              {rewritten || "Rewritten content will appear here."}
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>

  );
}

