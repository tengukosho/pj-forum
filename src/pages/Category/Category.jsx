import React from 'react'
import PostCard from '../../components/posts/PostCard'
import { useParams } from 'react-router-dom'

export default function Category() {
  const { id } = useParams()
  // In real app, fetch by category id
  const dummy = [{ id: 1, title: 'Loop problem in Java', author: 'carol', replies: 4, lastActivity: '5 hrs' }]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Category: Homework Help</h1>
          <p className="text-sm text-slate-500">Ask questions about homework</p>
        </div>
      </div>

      <div>
        <div className="mb-3 text-right"><a href="/create-thread" className="px-3 py-1 border rounded">Create New Thread</a></div>
        {dummy.map(t => <PostCard key={t.id} thread={t} />)}
      </div>
    </div>
  )
}
