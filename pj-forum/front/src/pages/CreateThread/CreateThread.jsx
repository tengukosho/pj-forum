import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { threadsAPI, categoriesAPI } from '../../api';

export default function CreateThread() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    content: '',
    categoryId: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCategories();
  }, [user]);

  const loadCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data);
      if (res.data.length > 0) {
        setForm(f => ({ ...f, categoryId: res.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.content) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await threadsAPI.create({
        ...form,
        tags,
        categoryId: parseInt(form.categoryId)
      });
      navigate(`/thread/${res.data.id}`);
    } catch (err) {
      setError('Không thể tạo bài viết');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">✏️ Tạo bài viết mới</h1>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 border border-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="forum-box p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề</label>
            <input
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              className="input"
              placeholder="Nhập tiêu đề bài viết"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Danh mục</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({...form, categoryId: e.target.value})}
              className="input"
              required
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nội dung</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({...form, content: e.target.value})}
              className="textarea min-h-64"
              placeholder="Nhập nội dung bài viết..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags (phân cách bằng dấu phẩy)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({...form, tags: e.target.value})}
              className="input"
              placeholder="vd: java, spring-boot, react"
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Đang tạo...' : 'Tạo bài viết'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
              Hủy
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
