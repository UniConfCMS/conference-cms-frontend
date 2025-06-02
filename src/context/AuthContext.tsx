import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User } from '../interfaces/User';

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updatedUser: User) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isLoading: false,
    login: async () => {},
    logout: async () => {},
    updateUser: () => {},
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchCsrfToken = async (): Promise<void> => {
        try {
            await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
                withCredentials: true,
            });
        } catch (err) {
            console.error('Error fetching CSRF token:', err);
        }
    };

    const login = async (email: string, password: string): Promise<void> => {
        try {
            await fetchCsrfToken();

            const response = await axios.post('http://localhost:8000/api/login', 
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            setUser(response.data.user);
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
        } catch (err: any) {
            if (err.response?.status === 422) {
                throw new Error(err.response.data.errors?.email?.[0] || 'Incorrect login data');
            }
            throw new Error(err.response?.data?.message || err.message || 'Failed to login');
        }
    };

    const logout = async (): Promise<void> => {
        if (!token) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            window.location.href = "/";
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/logout', 
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    withCredentials: true,
                }
            );
        } catch (err: any) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            window.location.href = "/";
        }
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    const checkAuth = async () => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            setIsLoading(false);
            return;
        }

        try {
            await fetchCsrfToken();

            const response = await axios.get('http://localhost:8000/api/me', {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Accept': 'application/json',
                },
                withCredentials: true,
            });

            setUser(response.data);
            setToken(storedToken);
        } catch (err: any) {
            console.error('Auth check error:', err);
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};