import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useState } from "react";

export default function Navbar({ toggleTheme, isDark }) {
    return (
        <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-gradient-to-r from-purple-900 to-black text-white">
            <div className="flex items-center gap-3">
                <img src="./src/assets/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
                <span className="text-2xl font-bold tracking-wide">ReWriteX</span>
            </div>
            <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-white text-lg hover:scale-110 transition-transform"
                aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
                {isDark ? <FaSun /> : <FaMoon />}
                <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
            </button>
        </nav>
    );
}
