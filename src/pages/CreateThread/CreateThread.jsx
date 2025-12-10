import React, { useState, useEffect } from 'react'
import RichTextEditor from '../../components/forms/RichTextEditor'
import { createThread } from '../../api/mockApi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function CreateThread() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // ======= States =======
  const [title, setTitle] = useState(localStorage.getItem("draft_title") || "")
  const [content, setContent] = useState(localStorage.getItem("draft_content") || "")
  const [tags, setTags] = useState([])
  const [category, setCategory] = useState("general")
  const [anonymous, setAnonymous] = useState(false)
  const [preview, setPreview] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const maxTitle = 100

  // ===== Auto-save =====
  useEffect(() => {
    localStorage.setItem("draft_title", title)
    localStorage.setItem("draft_content", content)
  }, [title, content])

  // ===== Require Login =====
  if (!user) {
    return (
      <div className="max-w-xl mx-auto mt-14 text-center animate-fadeIn">
        <h2 className="text-2xl font-bold text-slate-800">Login Required</h2>
        <p className="text-slate-600 mt-2">You must be logged in to create a thread.</p>
        <button 
          onClick={() => navigate('/login')}
          className="mt-5 px-6 py-2 bg-primary text-white rounded-lg shadow-sm hover:shadow-md transition"
        >
          Go to Login
        </button>
      </div>
    )
  }

  // ===== Submit Thread =====
  const submit = async () => {
    setError("")

    if (!title) return setError("Title cannot be empty")
    if (title.length > maxTitle) return setError("Title too long")
    if (!content) return setError("Content cannot be empty")

    setLoading(true)
    try {
      const author = anonymous ? "Anonymous" : user.username

      const res = await createThread({
        title,
        content,
        category,
        tags,
        author
      })

      localStorage.removeItem("draft_title")
      localStorage.removeItem("draft_content")

      navigate(`/thread/${res.data.id}`)
    } catch {
      setError("Failed to create thread. Backend not connected.")
    }
    setLoading(false)
  }

  // ===== Tags =====
  const addTag = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const tag = e.target.value.trim()
      if (!tags.includes(tag)) setTags([...tags, tag])
      e.target.value = ""
    }
  }

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag))
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-slate-800">Create New Thread</h1>

        {/* ===== Error Message ===== */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg animate-shake">
            {error}
          </div>
        )}

        {/* ===== TITLE ===== */}
        <div className="mb-6">
          <label className="block text-sm mb-1 font-medium text-slate-700">Title</label>
          <input
            maxLength={maxTitle}
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Enter a descriptive thread title"
          />
          <div className="text-xs mt-1 text-slate-500">
            {title.length}/{maxTitle} characters
          </div>
        </div>

        {/* ===== CATEGORY ===== */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-slate-700">Category</label>
          <select
            className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-primary transition"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="general">General Discussion</option>
            <option value="school">School</option>
            <option value="assignment">Assignment</option>
            <option value="tech">Tech</option>
          </select>
        </div>

        {/* ===== TAGS ===== */}
        <div className="mb-6">
          <label className="block text-sm mb-2 font-medium text-slate-700">Tags</label>

          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <span
                key={tag}
                onClick={() => removeTag(tag)}
                className="px-3 py-1 bg-slate-200 rounded-full text-xs cursor-pointer hover:bg-slate-300 transition"
              >
                {tag} ✕
              </span>
            ))}
          </div>

          <input
            onKeyDown={addTag}
            className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-primary transition"
            placeholder="Press Enter to add tag"
          />
        </div>

        {/* ===== ANONYMOUS ===== */}
        <div className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={() => setAnonymous(!anonymous)}
            className="w-4 h-4"
          />
          <span className="text-sm text-slate-700">Post anonymously</span>
        </div>

        {/* ===== CONTENT + PREVIEW ===== */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Content</label>
            <button
              onClick={() => setPreview(!preview)}
              className="text-primary text-sm underline hover:text-primary/70 transition"
            >
              {preview ? "Back to Editor" : "Preview"}
            </button>
          </div>

          {preview ? (
            <div className="border rounded-xl p-5 bg-slate-50 shadow-inner animate-fadeIn">
              <h2 className="text-xl font-semibold mb-3">{title}</h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          ) : (
            <RichTextEditor value={content} onChange={setContent} />
          )}
        </div>

        {/* ===== SUBMIT BUTTON ===== */}
        <div className="text-right">
          <button
            onClick={submit}
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white 
              ${loading ? "bg-primary/60" : "bg-primary hover:bg-primary/90"} 
              shadow-md hover:shadow-lg transition`}
          >
            {loading ? "Posting..." : "Submit Thread"}
          </button>
        </div>

      </div>
    </div>
  )
}
