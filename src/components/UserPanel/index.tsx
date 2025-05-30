import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import InviteUserModal from '../InviteUserModal/index';

const UserPanel: React.FC = () => {
    const { user, logout } = useContext(AuthContext);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#1a1a26] p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">User Panel</h1>
                <div className="bg-[#2a2a40] p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-300">
                            Welcome, {user.name} ({user.role})
                        </h2>
                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                        >
                            Logout
                        </button>
                    </div>
                    {(user.role === 'admin' || user.role === 'super_admin') && (
                        <button
                            onClick={() => setIsInviteModalOpen(true)}
                            className="text-blue-500 hover:text-blue-400 transition font-semibold"
                        >
                            Invite new user
                        </button>
                    )}
                </div>
                <InviteUserModal
                    isOpen={isInviteModalOpen}
                    onClose={() => setIsInviteModalOpen(false)}
                />
            </div>
        </div>
    );
};

export default UserPanel;