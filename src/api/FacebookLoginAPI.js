import { process } from 'node:process';
export default function handler(req, res) {
  try {
    if (typeof process === 'undefined' || !process.env) {
      throw new Error('Environment variables are not available');
    }
    const accessToken = process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('Facebook access token not found');
    }
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
