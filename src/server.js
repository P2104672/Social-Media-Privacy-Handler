import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// No need to import or require these modules again, as they are already imported at the top of the file
import { process } from 'express';
import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { TwitterApi } from 'twitter-api-v2';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
// Initialize Passport for Twitter authentication
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_API_KEY,
  consumerSecret: process.env.TWITTER_API_SECRET_KEY,
  callbackURL: process.env.TWITTER_CALLBACK_URL,
}, (token, tokenSecret, profile, done) => {
  return done(null, { profile, token });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use(cors());
app.use(express.json());

app.get('/api/FacebookLoginAPI', (req, res) => {
  try {
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('Facebook access token not found');
    }
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});



// Twitter API client setup
const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

// Configure Passport for Twitter authentication
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_API_KEY,
  consumerSecret: process.env.TWITTER_API_SECRET_KEY,
  callbackURL: `${process.env.FRONTEND_URL}/auth/twitter/callback`,
}, (token, tokenSecret, profile, done) => {
  return done(null, { profile, token });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Twitter authentication route
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter callback route
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }), (req, res) => {
  const userId = req.user.profile.id; // Get the user ID
  res.redirect(`${process.env.FRONTEND_URL}/home?userId=${userId}`); // Redirect to the frontend
});

// Fetch user tweets
app.get('/api/twitter/tweets', async (req, res) => {
  const userId = req.query.userId;

  try {
    const tweets = await twitterClient.v2.userTimeline(userId, {
      max_results: 5, // Adjust as needed
    });
    res.json(tweets);
  } catch (error) {
    console.error('Error fetching tweets:', error);
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});