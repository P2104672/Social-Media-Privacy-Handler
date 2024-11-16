  import { useState, useEffect } from 'react';
  import './DashboardSocialMeida.css';
  import { getFacebookAccessToken } from '../api/facebookUtils';
  import { getInstagramAccessToken } from '../api/instagramUtils'; // Add this import
  import threadsUtils from '../api/threadsUtils'; // Import your Threads API utility
  import Sidebar from '../components/Sidebar';
  import Footer from '../components/Footer';
  // Group ID = 
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
        
        // Fetch personal posts
        let nextUrl = `https://graph.facebook.com/v21.0/me/feed?fields=id,permalink_url,from,message,created_time,attachments&access_token=${accessToken}`;
        while (nextUrl) {
          const response = await fetch(nextUrl);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Facebook API error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
          }
          const data = await response.json();
          posts = posts.concat(data.data.map(post => ({ ...post, source: 'personal' }))); // Mark as personal
          nextUrl = data.paging && data.paging.next ? data.paging.next : null;
        }
  
        // Fetch groups
        nextUrl = `https://graph.facebook.com/v21.0/me/groups?access_token=${accessToken}`;
        const groupsResponse = await fetch(nextUrl);
        if (!groupsResponse.ok) {
          const errorData = await groupsResponse.json();
          throw new Error(`Facebook API error fetching groups! status: ${groupsResponse.status}, message: ${JSON.stringify(errorData)}`);
        }
        const groupsData = await groupsResponse.json();
  
        // Fetch posts from each group
        for (const group of groupsData.data) {
          const groupPostsResponse = await fetch(`https://graph.facebook.com/v21.0/${group.id}/feed?fields=id,permalink_url,from,message,created_time,attachments&access_token=${accessToken}`);
          if (!groupPostsResponse.ok) {
            const errorData = await groupPostsResponse.json();
            console.error(`Error fetching posts from group ${group.id}:`, errorData);
            continue; // Skip this group on error
          }
          const groupPostsData = await groupPostsResponse.json();
          posts = posts.concat(groupPostsData.data.map(post => ({ ...post, source: 'group', groupId: group.id }))); // Mark as group
        }
  
        // Fetch comments for each post
        const postsWithComments = await Promise.all(posts.map(async post => {
          try {
            const commentsResponse = await fetch(`https://graph.facebook.com/v21.0/${post.id}/comments?access_token=${accessToken}`);
            if (!commentsResponse.ok) {
              const commentsErrorData = await commentsResponse.json();
              console.error(`Error fetching comments for post ${post.id}:`, commentsErrorData);
              return { ...post, comments: [] }; // Return post with no comments if error occurs
            }
            const commentsData = await commentsResponse.json();
            return { ...post, comments: commentsData.data || [] };
          } catch (commentError) {
            console.error(`Error fetching comments for post ${post.id}:`, commentError);
            return { ...post, comments: [] }; // Return post with no comments if error occurs
          }
        }));
  
        setDisplayedPosts(postsWithComments);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError({
          line1: "Application request limit reached.",
          line2: "Please wait patiently for 15 minutes! (ฅ'ω'ฅ)"
        });
        setDisplayedPosts([]);
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
        {isLoading && <div className="loader">Loading...</div>}
        {error && (
          <p className="error-message">
            {error.line1}<br />{error.line2}
          </p>
        )}
       {displayedPosts.length > 0 ? (
  displayedPosts.map(post => (
    <div key={post.id} className="image-card">
      <a href={post.permalink_url} target="_blank" rel="noopener noreferrer">
        {post.attachments && post.attachments.data.map(attachment => (
          <img key={attachment.media.id} src={attachment.media.image.src} alt="Post attachment"/>
        ))}
        <p className="image-caption">{post.message}</p>
        <p className="post-date">{formatDate(post.created_time)}</p>
      </a>
      {post.source === 'group' && <p className="post-source">Posted in Group</p>}
      <div className="comments-section">
        {post.comments && post.comments.length > 0 ? (
          post.comments.map(comment => (
            <div key={comment.id} className="comment">
              <strong>{comment.from.name}:</strong>
              <p>{comment.message}</p>
            </div>
          ))
        ) : (
          <p> </p>
        )}
      </div>
    </div>
  ))
) : (
  <p className="no-results">No posts found.</p>
)}
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
        const { accessToken } = await getInstagramAccessToken();
        // need the version of the API
        const url = `https://graph.instagram.com/v11.0/me/media?fields=id,caption,media_url,timestamp,permalink&access_token=${accessToken}`;
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
          {isLoading && <div className="loader">Loading...</div>}
          {error && <p className="error-message">{error}</p>}
          {posts.length > 0 ? (
  posts.map(post => (
    <div key={post.id} className="image-card">
      <a href={post.permalink} target="_blank" rel="noopener noreferrer">
        <img src={post.media_url} alt="Instagram" />
        <p className='image-caption'>{post.caption}</p>
        <p className="post-date">{formatDate(post.timestamp)}</p>
      </a>
    </div>
  ))
) : (
  <p className="no-results">No posts found.</p>
)}
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
              const url = `https://graph.threads.net/v1.0/me/threads?fields=id,media_product_type,media_type,media_url,permalink,owner,username,text,timestamp,permalink&access_token=${accessToken}`;
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
                      try {
                        const commentsUrl = `https://graph.threads.net/v1.0/${post.id}/replies?fields=id,media_product_type,media_type,media_url,permalink,username,text,timestamp,thumbnail_url,is_quote_post,has_replies,root_post,replied_to,is_reply,is_reply_owned_by_me,reply_audience&access_token=${accessToken}`;
                        const commentsResponse = await fetch(commentsUrl);
                          if (!commentsResponse.ok) {
                              throw new Error(`Failed to fetch comments for post ${post.id}`);
                          }
                          const commentsData = await commentsResponse.json();
                          return { ...post, comments: commentsData.data || [] };
                      } catch (commentError) {
                          console.error(commentError);
                          return { ...post, comments: [] }; // Return post with empty comments on error
                      }
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
                  {isLoading && <div className="loader">Loading...</div>}
                  {error && <p className="error-message">{error.line1}<br />{error.line2}</p>}
                  {posts.length > 0 ? (
                  posts.map(post => (
                    <div key={post.id} className="image-card">
                      <a href={post.permalink} target="_blank" rel="noopener noreferrer">
                        {post.media_url && <img src={post.media_url} alt="Threads" />}
                        <p className='image-caption'>{post.text}</p>
                        <p className="post-date">{formatDate(post.timestamp)}</p>
                      </a>
                      {post.comments.length > 0 && (
                        <div className="comments">
                          {post.comments.map(comment => (
                            <div key={comment.id} className="comment">
                              <span className="comment-username">{comment.username}:</span> {comment.text}
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
      );
  };
  

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