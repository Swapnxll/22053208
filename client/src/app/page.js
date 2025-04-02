"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/posts?type=latest")
      .then((res) => {
        // Assuming the API returns { status: "success", data: [...] }
        const fetchedPosts = res.data.data;
        setPosts(fetchedPosts);
      })
      .catch((err) => {
        setError(`Failed to fetch posts: ${err.message}`);
        setPosts([]);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Latest Posts</h1>

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
                    src="/noImage.jpg" // Assuming you have this in /public
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
                </div>
              </div>
            ))
          : !error && <p>Loading posts...</p>}
      </div>
    </div>
  );
}
