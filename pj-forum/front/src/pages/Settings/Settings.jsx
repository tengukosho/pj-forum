import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import axios from 'axios'

export default function Settings() {
  const { user, login } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  
  const [form, setForm] = useState({
    username: '',
    avatar: '',
    bio: ''
  })
  
  const [systemSettings, setSystemSettings] = useState({
    autoDeleteDays: 30
  })

  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

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

  if (user.role === 'ADMIN') {
    loadSystemSettings()
  }

  if (user.role === 'ADMIN' || user.role === 'MODERATOR') {
    loadUsers()
  }
}, [user, navigate])

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:8080/api/users/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setUsers(res.data)
    } catch (err) {
      console.error('Error loading users:', err)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `http://localhost:8080/api/users/${user.id}`,
        form,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      
      const updatedUser = { ...user, ...form }
      login(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      alert('✅ Cập nhật thành công!')
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Không thể cập nhật'))
    } finally {
      setLoading(false)
    }
  }

  const loadSystemSettings = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get(
      'http://localhost:8080/api/admin/settings',
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setSystemSettings({
      autoDeleteDays: res.data.autoDeleteDays
    })
  } catch (err) {
    console.error('Failed to load system settings', err)
  }
}

  const handleUpdateSystem = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        'http://localhost:8080/api/admin/settings/auto-delete-days',
        { days: systemSettings.autoDeleteDays },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('✅ Cập nhật cài đặt hệ thống thành công!')
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Không thể cập nhật'))
    } finally {
      setLoading(false)
    }
  }

  const handleBan = async (id) => {
    if (!confirm('Cấm người dùng?')) return
    try {
      await axios.put(`http://localhost:8080/api/users/${id}/ban`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      loadUsers()
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Lỗi'))
    }
  }

  const handleUnban = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/users/${id}/unban`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      loadUsers()
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Lỗi'))
    }
  }

  const handleRole = async (id, role) => {
    if (!confirm(`Đổi vai trò thành ${role}?`)) return
    try {
      await axios.put(`http://localhost:8080/api/users/${id}/role`, 
        { role },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      )
      loadUsers()
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Lỗi'))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('⚠️ XÓA NGƯỜI DÙNG?')) return
    try {
      await axios.delete(`http://localhost:8080/api/users/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      loadUsers()
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Lỗi'))
    }
  }

  if (!user) return null

  const filtered = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const isAdmin = user.role === 'ADMIN'
  const isMod = user.role === 'MODERATOR'

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b flex">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium ${activeTab === 'profile' ? 'border-b-2 border-primary text-primary' : 'text-slate-600'}`}
          >
            👤 Tài khoản
          </button>
          {(isAdmin || isMod) && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-medium ${activeTab === 'users' ? 'border-b-2 border-primary text-primary' : 'text-slate-600'}`}
            >
              👥 Quản lý người dùng
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('system')}
              className={`px-6 py-3 font-medium ${activeTab === 'system' ? 'border-b-2 border-primary text-primary' : 'text-slate-600'}`}
            >
              🔧 Hệ thống
            </button>
          )}
        </div>

        <div className="p-6">
          
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {form.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="font-medium text-lg">{user.username}</div>
                  <div className="text-sm text-slate-500">{user.email}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {isAdmin ? '👑 Admin' : isMod ? '🛡️ Moderator' : '👤 Thành viên'}
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
                  placeholder="Viết vài dòng..."
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
          )}

          {activeTab === 'users' && (isAdmin || isMod) && (
            <div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 Tìm kiếm..."
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-primary"
              />
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm">Người dùng</th>
                      <th className="px-4 py-2 text-left text-sm">Email</th>
                      <th className="px-4 py-2 text-left text-sm">Vai trò</th>
                      <th className="px-4 py-2 text-left text-sm">Trạng thái</th>
                      <th className="px-4 py-2 text-left text-sm">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                              {u.username[0].toUpperCase()}
                            </div>
                            <span className="font-medium">{u.username}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded ${
                            u.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                            u.role === 'MODERATOR' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded ${
                            u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {u.role === 'ADMIN' ? (
                            <span className="text-xs text-slate-400">-</span>
                          ) : (
                            <div className="flex gap-1">
                              {u.status === 'ACTIVE' ? (
                                <button onClick={() => handleBan(u.id)} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                                  Cấm
                                </button>
                              ) : (
                                <button onClick={() => handleUnban(u.id)} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                                  Bỏ cấm
                                </button>
                              )}

                              {isAdmin && (
                                <>
                                  {u.role === 'USER' && (
                                    <button onClick={() => handleRole(u.id, 'MODERATOR')} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                                      ↑ Mod
                                    </button>
                                  )}
                                  {u.role === 'MODERATOR' && (
                                    <button onClick={() => handleRole(u.id, 'USER')} className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200">
                                      ↓ User
                                    </button>
                                  )}
                                  <button onClick={() => handleDelete(u.id)} className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                                    🗑
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'system' && isAdmin && (
            <form onSubmit={handleUpdateSystem} className="space-y-4">
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
                className="px-6 py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 disabled:opacity-50"
              >
                {loading ? 'Đang lưu...' : 'Lưu cài đặt hệ thống'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
