const express = require('express');

import mongoose from 'mongoose';
const bodyParser = require('body-parser');
import { taskRouter } from './routes';
// import redisClient from './cache'; // Use default import

// Initialize Express
const app = express();
const port = 3000;

// MongoDB Connection
const Mongo_url = "mongodb+srv://ayush:12345@cluster0.oo018hf.mongodb.net/FSD_Assignment";
mongoose.connect(Mongo_url)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/tasks', taskRouter);

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
