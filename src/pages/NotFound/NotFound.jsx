import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-3">404</h1>
      <p className="mb-4">Page not found</p>
      <Link to="/" className="px-4 py-2 border rounded">Go Home</Link>
    </div>
  )
}
