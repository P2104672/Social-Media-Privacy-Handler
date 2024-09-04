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

  const platforms = [
    { name: 'Facebook', icon: FaIcons.FaFacebook },
    { name: 'Twitter', icon: FaIcons.FaTwitter },
    { name: 'Instagram', icon: FaIcons.FaInstagram },
    { name: 'LinkedIn', icon: FaIcons.FaLinkedin },
  ];

  const handleSearch = (query) => {
    // Simulating a search request
    console.log(`Searching for: ${query} on platforms: ${selectedPlatforms.join(', ')}`);
    setKeywords(query.split(' '));
    // In a real application, you would make an API call here
    const mockResults = [
      { id: 1, title: 'First search result', content: 'This is the content of the first search result.' },
      { id: 2, title: 'Second search result', content: 'This is the content of the second search result.' },
      { id: 3, title: 'Third search result', content: 'This is the content of the third search result.' },
    ];
    setSearchResults(mockResults);
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
            {searchResults.map((result) => (
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