import { useState, useEffect } from 'react';
import threadsUtils from './threadsUtils';
import './ThreadsAPI.css'; // Import the CSS file

export default function Threads() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keywords, setKeywords] = useState('');
  const [images, setImages] = useState([]); // Assuming this is where your posts will go
  const [displayedImages, setDisplayedImages] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [specificDate, setSpecificDate] = useState('');
  const [specificMonth, setSpecificMonth] = useState('');

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
        setImages([]);
      } else {
        const data = await response.json();
        const postsWithComments = await Promise.all(data.data.map(async (post) => {
          try {
            // Construct the comments URL using the post ID
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
        
        setImages(postsWithComments); // Save posts to images for filtering
        setDisplayedImages(postsWithComments); // Initialize displayedImages
      }
    } catch (err) {
      setError({ line1: `Failed to fetch Threads posts:`, line2: err.message });
      setImages([]);
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

  useEffect(() => {
    applyFilters();
  }, [keywords, images, dateFilter, specificDate, specificMonth]); // Reapply filters when keywords, images, or date filters change

  const applyFilters = () => {
    const searchKeywords = keywords.toLowerCase().split(' ').filter(k => k); // Split and filter out empty strings
    const filteredImages = images.filter(image => {
      const matchesKeywords = searchKeywords.every(keyword =>
        image.text && image.text.toLowerCase().includes(keyword) // Changed to image.text
      );

      const postDate = new Date(image.timestamp);
      const now = new Date();

      // Date filtering logic
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
          case 'specificDate':
            return postDate.toDateString() === new Date(specificDate).toDateString();
          case 'specificMonth':
            return postDate.getMonth() === new Date(specificMonth).getMonth() && postDate.getFullYear() === new Date(specificMonth).getFullYear();
          default:
            return true; 
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.line1}<br />{error.line2}</div>;
  }

  return (
    <div className="Threads-container">
      <h1>Threads Posts</h1>
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
<div className="Threads-gallery">
  {isLoading && <div className="loader">Loading...</div>}
  {displayedImages.length > 0 ? (
    displayedImages.map(post => (
      <div key={post.id} className="Threads-image-card">
        <a href={post.permalink} target="_blank" rel="noopener noreferrer">
          {post.media_url && <img src={post.media_url} alt="Threads" />}
          <p className='image-caption'>{post.text}</p>
          <p className="post-date">{formatDate(post.timestamp)}</p>
        </a>
        {/* Display comments */}
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
    <p>No posts found.</p>
  )}
</div>
      </div>
  );
}