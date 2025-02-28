import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables early
dotenv.config();

// Import utilities
import connectDB from './config/dbConn.js';
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

// Import Routers
import authRouter from './routes/authRoutes.js';
import productsRouter from './routes/productsRoutes.js';

// Ensure MONGO_URI is set
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined. Check your .env file.");
  process.exit(1);
}

// Initialize Express App
const app = express();

// CORS settings
const allowedOrigins = [
  'https://woodhy-backend.onrender.com',
  'http://localhost:4001',
  'https://woodhy.vercel.app',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON requests

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productsRouter);

// Middleware for handling errors
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Server Port
const port = process.env.PORT || 5000;

// Start Server After Successful DB Connection
const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB

    mongoose.connection.once('open', () => {
      console.log('✅ Successfully connected to MongoDB');
      app.listen(port, () => console.log(`🚀 Server is running on port ${port}...`));
    });

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB Connection Error: ${err}`);
    });

  } catch (error) {
    console.error(`❌ Server Startup Error: ${error.message}`);
    process.exit(1);
  }
};

// Start the server
startServer();
