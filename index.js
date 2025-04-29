const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000', // Frontend development
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3004',
  'http://localhost:3006',
  'https://sporti-admin.vercel.app',
  'https://sporti2.vercel.app',
  'https://www.sporti.ksp.gov.in',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Security Middleware
app.use(helmet()); // Apply default helmet security headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:'],
      fontSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      connectSrc: [
        "'self'",
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3004',
        'http://localhost:3006',
        'http://localhost:4000',
        'https://sporti-backend-live-p00l.onrender.com',
        'https://sporti-admin.vercel.app',
        'https://sporti2.vercel.app',
        'https://www.sport backend code is using jwt authentication so give code for that with all the files needed for backend and also update the frotend code accordingly. i.ksp.gov.in',
      ],
      frameAncestors: ["'none'"],
    },
  })
);
app.use(helmet.frameguard({ action: 'deny' }));
app.use(
  helmet.hsts({
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  })
);

// Additional Middleware
app.use(cookieParser('your-secret-key'));
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());

// Sample User Model (save as models/User.js)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Auth Routes (save as routes/auth.js)
const authRoutes = express.Router();

authRoutes.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

authRoutes.post('/validate', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.status(200).json({
      data: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Placeholder Routes (replace with actual implementations)
const adminRoutes = express.Router();
adminRoutes.get('/dashboard', (req, res) => res.json({ message: 'Admin dashboard' }));

const adminBookings = express.Router();
adminBookings.get('/bookings', (req, res) => res.json({ message: 'Admin bookings' }));

const bookingRoutes = express.Router();
bookingRoutes.post('/service', (req, res) => res.json({ message: 'Service booking' }));

const RoomRoutes = express.Router();
RoomRoutes.get('/rooms', (req, res) => res.json({ message: 'Rooms' }));

const FeedbackRoutes = express.Router();
FeedbackRoutes.post('/feedback', (req, res) => res.json({ message: 'Feedback' }));

const PaymentRoutes = express.Router();
PaymentRoutes.post('/payment', (req, res) => res.json({ message: 'Payment' }));

// Route Middleware
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminBookings);
app.use('/api/sporti/service', bookingRoutes);
app.use('/api', RoomRoutes);
app.use('/api', FeedbackRoutes);
app.use('/api/payment', PaymentRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));