import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// 기존 weather API
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({error: 'City is required'});

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=en`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({error: 'Failed to fetch weather'});
  }
});

// 🎯 YouTube 검색 프록시 API
app.get('/api/youtube', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({error: 'Query is required'});

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        q
      )}&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({error: 'Failed to fetch YouTube videos'});
  }
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
