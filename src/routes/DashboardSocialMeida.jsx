//src\routes\DashboardSocialMeida.jsx
// File: src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import './DashboardSocialMeida.css';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
// Component for Facebook posts
const FacebookPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from Facebook API (placeholder function)
    fetchFacebookPosts().then(data => setPosts(data));
  }, []);

  const fetchFacebookPosts = async () => {
    // Mock data for demonstration. Replace this with actual API call.
    return [
      { id: 1, content: "Facebook Post 1", likes: 20 },
      { id: 2, content: "Facebook Post 2", likes: 45 },
      { id: 3, content: "Facebook Post 3", likes: 75 },
    ];
  };

  return (
    <div className="facebook">
      <h2>Facebook</h2>
      <div className="posts-container">
        {posts.map(post => (
          <div key={post.id} className="facebook-post">
            <p>{post.content}</p>
            <span>👍 {post.likes} likes</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component for Instagram posts
const InstagramPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from Instagram API (placeholder function)
    fetchInstagramPosts().then(data => setPosts(data));
  }, []);

  const fetchInstagramPosts = async () => {
    // Mock data for demonstration. Replace this with actual API call.
    return [
      { id: 1, image: "https://via.placeholder.com/150", caption: "Instagram Post 1", likes: 120 },
      { id: 2, image: "https://via.placeholder.com/150", caption: "Instagram Post 2", likes: 200 },
      { id: 3, image: "https://via.placeholder.com/150", caption: "Instagram Post 3", likes: 320 },
    ];
  };

  return (
    <div className="instagram">
      <h2>Instagram</h2>
      <div className="posts-container">
        {posts.map(post => (
          <div key={post.id} className="instagram-post">
            <img src={post.image} alt="Instagram" />
            <p>{post.caption}</p>
            <span>❤️ {post.likes} likes</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component for X (Twitter) posts
const XPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from X API (placeholder function)
    fetchXPosts().then(data => setPosts(data));
  }, []);

  const fetchXPosts = async () => {
    // Mock data for demonstration. Replace this with actual API call.
    return [
      { id: 1, content: "Tweet 1", retweets: 5, likes: 30 },
      { id: 2, content: "Tweet 2", retweets: 12, likes: 50 },
      { id: 3, content: "Tweet 3", retweets: 15, likes: 80 },
    ];
  };

  return (
    <div className="x">
      <h2>X</h2>
      <div className="posts-container">
        {posts.map(post => (
          <div key={post.id} className="x-post">
            <p>{post.content}</p>
            <span>🔁 {post.retweets} retweets</span>
            <span>❤️ {post.likes} likes</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Dashboard component containing all three sections
const Dashboard = () => {
  return (
    <div className="searchpost-container">
            <Sidebar/>
        <div className="dashboard">

            <FacebookPosts />
            <InstagramPosts />
            <XPosts />
        </div>
        <Footer />
    </div>
  );
};

export default Dashboard;
