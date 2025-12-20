import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b-2 border-voz-blue shadow-sm sticky top-0 z-50">
      <div className="container mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-voz-border">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold text-voz-blue">SCHOOL FORUM</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to={`/profile/${user.id}`} className="flex items-center gap-2 hover:text-voz-blue">
                  <div className="avatar text-xs">
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden md:block text-sm">
                    <div className="font-semibold">{user.username}</div>
                    {user.role !== 'USER' && (
                      <div className={`text-xs ${user.role === 'ADMIN' ? 'text-red-500' : 'text-purple-500'}`}>
                        {user.role}
                      </div>
                    )}
                  </div>
                </Link>
                <Link to="/settings" className="text-sm hover:text-voz-blue" title="Cài đặt">
                  ⚙️
                </Link>
                <button onClick={logout} className="text-sm text-red-600 hover:text-red-700">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm hover:text-voz-blue">Đăng nhập</Link>
                <Link to="/register" className="btn btn-primary text-sm">Đăng ký</Link>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6 px-4 py-3 text-sm">
          <Link to="/" className="hover:text-voz-blue font-medium">🏠 Trang chủ</Link>
          <Link to="/create-thread" className="hover:text-voz-blue">✏️ Tạo bài viết</Link>
        </nav>
      </div>
    </header>
  );
}
