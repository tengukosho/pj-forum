import React from 'react'
import { useParams } from 'react-router-dom'

export default function Profile() {
  const { id } = useParams()
  return (
    <div className="max-w-3xl bg-white p-4 rounded-md shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-xl">U</div>
        <div>
          <h2 className="text-xl font-semibold">Username</h2>
          <div className="text-sm text-slate-500">Joined: 2025-01-01</div>
        </div>
      </div>

      <section className="mt-4">
        <h3 className="font-medium">Recent Threads</h3>
        <div className="mt-2 text-sm text-slate-600">No threads yet</div>
      </section>
    </div>
  )
}
