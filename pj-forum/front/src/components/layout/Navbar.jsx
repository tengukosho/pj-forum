import { useContext, useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Left - Logo */}
          <Link to="/" className="text-xl font-bold text-primary hover:text-primary/80">
            🎓 School Forum
          </Link>

          {/* Right - Actions */}
          <div className="flex items-center gap-4">
            
            {/* New Thread Button */}
            {user && (
              <Link 
                to="/create-thread" 
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90"
              >
                + Tạo bài viết
              </Link>
            )}

            {user ? (
              /* User Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 hover:bg-slate-50 px-3 py-2 rounded-lg"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-slate-800">{user.username}</div>
                    <div className="text-xs text-slate-500">
                      {user.role === 'ADMIN' ? 'ADMIN' :
                       user.role === 'MODERATOR' ? 'MODERATOR' :
                       'Thành viên'}
                    </div>
                  </div>
                  <svg className={`w-4 h-4 text-slate-400 transition ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border py-1">
                    
                    <Link
                      to="/settings"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-sm"
                    >
                      <span>⚙️</span>
                      <span>Cài đặt</span>
                    </Link>

                    {(user.role === 'ADMIN' || user.role === 'MODERATOR') && (
                      <Link
                        to="/users"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-sm border-t"
                      >
                        <span>👥</span>
                        <span>Quản lý người dùng</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm w-full text-left border-t text-red-600"
                    >
                      <span>🚪</span>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Links */
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm text-slate-600 hover:text-primary">
                  Đăng nhập
                </Link>
                <Link to="/register" className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
