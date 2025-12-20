import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import axios from 'axios'

export default function EditThread() {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '',
    content: '',
    categoryId: 1
  })
  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadThread()
    loadCategories()
  }, [user, navigate, id])

  const loadThread = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/threads/${id}`)
      const thread = res.data
      
      if (thread.author?.id !== user.id) {
        alert('Bạn không có quyền chỉnh sửa bài viết này')
        navigate(`/thread/${id}`)
        return
      }
      
      setForm({
        title: thread.title,
        content: thread.content,
        categoryId: thread.categoryId
      })
    } catch (err) {
      alert('Không thể tải bài viết')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/categories')
      setCategories(res.data)
    } catch (err) {
      console.error('Error loading categories:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.put(
        `http://localhost:8080/api/threads/${id}`,
        form,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      )
      
      alert('✅ Đã cập nhật bài viết')
      navigate(`/thread/${id}`)
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Không thể cập nhật'))
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-20">Đang tải...</div>
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">✏️ Chỉnh sửa bài viết</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        
        <div>
          <label className="block text-sm font-medium mb-1">Chủ đề</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            required
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tiêu đề</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            required
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nội dung</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={12}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : '💾 Lưu thay đổi'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(`/thread/${id}`)}
            className="px-8 py-3 bg-slate-200 text-slate-700 font-bold text-lg rounded-lg hover:bg-slate-300"
          >
            ❌ Hủy
          </button>
        </div>
      </form>
    </div>
  )
}
