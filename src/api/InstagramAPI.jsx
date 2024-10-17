import { useEffect, useState } from 'react';
import { getInstagramAccessToken } from './instagramUtils';
import './InstagramAPI.css';
export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keywords, setKeywords] = useState('');
  const [displayedImages, setDisplayedImages] = useState([]);
  const [dateFilter, setDateFilter] = useState('all'); // Added state for date filter
  const [specificDate, setSpecificDate] = useState(''); // State for specific date
  const [specificMonth, setSpecificMonth] = useState(''); // State for specific month

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        const { accessToken } = await getInstagramAccessToken();
        const url = `https://graph.instagram.com/me/media?fields=id,username,caption,media_url,timestamp&access_token=${accessToken}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const feed = await response.json();
        setImages(feed.data);
        setDisplayedImages(feed.data); // Initialize displayed images
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [keywords, images, dateFilter, specificDate, specificMonth]); // Reapply filters when keywords, images, or date filters change

  const applyFilters = () => {
    const searchKeywords = keywords.toLowerCase().split(' ').filter(k => k); // Split and filter out empty strings
    const filteredImages = images.filter(image => {
      const matchesKeywords = searchKeywords.every(keyword =>
        image.caption && image.caption.toLowerCase().includes(keyword)
      );

      const postDate = new Date(image.timestamp);
      const now = new Date();

      // Date filtering logic
      const matchesDate = (() => {
        switch (dateFilter) {
          case 'today':
            return postDate.toDateString() === now.toDateString();
          case 'thisMonth':
            return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
          case 'specificDate':
            return postDate.toDateString() === new Date(specificDate).toDateString();
          case 'specificMonth':
            return postDate.getMonth() === new Date(specificMonth).getMonth() && postDate.getFullYear() === new Date(specificMonth).getFullYear();
          default:
            return true; // 'all' or no filter
        }
      })();

      return matchesKeywords && matchesDate; // Combine keyword and date matches
    });
    setDisplayedImages(filteredImages);
  };

  const handleKeywordsChange = (event) => {
    setKeywords(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const handleSpecificDateChange = (event) => {
    setSpecificDate(event.target.value);
  };

  const handleSpecificMonthChange = (event) => {
    setSpecificMonth(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
    <div className="container">
      <h1 className="gallery-title">Instagram Posts</h1>
      <input
        type="text"
        value={keywords}
        onChange={handleKeywordsChange}
        placeholder="Search captions..."
        className="search-input"
      />
      <select value={dateFilter} onChange={handleDateFilterChange} className="date-filter">
        <option value="all">All Time</option>
        <option value="today">Today</option>
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
      <div className="gallery">
        {displayedImages.length > 0 ? (
          displayedImages.map(image => (
            <div key={image.id} className="image-card">
              <img src={image.media_url} alt={image.caption} />
              <p className="image-caption">{image.caption}</p>
              <p className="post-date">{formatDate(image.timestamp)}</p>
            </div>
          ))
        ) : (
          <p>No posts found matching your search criteria.</p>
        )}
      </div>
    </div>
  );
}