// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import './TwitterPosts.css';
// const TwitterPosts = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [searchKeyword, setSearchKeyword] = useState('');
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);

//   const fetchPosts = async () => {
//     setIsLoading(true);
//     try {
//       // Replace with your own API endpoint
//       const response = await axios.get('/api/twitter/posts');
//       setPosts(response.data);
//       setFilteredPosts(response.data);
//     } catch (err) {
//       console.error('Error fetching posts:', err);
//       setError('Failed to fetch posts');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeletePost = async (postId) => {
//     try {
//       await axios.delete(`/api/twitter/posts/${postId}`);
//       fetchPosts(); // Refresh posts after deletion
//     } catch (err) {
//       console.error('Error deleting post:', err);
//       setError('Failed to delete post');
//     }
//   };

//   const handleEditPost = async (postId, newMessage) => {
//     try {
//       await axios.put(`/api/twitter/posts/${postId}`, { message: newMessage });
//       fetchPosts(); // Refresh posts after editing
//     } catch (err) {
//       console.error('Error editing post:', err);
//       setError('Failed to edit post');
//     }
//   };

//   const handleSearch = () => {
//     let filtered = posts;

//     // Filter by keyword
//     if (searchKeyword) {
//       filtered = filtered.filter(post => post.message.toLowerCase().includes(searchKeyword.toLowerCase()));
//     }

//     // Filter by date range
//     if (startDate) {
//       filtered = filtered.filter(post => new Date(post.created_at) >= startDate);
//     }
//     if (endDate) {
//       filtered = filtered.filter(post => new Date(post.created_at) <= endDate);
//     }

//     setFilteredPosts(filtered);
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   useEffect(() => {
//     handleSearch();
//   }, [searchKeyword, startDate, endDate, posts]);

//   return (
//     <div className="twitter-posts-container">
//       <h1>Your Twitter Posts</h1>
//       {isLoading && <div className="loader">Loading...</div>}
//       {error && <p className="error-message">{error}</p>}
      
//       <div className="search-filters">
//         <input
//           type="text"
//           placeholder="Search by keyword..."
//           value={searchKeyword}
//           onChange={(e) => setSearchKeyword(e.target.value)}
//         />
//         <DatePicker
//           selected={startDate}
//           onChange={(date) => setStartDate(date)}
//           placeholderText="Start Date"
//         />
//         <DatePicker
//           selected={endDate}
//           onChange={(date) => setEndDate(date)}
//           placeholderText="End Date"
//         />
//       </div>

//       {filteredPosts.length > 0 ? (
//         filteredPosts.map(post => (
//           <div key={post.id} className="post-card">
//             <p className="post-message">{post.message}</p>
//             {post.media && post.media.map(media => (
//               <img key={media.id} src={media.url} alt="Post media" className="post-image" />
//             ))}
//             <p className="post-date">{new Date(post.created_at).toLocaleString()}</p>
//             <button onClick={() => handleDeletePost(post.id)} className="delete-button">Delete</button>
//             <button onClick={() => {
//               const newMessage = prompt("Enter new message:", post.message);
//               if (newMessage) handleEditPost(post.id, newMessage);
//             }} className="edit-button">Edit</button>
//           </div>
//         ))
//       ) : (
//         <p className="no-results">No posts found. Try adjusting your search criteria.</p>
//       )}
//     </div>
//   );
// };

// export default TwitterPosts;