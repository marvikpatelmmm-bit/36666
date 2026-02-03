
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API endpoint to securely proxy requests to the Gemini API
app.post('/api/gemini', async (req, res) => {
  if (!process.env.API_KEY) {
    return res.status(500).json({ error: 'Server is not configured with an API key.' });
  }
  try {
    const { subject } = req.body;
    if (!subject) {
      return res.status(400).json({ error: 'Subject is required' });
    }

    const prompt = `Provide a concise, motivational, and actionable study tip for a student preparing for the JEE exam, focusing on the subject: ${subject}. The tip should be one or two sentences long.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
    });
    
    const text = response.text;

    res.json({ tip: text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to fetch study tip from Google AI.' });
  }
});


// Serve static files from the root directory
app.use(express.static(__dirname));

// For any other request, serve the index.html file to support client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
