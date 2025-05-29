import React from "react";
import logo from "../../assets/asd.svg";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="flex items-center justify-around px-6 py-4 border-gray border-gray-600 border-b">
      
      <div className="flex items-center space-x-3">
        <img src={logo} alt="Logo" className="h-10 w-10" />
        <span className="text-xl font-semibold select-none">UniConf Conference</span>
      </div>

      <nav className="space-x-6 text-lg">
        <Link to="/" className="hover:gray-300">Home</Link>
        <Link to="/faq/" className="hover:gray-300">FAQ</Link>
        <Link to="/conferences/" className="hover:gray-300">Conferences</Link>
      </nav>

      <div className="flex items-center space-x-3 cursor-pointer">
        <span className="font-semibold select-none">user</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="User Avatar"
          className="h-10 w-10 rounded-full object-cover"
        />
      </div>
    </header>
  );
};
