import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoriesAPI, threadsAPI } from '../../api';
import ThreadRow from '../../components/thread/ThreadRow';
import Loading from '../../components/common/Loading';

export default function Category() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [catRes, threadsRes] = await Promise.all([
        categoriesAPI.getById(id),
        threadsAPI.getAll({ categoryId: id, page: 0, size: 50 })
      ]);
      setCategory(catRes.data);
      setThreads(threadsRes.data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!category) return <div className="container mx-auto px-4 py-6">Không tìm thấy danh mục</div>;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="text-sm text-voz-gray mb-4">
        <Link to="/" className="hover:text-voz-blue">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span>{category.name}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{category.icon || '📁'}</span>
            <h1 className="text-2xl font-bold">{category.name}</h1>
          </div>
          <p className="text-voz-gray">{category.description}</p>
        </div>
        <Link to="/create-thread" className="btn btn-primary">✏️ Tạo bài viết</Link>
      </div>

      <div className="thread-table">
        {threads.length === 0 ? (
          <div className="text-center py-12 text-voz-gray">
            Chưa có bài viết trong danh mục này
          </div>
        ) : (
          threads.map(thread => <ThreadRow key={thread.id} thread={thread} />)
        )}
      </div>
    </div>
  );
}
