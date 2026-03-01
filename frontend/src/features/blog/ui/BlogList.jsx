import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../application/blogSlice';
import BlogCard from './BlogCard';

const BlogList = () => {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector((state) => state.blog);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBlogs());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <div>Loading blog posts...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div className="blog-list-container py-8">
      <h2 className="text-3xl font-bold mb-8">Blog</h2>
      {posts.length === 0 ? (
        <p>No blog posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
