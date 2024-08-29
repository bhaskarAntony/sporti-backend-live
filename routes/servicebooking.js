const express = require('express');
const { submitServiceForm, submitRoomForm, getBookingByApplicationNo, deleteBooking, updateBooking } = require('../controllers/servicebooking');
const router = express.Router();
const Booking = require('../models/servicesBooking');
const { sendrejectionEmail, sendConfirmationEmail, sendRoomConfirmationEmail, sendRoomRejectEmail } = require('../services/emailService');
const sendSMS = require('../s');
const { sendRejectSMS, sendSMSConfirmService, sendSMSConfirmRoom, confirmRoom, rejectRoomBookingSMS } = require('../sms');
const Room = require('../models/Room');

router.post('/service/book', submitServiceForm);
router.post('/room/book', submitRoomForm);
router.get('/booking/:applicationNo', getBookingByApplicationNo);
router.delete('/delete/booking/:applicationNo', deleteBooking);
router.put('/update/booking/:applicationNo', updateBooking);
// routes/bookings.js

// Reject a booking


router.patch('/:id/reject', async (req, res) => {
    try {
        const { rejectionReason } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        booking.status = 'rejected';
        booking.rejectionReason = rejectionReason;
        // sendrejectionEmail(booking)
        // sendSMS(`Hello ${booking.username},   Your booking request has been cancelled from admin team as you are not eligible for booking services in SPORTI. Thank you.`, booking.phoneNumber)
        if(booking.serviceName == "Room Booking"){
            rejectRoomBookingSMS(booking.phoneNumber);
            sendRoomRejectEmail(booking)
        }
        await booking.save();
        const room = await Room.findById(booking.roomId);

        if(!room){
            return res.status(404).json({error: 'Room id not found' });
        }
        room.isBooked = false;
        room.save();
        res.json({booking, room});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Confirm a booking
router.patch('/:id/confirm', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = 'confirmed';
        booking.roomId=req.params.id;
        // sendConfirmationEmail(booking)
        // sendSMS(`Hello ${booking.username}, Your booking request has been approved from admin team. Thank you. Please contact SPORTI team for`, booking.phoneNumber)
        // const date = new Date(booking.eventdate)
        sendSMSConfirmService(booking.phoneNumber, booking.eventdate);
        await booking.save();
        // Send email to user
        // You need to implement email sending logic here
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:id/select-room/:roomId', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const { roomNumber } = req.body;

        // Update booking with selected room number
        booking.selectedRoomNumber = roomNumber;
        booking.status = 'confirmed';
        booking.roomId = req.params.roomId;
        await booking.save();

        // Mark the room as booked
        var bookedRoom = await Room.findById(req.params.roomId);
        if(!bookedRoom){
            return res.status(404).json({error: 'Room id not found' });
        }
        bookedRoom.isBooked = true
        bookedRoom.save();
        confirmRoom(booking);
        sendRoomConfirmationEmail(booking)
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Get all bookings
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



router.get('/send/room/sms/:id', async(req, res)=>{
    const {id} = req.params;
    try {
        const booking = await Booking.findById(req.params.id);
        confirmRoom(booking);
        res.status(200).json({
            message:"sms sent"
        })
    } catch (error) {
        res.status(500).json({
            message:"failed to send sms."
        })
    }
})



module.exports = router;
