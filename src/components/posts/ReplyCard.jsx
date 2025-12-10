import React from 'react'

export default function ReplyCard({ reply }) {
  return (
    <div className="bg-white rounded-md shadow-sm p-3 mb-2">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">{reply.author?.[0]}</div>
        <div>
          <div className="text-sm font-medium">{reply.author} <span className="text-xs text-slate-500">• {reply.time}</span></div>
          <div className="mt-1 text-sm text-slate-800">{reply.content}</div>
        </div>
      </div>
    </div>
  )
}
