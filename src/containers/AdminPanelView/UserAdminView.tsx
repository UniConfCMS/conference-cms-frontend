import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { User } from '../../interfaces/User';

const Users: React.FC = () => {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ name: '', email: '', role: 'editor' });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isSuperAdmin = user?.role === 'super_admin';

  const fetchCsrfToken = async (): Promise<boolean> => {
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true,
      });
      return true;
    } catch (err: any) {
      console.error('Error fetching CSRF token:', err);
      setError('Failed to fetch CSRF token');
      return false;
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/${isSuperAdmin ? 'super-admin' : 'admin'}/users`,
        {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
          withCredentials: true,
        }
      );
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid users data format');
      }
      setUsers(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const intervalId = setInterval(() => {
      if (document.hasFocus()) {
        fetchUsers();
      }
    }, 10000);
    return () => clearInterval(intervalId);
  }, [token, isSuperAdmin]);

  const handleDelete = async (id: number) => {
    setError(null);
    setSuccess(null);
    try {
      const csrfSuccess = await fetchCsrfToken();
      if (!csrfSuccess) return;
      await axios.delete(`http://localhost:8000/api/${isSuperAdmin ? 'super-admin' : 'admin'}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        withCredentials: true,
      });
      setSuccess('User deleted successfully');
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const csrfSuccess = await fetchCsrfToken();
      if (!csrfSuccess) return;
      const response = await axios.post(
        `http://localhost:8000/api/${isSuperAdmin ? 'super-admin' : 'admin'}/users`,
        newUser,
        {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
          withCredentials: true,
        }
      );
      setSuccess('User created successfully');
      setIsCreateModalOpen(false);
      setNewUser({ name: '', email: '', role: 'editor' });
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setError(null);
    setSuccess(null);
    try {
      const csrfSuccess = await fetchCsrfToken();
      if (!csrfSuccess) return;
      const response = await axios.put(
        `http://localhost:8000/api/${isSuperAdmin ? 'super-admin' : 'admin'}/users/${editUser.id}`,
        {
          name: editUser.name,
          email: editUser.email,
          role: editUser.role,
        },
        {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
          withCredentials: true,
        }
      );
      setSuccess('User updated successfully');
      setIsEditModalOpen(false);
      setEditUser(null);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Users</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Create User
        </button>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}
      {success && <p className="text-green-400 mb-4">{success}</p>}
      {isLoading && (
        <div className="flex items-center space-x-3 mb-4">
          <svg className="animate-spin h-5 w-5 text-indigo-400" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"
            />
          </svg>
          <span className="text-gray-300">Loading...</span>
        </div>
      )}

      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100 capitalize">
                  {user.role.replace('_', ' ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-indigo-400 hover:text-indigo-600 mr-4"
                    disabled={user.role === 'super_admin' || (!isSuperAdmin && user.role === 'admin')}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-400 hover:text-red-600"
                    disabled={user.role === 'super_admin' || (!isSuperAdmin && user.role === 'admin')}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Create User</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                  Role
                </label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="editor">Editor</option>
                  {isSuperAdmin && <option value="admin">Admin</option>}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Edit User</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                  Role
                </label>
                <select
                  id="role"
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="editor">Editor</option>
                  {isSuperAdmin && <option value="admin">Admin</option>}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;