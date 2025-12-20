import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { threadsAPI, repliesAPI } from '../../api';
import ReplyBox from '../../components/thread/ReplyBox';
import Loading from '../../components/common/Loading';

export default function ThreadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadThread();
  }, [id]);

  const loadThread = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Loading thread:', id);
      
      const threadRes = await threadsAPI.getById(id);
      console.log('Thread response:', threadRes.data);
      
      const repliesRes = await repliesAPI.getByThread(id);
      console.log('Replies response:', repliesRes.data);
      
      setThread(threadRes.data);
      
      // Handle both array and object responses
      if (Array.isArray(repliesRes.data)) {
        setReplies(repliesRes.data);
      } else if (repliesRes.data.content) {
        // Spring Boot Page response
        setReplies(repliesRes.data.content);
      } else {
        setReplies([]);
      }
      
    } catch (err) {
      console.error('Error loading thread:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.status === 404) {
        setError('Bài viết không tồn tại');
      } else if (err.response?.status === 403) {
        setError('Bạn không có quyền xem bài viết này');
      } else {
        setError(`Không thể tải bài viết: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      setSubmitting(true);
      const res = await repliesAPI.create(id, replyContent);
      setReplies([...replies, res.data]);
      setReplyContent('');
    } catch (err) {
      alert('Không thể gửi trả lời');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    
    try {
      await threadsAPI.delete(id);
      navigate('/');
    } catch (err) {
      alert('Không thể xóa bài viết');
    }
  };

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="forum-box p-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold mb-2">{error}</h2>
          <Link to="/" className="btn btn-primary mt-4">Về trang chủ</Link>
        </div>
      </div>
    );
  }
  
  if (!thread) return null;

  const canDelete = user && (
    user.id === thread.author?.id || 
    user.role === 'ADMIN' || 
    user.role === 'MODERATOR'
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Breadcrumb */}
      <div className="text-sm text-voz-gray mb-4">
        <Link to="/" className="hover:text-voz-blue">Trang chủ</Link>
        {thread.categoryName && (
          <>
            <span className="mx-2">/</span>
            <Link to={`/category/${thread.categoryId}`} className="hover:text-voz-blue">
              {thread.categoryName}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span>{thread.title}</span>
      </div>

      {/* Thread Header */}
      <div className="forum-box p-6 mb-4">
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-2xl font-bold text-voz-text">{thread.title}</h1>
          {canDelete && (
            <button onClick={handleDelete} className="btn bg-red-500 text-white hover:bg-red-600">
              🗑️ Xóa
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3 text-sm text-voz-gray mb-3">
          <span className="font-medium">{thread.author?.username}</span>
          {thread.author?.role === 'ADMIN' && <span className="badge badge-admin">ADMIN</span>}
          {thread.author?.role === 'MODERATOR' && <span className="badge badge-mod">MOD</span>}
          <span>•</span>
          <span>{new Date(thread.createdAt).toLocaleString('vi-VN')}</span>
          <span>•</span>
          <span>👁 {thread.viewCount} lượt xem</span>
        </div>
        
        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {thread.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-voz-border text-voz-text whitespace-pre-wrap">
          {thread.content}
        </div>
      </div>

      {/* Replies */}
      <div className="forum-box mb-4">
        <div className="p-4 border-b border-voz-border bg-voz-bg">
          <h2 className="font-bold">💬 {replies.length} Trả lời</h2>
        </div>
        {replies.map(reply => (
          <ReplyBox key={reply.id} reply={reply} />
        ))}
      </div>

      {/* Reply Form */}
      {user ? (
        <div className="forum-box p-4">
          <h3 className="font-bold mb-3">Trả lời</h3>
          <form onSubmit={handleReply}>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="textarea min-h-32 mb-3"
              placeholder="Nhập nội dung trả lời..."
              required
            />
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Đang gửi...' : 'Gửi trả lời'}
            </button>
          </form>
        </div>
      ) : (
        <div className="forum-box p-4 text-center">
          <p className="text-voz-gray mb-3">Bạn cần đăng nhập để trả lời</p>
          <Link to="/login" className="btn btn-primary">Đăng nhập</Link>
        </div>
      )}
    </div>
  );
}
