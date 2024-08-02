const express = require('express');
const Booking = require('../models/servicesBooking');
const jwt = require('jsonwebtoken');

const router = express.Router();

const secret = '133a889e51573dae5d1f527089e91a3c3c4d547490c4e762bd6a3416905a11c811e8c93bdf9a2cac853ae8c6ed89890deff99826d67b469d758667bc26d9df45';

// Middleware to check authentication
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = decoded;
        next();
    });
};

// Get all bookings
router.get('/', authenticate, async (req, res) => {
    try {
        const { role } = req.user;
        const bookings = role === 'superadmin'
            ? await Booking.find()
            : await Booking.find({ sporti: role });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update booking status
router.patch('/:id/:action', authenticate, async (req, res) => {
    const { id, action } = req.params;
    try {
        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (action === 'confirm') {
            booking.status = 'confirmed';
        } else if (action === 'reject') {
            booking.status = 'rejected';
            booking.rejectionReason = req.body.rejectionReason || '';
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
