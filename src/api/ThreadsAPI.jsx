import { useState, useEffect } from 'react';
import { fetchThreadsPosts, deleteThreadsPost, editThreadsPost } from '../api/threadsUtils';
import './ThreadsAPI.css';

const ThreadsPosts = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setIsLoading(true);
        try {
            const posts = await fetchThreadsPosts();
            setPosts(posts);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        try {
            await deleteThreadsPost(postId);
            setPosts(posts.filter(post => post.id !== postId));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = async (postId) => {
        try {
            await editThreadsPost(postId, editedContent);
            setPosts(posts.map(post => (post.id === postId ? { ...post, content: editedContent } : post)));
            setEditingPostId(null);
            setEditedContent('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="threads-posts">
            {isLoading ? (
                <div className="loader">Loading...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="posts-container">
                    {posts.map(post => (
                        <div key={post.id} className="post-card">
                            {editingPostId === post.id ? (
                                <div>
                                    <textarea
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                        placeholder="Edit your post..."
                                    />
                                    <button onClick={() => handleEdit(post.id)}>Save</button>
                                    <button onClick={() => setEditingPostId(null)}>Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    <p className="post-content">{post.content}</p>
                                    <button onClick={() => { setEditingPostId(post.id); setEditedContent(post.content); }}>Edit</button>
                                    <button onClick={() => handleDelete(post.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ThreadsPosts;