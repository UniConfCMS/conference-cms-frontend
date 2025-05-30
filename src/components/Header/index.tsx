import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import LoginModal from '../LoginModal/index';
import logo from "../../assets/asd.svg";
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
    const { user, logout } = useContext(AuthContext);
    const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

    return (
        <header className="flex items-center justify-around px-6 py-4 border-gray border-gray-600 border-b">
            <div className="flex items-center space-x-3">
                <img src={logo} alt="Logo" className="h-10 w-10" />
                <span className="text-xl font-semibold select-none text-white">
                    ANIMAL SCIENCE CONSORTIUM
                </span>
            </div>

            <nav className="space-x-6 text-lg">
              <Link to="/" className="hover:gray-300">Home</Link>
              <Link to="/faq/" className="hover:gray-300">FAQ</Link>
              <Link to="/conferences/" className="hover:gray-300">Conferences</Link>
            </nav>

            {user ? (
                <div className="flex items-center space-x-3 cursor-pointer" onClick={logout}>
                    <span className="font-semibold select-none text-white">{user.name}</span>
                    <img
                        src="https://i.pravatar.cc/40"
                        alt="User Avatar"
                        className="h-10 w-10 rounded-full object-cover"
                    />
                </div>
            ) : (
                <button
                    onClick={() => setIsLoginOpen(true)}
                    className="text-blue-500 hover:text-blue-400 transition font-semibold"
                >
                    Login
                </button>
            )}

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </header>
    );
};