import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:8000/api/password/reset/send',
                { email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            setSuccess('Reset password link sent');
            setEmail('');
            setTimeout(() => {
                onClose();
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'An error occurred';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setEmail('');
        setError(null);
        setSuccess(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#1a1a26] p-6 rounded-lg shadow-md w-96 relative">
                <h2 className="text-2xl font-bold mb-4 text-white">Forgot Password</h2>
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
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-[#2a2a40] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-600"
                            required
                        />
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
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                            disabled={isLoading}
                        >
                            Send Reset Link
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

export default ForgotPasswordModal;
