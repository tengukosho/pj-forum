import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import axios from 'axios'

export default function Settings() {
  const { user, login } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    username: '',
    avatar: '',
    bio: ''
  })
  
  const [systemSettings, setSystemSettings] = useState({
    autoDeleteDays: 30
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    setForm({
      username: user.username || '',
      avatar: user.avatar || '',
      bio: user.bio || ''
    })
  }, [user, navigate])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      const res = await axios.put(
        `http://localhost:8080/api/users/${user.id}`,
        form,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      
      // Update local user data
      const updatedUser = { ...user, ...form }
      login(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      alert('✅ Cập nhật thành công!')
    } catch (err) {
      console.error('Update error:', err)
      alert('❌ ' + (err.response?.data?.message || 'Không thể cập nhật'))
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSystem = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await axios.put(
        'http://localhost:8080/api/settings/system',
        systemSettings,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      )
      
      alert('✅ Cập nhật cài đặt hệ thống thành công!')
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Không thể cập nhật'))
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">⚙️ Cài đặt tài khoản</h2>
        </div>
        
        <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
          
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
              {form.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="font-medium">{user.username}</div>
              <div className="text-sm text-slate-500">{user.email}</div>
              <div className="text-xs text-slate-400 mt-1">
                {user.role === 'ADMIN' ? '👑 Admin' :
                 user.role === 'MODERATOR' ? '🛡️ Moderator' :
                 '👤 Thành viên'}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tên hiển thị</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL Avatar</label>
            <input
              type="url"
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Giới thiệu</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="Viết vài dòng về bản thân..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : '💾 Lưu thay đổi'}
          </button>
        </form>
      </div>

      {user.role === 'ADMIN' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">🔧 Cài đặt hệ thống</h2>
          </div>
          
          <form onSubmit={handleUpdateSystem} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tự động xóa bài cũ sau (ngày)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={systemSettings.autoDeleteDays}
                onChange={(e) => setSystemSettings({ 
                  ...systemSettings, 
                  autoDeleteDays: parseInt(e.target.value) 
                })}
                className="w-40 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-slate-500 mt-1">
                Bài viết cũ hơn {systemSettings.autoDeleteDays} ngày sẽ tự động xóa
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu cài đặt hệ thống'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
