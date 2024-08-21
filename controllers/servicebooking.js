const express = require('express');
const { body, validationResult } = require('express-validator');
const Joi = require('joi');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const uuidv4 = require('uuid').v4;
const Booking = require('../models/servicesBooking');
const emailService = require('../services/emailService');
const sendSMS = require('../s'); // Adjust the path as necessary
const { sendPendingSMS } = require('../sms');

// Sanitize input
function sanitizeInput(input) {
    const window = new JSDOM('').window;
    return DOMPurify.sanitize(input, { USE_PROFILES: { html: true }, window });
}

// Generate a short unique ID
function generateShortUniqueId() {
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const uuid = uuidv4();
    const uuidSuffix = uuid.slice(-4);
    return `${randomNumber}${uuidSuffix}`;
}

// Calculate total room cost
const calculateTotalRoomCost = (formData) => {
    let roomPrice = 0;
    switch (formData.roomType) {
        case 'Family':
            roomPrice = formData.guestType === 'Officers from Karnataka' ? 1600 :
                        formData.guestType === 'Officers from Other States' ? 2100 :
                        formData.guestType === 'Serving and Senior Police Officers' ? 1600 : 0;
            break;
        case 'VIP':
            roomPrice = formData.guestType === 'Officers from Karnataka' ? 1300 :
                        formData.guestType === 'Officers from Other States' ? 1600 :
                        formData.guestType === 'Serving and Senior Police Officers' ? 2700 : 0;
            break;
        case 'Standard':
            roomPrice = formData.guestType === 'Officers from Karnataka' ? 800 :
                        formData.guestType === 'Officers from Other States' ? 1100 :
                        formData.guestType === 'Serving and Senior Police Officers' ? 1600 : 0;
            break;
        default:
            roomPrice = 0;
    }

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return roomPrice * formData.noGuests * diffDays;
};

// Calculate total service cost
const calculateTotalServiceCost = (formData) => {
    let baseCost = 0;
    if ((formData.serviceName).toLowerCase() === 'main function hall') {
        baseCost = formData.serviceType === 'Others' ? 45000 :
                    formData.serviceType === 'Senior Police Officers of Other Govt Department' ? 25000 :
                    formData.serviceType === 'Serving and Senior Police Officers' ? 2000 : 0;
    } else if ((formData.serviceName).toLowerCase() === 'conference room') {
        baseCost = formData.serviceType === 'Others' ? 15000 :
                    formData.serviceType === 'Senior Police Officers of Other Govt Department' ? 10000 :
                    formData.serviceType === 'Serving and Senior Police Officers' ? 7500 : 0;
    } else if ((formData.serviceName).toLowerCase() === 'barbeque area') {
        baseCost = formData.serviceType === 'Others' ? 10000 :
                    formData.serviceType === 'Senior Police Officers of Other Govt Department' ? 7500 :
                    formData.serviceType === 'Serving and Senior Police Officers' ? 5000 : 0;
    }
    return baseCost * formData.numberOfDays;
};

// Validation middleware for booking form
const validateBookingForm = [
    // body('roomType').isIn(['Family', 'VIP', 'Standard']),
    // body('guestType').isIn(['Officers from Karnataka', 'Officers from Other States', 'Serving and Senior Police Officers']),
    body('checkIn').isISO8601().toDate(),
    body('checkOut').isISO8601().toDate(),
    body('noGuests').isInt({ min: 1 }),
    body('phoneNumber').isMobilePhone()
];

const validateBookingForm2 = [
    // body('roomType').isIn(['Family', 'VIP', 'Standard']),
    body('serviceType').isIn(['Others', 'Senior Police Officers of Other Govt Department', 'Serving and Senior Police Officers']),
    body('serviceName').isIn(['main function hall', 'conference room', 'barbeque area']),
    body('eventdate').isISO8601().toDate(),
    // body('checkOut').isISO8601().toDate(),
    body('noGuests').isInt({ min: 1 }),
    body('phoneNumber').isMobilePhone()
];

// Submit room form
const submitRoomForm = async (req, res) => {
    await Promise.all(validateBookingForm.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const formData = req.body;
        formData.applicationNo = generateShortUniqueId();
        formData.totalCost = calculateTotalRoomCost(formData);
        
        const booking = new Booking(formData);
        await booking.save();
        // sendSMS(`hello ${formData.username}, Your booking request has been sent to admin for confirmation and it takes one working day for the same. SMS will be sent to the registered mobile number. please note the acknowledgement number for future reference. ApplicationNo is ${formData.applicationNo}`, formData.phoneNumber);

        sendPendingSMS(formData.phoneNumber);

        res.json({ success: true, user: booking });
    } catch (error) {
        console.error('Error submitting room form:', error.message);
        res.status(500).json({ success: false, error: 'An error occurred while submitting the room form.' });
    }
};

// Submit service form
const submitServiceForm = async (req, res) => {
    await Promise.all(validateBookingForm2.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const formData = req.body;
        formData.applicationNo = generateShortUniqueId();
        formData.totalCost = calculateTotalServiceCost(formData);
        
        const booking = new Booking(formData);
        
        await booking.save();
        // sendSMS(`hello ${formData.username},  Your booking request has been sent to admin for confirmation and it takes one working day for the same. SMS will be sent to the registered mobile number. please note the acknowledgement number for future reference. ApplicationNo is ${formData.applicationNo}`, formData.phoneNumber);
        sendPendingSMS(formData.phoneNumber);

        res.json({ success: true, user: booking });
    } catch (error) {
        console.error('Error submitting service form:', error.message);
        res.status(500).json({ success: false, error: 'An error occurred while submitting the service form.' });
    }
};

// Update booking
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
        console.error('Error updating booking:', error.message);
        res.status(500).json({ success: false, error: 'An error occurred while updating the booking.' });
    }
};

// Delete booking
const deleteBooking = async (req, res) => {
    try {
        const { applicationNo } = req.params;

        const deletedBooking = await Booking.findOneAndDelete({ applicationNo });

        if (!deletedBooking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        res.json({ success: true, deletedBooking });
    } catch (error) {
        console.error('Error deleting booking:', error.message);
        res.status(500).json({ success: false, error: 'An error occurred while deleting the booking.' });
    }
};

// Get booking by application number
const getBookingByApplicationNo = async (req, res) => {
    try {
        const { applicationNo } = req.params;

        const booking = await Booking.findOne({ applicationNo });

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        res.json({ success: true, booking });
    } catch (error) {
        console.error('Error retrieving booking:', error.message);
        res.status(500).json({ success: false, error: 'An error occurred while retrieving the booking.' });
    }
};

// Get all bookings
const allBookings = async (req, res) => {
    try {
        const allBookings = await Booking.find();
        res.status(200).json(allBookings);
    } catch (error) {
        console.error('Error retrieving all bookings:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all pending bookings
const pendingBookings = async (req, res) => {
    try {
        const pendingBookings = await Booking.find({ status: 'pending' });
        res.status(200).json(pendingBookings);
    } catch (error) {
        console.error('Error retrieving pending bookings:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Confirm bookings
const confirmBookings = async (req, res) => {
    try {
        const confirmedBookings = await Booking.updateMany({ status: 'pending' }, { $set: { status: 'confirmed' } });
        res.status(200).json(confirmedBookings);
    } catch (error) {
        console.error('Error confirming bookings:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Export functions
module.exports = {
    submitRoomForm,
    submitServiceForm,
    updateBooking,
    deleteBooking,
    getBookingByApplicationNo,
};
