"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import dummyData from "./dummyData.json"; // Adjust path as needed

export default function Home() {
  const [newPosts, setNewPosts] = useState([]);

  const fetchAndUpdatePosts = () => {
    // Using dummy data instead of API call
    const latestPosts = dummyData.posts;

    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    const newPostsArray = latestPosts.filter(
      (latestPost) =>
        !storedPosts.some((storedPost) => storedPost.id === latestPost.id)
    );

    if (newPostsArray.length > 0) {
      setNewPosts((prevPosts) => [...newPostsArray, ...prevPosts]);
      localStorage.setItem("posts", JSON.stringify(latestPosts));
    }
  };

  useEffect(() => {
    fetchAndUpdatePosts();
    const intervalId = setInterval(fetchAndUpdatePosts, 300000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-4 bg-slate-200 min-h-screen">
      <div className="flex space-x-4 mb-6">
        <Link href="/TopUsers">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Top Users
          </button>
        </Link>
        <Link href="/TrendingPosts">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Trending Posts
          </button>
        </Link>
      </div>

      {newPosts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">New Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-4 rounded-lg shadow-md border"
              >
                <div className="flex items-center mb-3">
                  <Image
                    src="/profile.png"
                    alt="User profile"
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <span className="font-semibold">{post.userName}</span>
                </div>
                <p className="text-gray-700">{post.postContent}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
