import express from 'express';
const app = express();

import { deleteFacebookPost } from './FacebookAPI.js';
import { deleteTweet } from './XTwitterAPI.js';
import { deleteInstagramPost } from './InstagramAPI.js';
import { deleteYouTubeVideo } from './YoutubeAPI.js';

app.use(express.json());

app.post('/delete-post', async (req, res) => {
    const { platform, postId } = req.body;
    
    // Switch for different platforms
    switch (platform) {
      case 'facebook':
        await deleteFacebookPost(postId);  // Add function in facebook.js
        break;
      case 'twitter':
        await deleteTweet(postId);  // Add function in twitter.js
        break;
      case 'instagram':
        await deleteInstagramPost(postId);  // Add function in instagram.js
        break;
      case 'youtube':
        await deleteYouTubeVideo(postId);  // Add function in youtube.js
        break;
      default:
        res.status(400).json({ message: 'Invalid platform' });
        return;
    }
    res.json({ message: 'Post deleted successfully' });
  });
