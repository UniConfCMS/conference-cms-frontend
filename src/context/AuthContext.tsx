import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Тип для данных пользователя на основе модели User
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

// Тип для контекста (экспортируем его)
export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

// Создаём контекст с значениями по умолчанию
export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: async () => {},
    logout: async () => {},
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    // Функция логина
    const login = async (email: string, password: string): Promise<void> => {
        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Wrong login data');
            }

            const data = await response.json();
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('token', data.token);
        } catch (err) {
            throw new Error(
                'Login error: ' + (err instanceof Error ? err.message : 'Undefined Error')
            );
        }
    };

    // Функция выхода
    const logout = async (): Promise<void> => {
        if (!token) return;
        try {
            await fetch('http://localhost:8000/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    // Проверка аутентификации при загрузке приложения
    const checkAuth = async () => {
        if (!token) return;
        try {
            const response = await fetch('http://localhost:8000/api/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
            }
        } catch (err) {
            console.error('Auth control error:', err);
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};