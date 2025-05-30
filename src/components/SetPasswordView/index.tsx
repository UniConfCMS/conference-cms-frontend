import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext, AuthContextType } from '../../context/AuthContext';

const SetPasswordView: React.FC = () => {
    const { login } = useContext(AuthContext) as AuthContextType;
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('email');
        const signature = params.get('signature');
        const expires = params.get('expires');

        console.log('URL params:', { email: emailParam, expires, signature });

        if (!emailParam || !signature || !expires) {
            setError('Invalid or missing link parameters');
            setIsLoading(false);
            return;
        }

        const verifyLink = async () => {
            try {
                const query = new URLSearchParams({
                    email: emailParam,
                    expires,
                    signature,
                }).toString();
                const response = await fetch(
                    `http://localhost:8000/api/set-password?${query}`,
                    {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    const data = await response.json();
                    console.error('GET /set-password error:', data);
                    throw new Error(data.message || 'Failed to verify link');
                }

                const data = await response.json();
                console.log('GET /set-password success:', data);
                setEmail(data.email); // Используем email из ответа (декодированный)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        verifyLink();
    }, [location.search]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            return;
        }

        try {
            await fetch('http://localhost:8000/sanctum/csrf-cookie', {
                method: 'GET',
                credentials: 'include',
            });

            const params = new URLSearchParams(location.search);
            const response = await fetch('http://localhost:8000/api/set-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email, // Используем декодированный email из состояния
                    password,
                    password_confirmation: passwordConfirmation,
                    expires: params.get('expires'),
                    signature: params.get('signature'),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                console.error('POST /set-password error:', data);
                throw new Error(data.message || 'Failed to set password');
            }

            const data = await response.json();
            console.log('POST /set-password success:', data);
            setSuccess('Password set successfully! Logging in...');

            await login(email, password);
            setTimeout(() => navigate('/panel'), 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#1a1a26] flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                    </svg>
                    <span className="text-gray-400 font-semibold">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a1a26] flex items-center justify-center">
            <div className="bg-[#2a2a40] p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-white">Account activation</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                {!error && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                disabled
                                className="mt-1 block w-full px-3 py-2 bg-[#3a3a50] border border-gray-600 rounded-md text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
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
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300">
                                Password confirmation
                            </label>
                            <input
                                type="password"
                                id="password_confirmation"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-[#2a2a40] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-600"
                                required
                                minLength={8}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                        >
                            Set password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SetPasswordView;