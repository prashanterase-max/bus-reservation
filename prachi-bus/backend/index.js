const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('Prachi Bus API is running');
});

// Import Routes
const busRoutes = require('./routes/bus');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');

app.use('/api/buses', busRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
