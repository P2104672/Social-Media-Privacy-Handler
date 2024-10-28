import { useState, useEffect } from 'react';
import threadsUtils from './threadsUtils';

function ThreadsAPI() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null); // Use accessToken to manage authentication

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        const { accessToken: token } = await threadsUtils.getThreadsAccessToken();
        setAccessToken(token); // Store the access token
        const postsData = await threadsUtils.fetchPosts(token);
        setPosts(postsData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error fetching posts data:', error);
      }
    };

    fetchPostsData();
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      await threadsUtils.deletePost(postId, accessToken);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEditPost = async (postId, newCaption) => {
    try {
      await threadsUtils.editPost(postId, newCaption, accessToken);
      setPosts(posts.map(post => post.id === postId ? { ...post, caption: newCaption } : post));
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  return (
    <div>
      {isLoggedIn && (
        <div>
          <h2>Threads Posts</h2>
          {posts.map(post => (
            <div key={post.id}>
              <p>{post.caption}</p>
              <img src={post.media_url} alt={post.caption} />
              <button onClick={() => handleDeletePost(post.id)}>Delete</button>
              <button onClick={() => {
                const newCaption = prompt('Enter new caption:', post.caption);
                if (newCaption) handleEditPost(post.id, newCaption);
              }}>Edit</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThreadsAPI;