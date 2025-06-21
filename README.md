# ✍️ ReWriteX – Article Rewriting Tool

ReWriteX is a smart article rewriting tool that provides real-time synonym suggestions, sentence rewriting using AI, keyboard accessibility, export functionality (TXT, PDF, DOCX), and a dark/light mode interface.

## 🚀 Features

- 🔁 **Inline Synonym Suggestions**
- 🧠 **AI-Powered Sentence Rewriting (via Groq API)**
- 🌗 **Dark/Light Theme Toggle**
- ♿ **Keyboard Accessible Navigation**
- ⬅️ ➡️ **Undo/Redo Functionality**
- 📤 **Export Options**: TXT, PDF, DOCX

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend/AI**: Groq API (for sentence rewriting), Datamuse API (for synonyms)
- **Utilities**: jsPDF, html2canvas, docx, file-saver

## 📦 Installation

```bash
git clone https://github.com/yourusername/rewritex.git
cd article-rewriter
npm install
npm run dev
```

📁 Project Structure
├── public/
│   ├── logo.png
│   └── preview.png
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── SuggestionPopup.jsx
│   ├── hooks/
│   │   └── useUndoRedo.js
│   ├── utils/
│   │   ├── api.js
│   │   ├── rewriteService.js
│   │   └── dictionary.js
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
├── index.css
└── README.md

⚙️ Environment Variables
Create a .env file for secure API keys:
VITE_GROQ_API_KEY=your_groq_api_key_here

🧪 How to Use
1. Start typing in the input box.

2. Hover or stop over any word to get synonym suggestions.

3. Accept or reject via buttons or arrow/enter keys.

4. Click ✨ to rewrite the entire content using AI.

5. Export the result via the ⬇️ Export button.
