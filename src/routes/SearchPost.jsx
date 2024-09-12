import React, { useState, useEffect } from 'react';
import './SearchPost.css';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { FaFacebookF, FaInstagram, FaLinkedin, FaSearch } from 'react-icons/fa';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SearchPost = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');

  const platforms = [
    { name: 'Facebook', icon: FaFacebookF },
    { name: 'Twitter', icon: () => <FontAwesomeIcon icon={faXTwitter} /> },
    { name: 'Instagram', icon: FaInstagram },
    { name: 'LinkedIn', icon: FaLinkedin },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/FacebookLoginAPI');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const { accessToken } = await response.json();
        const fbResponse = await fetch(`https://graph.facebook.com/v20.0/me/posts?fields=id,message,created_time&access_token=${accessToken}`);
        if (!fbResponse.ok) {
          const errorData = await fbResponse.json();
          throw new Error(`Facebook API error! status: ${fbResponse.status}, message: ${JSON.stringify(errorData)}`);
        }
        const data = await fbResponse.json();
        setSearchResults(data.data);
      } else {
        // Handle non-JSON response
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error('Received non-JSON response from server');
      }
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
      const response = await fetch('/api/FacebookLoginAPI');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const { accessToken } = await response.json();
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
      } else {
        // Handle non-JSON response
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error('Received non-JSON response from server');
      }
    } catch (err) {
      console.error('Error searching posts:', err);
      setError(`Failed to search posts: ${err.message}`);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyDateFilter = (posts) => {
    const now = new Date();
    const filtered = posts.filter(post => {
      const postDate = new Date(post.created_time);
      switch (dateFilter) {
        case 'week':
          return now - postDate <= 7 * 24 * 60 * 60 * 1000;
        case 'month':
          return now - postDate <= 30 * 24 * 60 * 60 * 1000;
        case 'year':
          return now - postDate <= 365 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });
    setSearchResults(filtered);
  };

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    applyDateFilter(searchResults);
  };

  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const selectAllPlatforms = () => {
    setSelectedPlatforms(platforms.map(p => p.name));
  };

  const highlightKeywords = (text) => {
    if (!text) return '';
    let highlightedText = text;
    keywords.split(' ').forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      highlightedText = highlightedText.replace(regex, match => `<mark>${match}</mark>`);
    });
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  return (
    <div className="searchpost-container">
      <div className="search-page">
        <Sidebar />
        <div className="search-container">
          <h1 className="search-title">Search Posts</h1>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Enter keywords to search"
              className="search-input"
            />
            <button type="submit" className="search-button">
              <FaSearch />
            </button>
          </form>
          <div className="filter-bar">
            <div className="platform-selection">
              <div className="platform-buttons">
                {platforms.map(platform => (
                  <button
                    key={platform.name}
                    className={`platform-button ${selectedPlatforms.includes(platform.name) ? 'selected' : ''}`}
                    onClick={() => togglePlatform(platform.name)}
                    data-platform={platform.name}
                    title={platform.name}
                  >
                    {React.createElement(platform.icon)}
                  </button>
                ))}
              </div>
              <button className="select-all-button" onClick={selectAllPlatforms}>
                All Platforms
              </button>
            </div>
            <div className="date-filter">
              <select value={dateFilter} onChange={(e) => handleDateFilterChange(e.target.value)}>
                <option value="all">All time</option>
                <option value="week">Last week</option>
                <option value="month">Last month</option>
                <option value="year">Last year</option>
              </select>
            </div>
          </div>
          <div className="search-results">
            {isLoading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && !error && searchResults.length === 0 && <p>No results found.</p>}
            {!isLoading && !error && searchResults.map((post) => (
              <div key={post.id} className="search-result-item">
                <h2>{highlightKeywords(post.message)}</h2>
                <p>Date: {new Date(post.created_time).toLocaleDateString()}</p>
                <p>Platform: {post.platform}</p>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SearchPost;