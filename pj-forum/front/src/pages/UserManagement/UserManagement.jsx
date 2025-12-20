import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function UserManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Only admin and moderators can access
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
      navigate('/');
      return;
    }
    loadUsers();
  }, [user, navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Backend might not have this endpoint yet, so we'll mock it
      const res = await api.get('/users/all').catch(() => ({ data: [] }));
      setUsers(res.data);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (userId, username) => {
    if (!window.confirm(`Bạn có chắc muốn cấm ${username}?`)) return;

    try {
      await api.put(`/users/${userId}/ban`);
      setMessage(`✅ Đã cấm người dùng ${username}`);
      loadUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(`Không thể cấm người dùng: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleUnban = async (userId, username) => {
    if (!window.confirm(`Bạn có chắc muốn bỏ cấm ${username}?`)) return;

    try {
      await api.put(`/users/${userId}/unban`);
      setMessage(`✅ Đã bỏ cấm người dùng ${username}`);
      loadUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(`Không thể bỏ cấm người dùng: ${err.response?.data?.message || err.message}`);
    }
  };

  const handlePromoteToMod = async (userId, username) => {
    if (!window.confirm(`Bạn có chắc muốn thăng cấp ${username} lên MODERATOR?`)) return;

    try {
      await api.put(`/users/${userId}/role`, { role: 'MODERATOR' });
      setMessage(`✅ Đã thăng cấp ${username} lên MODERATOR`);
      loadUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(`Không thể thăng cấp: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDemoteToUser = async (userId, username) => {
    if (!window.confirm(`Bạn có chắc muốn hạ cấp ${username} xuống USER?`)) return;

    try {
      await api.put(`/users/${userId}/role`, { role: 'USER' });
      setMessage(`✅ Đã hạ cấp ${username} xuống USER`);
      loadUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(`Không thể hạ cấp: ${err.response?.data?.message || err.message}`);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAdmin = user?.role === 'ADMIN';
  const isModerator = user?.role === 'MODERATOR';

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="text-center py-12">⏳ Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-2xl font-bold text-voz-text mb-6">
        👥 Quản lý người dùng
      </h1>

      {/* Messages */}
      {message && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="forum-box p-4 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-voz-border rounded focus:ring-2 focus:ring-voz-orange focus:border-voz-orange"
            placeholder="🔍 Tìm kiếm theo tên hoặc email..."
          />
          <button
            onClick={() => setSearchTerm('')}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="forum-box overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-voz-bg border-b border-voz-border">
              <tr>
                <th className="text-left p-3 font-bold text-voz-text">Người dùng</th>
                <th className="text-left p-3 font-bold text-voz-text">Email</th>
                <th className="text-left p-3 font-bold text-voz-text">Vai trò</th>
                <th className="text-left p-3 font-bold text-voz-text">Trạng thái</th>
                <th className="text-left p-3 font-bold text-voz-text">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-voz-gray">
                    Không tìm thấy người dùng
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="border-b border-voz-border hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="avatar text-xs">
                          {u.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium">{u.username}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-voz-gray">{u.email}</td>
                    <td className="p-3">
                      {u.role === 'ADMIN' && <span className="badge badge-admin">ADMIN</span>}
                      {u.role === 'MODERATOR' && <span className="badge badge-mod">MOD</span>}
                      {u.role === 'USER' && <span className="badge bg-blue-100 text-blue-700">USER</span>}
                    </td>
                    <td className="p-3">
                      {u.status === 'ACTIVE' && <span className="text-green-600 text-sm">✓ Hoạt động</span>}
                      {u.status === 'BANNED' && <span className="text-red-600 text-sm">✕ Đã cấm</span>}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 flex-wrap">
                        {/* Ban/Unban - Both admin and moderator can do */}
                        {u.status === 'ACTIVE' && u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleBan(u.id, u.username)}
                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                          >
                            Cấm
                          </button>
                        )}
                        {u.status === 'BANNED' && (
                          <button
                            onClick={() => handleUnban(u.id, u.username)}
                            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                          >
                            Bỏ cấm
                          </button>
                        )}

                        {/* Promote/Demote - Only admin can do */}
                        {isAdmin && u.role === 'USER' && (
                          <button
                            onClick={() => handlePromoteToMod(u.id, u.username)}
                            className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                          >
                            ↑ Thăng MOD
                          </button>
                        )}
                        {isAdmin && u.role === 'MODERATOR' && (
                          <button
                            onClick={() => handleDemoteToUser(u.id, u.username)}
                            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          >
                            ↓ Hạ USER
                          </button>
                        )}

                        {/* Show what moderators can't do */}
                        {isModerator && !isAdmin && u.role !== 'USER' && (
                          <span className="text-xs text-gray-400 italic">
                            Không thể sửa
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="forum-box p-4 text-center">
          <div className="text-2xl font-bold text-voz-blue">{users.length}</div>
          <div className="text-sm text-voz-gray">Tổng người dùng</div>
        </div>
        <div className="forum-box p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {users.filter(u => u.status === 'ACTIVE').length}
          </div>
          <div className="text-sm text-voz-gray">Đang hoạt động</div>
        </div>
        <div className="forum-box p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {users.filter(u => u.status === 'BANNED').length}
          </div>
          <div className="text-sm text-voz-gray">Đã bị cấm</div>
        </div>
        <div className="forum-box p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.role === 'MODERATOR').length}
          </div>
          <div className="text-sm text-voz-gray">Moderator</div>
        </div>
      </div>

      {/* Permission Info */}
      <div className="mt-6 forum-box p-4 bg-blue-50">
        <h3 className="font-bold mb-2">ℹ️ Phân quyền:</h3>
        <ul className="text-sm space-y-1 text-voz-gray">
          <li>• <strong>ADMIN:</strong> Cấm/bỏ cấm, thăng cấp/hạ cấp người dùng</li>
          <li>• <strong>MODERATOR:</strong> Cấm/bỏ cấm người dùng (không thể thăng/hạ cấp)</li>
          <li>• Không thể thao tác với tài khoản ADMIN</li>
        </ul>
      </div>
    </div>
  );
}
