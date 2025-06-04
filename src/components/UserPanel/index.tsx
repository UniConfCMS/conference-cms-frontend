import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import InviteUserModal from '../InviteUserModal/index';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User } from '../../interfaces/User';

const UserPanel: React.FC = () => {
    const { user, logout, token, updateUser, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    // States
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
    const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    // Fetch users for super_admin
    useEffect(() => {
        if (user && user.role === 'super_admin' && isAssignRoleModalOpen) {
            const fetchUsers = async () => {
                try {
                    const response = await axios.get('http://localhost:8000/api/super-admin/users', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                        },
                        withCredentials: true,
                    });

                    setUsers(response.data);
                    setFilteredUsers(response.data);
                } catch (err: any) {
                    setError(err.response?.data?.message || err.message || 'An error occurred');
                }
            };

            fetchUsers();
        }
    }, [isAssignRoleModalOpen, token, user]);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-20">
                <div className="flex items-center space-x-3">
                    <svg className="animate-spin h-7 w-7 text-indigo-400" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
                    </svg>
                    <span className="text-gray-200 text-lg font-medium">Loading...</span>
                </div>
            </div>
        );
    }

    // Redirect to login if no user
    if (!user) {
        navigate('/login');
        return null;
    }

    // Handlers
    const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSelectedEmail(value);
        if (value) {
            const filtered = users.filter((u) =>
                u.email.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    };

    const handleSelectUser = (selectedUser: User) => {
        setSelectedEmail(selectedUser.email);
        setSelectedUserId(selectedUser.id);
        setFilteredUsers([]);
    };

    const closeInviteModal = () => {
        setIsInviteModalOpen(false);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setError(null);
        setSuccess(null);
    };

    const closeAssignRoleModal = () => {
        setIsAssignRoleModalOpen(false);
        setError(null);
        setSuccess(null);
        setSelectedEmail('');
        setSelectedUserId(null);
        setSelectedRole('admin');
        setFilteredUsers(users);
    };

    const closeChangeNameModal = () => {
        setIsChangeNameModalOpen(false);
        setError(null);
        setSuccess(null);
        setName('');
    };

    const closeChangePasswordModal = () => {
        setIsChangePasswordModalOpen(false);
        setError(null);
        setSuccess(null);
        setCurrentPassword('');
        setNewPassword('');
        setPasswordConfirmation('');
    };

    const handleDeleteAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoadingModal(true);

        try {
            await axios.delete('http://localhost:8000/api/user/delete', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });

            setSuccess('Account deleted successfully!');
            setTimeout(() => {
                logout();
                window.location.href = "/";
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setIsLoadingModal(false);
        }
    };

    const handleAssignRole = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoadingModal(true);

        if (!selectedUserId) {
            setError('Please select a user');
            setIsLoadingModal(false);
            return;
        }

        try {
            await axios.patch(`http://localhost:8000/api/super-admin/users/${selectedUserId}/assign-role`,
                { role: selectedRole },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            setSuccess('Role assigned successfully!');
            setTimeout(() => closeAssignRoleModal(), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setIsLoadingModal(false);
        }
    };

    const handleChangeName = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoadingModal(true);

        if (!name.trim()) {
            setError('Name cannot be empty');
            setIsLoadingModal(false);
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8000/api/admin/users/${user.id}`,
                { name },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            updateUser({ ...user, name });
            setSuccess('Name updated successfully!');
            setTimeout(() => closeChangeNameModal(), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setIsLoadingModal(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoadingModal(true);

        if (newPassword !== passwordConfirmation) {
            setError('Passwords do not match');
            setIsLoadingModal(false);
            return;
        }

        try {
            await axios.patch('http://localhost:8000/api/user/password',
                {
                    current_password: currentPassword,
                    password: newPassword,
                    password_confirmation: passwordConfirmation,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            setSuccess('Password changed successfully!');
            setTimeout(() => closeChangePasswordModal(), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setIsLoadingModal(false);
        }
    };

    const handleNavigateToAdminPanel = () => {
        navigate('/admin');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 pt-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                            aria-label="Go back"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <h1 className="text-3xl font-bold tracking-tight text-white">User Panel</h1>
                    </div>
                </div>

                {/* User Profile Card */}
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8 transition-all duration-300 hover:shadow-xl">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-14 sm:h-20 rounded-full bg-indigo-500 flex items-center justify-center text-2xl font-semibold sm:font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-white dark:text-gray-900">{user.name}</h2>
                            <p className="text-gray-400">{user.email}</p>
                            <p className="text-gray-400 capitalize">Role: {user.role.replace('_', ' ')}</p>
                        </div>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-white mb-6">Account Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(user.role === 'admin' || user.role === 'super_admin') && (
                            <>
                                <button
                                    onClick={() => setIsInviteModalOpen(true)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    Invite New User
                                </button>
                                <button
                                    onClick={handleNavigateToAdminPanel}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    Go to Admin Panel
                                </button>
                            </>
                        )}
                        {user.role === 'super_admin' && (
                            <button
                                onClick={() => setIsAssignRoleModalOpen(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Assign Role
                            </button>
                        )}
                        <button
                            onClick={() => setIsChangeNameModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Change Name
                        </button>
                        <button
                            onClick={() => setIsChangePasswordModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Change Password
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 col-span-1 sm:col-span-2"
                        >
                            Delete Account
                        </button>
                        <button
                            onClick={logout}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 col-span-1 sm:col-span-2"
                        >
                            Log Out
                        </button>
                    </div>
                </div>

                {/* Invite User Modal */}
                <InviteUserModal
                    isOpen={isInviteModalOpen}
                    onClose={closeInviteModal}
                />

                {/* Delete Account Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
                            <h2 className="text-2xl font-bold text-white mb-4">Delete Account</h2>
                            {error && <p className="text-red-400 mb-4">{error}</p>}
                            {success && <p className="text-green-400 mb-4">{success}</p>}
                            <p className="text-gray-300 mb-6">
                                Are you sure you want to delete your account? This action cannot be undone.
                            </p>
                            {isLoadingModal && (
                                <div className="flex items-center space-x-3 mb-4">
                                    <svg className="animate-spin h-5 w-5 text-indigo-400" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span className="text-gray-300">Deleting...</span>
                                </div>
                            )}
                            <form onSubmit={handleDeleteAccount}>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={closeDeleteModal}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                        disabled={isLoadingModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                        disabled={isLoadingModal}
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
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
                            <h2 className="text-2xl font-bold text-white mb-4">Assign Role</h2>
                            {error && <p className="text-red-400 mb-4">{error}</p>}
                            {success && <p className="text-green-400 mb-4">{success}</p>}
                            {isLoadingModal && (
                                <div className="flex items-center space-x-3 mb-4">
                                    <svg className="animate-spin h-5 w-5 text-indigo-400" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4" />
                                    </svg>
                                    <span className="text-gray-300">Assigning...</span>
                                </div>
                            )}
                            <form onSubmit={handleAssignRole}>
                                <div className="mb-4 relative">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                        User Email
                                    </label>
                                    <input
                                        type="text"
                                        id="email"
                                        value={selectedEmail}
                                        onChange={handleEmailInput}
                                        className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Start typing email..."
                                        required
                                    />
                                    {filteredUsers.length > 0 && (
                                        <ul className="absolute z-10 w-full bg-gray-700 border border-gray-600 rounded-lg mt-1 max-h-40 overflow-y-auto">
                                            {filteredUsers.map((u) => (
                                                <li
                                                    key={u.id}
                                                    onClick={() => handleSelectUser(u)}
                                                    className="px-4 py-2 text-white hover:bg-indigo-600 cursor-pointer transition-colors duration-200"
                                                >
                                                    {u.email} ({u.name})
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                                        Role
                                    </label>
                                    <select
                                        id="role"
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="editor">Editor</option>
                                        <option value="admin">Administrator</option>
                                        <option value="super_admin">Super Administrator</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={closeAssignRoleModal}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                        disabled={isLoadingModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                        disabled={isLoadingModal}
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
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
                            <h2 className="text-2xl font-bold text-white mb-4">Change Name</h2>
                            {error && <p className="text-red-400 mb-4">{error}</p>}
                            {success && <p className="text-green-400 mb-4">{success}</p>}
                            {isLoadingModal && (
                                <div className="flex items-center space-x-3 mb-4">
                                    <svg className="animate-spin h-5 w-5 text-indigo-400" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span className="text-gray-300">Updating...</span>
                                </div>
                            )}
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
                                        className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter new name"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={closeChangeNameModal}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                        disabled={isLoadingModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                        disabled={isLoadingModal}
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
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
                            <h2 className="text-2xl font-bold text-white mb-4">Change Password</h2>
                            {error && <p className="text-red-400 mb-4">{error}</p>}
                            {success && <p className="text-green-400 mb-4">{success}</p>}
                            {isLoadingModal && (
                                <div className="flex items-center space-x-3 mb-4">
                                    <svg className="animate-spin h-5 w-5 text-indigo-400" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span className="text-gray-300">Updating...</span>
                                </div>
                            )}
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
                                        className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter current password"
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
                                        className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter new password"
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
                                        className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Confirm new password"
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={closeChangePasswordModal}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                        disabled={isLoadingModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                        disabled={isLoadingModal}
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