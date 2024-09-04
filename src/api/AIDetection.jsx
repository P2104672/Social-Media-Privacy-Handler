import axios from 'axios';

const sensitiveWords = [
  'offensive', 'inappropriate', 'vulgar', 'hate', 'discriminatory',
  // Add more sensitive words as needed
];

export const detectSensitiveContent = async (postUrl) => {
  try {
    // Fetch the post content from the provided URL
    const response = await axios.get(postUrl);
    const postContent = response.data.content; // Adjust this based on the actual API response structure

    // Convert post content to lowercase for case-insensitive matching
    const lowerCaseContent = postContent.toLowerCase();

    // Check for sensitive words
    const detectedWords = sensitiveWords.filter(word => 
      lowerCaseContent.includes(word.toLowerCase())
    );

    if (detectedWords.length > 0) {
      return {
        hasSensitiveContent: true,
        detectedWords: detectedWords
      };
    } else {
      return {
        hasSensitiveContent: false,
        detectedWords: []
      };
    }
  } catch (error) {
    console.error('Error detecting sensitive content:', error);
    return {
      error: 'Failed to analyze the post content'
    };
  }
};
