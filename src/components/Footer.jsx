// src/components/Footer.jsx
import React from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gray-200 dark:bg-gray-950 text-center text-sm py-4 mt-10 border-t border-gray-300 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between px-6">
                <p className="text-gray-800 dark:text-gray-300 mb-2 md:mb-0">
                    © {new Date().getFullYear()} ReWriteX. All rights reserved.
                </p>
                <div className="flex gap-4 text-xl text-gray-700 dark:text-gray-300">
                    <a
                        href="https://github.com/Manyata39"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-500"
                        aria-label="GitHub"
                    >
                        <FaGithub />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/manyata-9b847a27b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app "
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-500"
                        aria-label="LinkedIn"
                    >
                        <FaLinkedin />
                    </a>
                    <a
                        href="https://www.instagram.com/manyata__0?igsh=MTFnbXh2NzI1OHJ0bA=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-500 "
                        aria-label="Instagram"
                    >
                        <FaInstagram />
                    </a>
                </div>
            </div>
        </footer>
    );
}
