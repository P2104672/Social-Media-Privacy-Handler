import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// No need to import or require these modules again, as they are already imported at the top of the file
import { process } from 'express';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

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
