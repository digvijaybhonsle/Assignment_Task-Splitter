import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { register, login, logout } from './controllers/authController.js';
import agentRoutes from './routes/agents.js';
import listRoutes from './routes/lists.js';
import multer from 'multer';

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize environment
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MONGO_URI not defined');
  process.exit(1);
}

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Connect to MongoDB
connectDB();

// CORS configuration
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://assignment-task-splitter.vercel.app',
    ],
    credentials: true,
  })
);


// Middleware: JSON, URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// File upload middleware for avatar
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});
const upload = multer({ storage });

// Health check
app.get('/', (req, res) => {
  res.send('API is running');
});

// Auth routes
app.post('/api/auth/register', upload.single('avatar'), register);
app.post('/api/auth/signin', login);
app.post('/api/auth/logout', logout);

// Protected/admin routes
app.use('/api/agents', agentRoutes);
app.use('/api/lists', listRoutes);

// Start server
mongoose
  .connect(uri)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));