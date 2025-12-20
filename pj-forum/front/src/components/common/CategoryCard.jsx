import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  return (
    <Link 
      to={`/category/${category.id}`}
      className="forum-box p-4 hover:shadow-md hover:border-voz-blue transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="text-3xl">{category.icon || '📁'}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-voz-text mb-1">{category.name}</h3>
          <p className="text-xs text-voz-gray line-clamp-2">{category.description}</p>
        </div>
        <div className="text-voz-blue text-xl">→</div>
      </div>
    </Link>
  );
}
