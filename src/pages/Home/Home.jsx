import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6">

      <h1 className="text-2xl font-semibold mb-4">Latest Threads</h1>

      <div className="space-y-4">

        {/* Example Thread Card */}
        <div className="p-4 border rounded-lg hover:bg-gray-50 transition">
          <Link to="/thread/1" className="text-lg font-medium text-blue-600">
            How do I solve this math problem?
          </Link>

          <p className="text-sm text-gray-600 mt-1">
            Posted by <strong>Alice</strong> • 5 replies
          </p>
        </div>

        {/* Example Thread Card */}
        <div className="p-4 border rounded-lg hover:bg-gray-50 transition">
          <Link to="/thread/2" className="text-lg font-medium text-blue-600">
            Need help with Java inheritance
          </Link>

          <p className="text-sm text-gray-600 mt-1">
            Posted by <strong>Bob</strong> • 12 replies
          </p>
        </div>

      </div>
    </div>
  );
}
