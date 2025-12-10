import React from 'react'

export default function RichTextEditor({ value, onChange }) {
  // basic textarea so you can swap it later for Quill/Tiptap
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={8}
      className="w-full border rounded-md p-2 resize-vertical"
      placeholder="Write your message..."
    />
  )
}
