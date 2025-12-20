#!/bin/bash

# Login Page
cat > src/pages/Login/Login.jsx << 'EOF'
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

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
              className="input" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}
              className="input" required />
          </div>

          <button type="submit" disabled={loading} className="w-full btn btn-primary">
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Chưa có tài khoản? <Link to="/register" className="text-voz-blue hover:underline">Đăng ký</Link>
        </p>

        <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-center">
          <p className="font-semibold">Test: admin@school.edu / password123</p>
        </div>
      </div>
    </div>
  );
}
EOF

# Register Page
cat > src/pages/Register/Register.jsx << 'EOF'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
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

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
            <input value={form.username} onChange={(e) => setForm({...form, username: e.target.value})}
              className="input" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
              className="input" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}
              className="input" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
              className="input" required />
          </div>

          <button type="submit" disabled={loading} className="w-full btn btn-primary">
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Đã có tài khoản? <Link to="/login" className="text-voz-blue hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
EOF

echo "✅ Auth pages created"
