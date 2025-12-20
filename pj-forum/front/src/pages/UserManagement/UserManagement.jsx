import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function UserManagement() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
      navigate('/')
      return
    }
    loadUsers()
  }, [user, navigate])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:8080/api/users/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setUsers(res.data)
    } catch (err) {
      console.error('Error:', err)
      alert('Không thể tải danh sách: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleBan = async (id) => {
    if (!confirm('Cấm người dùng này?')) return
    try {
      await axios.put(`http://localhost:8080/api/users/${id}/ban`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      loadUsers()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleUnban = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/users/${id}/unban`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      loadUsers()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
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
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('⚠️ XÓA NGƯỜI DÙNG? KHÔNG THỂ HOÀN TÁC!')) return
    try {
      await axios.delete(`http://localhost:8080/api/users/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      loadUsers()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  if (!user) return null

  const filtered = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">👥 Quản lý người dùng</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Tìm kiếm..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">⏳ Đang tải...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left">Người dùng</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Vai trò</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
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
                      u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
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

                        {user.role === 'ADMIN' && (
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
          
          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-500">Không tìm thấy người dùng</div>
          )}
        </div>
      )}
    </div>
  )
}
