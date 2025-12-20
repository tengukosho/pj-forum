import { Link } from 'react-router-dom';

export default function ThreadRow({ thread }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`thread-row ${thread.isPinned ? 'pinned' : ''} p-4`}>
      <div className="flex items-start gap-3">
        
        {/* Avatar */}
        <div className="avatar">
          {thread.author?.username?.[0]?.toUpperCase() || '?'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <Link 
              to={`/thread/${thread.id}`}
              className="font-semibold text-voz-text hover:text-voz-blue transition-colors"
            >
              {thread.isPinned && '📌 '}
              {thread.isLocked && '🔒 '}
              {thread.title}
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-voz-gray">
            <div className="flex items-center gap-2">
              <span className="font-medium">{thread.author?.username || 'Anonymous'}</span>
              {thread.author?.role === 'ADMIN' && (
                <span className="badge badge-admin">ADMIN</span>
              )}
              {thread.author?.role === 'MODERATOR' && (
                <span className="badge badge-mod">MOD</span>
              )}
            </div>
            <span>•</span>
            <span>{formatDate(thread.createdAt)}</span>
            <span>•</span>
            <span>💬 {thread.replyCount}</span>
            <span>•</span>
            {thread.categoryName && (
              <>
                <span>•</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                  {thread.categoryName}
                </span>
              </>
            )}
          </div>

          {/* Tags */}
          {thread.tags && thread.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {thread.tags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="hidden md:flex flex-col items-end text-xs text-voz-gray">
          <div className="font-semibold text-voz-blue text-base">{thread.replyCount}</div>
          <div>trả lời</div>
        </div>
      </div>
    </div>
  );
}
