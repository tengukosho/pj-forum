import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(form.email)) {
      setError('Email không hợp lệ (vd: user@example.com)');
      return;
    }

    if (!validatePassword(form.password)) {
      setError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ HOA, chữ thường và SỐ');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    try {
      setLoading(true);
      await authAPI.register(form.username, form.email, form.password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-voz-bg px-4">
      <div className="forum-box w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Đăng ký <span className="text-voz-blue">School Forum</span>
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
            <input
              value={form.username}
              onChange={(e) => setForm({...form, username: e.target.value})}
              className="input"
              required
              minLength={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="input"
              placeholder="user@example.com"
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
              placeholder="Tối thiểu 8 ký tự"
              required
            />
            <p className="text-xs text-voz-gray mt-1">
              Phải có: Chữ HOA, chữ thường, và số
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
              className="input"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="w-full btn btn-primary disabled:opacity-50">
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-voz-gray">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-voz-blue hover:underline font-medium">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
