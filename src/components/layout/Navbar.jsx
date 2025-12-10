import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-semibold text-lg">SchoolForum</Link>
          <Link to="/" className="text-sm text-slate-600">Home</Link>
          <Link to="/category/1" className="text-sm text-slate-600">Homework</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/create-thread" className="px-3 py-1 rounded-md border text-sm">New Thread</Link>
          {user ? (
            <>
              <Link to={`/profile/${user.id}`} className="text-sm">{user.username}</Link>
              <button onClick={logout} className="text-sm text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/register" className="text-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
