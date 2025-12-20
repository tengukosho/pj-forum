import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      const res = await authAPI.login(form.email, form.password);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-voz-bg px-4">
      <div className="forum-box w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Đăng nhập <span className="text-voz-blue">School Forum</span>
        </h1>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="input"
              placeholder="admin@school.edu"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="w-full btn btn-primary disabled:opacity-50">
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-voz-gray">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-voz-blue hover:underline font-medium">
            Đăng ký ngay
          </Link>
        </p>

        <div className="mt-6 p-3 bg-blue-50 rounded text-xs text-center border border-blue-200">
          <p className="font-semibold mb-1">Tài khoản test:</p>
          <p>📧 admin@school.edu</p>
          <p>🔑 password123</p>
        </div>
      </div>
    </div>
  );
}
