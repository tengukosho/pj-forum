import { useState, useEffect, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import axios from 'axios'

export default function ThreadPage() {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const [thread, setThread] = useState(null)
  const [replies, setReplies] = useState([])
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadThread()
  }, [id])

  const loadThread = async () => {
    try {
      setLoading(true)
      setError('')
      
      const res = await axios.get(`http://localhost:8080/api/threads/${id}`)
      setThread(res.data)
      setReplies(res.data.replies || [])
    } catch (err) {
      setError('Không thể tải bài viết')
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    try {
      await axios.post(
        `http://localhost:8080/api/replies`,
        { threadId: parseInt(id), content: replyContent },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      )
      
      setReplyContent('')
      loadThread()
    } catch (err) {
      alert('Không thể gửi trả lời')
    }
  }

  const handleDelete = async () => {
    if (!confirm('⚠️ Bạn có chắc muốn xóa bài viết này?')) return
    
    try {
      await axios.delete(`http://localhost:8080/api/threads/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      alert('✅ Đã xóa bài viết')
      navigate('/')
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Không thể xóa'))
    }
  }

  const handlePin = async () => {
    try {
      await axios.post(`http://localhost:8080/api/threads/${id}/pin`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      loadThread()
    } catch (err) {
      alert('❌ Không thể ghim/bỏ ghim')
    }
  }

  if (loading) return <div className="text-center py-20">Đang tải...</div>

  if (error || !thread) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-red-50 p-4 rounded-lg">{error || 'Không tìm thấy bài viết'}</div>
        <Link to="/" className="text-primary mt-4 inline-block">← Về trang chủ</Link>
      </div>
    )
  }

  const canEdit = user && user.id === thread.author?.id
  const canDelete = user && (
    user.id === thread.author?.id || 
    (user.role === 'MODERATOR' && thread.author?.role === 'USER') ||
    (user.role === 'ADMIN' && thread.author?.role !== 'ADMIN')
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      <div className="text-sm text-slate-600 mb-4">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span>{thread.title}</span>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-2xl font-bold flex-1">{thread.title}</h1>
            
            {user && (
              <div className="flex gap-2">
                {canEdit && (
                  <button
                    onClick={() => navigate(`/edit-thread/${id}`)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    ✏️ Sửa
                  </button>
                )}
                
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    🗑️ Xóa
                  </button>
                )}
                
                {user.role === 'ADMIN' && (
                  <button
                    onClick={handlePin}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                  >
                    {thread.isPinned ? '📌 Bỏ ghim' : '📌 Ghim'}
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>👤 {thread.author?.username || 'Anonymous'}</span>
            <span>•</span>
            <span>{new Date(thread.createdAt).toLocaleString('vi-VN')}</span>
          </div>
        </div>
        <div className="p-6">
          <p className="whitespace-pre-wrap">{thread.content}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b font-semibold">
          💬 {replies.length} trả lời
        </div>
        
        {replies.length > 0 ? (
          <div className="divide-y">
            {replies.map((reply) => (
              <div key={reply.id} className="p-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {reply.author?.username?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium mb-1">{reply.author?.username || 'Anonymous'}</div>
                    <div className="text-xs text-slate-500 mb-2">
                      {new Date(reply.createdAt).toLocaleString('vi-VN')}
                    </div>
                    <p className="whitespace-pre-wrap">{reply.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-500">Chưa có trả lời</div>
        )}
      </div>

      {user ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-3">💬 Trả lời</h3>
          <form onSubmit={handleReply}>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="Viết trả lời của bạn..."
              required
            />
            <button
              type="submit"
              className="mt-3 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg text-lg"
            >
              📤 Gửi trả lời
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-lg p-6 text-center">
          <Link to="/login" className="text-primary underline">Đăng nhập</Link> để trả lời
        </div>
      )}
    </div>
  )
}
