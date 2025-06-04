import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="flex items-baseline justify-around px-6 py-6 border-gray border-gray-600 border-t bg-[#1a1a26] mt-auto">
      <div className="text-sm text-gray-400 select-none">
        © {new Date().getFullYear()} ANIMAL SCIENCE DAYS.
      </div>
      <nav className="flex items-center space-x-6 text-sm">
        <a href="/" className="hover:text-gray-300 text-gray-400 transition">Home</a>
        <a href="/faq/" className="hover:text-gray-300 text-gray-400 transition">FAQ</a>
        <a href="/conferences/" className="hover:text-gray-300 text-gray-400 transition">Conferences</a>
      </nav>
    </footer>
  );
};
