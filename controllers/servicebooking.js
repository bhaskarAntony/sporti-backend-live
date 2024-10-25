const express = require('express');
const { body, validationResult } = require('express-validator');
const Joi = require('joi');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const uuidv4 = require('uuid').v4;
const Booking = require('../models/servicesBooking');
const sendSMS = require('../s'); // Adjust the path as necessary
const { sendPendingSMS, bookRoomSMS } = require('../sms');
const Room = require('../models/Room');
const { sendRoomConfirmationEmail, sendRoomPendingEmail } = require('../services/emailService');

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
    console.log(formData.roomType);
    
    switch (formData.roomType) {
        case 'Family':
            roomPrice = formData.serviceType === 'Officers from Karnataka State' ? 1600 :
                        formData.serviceType === 'Officers from Other State' ? 2100 :
                        formData.serviceType === 'Others' ? 1600 : 0;
            break;
        case 'VIP':
            roomPrice = formData.serviceType === 'Officers from Karnataka State' ? 1300 :
                        formData.serviceType === 'Officers from Other State' ? 1600 :
                        formData.serviceType === 'Others' ? 2700 : 0;
            break;
        case 'Standard':
            roomPrice = formData.serviceType === 'Officers from Karnataka State' ? 800 :
                        formData.serviceType === 'Officers from Other State' ? 1100 :
                        formData.serviceType === 'Others' ? 1600 : 0;
            break;
        default:
            roomPrice = 0;
    }

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return roomPrice * diffDays;
};

// Calculate total service cost
const calculateTotalServiceCost = (formData) => {
    let baseCost = 0;
    if (formData.serviceName === 'Main Function Hall') {
        baseCost = formData.serviceType === 'Others' ? 45000 :
                    formData.serviceType === 'Officers from Other State' ? 25000 :
                    formData.serviceType === 'Officers from Karnataka State' ? 2000 : 0;
    } else if (formData.serviceName === 'Conference Room') {
        baseCost = formData.serviceType === 'Others' ? 15000 :
                    formData.serviceType === 'Officers from Other State' ? 10000 :
                    formData.serviceType === 'Officers from Karnataka State' ? 7500 : 0;
    } else if (formData.serviceName === 'Barbeque Area') {
        baseCost = formData.serviceType === 'Others' ? 10000 :
                    formData.serviceType === 'Officers from Other State' ? 7500 :
                    formData.serviceType === 'Officers from Karnataka State' ? 5000 : 0;
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
    // body('serviceType').isIn(['Others', 'Officers from Other State', 'Officers from Karnataka State']),
    // body('serviceName').isIn(['Main Function Hall', 'Conference Room', 'Barbeque Area']),
    body('eventdate').isISO8601().toDate(),
    // body('checkOut').isISO8601().toDate(),
    body('noRooms').isInt({ min: 1 }),
    body('phoneNumber').isMobilePhone()
];
 
// Submit room form
const submitRoomForm = async (req, res) => {
    try {
        const formData = req.body;
        const bookingResponses = [];

        for (let i = 0; i < formData.noRooms; i++) {
            const applicationNo = generateShortUniqueId(); // Unique ID for applicationNo
            const bookingData = {
                ...formData,
                applicationNo,
                totalCost: calculateTotalRoomCost(formData)
            };

            // Create and save a new Booking instance for each room
            const booking = new Booking(bookingData);
            await booking.save();

            // Send SMS and email notifications
            bookRoomSMS(bookingData.phoneNumber);
            sendRoomPendingEmail(bookingData);

            // Append booking response
            bookingResponses.push({
                room: i + 1,
                applicationNo: bookingData.applicationNo,
                totalCost: bookingData.totalCost,
                status: 'Pending confirmation'
            });

            console.log(`Booking created for Room ${i + 1}:`, bookingData);
        }
        // Respond with success and booking details
        res.json({ 
            success: true, 
            message: `${formData.noRooms} room bookings submitted successfully!`, 
            bookings: bookingResponses 
        });
    } catch (error) {
        console.error('Error submitting room form:', error);
        res.status(500).json({ 
            success: false, 
            error: 'An error occurred while submitting the room form.',
            data: error
        });
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
        // Object.keys(formData).forEach(key => {
        //     formData[key] = sanitizeInput(formData[key]);
        // });

        const updatedBooking = await Booking.findOneAndUpdate({ applicationNo }, formData, { new: true });

        if (!updatedBooking) {
            return res.status(404).json({ success: false, error: 'Application number not found' });
        }

          // Send SMS and email for each room booking
          bookRoomSMS(formData.phoneNumber);
          sendRoomPendingEmail(formData);
        // Send confirmation email
        // emailService.sendConfirmationEmail(formData);
        res.json({ success: true, updatedBooking });
    } catch (error) {
        console.error('Error updating booking:', error.message);
        res.status(500).json({ success: false, error: 'An error occurred while updating the booking.' });
    }
};

// Delete booking
const deleteBooking = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the booking by applicationNo
      const booking = await Booking.findById(id);
      
  
      if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
      }
  
      // Find the associated room by roomId
      const room = await Room.findById(booking.roomId);
  
      if (room) {
        room.isBooked = false;
        await room.save();
      }
  
      // Update the room's isBooked status to false
     
  
      // Delete the booking
      const deletedBooking = await Booking.findOneAndDelete({ applicationNo });
  
      res.json({ success: true, deletedBooking, room });
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
