const express = require('express');
const router = express.Router();
const feedback = require('../models/feedback');

// Route to handle creating new feedback
router.post('/submit/feedback', async (req, res) => {
    try {
        // Create a new feedback instance from the request body
        const newfeedback = new feedback(req.body);

        // Save the feedback to the database
        await newfeedback.save();

        // Respond with the saved feedback
        res.status(201).json({
            message: 'Feedback submitted successfully',
            newfeedback
        });
    } catch (error) {
        // Handle errors during the save process
        res.status(500).json({
            message: 'Failed to submit feedback',
            error: error.message
        });
    }
});

router.get('/feedbacks', async (req, res) => {
    try {
        // Create a new feedback instance from the request body
        const allfeedbacks = await feedback.find();


        // Respond with the saved feedback
        res.status(201).json({
            message: 'Feedback submitted successfully',
            data:allfeedbacks
        });
    } catch (error) {
        // Handle errors during the save process
        res.status(500).json({
            message: 'Failed to get feedbacks',
            error: error.message
        });
    }
});

module.exports = router;
