// src/components/CreateConferenceForm.tsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export const CreateConferenceView = () => {
    const { token, user } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:8000/api/admin/conferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, year: parseInt(year) }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || 'Error creating a conference');
                return;
            }

            const data = await response.json();
            setSuccess(`Конференцію "${data.title}" successfully created`);
            setTitle('');
            setYear('');
        } catch (err) {
            setError('An error occurred while sending a request');
        }
    };

    if (!user || user.role !== 'admin') {
        return (
            <div className="text-white bg-black p-4 rounded shadow">
                <p>You do not have permission to create conferences.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-900 p-6 rounded-2xl shadow-lg">
            <h2 className="text-white text-2xl font-bold mb-4">Creating a conference</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            <div className="mb-4">
                <label className="block text-gray-300 mb-1">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Напр. International Science Conf"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-300 mb-1">Year</label>
                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                    className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Напр. 2025"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
                Create a conference
            </button>
        </form>
    );
};
