import React from 'react'
import { Link } from 'react-router-dom'

export default function PostCard({ thread }) {
  return (
    <div className="bg-white rounded-md shadow-sm p-4 mb-3">
      <div className="flex justify-between items-start">
        <div>
          <Link to={`/thread/${thread.id}`} className="font-semibold text-lg">{thread.title}</Link>
          <div className="text-sm text-slate-500">by {thread.author} • {thread.replies} replies</div>
        </div>
        <div className="text-sm text-slate-500">{thread.lastActivity}</div>
      </div>
    </div>
  )
}
