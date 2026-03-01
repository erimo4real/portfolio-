import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiClient } from '../../../shared/http/apiClient';

const AdminDashboard = () => {
  const { admin } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/analytics/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Welcome, {admin?.name || 'Admin'}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Total Page Views</h3>
          <p className="text-3xl font-bold mt-2">{loading ? '...' : stats?.page_view || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Project Views</h3>
          <p className="text-3xl font-bold mt-2">
            {loading ? '...' : Object.values(stats?.project_view || {}).reduce((a, b) => a + b, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Blog Reads</h3>
          <p className="text-3xl font-bold mt-2">
            {loading ? '...' : Object.values(stats?.blog_read || {}).reduce((a, b) => a + b, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Resume Downloads</h3>
          <p className="text-3xl font-bold mt-2">{loading ? '...' : stats?.resume_download || 0}</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add New Project
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Write Blog Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
