import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI, threadsAPI } from '../../api';
import CategoryCard from '../../components/common/CategoryCard';
import ThreadRow from '../../components/thread/ThreadRow';
import Loading from '../../components/common/Loading';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [catRes, threadRes] = await Promise.all([
        categoriesAPI.getAll(),
        threadsAPI.getAll({ page: 0, size: 20 })
      ]);

      setCategories(catRes.data);
      setThreads(threadRes.data.content || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-50 text-red-600 p-4 rounded border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      
      {/* Categories */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-voz-text mb-4">📂 Danh mục diễn đàn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Latest Threads */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-voz-text">🔥 Bài viết mới nhất</h2>
          <Link to="/create-thread" className="btn btn-primary">
            ✏️ Tạo bài viết
          </Link>
        </div>

        <div className="thread-table overflow-hidden">
          {threads.length === 0 ? (
            <div className="text-center py-12 text-voz-gray">
              Chưa có bài viết. Hãy tạo bài đầu tiên!
            </div>
          ) : (
            threads.map(thread => (
              <ThreadRow key={thread.id} thread={thread} />
            ))
          )}
        </div>
      </section>

    </div>
  );
}
