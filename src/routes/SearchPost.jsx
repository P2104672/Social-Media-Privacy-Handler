import { useState, useEffect } from 'react';
import './SearchPost.css';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { faThreads } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getFacebookAccessToken } from '../api/facebookUtils';
import { getInstagramAccessToken } from '../api/instagramUtils';
import threadsUtils from '../api/threadsUtils';

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
  const [sensitiveWarnings, setSensitiveWarnings] = useState([]); // State for sensitive content warnings
  const [snippets, setSnippets] = useState([]);
  const [notification, setNotification] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);


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

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const detectSensitiveContent = () => {
    setIsDetecting(true); // Set loading state to true
    const sensitiveKeywords = ['violence', 'hate', 'drugs', 'nudity', 'abuse', 'self-harm', 'suicide']; // Expanded keywords
    const warnings = [];
    const newSnippets = [];
    const maxLength = 50;
  
    // Regular expressions for detecting sensitive information
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const creditCardRegex = /\b(?:\d[ -]*?){13,16}\b/;
    const phoneRegex = /(?:\+?\d{1,3})?[-. (]?(\d{1,4})[-. )]?(\d{1,4})[-. ]?(\d{1,9})/; // Basic phone number regex
    const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/; // SSN format: XXX-XX-XXXX
    const urlRegex = /https?:\/\/[^\s]+/; // Basic URL regex
  

    const truncateText = (text, maxLength) => {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };
  
    displayedPosts.forEach(post => {
      const postContent = post.message || post.text || '';
      const detectedWords = [];
      
      // Check for sensitive keywords
      sensitiveKeywords.forEach(keyword => {
        if (postContent.toLowerCase().includes(keyword)) {
          detectedWords.push(keyword);
        }
      });
  
      // Check for email addresses
      if (emailRegex.test(postContent)) {
        detectedWords.push('email address');
      }
  
      // Check for credit card numbers
      if (creditCardRegex.test(postContent)) {
        detectedWords.push('credit card number');
      }
  
      // Check for phone numbers
      if (phoneRegex.test(postContent)) {
        detectedWords.push('phone number');
      }
  
      // Check for Social Security Numbers
      if (ssnRegex.test(postContent)) {
        detectedWords.push('Social Security number');
      }
  
      // Check for URLs
      if (urlRegex.test(postContent)) {
        detectedWords.push('URL');
      }
  
      // If any sensitive content is detected, create a warning and a snippet
      if (detectedWords.length > 0) {
        warnings.push({
          postId: post.id,
          words: detectedWords,
        });
  
        newSnippets.push({
          postId: post.id,
          snippet: truncateText(postContent, maxLength), // Shortened version
        });
      }
    });
  

    setSensitiveWarnings(warnings);
    setSnippets(newSnippets);
    setNotification('Sensitive content detection completed.');
    setIsDetecting(false);
  };  
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
          comments: commentsData .data || [],
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


  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
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
        <button onClick={detectSensitiveContent} className="detect-button">
        {isDetecting ? 'Detecting...' : 'Detect Sensitive Content'}
        </button>
      {notification && <div className="notification">{notification}</div>}
      
        {snippets.length > 0 ? (
          snippets.map(snippet => (
            <div key={snippet.postId} className="sensitive-snippet">
              <p>Snippet: {snippet.snippet}</p>
              <a href={`#post-${snippet.postId}`} className="view-post-link">View Full Post</a>
            </div>
          ))
        ) : (
          <p className="no-sensitive-posts"></p>
        )}

        <div className="search-results-container">
          {isLoading && <div className="loader">Loading...</div>}
          {error && <p className="error-message">{error}</p>}
          {displayedPosts.length > 0 ? (
            displayedPosts.map(post => (
              <div key={post.id} id={`post-${post.id}`} className="post-card">  {/* use # to nav the post with sensitive content */}
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
                  <p className="post-date">{formatDate(post.created_time)}</p>
                </a>
                {/* Display sensitive content warnings under the posts */}
                {sensitiveWarnings
                .filter(warning => warning.postId === post.id)
                .map(warning => (
                  <div key={warning.postId} className="sensitive-warning">
                    <p>Warning: Sensitive content detected - {warning.words.join(', ')}</p>
                  </div>
                  ))}
              </div>
            ))
   ) : (
            <p className="no-results">No posts found. Try adjusting your search criteria.</p>
          )}
        </div>
      </div>

      <button onClick={goToTop} className="go-to-top-button" aria-label="Go to top">
        <FontAwesomeIcon icon={faArrowUp}  className="fa-lg" />
      </button>
      <Footer />
    </div>
  );
}
export default SearchPost;