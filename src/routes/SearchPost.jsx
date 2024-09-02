import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import './SearchPost.css';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    // Simulating a search request
    console.log(`Searching for: ${query}`);
    // In a real application, you would make an API call here
    const mockResults = [
      { id: 1, title: 'First search result', content: 'This is the content of the first search result.' },
      { id: 2, title: 'Second search result', content: 'This is the content of the second search result.' },
      { id: 3, title: 'Third search result', content: 'This is the content of the third search result.' },
    ];
    setSearchResults(mockResults);
  };

  return (
    <div className="searchpost-container">
      <div className="search-page">
        <Sidebar />
        <div className="search-container">
          <h1 className="search-title">Search Posts</h1>
          <SearchBar onSearch={handleSearch} />
          <div className="search-results">
            {searchResults.map((result) => (
              <div key={result.id} className="search-result-item">
                <h2>{result.title}</h2>
                <p>{result.content}</p>
              </div>
            ))}
          </div>
        </div>
        
      </div>
      <Footer />
    </div>
  );
};

export default Search;