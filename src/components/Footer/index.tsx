import React from "react";

export const Footer = () => {
  return (
    <footer className="py-6 px-6 border-t border-gray-600 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm mb-4 md:mb-0 select-none">
          © 2025 NEWSPAPER GROUP SPACE. Все права защищены.
        </div>

        <div className="flex space-x-6 text-sm font-medium">
          <a href="/" className="hover:text-gray-300 transition">Home</a>
          <a href="/faq" className="hover:text-gray-300 transition">FAQ</a>
          <a href="/newspaper" className="hover:text-gray-300 transition">Newspaper</a>
        </div>
      </div>
    </footer>
  );
};
