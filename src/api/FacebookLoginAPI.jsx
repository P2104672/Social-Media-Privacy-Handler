

import { useState } from 'react';
import FacebookLogin from '@greatsumini/react-facebook-login';
import axios from 'axios';

function FacebookLoginAPI() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);

  const responseFacebook = async (response) => {
    console.log(response);
    setIsLoggedIn(true);
    setUserData(response);
    await fetchPosts(response.accessToken);
  };

  const fetchPosts = async (token) => {
    try {
      const response = await axios.get(`https://graph.facebook.com/v12.0/me/posts?fields=id,message&access_token=${token}`);
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`https://graph.facebook.com/v12.0/${postId}?access_token=${userData.accessToken}`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const updatePost = async (postId, newMessage) => {
    try {
      await axios.post(`https://graph.facebook.com/v12.0/${postId}?message=${encodeURIComponent(newMessage)}&access_token=${userData.accessToken}`);
      setPosts(posts.map(post => post.id === postId ? {...post, message: newMessage} : post));
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <FacebookLogin
        appId="1050996050019664"
        onSuccess={responseFacebook}
        onFail={(error) => {
          console.log('Login Failed!', error);
        }}
        onProfileSuccess={(response) => {
          console.log('Get Profile Success!', response);
        }}
      />
    );
  }

  return (
    <div>
      <h2>Welcome {userData.name}</h2>
      <img src={userData.picture.data.url} alt={userData.name} />
      <h3>Your Posts:</h3>
      {posts.map(post => (
        <div key={post.id}>
          <p>{post.message}</p>
          <button onClick={() => deletePost(post.id)}>Delete</button>
          <button onClick={() => {
            const newMessage = prompt('Enter new message:', post.message);
            if (newMessage) updatePost(post.id, newMessage);
          }}>Edit</button>
        </div>
      ))}
    </div>
  );
};

export default FacebookLoginAPI;