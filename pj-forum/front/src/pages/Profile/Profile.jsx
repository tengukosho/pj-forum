import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import axios from 'axios'

export default function Profile() {
  const { id } = useParams()
  const { user, login } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  
  const [form, setForm] = useState({
    username: '',
    avatar: '',
    bio: ''
  })

  const [systemSettings, setSystemSettings] = useState({
    autoDeleteDays: 30
  })

  const isOwnProfile = user && user.id === parseInt(id)
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    fetchProfile()
  }, [id])

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${id}`)
      setProfile(response.data)
      setForm({
        username: response.data.username || '',
        avatar: response.data.avatar || '',
        bio: response.data.bio || ''
      })
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await axios.put(
        `http://localhost:8080/api/users/${id}`,
        form,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      )
      
      const updatedUser = { ...user, username: form.username, avatar: form.avatar, bio: form.bio }
      login(updatedUser)
      
      alert('Cập nhật thành công!')
      setEditing(false)
      fetchProfile()
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể cập nhật')
    }
  }

  const handleSystemSettingsUpdate = async () => {
    try {
      await axios.put(
        'http://localhost:8080/api/settings/system',
        systemSettings,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      )
      alert('Cập nhật cài đặt hệ thống thành công!')
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể cập nhật cài đặt')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!profile) {
    return <div className="text-center py-20">Không tìm thấy người dùng</div>
  }

  // If not own profile, redirect to home
  if (!isOwnProfile) {
    navigate('/')
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start gap-6">
          
          <div className="flex-shrink-0">
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt={profile.username}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                {profile.username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              <span className={`text-xs px-3 py-1 rounded-full ${
                profile.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                profile.role === 'MODERATOR' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {profile.role === 'ADMIN' ? '👑 Admin' :
                 profile.role === 'MODERATOR' ? '🛡️ Moderator' :
                 '👤 Thành viên'}
              </span>
            </div>
            
            <p className="text-slate-600 text-sm mb-2">{profile.email}</p>
            <p className="text-slate-700">{profile.bio || 'Chưa có giới thiệu'}</p>
            <p className="text-xs text-slate-500 mt-2">
              Tham gia: {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          
          <div>
            <h2 className="text-lg font-semibold mb-4">⚙️ Cài đặt tài khoản</h2>
            
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Chỉnh sửa
              </button>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4">
                
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
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Viết vài dòng về bản thân..."
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    Lưu thay đổi
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}
          </div>

          {isAdmin && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">🔧 Cài đặt hệ thống</h2>
              
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-2">
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
                  onClick={handleSystemSettingsUpdate}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                >
                  Lưu cài đặt hệ thống
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
