import { useState, useEffect } from 'react';
import { 
  fetchConnectedAccounts, 
  connectSocialMedia,
  fetchFacebookPosts, 
  fetchInstagramPosts, 
  fetchXPosts,
  deletePost,
  editPost,
  createPost
} from '../api/SocialMediaApi';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import useGoogleAuth from '../components/useGoogleAuth';

function PostManagement() {
    const clientId = "544721700557-k663mu7847o4a1bctnuq5jh104qe982h.apps.googleusercontent.com";
    const { user, isLoading } = useGoogleAuth(clientId);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [newPostContent, setNewPostContent] = useState('');
    const [connectedAccounts, setConnectedAccounts] = useState([]);

    useEffect(() => {
        if (user) {
            loadConnectedAccounts(user.email);
            fetchAllPosts();
        }
    }, [user]);

    const loadConnectedAccounts = async (email) => {
        try {
            const accounts = await fetchConnectedAccounts(email);
            setConnectedAccounts(accounts);
        } catch (error) {
            console.error('Error fetching connected accounts:', error);
            setError('Failed to load connected accounts');
        }
    };

    const fetchAllPosts = async () => {
        try {
            const facebookPosts = await fetchFacebookPosts();
            const instagramPosts = await fetchInstagramPosts();
            const xPosts = await fetchXPosts();
            setPosts([...facebookPosts, ...instagramPosts, ...xPosts]);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to fetch posts');
        }
    };

    const handleConnectPlatform = async (platform) => {
        if (!user) return;
        try {
            await connectSocialMedia(user.email, platform);
            await loadConnectedAccounts(user.email);
        } catch (error) {
            console.error(`Error connecting to ${platform}:`, error);
            setError(`Failed to connect to ${platform}`);
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
                <textarea 
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
    );
}

export default PostManagement;
