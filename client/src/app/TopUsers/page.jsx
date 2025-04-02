"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [topfiveusers, settopfiveusers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/users")
      .then((res) => {
        const users = res.data.users;
        const sortedTopFive = users;
        settopfiveusers(sortedTopFive);
      })
      .catch(() => {
        setError("Failed to fetch top 5 users.");
        settopfiveusers(null);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Top 5 Users</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topfiveusers && topfiveusers.length > 0
          ? topfiveusers.map((user) => (
              <div
                key={user.id}
                className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow flex items-center"
              >
                <div className="mr-4">
                  <Image
                    src="/profile.png"
                    alt={`${user.name}'s profile`}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-600">ID: {user.id}</p>
                  <p className="text-gray-600">Posts: {user.postCount}</p>
                </div>
              </div>
            ))
          : !error && <p>Loading users...</p>}
      </div>
    </div>
  );
}
