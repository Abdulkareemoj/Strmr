import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { Video } from '../../models/video'; // Import your video model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;

  if (!q) {
    res.status(400).json({ message: 'Missing query parameter: q' });
    return;
  }

  try {
    // Connect to your MongoDB database
    await mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true, useUnifiedTopology: true});

    // Search for videos
    const videos = await Video.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ],
    });

    res.status(200).json(videos);
  } catch (error) {
    console.error('Error searching for videos:', error);
    res.status(500).json({ message: 'Error searching for videos' });
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}; 
