// backend/social-media-integrations/youtube.js
import { google } from 'googleapis';
const youtube = google.youtube('v3');

async function getYouTubeVideos(oauth2Client) {
  const response = await youtube.videos.list({
    auth: oauth2Client,
    part: 'snippet',
    mine: true
  });
  return response.data.items;
}

export { getYouTubeVideos };
