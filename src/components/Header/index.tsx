import React, { useState, useContext } from 'react';
import { AuthContext, AuthContextType } from '../../context/AuthContext';
import LoginModal from '../LoginModal';
import logo from '../../assets/asd.svg';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
    const { user, isLoading } = useContext(AuthContext) as AuthContextType;
    const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

    return (
        <header className="flex items-center justify-around px-6 py-4 border-gray border-gray-600 border-b bg-[#1a1a26]">
            <div className="flex items-center space-x-3">
                <img src={logo} alt="Logo" className="h-14 w-14" />
                <span className="text-xl font-semibold select-none text-white">
                    ANIMAL SCIENCE DAYS
                </span>
            </div>

            <nav className="space-x-6 text-lg">
              <Link to="/" className="hover:gray-300">Home</Link>
              <Link to="/faq/" className="hover:gray-300">FAQ</Link>
              <Link to="/conferences/" className="hover:gray-300">Conferences</Link>
            </nav>

            {isLoading ? (
                <span className="text-gray-400 font-semibold select-none">Loading...</span>
            ) : user ? (
                <Link to="/panel" className="flex items-center space-x-3">
                    <span className="font-semibold select-none text-white">{user.name}</span>
                    {user.profilePicture ? (
                        <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500 bg-indigo-500"
                        />
                    ) : (
                        <span className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-lg font-bold text-white select-none">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    )}
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