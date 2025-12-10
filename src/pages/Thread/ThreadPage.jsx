import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReplyCard from '../../components/posts/ReplyCard'
import RichTextEditor from '../../components/forms/RichTextEditor'
import { fetchThread, postReply } from '../../api/mockApi'

export default function ThreadPage() {
  const { id } = useParams()
  const [thread, setThread] = useState(null)
  const [replies, setReplies] = useState([])
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    fetchThread(id).then(res => {
      setThread(res.data)
      setReplies(res.data?.replies || [])
    })
  }, [id])

  const submit = async () => {
    if (!replyText) return
    const res = await postReply(id, { content: replyText, author: 'you' })
    setReplies(prev => [...prev, res.data])
    setReplyText('')
  }

  if (!thread) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-md shadow-sm p-4">
        <h1 className="text-xl font-semibold">{thread.title}</h1>
        <div className="text-sm text-slate-500">by {thread.author} • {thread.createdAt}</div>
        <div className="mt-3 text-sm">{thread.content}</div>
      </div>

      <div>
        <h2 className="text-lg font-medium">Replies</h2>
        <div className="mt-2">
          {replies.map(r => <ReplyCard key={r.id} reply={r} />)}
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm p-4">
        <h3 className="font-medium">Add a Reply</h3>
        <div className="mt-2">
          <RichTextEditor value={replyText} onChange={setReplyText} />
          <div className="text-right mt-2">
            <button onClick={submit} className="px-4 py-2 rounded bg-slate-800 text-white">Submit Reply</button>
          </div>
        </div>
      </div>
    </div>
  )
}
