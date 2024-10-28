  import { useState, useEffect } from 'react';
  import './DashboardSocialMeida.css';
  import { getFacebookAccessToken } from '../api/facebookUtils';
  import { getInstagramAccessToken } from '../api/instagramUtils'; // Add this import
  import threadsUtils from '../api/threadsUtils'; // Import your Threads API utility
  import Sidebar from '../components/Sidebar';
  import Footer from '../components/Footer';

  // Component for Facebook posts
  const FacebookPosts = () => {
    const [displayedPosts, setDisplayedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetchPosts();
    }, []);

    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { accessToken } = await getFacebookAccessToken();
        let posts = [];
        let nextUrl = `https://graph.facebook.com/v20.0/me/feed?fields=id,message,created_time,attachments&access_token=${accessToken}`;

        // Fetch all posts with pagination
        while (nextUrl) {
          const response = await fetch(nextUrl);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Facebook API error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
          }

          const data = await response.json();
          posts = posts.concat(data.data);

          nextUrl = data.paging && data.paging.next ? data.paging.next : null;
        }

        // Fetch comments for each post
        const postsWithComments = await Promise.all(posts.map(async post => {
          const commentsResponse = await fetch(`https://graph.facebook.com/v20.0/${post.id}/comments?access_token=${accessToken}`);
          const commentsData = await commentsResponse.json();
          return { ...post, comments: commentsData.data || [] };
        }));

        setDisplayedPosts(postsWithComments);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError({
          line1: "Application request limit reached.",
          line2: "Please wait patiently for 15 minutes! (ฅ'ω'ฅ)"
      });        setDisplayedPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    const formatDate = (dateString) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(dateString));
    };

    return (
      <div className="facebook">
        <h1>Facebook</h1>
        <div className="search-results-container">
          {isLoading && <div className="loader">Loading...</div>}
          {error && (
            <p className="error-message">
                {error.line1}<br />{error.line2}
            </p>
        )}
          {displayedPosts.length > 0 ? (
            displayedPosts.map(post => (
              <div key={post.id} className="post-card">
                {post.attachments && post.attachments.data.map(attachment => (
                  <img key={attachment.media.id} src={attachment.media.image.src} alt="Post attachment" className="post-image" />
                ))}
                <p className="post-date">{formatDate(post.created_time)}</p>
                <p className="post-message">{post.message}</p>
                <div className="comments-section">
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map(comment => (
                      <div key={comment.id} className="comment">
                        <p>{comment.message}</p>
                      </div>
                    ))
                  ) : (
                    <p>No comments.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No posts found.</p>
          )}
        </div>
      </div>
    );
  };

  // Component for Instagram posts
  const InstagramPosts = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetchInstagramPosts();
    }, []);

    const fetchInstagramPosts = async () => {
      setIsLoading(true);
      try {
        const { accessToken } = await getInstagramAccessToken(); // Fetch Instagram access token
        const url = `https://graph.instagram.com/me/media?fields=id,caption ,media_url,timestamp&access_token=${accessToken}`;
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Instagram API error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        setPosts(data.data);
      } catch (err) {
        console.error('Error fetching Instagram posts:', err);
        setError(`Failed to fetch Instagram posts: ${err.message}`);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    const formatDate = (dateString) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(dateString));
    };
    
    return (
      <div className="instagram">
        <h1>Instagram</h1>
        <div className="posts-container">
          {isLoading && <div className="loader">Loading...</div>}
          {error && <p className="error-message">{error}</p>}
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="image-card">
                <img src={post.media_url} alt="Instagram" />
                <p className="post-date">{formatDate(post.timestamp)}</p>
                <p className='image-caption'>{post.caption}</p>

              </div>
            ))
          ) : (
            <p className="no-results">No posts found.</p>
          )}
        </div>
      </div>
    );
  };


  const ThreadsPosts = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      fetchThreadsPosts();
    }, []);
  
    const fetchThreadsPosts = async () => {
      setIsLoading(true);
      try {
          const { accessToken } = await threadsUtils.getThreadsAccessToken();
          const url = `https://graph.threads.net/v1.0/me/threads?fields=id,media_product_type,media_type,media_url,permalink,owner,username,text,timestamp&access_token=${accessToken}`;
          
          const response = await fetch(url);
  
          if (!response.ok) {
              const errorData = await response.json();
              if (response.status === 429) {
                  setError({
                      line1: "Application request limit reached.",
                      line2: "Please wait patiently for 15 minutes! (ฅ'ω'ฅ)"
                  });
              } else {
                  throw new Error(`Threads API error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
              }
              setPosts([]);
          } else {
              const data = await response.json();
              const postsWithComments = await Promise.all(data.data.map(async (post) => {
                  const commentsUrl = `https://graph.threads.net/v1.0/${post.id}/comments?access_token=${accessToken}`;
                  const commentsResponse = await fetch(commentsUrl);
                  const commentsData = await commentsResponse.json();
                  return { ...post, comments: commentsData.data || [] };
              }));
              setPosts(postsWithComments);
          }
  
      } catch (err) {
          setError({ line1: `Failed to fetch Threads posts:`, line2: err.message });
          setPosts([]);
      } finally {
          setIsLoading(false);
      }
  };
  
    const formatDate = (dateString) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(dateString));
    };
  
    return (
      <div className="threads">
          <h1>Threads</h1>
          <div className="posts-container">
              {isLoading && <div className="loader">Loading...</div>}
              {error && <p className="error-message">{error.line1}<br />{error.line2}</p>}
              {posts.length > 0 ? (
                  posts.map(post => (
                      <div key={post.id} className="image-card">
                          {post.media_url && <img src={post.media_url} alt="Threads" />}
                          <p className="post-date">{formatDate(post.timestamp)}</p>
                          <p className='image-caption'>{post.text}</p>
                          {post.comments.length > 0 && (
                              <div className="comments-section">
                                  <h4>Comments:</h4>
                                  {post.comments.map(comment => (
                                      <div key={comment.id} className="comment">
                                          <p><strong>{comment.username}:</strong> {comment.text}</p>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  ))
              ) : (
                  <p className="no-results">No posts found.</p>
              )}
          </div>
      </div>
    )}

  // Dashboard component containing all three sections
  const Dashboard = () => {
    return (
      <div className="searchpost-container">
        <Sidebar />
        <div className="dashboard">
          <FacebookPosts />
          <InstagramPosts />
          <ThreadsPosts />
        </div>
        <Footer />
      </div>
    );
  };

  export default Dashboard;