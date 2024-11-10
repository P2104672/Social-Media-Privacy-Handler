import { useState, useEffect } from 'react';
import './SearchPost.css';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { faThreads } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getFacebookAccessToken } from '../api/facebookUtils';
import { getInstagramAccessToken } from '../api/instagramUtils';
import threadsUtils from '../api/threadsUtils';
import axios from 'axios';

const SearchPost = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [specificDate, setSpecificDate] = useState('');
  const [specificMonth, setSpecificMonth] = useState('');

  const platforms = [
    { name: 'Facebook', icon: FaFacebookF },
    { name: 'Instagram', icon: FaInstagram },
    { name: 'Threads', icon: () => <FontAwesomeIcon icon={faThreads} /> },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [dateFilter, keywords, selectedPlatforms, specificDate, specificMonth, allPosts]);

  const fetchPosts = async () => {
    setIsLoading(true);
    let facebookPosts = [];
    let instagramPosts = [];
    let threadsPosts = [];

    try {
      const { accessToken } = await getFacebookAccessToken();
      let nextUrl = `https://graph.facebook.com/v20.0/me/feed?fields=id,message,permalink_url,created_time,attachments&access_token=${accessToken}`;

      // Fetch Facebook posts with pagination
      while (nextUrl) {
        const response = await fetch(nextUrl);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Facebook API error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        facebookPosts = facebookPosts.concat(data.data);
        nextUrl = data.paging && data.paging.next ? data.paging.next : null;
      }

      // Map Facebook posts to desired structure
      facebookPosts = await Promise.all(facebookPosts.map(async post => {
        const commentsResponse = await fetch(`https://graph.facebook.com/v20.0/${post.id}/comments?access_token=${accessToken}`);
        const commentsData = await commentsResponse.json();
        return {
          id: post.id,
          message: post.message,
          created_time: post.created_time,
          attachments: post.attachments,
          platform: 'Facebook',
          comments: commentsData.data || [],
          permalink: post.permalink_url
        };
      }));
    } catch (err) {
      console.error('Error fetching Facebook posts:', err);
      setError("Facebook limit reached. Please wait patiently for 15 minutes! (ฅ'ω'ฅ)");        
    }

    try {
      instagramPosts = await fetchInstagramPosts();
    } catch (err) {
      console.error('Error fetching Instagram posts:', err);
      setError(`Failed to fetch Instagram posts: ${err.message}`);
    }

    try {
      threadsPosts = await fetchThreadsPosts();
    } catch (err) {
      console.error('Error fetching Threads posts:', err);
      setError(`Failed to fetch Threads posts: ${err.message}`);
    }

    // Combine all posts
    const combinedPosts = [...facebookPosts, ...instagramPosts, ...threadsPosts];
    setAllPosts(combinedPosts);
    setDisplayedPosts(combinedPosts);
    setIsLoading(false);
  };

  const fetchInstagramPosts = async () => {
    const { accessToken } = await getInstagramAccessToken();
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp&access_token=${accessToken}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Instagram API error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.data.map(post => ({
      id: post.id,
      message: post.caption,
      created_time: post.timestamp,
      media_url: post.media_url,
      platform: 'Instagram',
      comments: [],
      permalink: post.permalink
    }));
  };

  const fetchThreadsPosts = async () => {
    const { accessToken } = await threadsUtils.getThreadsAccessToken();
    const url = `https://graph.threads.net/v1.0/me/threads?fields=id,text,timestamp,media_url,permalink&access_token=${accessToken}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Threads API error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.data.map(post => ({
      id: post.id,
      message: post.text,
      created_time: post.timestamp,
      media_url: post.media_url,
      platform: 'Threads',
      comments: [],
      permalink: post.permalink
    }));
  };

  const applyFilters = () => {
    const searchKeywords = keywords.toLowerCase().split(' ');
    const now = new Date();

    const filteredPosts = allPosts.filter(post => {
      const postDate = new Date(post.created_time);
      const matchesKeywords = searchKeywords.every(keyword =>
        post.message && post.message.toLowerCase().includes(keyword)
      );

      const matchesDate = (() => {
        switch (dateFilter) {
          case 'today':
            return postDate.toDateString() === now.toDateString();
          case 'thisWeek': {
            const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
            return postDate >= weekAgo;
          }
          case 'thisMonth':
            return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
          case 'specificDate': {
            const specificDateObj = new Date(specificDate);
            return postDate.toDateString() === specificDateObj.toDateString();
          }
          case 'specificMonth': {
            const monthDate = new Date(specificMonth);
            return postDate.getMonth() === monthDate.getMonth() && postDate.getFullYear() === monthDate.getFullYear();
          }
          default:
            return true;
        }
      })();

      const matchesPlatform = selectedPlatforms.length === 0 || selectedPlatforms.includes(post.platform);
      return matchesKeywords && matchesDate && matchesPlatform;
    });

    // Sort filtered posts by date (latest first)
    filteredPosts.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));
    setDisplayedPosts(filteredPosts);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const handleKeywordsChange = (event) => {
    setKeywords(event.target.value);
  };

  const handleSpecificDateChange = (event) => {
    setSpecificDate(event.target.value);
  };

  const handleSpecificMonthChange = (event) => {
    setSpecificMonth(event.target.value);
  };

  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const deletePost = async (postId) => {
    try {
      const { accessToken } = await getFacebookAccessToken();
      await axios.delete(`https://graph.facebook.com/v20.0/${postId}?access_token=${accessToken}`);
      setAllPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      setDisplayedPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      if (error.response && error.response.status === 403) {
        alert("You don't have permission to delete this post. This may be because the post is older than 90 days or you don't have the necessary app permissions.");
      } else {
        alert("An error occurred while trying to delete the post. Please try again later.");
      }
    }
  };

  const updatePost = async (postId, newMessage) => {
    try {
      const { accessToken } = await getFacebookAccessToken();
      await axios.post(`https://graph.facebook.com/v20.0/${postId}?message=${ encodeURIComponent(newMessage)}&access_token=${accessToken}`);
      setAllPosts(prevPosts => prevPosts.map(post => post.id === postId ? { ...post, message: newMessage } : post));
      setDisplayedPosts(prevPosts => prevPosts.map(post => post.id === postId ? { ...post, message: newMessage } : post));
    } catch (error) {
      console.error('Error updating post:', error);
      alert("An error occurred while trying to update the post. Please try again later.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date"; // Return a placeholder for invalid dates
    }

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="searchpost-container">
      <Sidebar />
      <div className="main-content">
        <h1 className="search-title">Search Posts</h1>
        <div className="search-controls">
          <input
            type="text"
            value={keywords}
            onChange={handleKeywordsChange}
            placeholder="Search posts..."
            className="search-input"
          />
          <select value={dateFilter} onChange={handleDateFilterChange} className="date-filter">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="specificDate">Specific Date</option>
            <option value="specificMonth">Specific Month</option>
          </select>
          {dateFilter === 'specificDate' && (
            <input
              type="date"
              value={specificDate}
              onChange={handleSpecificDateChange}
              className="specific-date-input"
            />
          )}
          {dateFilter === 'specificMonth' && (
            <input
              type="month"
              value={specificMonth}
              onChange={handleSpecificMonthChange}
              className="specific-month-input"
            />
          )}
        </div>
        <div className="platform-filters">
          {platforms.map(({ name, icon: Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => togglePlatform(name)}
              className={`platform-button ${selectedPlatforms.includes(name) ? 'selected' : ''}`}
            >
              <Icon />
              <span className="platform-name">{name}</span>
            </button>
          ))}
        </div>
        <br />
        <div className="search-results-container">
          {isLoading && <div className="loader">Loading...</div>}
          {error && <p className="error-message">{error}</p>}
          {displayedPosts.length > 0 ? (
            displayedPosts.map(post => (
              <div key={post.id} className="post-card">
                <p className='searchpost-platform'>{post.platform}</p>
                <a 
                  href={post.permalink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="post-link"
                >
                  <p className="post-message">{post.message || post.text}</p>
                  {post.platform === 'Facebook' && post.attachments && post.attachments.data && post.attachments.data.map(attachment => (
                    <img key={attachment.media.id} src={attachment.media.image.src} alt="Post attachment" className="post-image" />
                  ))}
                  {post.platform === 'Instagram' && post.media_url && (
                    <img src={post.media_url} alt="Post attachment" className="post-image" />
                  )}
                  {post.platform === 'Threads' && post.media_url && (
                    <img src={post.media_url} alt="Post attachment" className="post-image" />
                  )}
                </a>
                <p className="post-date">{formatDate(post.created_time)}</p>
                <button onClick={() => deletePost(post.id)} className="delete-button">Delete</button>
                <button onClick={() => {
                  const newMessage = prompt("Enter new message:", post.message || post.text);
                  if (newMessage) updatePost(post.id, newMessage);
                }} className="edit-button">Edit</button>
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
            <p className="no-results">No posts found. Try adjusting your search criteria.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPost;