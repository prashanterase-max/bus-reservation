const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message)
            return res.status(400).json({ message: 'All fields are required' });
        await Message.create({ name, email, message });
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
