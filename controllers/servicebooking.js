const Booking = require('../models/servicesBooking');
const emailService = require('../services/emailService');
const { v4: uuidv4 } = require('uuid');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const sendSMS = require('../s')

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

const calculateTotalRoomCost = (formData) => {
    let roomPrice = 0;
    switch (formData.roomType) {
        case 'Family':
            if (formData.guestType === 'Officers from Karnataka') {
                roomPrice = 1600;
            } else if (formData.guestType === 'Officers from Other States') {
                roomPrice = 2100;
            } else if (formData.guestType === 'Serving and Senior Police Officers') {
                roomPrice = 1600;
            }
            break;
        case 'VIP':
            if (formData.guestType === 'Officers from Karnataka') {
                roomPrice = 1300;
            } else if (formData.guestType === 'Officers from Other States') {
                roomPrice = 1600;
            } else if (formData.guestType === 'Serving and Senior Police Officers') {
                roomPrice = 2700;
            }
            break;
        case 'Standard':
            if (formData.guestType === 'Officers from Karnataka') {
                roomPrice = 800;
            } else if (formData.guestType === 'Officers from Other States') {
                roomPrice = 1100;
            } else if (formData.guestType === 'Serving and Senior Police Officers') {
                roomPrice = 1600;
            }
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

const calculateTotalServiceCost = (formData) => {
    let baseCost = 0;

    // Determine the base cost based on serviceName and serviceType
    if (formData.serviceName === 'main function hall') {
        switch (formData.serviceType) {
            case 'Others':
                baseCost = 45000;
                break;
            case 'Senior Police Officers of Other Govt Department':
                baseCost = 25000;
                break;
            case 'Serving and Senior Police Officers':
                baseCost = 2000;
                break;
            default:
                baseCost = 0;
        }
    } else if (formData.serviceName === 'Conference Room') {
        switch (formData.serviceType) {
            case 'Others':
                baseCost = 15000;
                break;
            case 'Senior Police Officers of Other Govt Department':
                baseCost = 10000;
                break;
            case 'Serving and Senior Police Officers':
                baseCost = 7500;
                break;
            default:
                baseCost = 0;
        }
    } else if (formData.serviceName === 'Barbeque Area') {
        switch (formData.serviceType) {
            case 'Others':
                baseCost = 10000;
                break;
            case 'Senior Police Officers of Other Govt Department':
                baseCost = 7500;
                break;
            case 'Serving and Senior Police Officers':
                baseCost = 5000;
                break;
            default:
                baseCost = 0;
        }
    }

    return baseCost * formData.numberOfDays;
};

const submitRoomForm = async (req, res) => {
    try {
        const formData = req.body;

        formData.applicationNo = generateShortUniqueId();
        formData.totalCost = calculateTotalRoomCost(formData);
console.log(calculateTotalRoomCost(formData));

        const booking = new Booking(formData);
        await booking.save();
        sendSMS(`Your booking request has been sent to admin for confirmation and it takes one working day for the same. SMS will be sent to the registered mobile number. please note the acknowledgement number for future reference. ApplicationNo is ${formData.applicationNo}`, formData.phoneNumber);

        res.json({ success: true, user: booking });
    } catch (error) {
        console.error('Error submitting room form:', error);
        res.status(500).json({ success: false, error: 'An error occurred while submitting the room form.' });
    }
};

const submitServiceForm = async (req, res) => {
    try {
        const formData = req.body;

        formData.applicationNo = generateShortUniqueId();
        formData.totalCost = calculateTotalServiceCost(formData);
        console.log(calculateTotalServiceCost(formData));
        

        const booking = new Booking(formData);
        await booking.save();
        sendSMS(`Your booking request has been sent to admin for confirmation and it takes one working day for the same. SMS will be sent to the registered mobile number. please note the acknowledgement number for future reference. ApplicationNo is ${formData.applicationNo}`, formData.phoneNumber);
        res.json({ success: true, user: booking });
    } catch (error) {
        console.error('Error submitting service form:', error);
        res.status(500).json({ success: false, error: 'An error occurred while submitting the service form.' });
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

// Get all bookings
const allBookings = async (req, res) => {
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
    updateBooking,
    submitRoomForm,
    submitServiceForm,
    getBookingByApplicationNo,
    deleteBooking,
    allBookings,
    pendingBookings,
    confirmBookings
};
