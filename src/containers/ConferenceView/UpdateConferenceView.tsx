import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Conference } from '../../interfaces/Conference';

export const EditConferenceView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token, user } = useContext(AuthContext);

    const [conference, setConference] = useState<Conference | null>(null);
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchConference = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/conferences/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) throw new Error('Failed to load conference');

                const data: Conference = await res.json();
                setConference(data);
                setTitle(data.title);
                setYear(data.year.toString());
            } catch (err) {
                setError((err as Error).message || 'Failed to load conference');
            }
        };

        fetchConference();
    }, [id, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!id) return;

        try {
            const response = await fetch(`http://localhost:8000/api/admin/conferences/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, year: parseInt(year) }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Update failed');
                return;
            }

            setSuccess('Conference updated successfully');
            navigate('/conferences');
        } catch {
            setError('Request error occurred');
        }
    };

    if (!user || user.role !== 'admin') {
        return <p>You do not have permission to edit conferences.</p>;
    }

    if (!conference) {
        return <p>Loading...</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-900 p-6 rounded-2xl shadow-lg">
            <h2 className="text-white text-2xl font-bold mb-4">Edit Conference</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            <div className="mb-4">
                <label className="block text-gray-300 mb-1">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-300 mb-1">Year</label>
                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                    className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
                Save Changes
            </button>
        </form>
    );
};
