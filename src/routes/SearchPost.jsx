import { useState, useEffect } from 'react';
import './SearchPost.css';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { faThreads } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import { getFacebookAccessToken } from '../api/facebookUtils';
import { getInstagramAccessToken } from '../api/instagramUtils';
import threadsUtils from '../api/threadsUtils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import CaptionEnhancer from '../components/CaptionEnhancer';
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
  const [sensitiveWarnings, setSensitiveWarnings] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [notification] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isAIDetecting, setIsAIDetecting] = useState(false);
  const [DetectionCompleted, setDetectionCompleted] = useState(false);
  const [AIDetectionCompleted, setAIDetectionCompleted] = useState(false);
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
  
  const SnippetComponent = () => {
    const [isVisible, setIsVisible] = useState(true); 

    const toggleVisibility = () => {
      setIsVisible(!isVisible); 
    };

    return (
      <div className="sensitive-snippet-container">
        <button onClick={toggleVisibility} className="toggle-button">
          {isVisible ? 'Hide Warnings' : 'Show Warnings'}
        </button>
        {isVisible && (
          <div className="snippets">
            {snippets.length > 0 ? (
              snippets.map(snippet => (
                <div key={snippet.postId} className="sensitive-snippet">
                  <p>Snippet: {snippet.snippet}</p>
                  <a href={`#post-${snippet.postId}`} className="view-post-link">View Full Post</a>
                </div>
              ))
            ) : (
              <p className="no-sensitive-posts">No sensitive posts available.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  
    const AIdetectSensitiveContent = async () => {
      setIsAIDetecting(true); 

      const warnings = [];
      const newSnippets = [];
      const maxLength = 50;

      const truncateText = (text, maxLength) => {
          return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
      };

      // Process each post for sensitive content using AI
      for (const post of displayedPosts) {
          const postContent = post.message || post.text || '';
        
          // Call the AI API to check for sensitive content
          try {
              const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                  model: "anthropic/claude-3-haiku",
                  messages: [
                      {
                        role: "user",
                        content: [
                          {
                            type: "text",
                            text: `Analyse the following content for sensitive topics and privacy risks. Identify any language or topics that may be harmful or inappropriate for social media audiences. If The content does not appear to contain any sensitive topics or privacy risks, skip to the next posts. '#FYP' is my project name, do not consider it as a sensitive topics. 20 words or less.: "${postContent}"`
                          }
                        ]
                      }
                  ]
              }, {
                headers: {
                  'HTTP-Referer': 'https://loaclhost:3000', 
                  'X-Title': 'Social Media Privacy Handler', 
                  'Content-Type': 'application/json'
              }
              });

              const aiResponse = response.data.choices[0].message.content;
              console.log('AI Response:', aiResponse); // Log the AI response

              // Check if the response contains the specific phrase
              if (aiResponse.includes("does not appear") || aiResponse.includes("does not contain ") || aiResponse.includes("without")) {
                  continue; // Skip to the next post if the phrase is found
              }

              // Process the AI response to extract warnings
              if (aiResponse) {
                  const detectedWords = aiResponse.split(',').map(word => word.trim());
                  if (detectedWords.length > 0) {
                      warnings.push({
                          postId: post.id,
                          words: detectedWords,
                      });
                      // Create a snippet without highlighting
                      newSnippets.push({
                          postId: post.id,
                          snippet: truncateText(postContent, maxLength), // Shortened version without highlighting
                      });
                  }
              }
          } catch (error) {
              console.error('Error detecting sensitive content from OpenAI API:', error);
          }
      }

      console.log('Final Warnings:', warnings); // Log final warnings
      console.log('Final Snippets:', newSnippets); // Log final snippets

      setSensitiveWarnings(warnings);
      setSnippets(newSnippets);
      
      // Show a pop-up message with the completion notification
      alert('AI Sensitive content detection completed.');

      setIsAIDetecting(false);
      setAIDetectionCompleted(true);
  };

    const detectSensitiveContent = async () => {
      setIsDetecting(true); // Set loading state to true

      const sensitiveKeywords = ['violence', 'hate', 'drugs', 'nudity', 'abuse', 'self-harm', 'suicide', 
                                'address','住址','身份證','password','密碼','電話','phone number']; // Expanded keywords
      const warnings = [];
      const newSnippets = [];
      const maxLength = 50;

      // Regular expressions for detecting sensitive information
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
      const creditCardRegex = /\b(?:\d[ -]*?){13,16}\b/;
      const phoneRegex = /^6\d{7}$/;
      const urlRegex = /https?:\/\/[^\s]+/; // Basic URL regex

      const truncateText = (text, maxLength) => {
          return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
      };

      // Process each post for sensitive keywords and API detection
      for (const post of displayedPosts) {
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

              // Create a snippet without highlighting
              newSnippets.push({
                  postId: post.id,
                  snippet: truncateText(postContent, maxLength),
              });
          }

          // Call the Hugging Face API to check for negative sentiment
          try {
              const response = await query({ "inputs": postContent }); // Call the Hugging Face function
              console.log('Hugging Face API Response:', response); // Log the API response

              // Assuming the response format is an array of objects with label and score
              const { label, score } = response[0]; // Adjust based on your actual response structure
              if (label == '1 star' && score == 0.4831047058105469) { // Check for negative label and score
                  warnings.push({
                      postId: post.id,
                      words: ['This post may convey negative emotions.'],
                  });
                  newSnippets.push({
                      postId: post.id,
                      snippet: truncateText(postContent, maxLength),
                  });
              }
          } catch (error) {
              console.error('Error detecting sensitive content from Hugging Face API:', error);
          }
      }

      console.log('Final Warnings:', warnings); // Log final warnings
      console.log('Final Snippets:', newSnippets); // Log final snippets

      setSensitiveWarnings(warnings);
      setSnippets(newSnippets);
      
      // Show a pop-up message with the completion notification
      alert('Sensitive content detection completed.');

      setIsDetecting(false);
      setDetectionCompleted(true);
  };

// Hugging Face query function
async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment",
        {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
}

const exportSensitivePostsReport = () => {
  const doc = new jsPDF();

  const columns = [
    { header: 'Platform', dataKey: 'platform' },
    { header: 'Message', dataKey: 'message' },
    { header: 'Warnings', dataKey: 'detected_warnings' },
  ];

  const reportData = sensitiveWarnings.map(warning => {
    const post = displayedPosts.find(post => post.id === warning.postId);
    return {
      platform: post.platform,
      message: post.message || post.text,
      detected_warnings: warning.words.join(', ')
    };
  });

  doc.setFontSize(12);
  doc.text('Sensitive Posts Report', 14, 22);
  doc.autoTable(columns, reportData, { startY: 30 });

  const saveReport = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const filename = `sensitive_posts_report_${formattedDate}.pdf`;
    doc.save(filename);
    alert(`Report saved as: ${filename}`);
  };

  // Show toast notification
    


  saveReport();
};

const exportAISensitivePostsReport = () => {
  const doc = new jsPDF();

  const columns = [
    { header: 'Platform', dataKey: 'platform' },
    { header: 'Message', dataKey: 'message' },
    { header: 'Warnings', dataKey: 'detected_warnings' },
  ];

  const reportData = sensitiveWarnings.map(warning => {
    const post = displayedPosts.find(post => post.id === warning.postId);
    return {
      platform: post.platform,
      message: post.message || post.text,
      detected_warnings: warning.words.join(', ')
    };
  });

  doc.setFontSize(12);
  doc.text('Sensitive Posts Report', 14, 22);
  doc.autoTable(columns, reportData, { startY: 30 });

  const saveReport = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const filename = `AI_sensitive_posts_report_${formattedDate}.pdf`;
    doc.save(filename);
    alert(`Report saved as: ${filename}`);
  };

  saveReport();
};




  const fetchPosts = async () => {
    setIsLoading(true);
    let facebookPosts = [];
    let instagramPosts = [];
    let threadsPosts = [];

    try {
      const { accessToken } = await getFacebookAccessToken();
      let nextUrl = `https://graph.facebook.com/v20.0/me/feed?fields=id,message,permalink_url,created_time,attachments&access_token=${accessToken}`;

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
      throw new Error(`Threads API error! status: ${response.status }, message: ${JSON.stringify(errorData)}`);
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

  const getPlatformColor = (platform) => {
    switch (platform) {
        case 'Facebook':
            return '#3b5998'; // Facebook color
        case 'Instagram':
            return '#C13584'; // Instagram color
        case 'Threads':
            return '#262626'; // Threads color (dark gray)
        default:
            return '#ffffff'; // Default color (white)
    }
};

  return (
    <div className="searchpost-container">
      <Sidebar />
      <CaptionEnhancer/>
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
              <span className="platform -name">{name}</span>
            </button>
          ))}
        </div>
        <br />
        <button onClick={detectSensitiveContent} className="detect-button">
          {isDetecting ? 'Detecting...' : 'Detect Sensitive Content'}
        </button>
        { !isDetecting && DetectionCompleted && snippets.length > 0 && (
          <button onClick={exportSensitivePostsReport} className="export-button" title="Export Sensitive Posts Report">
            <FontAwesomeIcon icon={faFileExport} />
          </button>
        )}
        {notification && <div className="notification">{notification}</div>}
        
        <SnippetComponent />

        <button onClick={AIdetectSensitiveContent} className="detect-button">
          {isAIDetecting ? 'AI is Detecting...' : 'AI Detect Sensitive Content'}
        </button>
        { !isAIDetecting && AIDetectionCompleted && snippets.length > 0 && (
            <button onClick={exportAISensitivePostsReport} className="export-button" title="Export AI Sensitive Posts Report">
                <FontAwesomeIcon icon={faFileExport} />
            </button>
        )}
        {notification && <div className="notification">{notification}</div>}
        
        <SnippetComponent />

        <br />
        <div className="search-results-container">
          {isLoading && <div className="loader">Loading...</div>}
          {error && <p className="error-message">{error}</p>}
          {displayedPosts.length > 0 ? (
            displayedPosts.map(post => (
              <div key={post.id} id={`post-${post.id}`} className="post-card">
                <p 
                  className='searchpost-platform' 
                  style={{ backgroundColor: getPlatformColor(post.platform), color: 'white', padding: '5px', borderRadius: '5px' }} // Apply styles here
                >
            {post.platform}
        </p> 
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
                {sensitiveWarnings
                  .filter(warning => warning.postId === post.id)
                  .map(warning => (
                    <div key={warning.postId} className="sensitive-warning">
                      <p>Warning!! Sensitive content detected:  {warning.words.join(', ')}</p>
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
        <FontAwesomeIcon icon={faArrowUp} className="fa-lg" />
      </button>

      <Footer />
    </div>
  );
}

export default SearchPost;