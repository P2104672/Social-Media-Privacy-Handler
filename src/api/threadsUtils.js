// api/threadsUtils.js

// Example function to retrieve Threads access token
export const getThreadsAccessToken = async () => {
    // Retrieve the access token from local storage or another secure method
    const accessToken = localStorage.getItem('threads_access_token');

    if (!accessToken) {
        throw new Error('No access token found. Please authenticate.');
    }

    return { accessToken };
};

// Function to fetch posts from Threads
export const fetchThreadsPosts = async () => {
    const { accessToken } = await getThreadsAccessToken();
    const response = await fetch(`https://api.threads.net/v1/posts?access_token=${accessToken}`);

    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }

    const data = await response.json();
    return data.posts; // Assuming the response structure contains a 'posts' key
};

// Function to delete a post
export const deleteThreadsPost = async (postId) => {
    const { accessToken } = await getThreadsAccessToken();
    const response = await fetch(`https://api.threads.net/v1/posts/${postId}?access_token=${accessToken}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete post');
    }
};

// Function to edit a post
export const editThreadsPost = async (postId, updatedContent) => {
    const { accessToken } = await getThreadsAccessToken();
    const response = await fetch(`https://api.threads.net/v1/posts/${postId}?access_token=${accessToken}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: updatedContent }),
    });

    if (!response.ok) {
        throw new Error('Failed to edit post');
    }
};