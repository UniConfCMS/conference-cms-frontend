import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

interface InviteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ isOpen, onClose }) => {
    const { user, token } = useContext(AuthContext);
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [role, setRole] = useState<string>(user?.role === 'super_admin' ? 'admin' : 'editor');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setRole(user?.role === 'super_admin' ? 'admin' : 'editor');
    }, [user]);

    const handleClose = () => {
        setEmail('');
        setName('');
        setRole(user?.role === 'super_admin' ? 'admin' : 'editor');
        setError(null);
        setSuccess(null);
        onClose();
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        const endpoint =
            user?.role === 'super_admin'
                ? 'http://localhost:8000/api/super-admin/users'
                : 'http://localhost:8000/api/admin/users';

        const payload = { name, email, role };

        try {
            const response = await axios.post(endpoint, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });

            setSuccess('Invitation Sent!');
            setTimeout(() => handleClose(), 2000);
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'An error occurred';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const availableRoles =
        user?.role === 'super_admin'
            ? [
                { value: 'admin', label: 'Administrator' },
                { value: 'super_admin', label: 'Super Administrator' },
            ]
            : [{ value: 'editor', label: 'Editor' }];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#1a1a26] p-6 rounded-lg shadow-md w-96 relative">
                <h2 className="text-2xl font-bold mb-4 text-white">Invite user</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-600 mb-4">{success}</p>}
                {isLoading && (
                    <div className="flex items-center space-x-2 mb-4">
                        <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-gray-400">Sending...</span>
                    </div>
                )}
                <form onSubmit={handleInvite}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-[#2a2a40] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-600"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-[#2a2a40] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-600"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-300">CMS Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-[#2a2a40] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-600"
                            required
                        >
                            {availableRoles.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
                            disabled={isLoading}
                        >
                            Send invitation
                        </button>
                    </div>
                </form>
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-400 text-2xl hover:text-gray-200"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default InviteUserModal;
