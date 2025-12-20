import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usersAPI } from '../../api';
import Loading from '../../components/common/Loading';

export default function Profile() {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await usersAPI.getById(id);
      setUser(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async () => {
    if (!window.confirm('Bạn có chắc muốn cấm người dùng này?')) return;
    
    try {
      await usersAPI.ban(user.id);
      loadUser();
    } catch (err) {
      alert('Không thể cấm người dùng');
    }
  };

  const handleUnban = async () => {
    try {
      await usersAPI.unban(user.id);
      loadUser();
    } catch (err) {
      alert('Không thể bỏ cấm người dùng');
    }
  };

  if (loading) return <Loading />;
  if (!user) return <div className="container mx-auto px-4 py-6">Không tìm thấy người dùng</div>;

  const isOwnProfile = authUser?.id === user.id;
  const isAdmin = authUser?.role === 'ADMIN';

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="forum-box p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="avatar text-2xl w-20 h-20">
            {user.avatar || user.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              {user.role === 'ADMIN' && <span className="badge badge-admin">ADMIN</span>}
              {user.role === 'MODERATOR' && <span className="badge badge-mod">MOD</span>}
              {user.status === 'BANNED' && (
                <span className="badge bg-red-500 text-white">BỊ CẤM</span>
              )}
            </div>
            <p className="text-sm text-voz-gray">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="text-voz-gray">Ngày tham gia:</span>
            <p className="font-medium">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
          </div>
          <div>
            <span className="text-voz-gray">Trạng thái:</span>
            <p className="font-medium">{user.status || 'ACTIVE'}</p>
          </div>
        </div>

        {/* Edit button */}
        {isOwnProfile && (
          <Link to="/profile/edit" className="btn btn-primary">
            Chỉnh sửa hồ sơ
          </Link>
        )}

        {/* Admin controls */}
        {isAdmin && !isOwnProfile && (
          <div className="mt-4 pt-4 border-t border-voz-border">
            <h3 className="font-semibold mb-2">Quản trị viên</h3>
            {user.status === 'BANNED' ? (
              <button onClick={handleUnban} className="btn btn-primary">
                ✅ Bỏ cấm
              </button>
            ) : (
              <button onClick={handleBan} className="btn bg-red-500 text-white hover:bg-red-600">
                🚫 Cấm người dùng
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
