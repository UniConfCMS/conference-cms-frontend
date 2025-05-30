import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updatedUser: User) => void; // ДОБАВЛЕНО
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isLoading: false,
    login: async () => {},
    logout: async () => {},
    updateUser: () => {}, // ДОБАВЛЕНО
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const login = async (email: string, password: string): Promise<void> => {
        try {
            await fetch('http://localhost:8000/sanctum/csrf-cookie', {
                method: 'GET',
                credentials: 'include',
            });

            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 422) {
                    const data = await response.json();
                    throw new Error(data.errors?.email?.[0] || 'Incorrect login data');
                }
                throw new Error('Failed to login');
            }

            const data = await response.json();
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('token', data.token);
        } catch (err) {
            throw new Error(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
    };

    const logout = async (): Promise<void> => {
        if (!token) return;
        try {
            await fetch('http://localhost:8000/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            window.location.href = "/";
        }
    };

    const updateUser = (updatedUser: User) => { // ДОБАВЛЕНО
        setUser(updatedUser);
    };

    const checkAuth = async () => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            setIsLoading(false);
            return;
        }

        try {
            await fetch('http://localhost:8000/sanctum/csrf-cookie', {
                method: 'GET',
                credentials: 'include',
            });

            const response = await fetch('http://localhost:8000/api/me', {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setToken(storedToken);
            } else {
                console.warn(`Auth check failed: Server ${response.status}`);
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
            }
        } catch (err) {
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