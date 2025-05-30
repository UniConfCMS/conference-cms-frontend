import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

interface ResetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose }) => {
    const { token } = useParams<{ token: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>(searchParams.get('email') || '');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Отладка
    console.log('Token from useParams:', token);
    console.log('Email from useSearchParams:', searchParams.get('email'));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (!token) {
            setError('Token is missing');
            setIsLoading(false);
            return;
        }

        const body = {
            email,
            password,
            password_confirmation: passwordConfirmation,
            token,
        };
        console.log('Request body:', body);

        try {
            const response = await fetch('http://localhost:8000/api/password/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('Reset password error:', data);
                throw new Error(data.message || 'Failed to reset password');
            }

            setSuccess('Successful password reset');
            setEmail('');
            setPassword('');
            setPasswordConfirmation('');
            setTimeout(() => {
                onClose();
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
        setError(null);
        setSuccess(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#1a1a26] p-6 rounded-lg shadow-md w-96 relative">
                <h2 className="text-2xl font-bold mb-4 text-white">Reset Password</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-600 mb-4">{success}</p>}
                {isLoading && (
                    <div className="flex items-center space-x-2 mb-4">
                        <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-gray-400">Resetting...</span>
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
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            Reset Password
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

export default ResetPasswordModal;