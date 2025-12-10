import React from 'react'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="text-center py-4 text-sm text-slate-600">
        Forum • Built with React + Tailwind
      </footer>
    </div>
  )
}
