const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));

app.get("/users", async (req, res) => {
  // Add your Bearer token here
  const bearerToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjA0NDQ1LCJpYXQiOjE3NDM2MDQxNDUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQ0MjEyYmYxLTk5ZDgtNGJlOC04YTRjLTM0ZjQzY2RhMDUxYyIsInN1YiI6IjIyMDUzMjA4QGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1MzIwOEBraWl0LmFjLmluIiwibmFtZSI6InN3YXBuaWwgc2luaGEiLCJyb2xsTm8iOiIyMjA1MzIwOCIsImFjY2Vzc0NvZGUiOiJud3B3cloiLCJjbGllbnRJRCI6IjQ0MjEyYmYxLTk5ZDgtNGJlOC04YTRjLTM0ZjQzY2RhMDUxYyIsImNsaWVudFNlY3JldCI6ImNmZ0NQdGJCSGJnZXBkQUMifQ.Q63St4yRNIZkqszdGCYmDLvHMkKZD3ZbLMVTmmYMiZ8"; // Replace with your real token

  try {
    // Fetch users data with authentication headers
    const usersResponse = await fetch(
      "http://20.244.56.144/evaluation-service/users",
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const usersData = await usersResponse.json();

    if (!usersResponse.ok) {
      return res.status(usersResponse.status).json({
        error: `Failed to fetch users: ${usersResponse.statusText}`,
      });
    }

    if (!usersData || !usersData.users) {
      return res.status(500).json({ error: "Invalid users data format" });
    }

    const userPostCounts = [];
    // Iterate through each user
    for (const userId in usersData.users) {
      // Fetch posts for each user with authentication headers
      const postsResponse = await fetch(
        `http://20.244.56.144/evaluation-service/users/${userId}/posts`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const postsData = await postsResponse.json();

      if (!postsResponse.ok) {
        console.error(
          `Failed to fetch posts for user ${userId}: ${postsResponse.statusText}`
        );
        continue; // Skip this user if posts fetch fails
      }

      if (postsData && postsData.posts) {
        userPostCounts.push({
          id: userId,
          name: usersData.users[userId],
          postCount: postsData.posts.length,
        });
      }
    }

    // Sort by post count in descending order and return top 5
    userPostCounts.sort((a, b) => b.postCount - a.postCount);
    res.json(userPostCounts.slice(0, 5));
  } catch (error) {
    console.error("Error in /users route:", error);
    res.status(500).json({
      error: "An error occurred while fetching data: " + error.message,
    });
  }
});

app.get("/posts", async (req, res) => {
  const { type } = req.query;
  const usersData = await fetchData("users");
  if (!usersData || !usersData.users)
    return res.status(500).json({ error: "Failed to fetch users." });

  let allPosts = [];
  for (const userId in usersData.users) {
    const postsData = await fetchData(`users/${userId}/posts`);
    if (postsData && postsData.posts) {
      allPosts = allPosts.concat(postsData.posts);
    }
  }

  if (type === "popular") {
    let postCommentCounts = [];
    for (const post of allPosts) {
      const commentsData = await fetchData(`posts/${post.id}/comments`);
      const commentCount =
        commentsData && commentsData.comments
          ? commentsData.comments.length
          : 0;
      postCommentCounts.push({ ...post, commentCount });
    }

    const maxComments = Math.max(
      ...postCommentCounts.map((p) => p.commentCount)
    );
    res.json(postCommentCounts.filter((p) => p.commentCount === maxComments));
  } else if (type === "latest") {
    allPosts.sort((a, b) => b.id - a.id); // Higher ID = newer post
    res.json(allPosts.slice(0, 5));
  } else {
    res
      .status(400)
      .json({ error: "Invalid type parameter. Use 'latest' or 'popular'." });
  }
});

app.get("/users/:userid/posts", async (req, res) => {
  const { userid } = req.params;
  const userPosts = await fetchData(`users/${userid}/posts`);
  res.json(userPosts?.posts || []);
});

app.get("/posts/:postid/comments", async (req, res) => {
  const { postid } = req.params;
  const postComments = await fetchData(`posts/${postid}/comments`);
  res.json(postComments?.comments || []);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
