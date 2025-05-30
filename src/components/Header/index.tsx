import React, { useState, useContext } from 'react';
import { AuthContext, AuthContextType } from '../../context/AuthContext';
import LoginModal from '../LoginModal';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
    const { user, isLoading } = useContext(AuthContext) as AuthContextType;
    const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

    return (
        <header className="flex items-center justify-around px-6 py-4 border-gray border-gray-600 border-b bg-[#1a1a26]">
            <div className="flex items-center space-x-3">
                <img src={logo} alt="Logo" className="h-10 w-10" />
                <span className="text-xl font-semibold select-none text-white">
                    ANIMAL SCIENCE CONSORTIUM
                </span>
            </div>

            <nav className="space-x-6 text-lg">
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                <Link to="/faq/" className="text-gray-300 hover:text-white">FAQ</Link>
                <Link to="/newspaper/" className="text-gray-300 hover:text-white">Newspaper</Link>
            </nav>

            {isLoading ? (
                <span className="text-gray-400 font-semibold select-none">Loading...</span>
            ) : user ? (
                <Link to="/panel" className="flex items-center space-x-3">
                    <span className="font-semibold select-none text-white">{user.name}</span>
                    <img
                        src="https://i.pravatar.cc/40"
                        alt="User Avatar"
                        className="h-10 w-10 rounded-full object-cover"
                    />
                </Link>
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