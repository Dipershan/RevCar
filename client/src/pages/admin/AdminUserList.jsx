import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/users/listUsers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data.users);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };


  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token'); // ✅ Get admin token

      const res = await axios.delete(`/api/users/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Attach the token
        },
      });

      console.log('User deleted:', res.data);
      // optionally refresh list or remove from state
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <div className="container py-4">
        <h1 className="text-center display-6 fw-bold mb-4">All Users</h1>

        {loading ? (
          <div className="text-center">Loading users...</div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-center text-muted">No users found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Email</th>
                  <th>User ID</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.email}</td>
                    <td>{user._id}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUserList;
