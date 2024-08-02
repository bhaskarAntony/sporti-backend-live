const Booking = require('../models/servicesBooking');
const emailService = require('../services/emailService');
const { v4: uuidv4 } = require('uuid');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

function sanitizeInput(input) {
    const window = new JSDOM('').window;
    return DOMPurify.sanitize(input, { USE_PROFILES: { html: true }, window });
}

function generateShortUniqueId() {
    // Generate a random number between 10000 and 99999
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    
    // Generate a UUID
    const uuid = uuidv4();
    
    // Extract the last 4 characters from the UUID
    const uuidSuffix = uuid.slice(-4);

    // Concatenate the random number and UUID suffix
    return `${randomNumber}${uuidSuffix}`;
}

const submitForm = async (req, res) => {
    try {
        const formData = req.body;

        // Sanitize the form data
        // Object.keys(formData).forEach(key => {
        //     formData[key] = sanitizeInput(formData[key]);
        // });

        formData.applicationNo = generateShortUniqueId();

        const booking = new Booking(formData);
        await booking.save();

        res.json({ success: true, user: booking });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({ success: false, error: 'An error occurred while submitting the form.' });
    }
};

const updateBooking = async (req, res) => {
    try {
        const { applicationNo } = req.params;
        const formData = req.body;

        // Sanitize the form data
        Object.keys(formData).forEach(key => {
            formData[key] = sanitizeInput(formData[key]);
        });

        const updatedBooking = await Booking.findOneAndUpdate({ applicationNo }, formData, { new: true });

        if (!updatedBooking) {
            return res.status(404).json({ success: false, error: 'Application number not found' });
        }

        // Send confirmation email
        emailService.sendConfirmationEmail(formData);

        res.json({ success: true, updatedBooking });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ success: false, error: 'An error occurred while updating the booking.' });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const { applicationNo } = req.params;

        const deletedBooking = await Booking.findOneAndDelete({ applicationNo });

        if (!deletedBooking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        res.json({ success: true, deletedBooking });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ success: false, error: 'An error occurred while deleting the booking.' });
    }
};

const getBookingByApplicationNo = async (req, res) => {
    try {
        const { applicationNo } = req.params;

        const booking = await Booking.findOne({ applicationNo });

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        res.json({ success: true, booking });
    } catch (error) {
        console.error('Error retrieving booking:', error);
        res.status(500).json({ success: false, error: 'An error occurred while retrieving the booking.' });
    }
};

// GET request handler to retrieve all form submissions
const allBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching form bookings:', error);
        res.status(500).json({ error: 'Failed to fetch form bookings' });
    }
};

// Get all bookings
const getAll = async (req, res) => {
    try {
        const allBookings = await Booking.find();
        res.status(200).json(allBookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all pending bookings
const pendingBookings = async (req, res) => {
    try {
        const pendingBookings = await Booking.find({ status: 'pending' });
        res.status(200).json(pendingBookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Accept or reject a booking
const confirmBookings = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const updatedBooking = await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed' }, { new: true });
        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    submitForm,
    updateBooking,
    getBookingByApplicationNo,
    deleteBooking,
    allBookings,
    pendingBookings,
    confirmBookings
};
