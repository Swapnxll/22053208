"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

function TrendingPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/posts?type=popular`)
      .then((res) => {
        // Assuming the API returns an array of posts or an object with a posts array
        const fetchedPosts = Array.isArray(res.data)
          ? res.data
          : res.data.posts;
        // Take only the first 5 posts
        const topFivePosts = fetchedPosts.slice(0, 5);
        setPosts(topFivePosts);
      })
      .catch(() => {
        setError("Failed to fetch trending posts.");
        setPosts([]);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Trending Posts</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.length > 0
          ? posts.map((post) => (
              <div
                key={post.id}
                className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="mb-4">
                  <Image
                    src="/noImage.jpg"
                    alt={`Post ${post.id}`}
                    width={200}
                    height={200}
                    className="rounded w-full h-auto"
                  />
                </div>
                <div>
                  <p className="text-gray-800 font-semibold">
                    Post ID: {post.id}
                  </p>
                  <p className="text-gray-600 mt-2">{post.content}</p>
                  <p className="text-gray-500 mt-2">
                    Comments: {post.commentCount}
                  </p>
                </div>
              </div>
            ))
          : !error && <p>Loading trending posts...</p>}
      </div>
    </div>
  );
}

export default TrendingPosts;
