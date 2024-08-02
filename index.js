const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Apply security headers using helmet
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    frameAncestors: ["'self'"]
  }
}));
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.hsts({
  maxAge: 31536000,  // 1 year
  includeSubDomains: true,
  preload: true
}));

// Set Content Security Policy and other headers explicitly
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self';" +
    "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data:; " +
    "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; " +
    "connect-src 'self' http://localhost:3000 http://localhost:4000 http://localhost:3001 http://localhost:5000 https://www.sporti.ksp.gov.in https://sporti-admin.vercel.app https://sporti-services-backend.onrender.com https://sporti2.vercel.app; " +
    "frame-ancestors 'none';"
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');
  next();
});

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');  // Block all iframe embedding
  next();
});


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Middlewares
app.use(cookieParser('your-secret-key'));
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:4000',
    'https://sporti-admin.vercel.app',
    'https://sporti-admin.vercel.app/bookings',
    'https://www.sporti.ksp.gov.in',
    'https://sporti2.vercel.app',
    'https://www.sporti.ksp.gov.in/login',
    'https://sporti-admin.vercel.app/login',
    'https://sporti-admin.vercel.app/dashboard',
    'https://sporti-admin.vercel.app/bookings'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const adminBookings = require('./routes/adminBooking');
const bookingRoutes = require('./routes/servicebooking');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminBookings);
app.use('/api/sporti/service', bookingRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));