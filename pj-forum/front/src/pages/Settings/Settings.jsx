import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usersAPI } from '../../api';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    avatar: user?.avatar || '',
    bio: user?.bio || '',
  });

  const [adminSettings, setAdminSettings] = useState({
    autoDeleteDays: localStorage.getItem('autoDeleteDays') || 90,
    allowRegistration: localStorage.getItem('allowRegistration') !== 'false',
    allowAnonymous: localStorage.getItem('allowAnonymous') !== 'false',
    autoApprove: localStorage.getItem('autoApprove') !== 'false',
    emailVerification: localStorage.getItem('emailVerification') === 'true',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.username.length < 3 || formData.username.length > 50) {
      setError('Tên người dùng phải từ 3-50 ký tự');
      return;
    }

    try {
      setLoading(true);
      const res = await usersAPI.update(user.id, formData);
      
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage('✅ Cập nhật thành công!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    localStorage.setItem('autoDeleteDays', adminSettings.autoDeleteDays);
    localStorage.setItem('allowRegistration', adminSettings.allowRegistration);
    localStorage.setItem('allowAnonymous', adminSettings.allowAnonymous);
    localStorage.setItem('autoApprove', adminSettings.autoApprove);
    localStorage.setItem('emailVerification', adminSettings.emailVerification);

    setMessage('✅ Cài đặt đã được lưu!');
    setTimeout(() => setMessage(''), 3000);
  };

  if (!user) return null;

  const isAdmin = user.role === 'ADMIN';
  const isModerator = user.role === 'MODERATOR';
  const canManageUsers = isAdmin || isModerator;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-voz-text mb-6">⚙️ Cài đặt</h1>

      {/* Tab Navigation */}
      <div className="forum-box mb-6">
        <div className="flex border-b border-voz-border">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'profile'
                ? 'text-voz-orange border-b-2 border-voz-orange'
                : 'text-voz-gray hover:text-voz-text'
            }`}
          >
            👤 Thông tin cá nhân
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-6 py-3 font-medium transition ${
                activeTab === 'admin'
                  ? 'text-voz-orange border-b-2 border-voz-orange'
                  : 'text-voz-gray hover:text-voz-text'
              }`}
            >
              🔧 Cài đặt hệ thống
            </button>
          )}

          {canManageUsers && (
            <button
              onClick={() => navigate('/users')}
              className="px-6 py-3 font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition"
            >
              👥 Quản lý người dùng →
            </button>
          )}
        </div>
      </div>

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

      {/* Profile Settings Tab */}
      {activeTab === 'profile' && (
        <div className="forum-box p-6">
          <h2 className="text-xl font-bold mb-4">Chỉnh sửa thông tin cá nhân</h2>
          
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên người dùng</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-voz-border rounded focus:ring-2 focus:ring-voz-orange"
                minLength={3}
                maxLength={50}
                required
              />
              <p className="text-xs text-voz-gray mt-1">3-50 ký tự</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL Avatar</label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full px-3 py-2 border border-voz-border rounded focus:ring-2 focus:ring-voz-orange"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Giới thiệu bản thân</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 border border-voz-border rounded focus:ring-2 focus:ring-voz-orange resize-vertical"
                rows={4}
                maxLength={500}
                placeholder="Viết vài dòng về bạn..."
              />
              <p className="text-xs text-voz-gray mt-1">{formData.bio.length}/500 ký tự</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>
      )}

      {/* Admin Settings Tab */}
      {activeTab === 'admin' && isAdmin && (
        <div className="forum-box p-6">
          <h2 className="text-xl font-bold mb-4">Cài đặt hệ thống</h2>
          
          <form onSubmit={handleAdminSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tự động xóa bài viết cũ (số ngày)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={adminSettings.autoDeleteDays}
                onChange={(e) => setAdminSettings({ ...adminSettings, autoDeleteDays: e.target.value })}
                className="w-full px-3 py-2 border border-voz-border rounded focus:ring-2 focus:ring-voz-orange"
              />
              <p className="text-xs text-voz-gray mt-1">
                Bài viết không hoạt động quá {adminSettings.autoDeleteDays} ngày sẽ tự động bị xóa
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adminSettings.allowRegistration}
                  onChange={(e) => setAdminSettings({ ...adminSettings, allowRegistration: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Cho phép đăng ký tài khoản mới</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adminSettings.allowAnonymous}
                  onChange={(e) => setAdminSettings({ ...adminSettings, allowAnonymous: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Cho phép đăng bài ẩn danh</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adminSettings.autoApprove}
                  onChange={(e) => setAdminSettings({ ...adminSettings, autoApprove: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Tự động duyệt bài viết</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adminSettings.emailVerification}
                  onChange={(e) => setAdminSettings({ ...adminSettings, emailVerification: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Yêu cầu xác thực email</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary">
              Lưu cài đặt
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
