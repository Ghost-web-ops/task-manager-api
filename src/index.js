
 import "dotenv/config";
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import listRoutes from './routes/listRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import passport from 'passport';
import './passport-setup.js';

const app = express();
app.set('trust proxy', 1); // ✅ Add this line
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(passport.initialize());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', userRoutes);
app.use('/api', boardRoutes);
app.use('/api', listRoutes);
app.use('/api', cardRoutes);


// Test Route - مسار للتأكد من أن الخادم يعمل
app.get('/', (req, res) => {
  res.send('Task Manager API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});