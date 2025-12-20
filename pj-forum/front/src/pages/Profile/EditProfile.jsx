import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usersAPI } from '../../api';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [form, setForm] = useState({ username: '', avatar: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setForm({ username: user.username, avatar: user.avatar || '' });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await usersAPI.update(user.id, form);
      
      const updatedUser = { ...user, ...form };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      login(updatedUser, localStorage.getItem('token'));
      
      navigate(`/profile/${user.id}`);
    } catch (err) {
      setError('Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa hồ sơ</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="forum-box p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tên hiển thị</label>
          <input
            value={form.username}
            onChange={(e) => setForm({...form, username: e.target.value})}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Avatar (emoji hoặc ký tự)</label>
          <input
            value={form.avatar}
            onChange={(e) => setForm({...form, avatar: e.target.value})}
            className="input"
            placeholder="😊"
            maxLength={2}
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
