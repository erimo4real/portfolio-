import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ post }) => {
  return (
    <div className="blog-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {post.coverImage && (
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">
          <Link to={`/blog/${post.slug}`} className="hover:text-blue-600">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <div className="flex gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="bg-gray-100 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
