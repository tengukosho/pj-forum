// Simple promise-based mock API. Replace with real axios calls to your backend.
const delay = (ms) => new Promise(res => setTimeout(res, ms))

let threads = [
  { id: 1, title: 'Why is Java Servlet so difficult?', author: 'alice', replies: 56, lastActivity: '3 hrs' },
  { id: 2, title: 'Help with loops in R', author: 'bob', replies: 22, lastActivity: '5 hrs' },
]

let posts = {
  1: {
    id: 1, title: threads[0].title, author: 'alice', content: 'I have problem with...', createdAt: '2025-11-20',
    replies: [{ id: 101, author: 'dave', time: '1 hr ago', content: 'Try checking if object is null.' }]
  },
  2: {
    id: 2, title: threads[1].title, author: 'bob', content: 'Loop issue...', createdAt: '2025-11-21',
    replies: []
  }
}

export async function fetchThreads() {
  await delay(200)
  return { data: threads }
}

export async function fetchThread(id) {
  await delay(150)
  return { data: posts[id] || null }
}

export async function createThread(payload) {
  await delay(150)
  const id = threads.length + 1
  const item = { id, title: payload.title, author: payload.author || 'you', replies: 0, lastActivity: 'just now' }
  threads.unshift(item)
  posts[id] = { id, title: payload.title, author: payload.author || 'you', content: payload.content, createdAt: new Date().toISOString(), replies: [] }
  return { data: posts[id] }
}

export async function postReply(threadId, reply) {
  await delay(100)
  const r = { id: Date.now(), author: reply.author || 'you', time: 'just now', content: reply.content }
  posts[threadId].replies.push(r)
  const thread = threads.find(t => t.id === Number(threadId))
  if (thread) thread.replies = posts[threadId].replies.length
  return { data: r }
}
