import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import './SearchPost.css';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import * as FaIcons from 'react-icons/fa';

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const platforms = [
    { name: 'Facebook', icon: FaIcons.FaFacebook },
    { name: 'X', icon: FaIcons.FaXTwitter },
    { name: 'Instagram', icon: FaIcons.FaInstagram },
    { name: 'LinkedIn', icon: FaIcons.FaLinkedin },
  ];

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setError('Please enter some keywords to search.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setKeywords(query.split(' '));

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Oops! Received non-JSON response from server");
      }

      const text = await response.text();
      const data = JSON.parse(text);
      setSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setError(`An error occurred while searching: ${err.message}`);
      if (err.message.includes("Unexpected token '<'")) {
        console.error('Received HTML instead of JSON. Response:', err.message);
      }
    } finally {
      setIsLoading(false);
    }
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
    let highlightedText = text;
    keywords.forEach(keyword => {
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
          <div className="platform-selection">
            {platforms.map(platform => (
              <button
                key={platform.name}
                className={`platform-button ${selectedPlatforms.includes(platform.name) ? 'selected' : ''}`}
                onClick={() => togglePlatform(platform.name)}
              >
                <platform.icon />
              </button>
            ))}
            <button className="select-all-button" onClick={selectAllPlatforms}>
              Select All
            </button>
          </div>
          <SearchBar onSearch={handleSearch} />
          <div className="search-results">
            {isLoading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && !error && searchResults.length === 0 && <p>No results found.</p>}
            {!isLoading && !error && searchResults.map((result) => (
              <div key={result.id} className="search-result-item">
                <h2>{highlightKeywords(result.title)}</h2>
                <p>{highlightKeywords(result.content)}</p>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Search;