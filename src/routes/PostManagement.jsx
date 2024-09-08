import { useState, useEffect, useCallback } from 'react';
import { 
  fetchConnectedAccounts, 
  connectSocialMedia,
  fetchFacebookPosts, 
//   fetchInstagramPosts, 
//   fetchXPosts,
  deletePost,
  editPost,
  createPost
} from '../api/SocialMediaApi';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import useGoogleAuth from '../components/useGoogleAuth';
import FacebookLoginAPI from '../api/FacebookLoginAPI'

function PostManagement() {
    const clientId = "544721700557-k663mu7847o4a1bctnuq5jh104qe982h.apps.googleusercontent.com"; //Google client ID
    const { user, isLoading } = useGoogleAuth(clientId);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [newPostContent, setNewPostContent] = useState('');
    const [connectedAccounts, setConnectedAccounts] = useState([]);
    const [facebookAccessToken, setFacebookAccessToken] = useState(null);
    const [isFBSDKLoaded, setIsFBSDKLoaded] = useState(false);

    const loadConnectedAccounts = useCallback(async () => {
        if (!user || !user.uid) {
            console.log('User not loaded yet');
            return;
        }
        try {
            const accounts = await fetchConnectedAccounts(user.uid);
            setConnectedAccounts(accounts);
        } catch (error) {
            console.error('Error fetching connected accounts:', error);
            setError('Failed to load connected accounts');
        }
    }, [user]);

    const fetchFacebookPostsData = useCallback(async () => {
        if (!facebookAccessToken || !isFBSDKLoaded) return;
        try {
            const facebookPosts = await fetchFacebookPosts(facebookAccessToken);
            console.log('Fetched Facebook posts:', facebookPosts);
            setPosts(prevPosts => [...prevPosts.filter(post => post.platform !== 'facebook'), ...facebookPosts]);
        } catch (error) {
            console.error('Error fetching Facebook posts:', error.message);
            setError(`Failed to fetch Facebook posts: ${error.message}`);
        }
    }, [facebookAccessToken, isFBSDKLoaded]);

    useEffect(() => {
        const checkFBSDK = setInterval(() => {
            if (window.FB) {
                setIsFBSDKLoaded(true);
                clearInterval(checkFBSDK);
            }
        }, 100);

        return () => clearInterval(checkFBSDK);
    }, []);

    useEffect(() => {
        if (user) {
            loadConnectedAccounts();
        } else {
            console.log("User not loaded yet");
        }
    }, [user, loadConnectedAccounts]);

    useEffect(() => {
        if (facebookAccessToken) {
            fetchFacebookPostsData();
        }
    }, [facebookAccessToken, fetchFacebookPostsData]);

    useEffect(() => {
      if (window.FB) {
        console.log('Facebook SDK is loaded and initialized');
      } else {
        console.error('Facebook SDK is not loaded');
      }
    }, []);

    const handleLoginSuccess = (loginData) => {
        console.log('Facebook login successful:', loginData);
        setFacebookAccessToken(loginData.accessToken);
    };

    const handleConnectPlatform = async (platform) => {
        if (!user) return;
        try {
            await connectSocialMedia(user.email, platform);
            await loadConnectedAccounts(user.email);
        } catch (error) {
            console.error(`Error connecting to ${platform}:`, error);
            setError(`Failed to connect to ${platform}`);
            
            if (platform === 'facebook') {
                // Provide Facebook Login to the user
                window.FB.login((response) => {
                    if (response.authResponse) {
                        console.log('Facebook login successful');
                    } else {
                        console.log('Facebook login failed');
                    }
                }, {scope: 'public_profile,email'});
            }
        }
    };

    const handleDeletePost = async (platform, postId) => {
        try {
            await deletePost(platform, postId);
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
            setError('Failed to delete post');
        }
    };

    const handleEditPost = async (platform, postId, newContent) => {
        try {
            await editPost(platform, postId, newContent);
            setPosts(posts.map(post => post.id === postId ? { ...post, content: newContent } : post));
            setEditingPost(null);
        } catch (error) {
            console.error('Error editing post:', error);
            setError('Failed to edit post');
        }
    };

    const handleCreatePost = async (platform) => {
        try {
            const newPost = await createPost(platform, newPostContent);
            setPosts([newPost, ...posts]);
            setNewPostContent('');
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Failed to create post');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <Sidebar />
            <h2>Welcome, {user?.name}!</h2>
            <p>Email: {user?.email}</p>
            <div className="profile-picture-placeholder">
                <i className="fas fa-user-circle"></i>
            </div>
            <FacebookLoginAPI onLoginSuccess={handleLoginSuccess} />
            
            {facebookAccessToken ? (
                <p>Facebook connected successfully!</p>
            ) : (
                <p>Please log in to Facebook to view and manage your posts.</p>
            )}

            {error && <div className="error-message">{error}</div>}

            <h1>Manage Your Posts</h1>
            
            {/* Add these buttons to connect platforms */}
            <div>
                <button onClick={() => handleConnectPlatform('facebook')}>Connect Facebook</button>
                <button onClick={() => handleConnectPlatform('instagram')}>Connect Instagram</button>
                <button onClick={() => handleConnectPlatform('x')}>Connect X</button>
            </div>

            {/* Display connected accounts */}
            <div>
                <h3>Connected Accounts:</h3>
                <ul>
                    {connectedAccounts.map(account => (
                        <li key={account.id}>{account.platform}</li>
                    ))}
                </ul>
            </div>

            <div>
                <div className="chat-like-textarea">
                    <textarea 
                    className="chat-textarea"
                    rows="4"
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        resize: 'vertical',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '14px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                    }}
                    value={newPostContent} 
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Write a new post..."
                />
                <button onClick={() => handleCreatePost('facebook')}>Post to Facebook</button>
                <button onClick={() => handleCreatePost('instagram')}>Post to Instagram</button>
                <button onClick={() => handleCreatePost('x')}>Post to X</button>
            </div>
            {posts.length === 0 ? (
                <p>No posts available.</p>
            ) : (
                <ul>
                    {posts.map((post) => (
                        <li key={`${post.platform}-${post.id}`}>
                            {editingPost === post.id ? (
                                <>
                                    <textarea 
                                        value={post.content} 
                                        onChange={(e) => setPosts(posts.map(p => p.id === post.id ? { ...p, content: e.target.value } : p))}
                                    />
                                    <button onClick={() => handleEditPost(post.platform, post.id, post.content)}>Save</button>
                                    <button onClick={() => setEditingPost(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    [{post.platform}] {post.content}
                                    <button onClick={() => setEditingPost(post.id)}>Edit</button>
                                    <button onClick={() => handleDeletePost(post.platform, post.id)}>Delete</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            <Footer/>
        </div>
        </div>
    );
}

export default PostManagement;
