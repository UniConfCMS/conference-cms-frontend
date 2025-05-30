import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import InviteUserModal from '../InviteUserModal/index';
import { useNavigate } from 'react-router-dom';

const UserPanel: React.FC = () => {
    const { user, logout, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isAssignRoleModalOpen, setIsAssignRoleModalOpen] = useState<boolean>(false);
    const [isChangeNameModalOpen, setIsChangeNameModalOpen] = useState<boolean>(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
    const [selectedEmail, setSelectedEmail] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('admin');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    if (!user) return null;

    console.log('User:', { id: user.id, role: user.role, email: user.email });

    const handleDeleteAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/user/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete account');
            }

            setSuccess('Account deleted successfully!');
            setTimeout(() => {
                logout();
                window.location.href = "/";
            }, 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssignRole = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        console.log('Assign role:', selectedRole, 'to email:', selectedEmail);
    };

    const handleChangeName = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        console.log('Change name to:', name);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        console.log('Change password:', { currentPassword, newPassword });
    };

    return (
        <div className="min-h-screen bg-[#1a1a26] p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">User Panel</h1>
                <div className="bg-[#2a2a40] p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-6">
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
                    <div className="space-y-4">
                        <div className="flex space-x-4">
                            {(user.role === 'admin' || user.role === 'super_admin') && (
                                <button
                                    onClick={() => setIsInviteModalOpen(true)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                                >
                                    Invite New User
                                </button>
                            )}
                            {user.role === 'super_admin' && (
                                <button
                                    onClick={() => setIsAssignRoleModalOpen(true)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                                >
                                    Assign Role
                                </button>
                            )}
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setIsChangeNameModalOpen(true)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                            >
                                Change Name
                            </button>
                            <button
                                onClick={() => setIsChangePasswordModalOpen(true)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                            >
                                Change Password
                            </button>
                        </div>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>

                {/* Invite User Modal */}
                <InviteUserModal
                    isOpen={isInviteModalOpen}
                    onClose={() => setIsInviteModalOpen(false)}
                />

                {/* Delete Account Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-[#1a1a26] p-6 rounded-lg shadow-md w-96">
                            <h2 className="text-2xl font-bold mb-4 text-white">Delete Account</h2>
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            {success && <p className="text-green-600 mb-4">{success}</p>}
                            <p className="text-gray-300 mb-4">
                                Are you sure you want to delete your account? This action cannot be undone.
                            </p>
                            {isLoading && (
                                <div className="flex items-center space-x-2 mb-4">
                                    <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span className="text-gray-400">Deleting...</span>
                                </div>
                            )}
                            <form onSubmit={handleDeleteAccount}>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                                        disabled={isLoading}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Assign Role Modal */}
                {isAssignRoleModalOpen && user.role === 'super_admin' && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-[#1a1a26] p-6 rounded-lg shadow-md w-96">
                            <h2 className="text-2xl font-bold mb-4 text-white">Assign Role</h2>
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            {success && <p className="text-green-600 mb-4">{success}</p>}
                            <form onSubmit={handleAssignRole}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                        User Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={selectedEmail}
                                        onChange={(e) => setSelectedEmail(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 bg-[#2a2a40] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-600"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                                        Role
                                    </label>
                                    <select
                                        id="role"
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 bg-[#2a2a40] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-600"
                                        required
                                    >
                                        <option value="admin">Administrator</option>
                                        <option value="super_admin">Super Administrator</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAssignRoleModalOpen(false)}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                                    >
                                        Assign
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Change Name Modal */}
                {isChangeNameModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-[#1a1a26] p-6 rounded-lg shadow-md w-96">
                            <h2 className="text-2xl font-bold mb-4 text-white">Change Name</h2>
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            {success && <p className="text-green-600 mb-4">{success}</p>}
                            <form onSubmit={handleChangeName}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                        New Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 bg-[#2a2a40] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-600"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsChangeNameModalOpen(false)}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Change Password Modal */}
                {isChangePasswordModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-[#1a1a26] p-6 rounded-lg shadow-md w-96">
                            <h2 className="text-2xl font-bold mb-4 text-white">Change Password</h2>
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            {success && <p className="text-green-600 mb-4">{success}</p>}
                            <form onSubmit={handleChangePassword}>
                                <div className="mb-4">
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 bg-[#2a2a40] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-600"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 bg-[#2a2a40] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-600"
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-300">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="passwordConfirmation"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 bg-[#2a2a40] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-600"
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsChangePasswordModalOpen(false)}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPanel;