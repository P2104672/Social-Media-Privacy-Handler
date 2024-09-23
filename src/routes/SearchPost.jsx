import { useState, useEffect } from 'react';
import './SearchPost.css';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { FaFacebookF, FaInstagram, FaLinkedin, FaSearch } from 'react-icons/fa';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getFacebookAccessToken } from '../api/facebookUtils';
import {updatePost, deletePost } from '../api/FacebookLoginAPI';
const SearchPost = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');

  const platforms = [
    { name: 'Facebook', icon: FaFacebookF },
    { name: 'X', icon: () => <FontAwesomeIcon icon={faXTwitter} /> },
    { name: 'Instagram', icon: FaInstagram },
    { name: 'LinkedIn', icon: FaLinkedin },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { accessToken } = await getFacebookAccessToken();
      const fbResponse = await fetch(`https://graph.facebook.com/v20.0/me/posts?fields=id,message,created_time&access_token=${accessToken}`);
      if (!fbResponse.ok) {
        const errorData = await fbResponse.json();
        throw new Error(`Facebook API error! status: ${fbResponse.status}, message: ${JSON.stringify(errorData)}`);
      }
      const data = await fbResponse.json();
      setSearchResults(data.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(`Failed to fetch posts: ${err.message}`);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!keywords.trim()) {
      setError('Please enter some keywords to search.');
      return;
    }

    setError(null);
    setIsLoading(true);
    const searchKeywords = keywords.toLowerCase().split(' ');

    try {
      const { accessToken } = await getFacebookAccessToken();
      const fbResponse = await fetch(`https://graph.facebook.com/v20.0/me/posts?fields=id,message,created_time&access_token=${accessToken}&q=${encodeURIComponent(keywords)}`);
      if (!fbResponse.ok) {
        const errorData = await fbResponse.json();
        throw new Error(`Facebook API error! status: ${fbResponse.status}, message: ${JSON.stringify(errorData)}`);
      }
      const data = await fbResponse.json();
      
      const filteredResults = data.data.filter(post => 
        (selectedPlatforms.length === 0 || selectedPlatforms.includes('Facebook')) &&
        searchKeywords.some(keyword => 
          post.message && post.message.toLowerCase().includes(keyword)
        )
      );

      applyDateFilter(filteredResults);
    } catch (err) {
      console.error('Error searching posts:', err);
      setError(`Failed to search posts: ${err.message}`);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyDateFilter = (results) => {
    const now = new Date();
    const filteredResults = results.filter(post => {
      const postDate = new Date(post.created_time);
      switch (dateFilter) {
        case 'today':
          return postDate.toDateString() === now.toDateString();
        case 'thisWeek': {
          const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          return postDate >= weekAgo;
        }
        case 'thisMonth':
          return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
    setSearchResults(filteredResults);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
    applyDateFilter(searchResults);
  };

  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <div className="searchpost-container">
      <Sidebar />
      <div className="main-content">
        <h1 className="search-title">Search Posts</h1>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Search posts..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              <FaSearch />
            </button>
          </div>
          <div className="filter-container">
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
            <div className="date-filter-container">
              <select value={dateFilter} onChange={handleDateFilterChange} className="date-filter">
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
              </select>
            </div>
          </div>
        </form>
        {isLoading && <div className="loader">Loading...</div>}
        {error && <p className="error-message">{error}</p>}
        <div className="search-results-container">
          {searchResults.length > 0 ? (
            searchResults.map(post => (
              <div key={post.id} className="post-card">
                <p className="post-message">{post.message}</p>
                <p className="post-date">{new Date(post.created_time).toLocaleString()}</p>
                <div className="post-actions">
              <button className="post-button delete-button" onClick={() => deletePost(post.id)}>Delete</button>
              <button className="post-button edit-button" onClick={() => {
                const newMessage = prompt('Enter new message:', post.message);
                if (newMessage) updatePost(post.id, newMessage);
              }}>Edit</button>
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