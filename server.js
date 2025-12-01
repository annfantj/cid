// server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Proxy endpoint to your GPT-OSS-20B backend
app.post('/api/ask', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  try {
    // Forward request to Python GPT-OSS backend
    const response = await fetch('http://localhost:5000/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    const data = await response.json();
    if (data.answer) {
      res.json({ answer: data.answer });
    } else {
      res.status(500).json({ error: 'No response from GPT-OSS-20B backend' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to query AI backend' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AI server running on port ${PORT}`));
