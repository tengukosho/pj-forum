export default function ReplyBox({ reply }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleString('vi-VN');
  };

  return (
    <div className="bg-white border-b border-voz-border p-4 last:border-b-0">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="avatar">
          {reply.author?.username?.[0]?.toUpperCase() || '?'}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-sm">{reply.author?.username || 'Anonymous'}</span>
            <span className="text-xs text-voz-gray">{formatDate(reply.createdAt)}</span>
            {reply.author?.role === 'ADMIN' && (
              <span className="badge badge-admin">ADMIN</span>
            )}
            {reply.author?.role === 'MODERATOR' && (
              <span className="badge badge-mod">MOD</span>
            )}
          </div>

          <div className="text-sm text-voz-text whitespace-pre-wrap break-words">
            {reply.content}
          </div>
        </div>
      </div>
    </div>
  );
}
