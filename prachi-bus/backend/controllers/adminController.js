const User = require('../models/User');
const Bus = require('../models/Bus');
const Booking = require('../models/Booking');
const bcrypt = require('bcryptjs');

const Message = require('../models/Message');

// ── Stats ──────────────────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
    try {
        const [totalUsers, totalBuses, totalBookings, revenue, recentBookings, unreadMessages] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            Bus.countDocuments(),
            Booking.countDocuments(),
            Booking.aggregate([
                { $match: { status: { $ne: 'Cancelled' } } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]),
            Booking.find()
                .populate('user', 'name email')
                .populate('bus', 'name source destination')
                .sort({ bookingDate: -1 })
                .limit(5),
            Message.countDocuments({ read: false })
        ]);
        res.json({
            totalUsers,
            totalBuses,
            totalBookings,
            totalRevenue: revenue[0]?.total || 0,
            recentBookings,
            unreadMessages
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Users ──────────────────────────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already in use' });
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashed, phone, role: role || 'user' });
        res.status(201).json({ id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, createdAt: user.createdAt });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { name, email, phone, role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, role },
            { new: true, runValidators: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        await Booking.deleteMany({ user: req.params.id });
        res.json({ message: 'User and their bookings deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Buses ──────────────────────────────────────────────────────────────────
exports.getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find().sort({ _id: -1 });
        res.json(buses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createBus = async (req, res) => {
    try {
        const data = req.body;
        data.seatsAvailable = data.totalSeats || 40;
        data.bookedSeats = [];
        const bus = await Bus.create(data);
        res.status(201).json(bus);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateBus = async (req, res) => {
    try {
        const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!bus) return res.status(404).json({ message: 'Bus not found' });
        res.json(bus);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteBus = async (req, res) => {
    try {
        await Bus.findByIdAndDelete(req.params.id);
        res.json({ message: 'Bus deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Bookings ───────────────────────────────────────────────────────────────
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email phone')
            .populate('bus', 'name source destination departureTime arrivalTime type fare')
            .sort({ bookingDate: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id).populate('bus');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // If cancelling, free up seats on the bus
        if (status === 'Cancelled' && booking.status !== 'Cancelled') {
            await Bus.findByIdAndUpdate(booking.bus._id, {
                $pull: { bookedSeats: { $in: booking.seatNumbers } },
                $inc: { seatsAvailable: booking.seatNumbers.length }
            });
        }
        // If re-booking a cancelled booking, re-occupy seats
        if (status === 'Booked' && booking.status === 'Cancelled') {
            await Bus.findByIdAndUpdate(booking.bus._id, {
                $push: { bookedSeats: { $each: booking.seatNumbers } },
                $inc: { seatsAvailable: -booking.seatNumbers.length }
            });
        }

        booking.status = status;
        await booking.save();
        res.json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        // Free seats if not already cancelled
        if (booking.status !== 'Cancelled') {
            await Bus.findByIdAndUpdate(booking.bus, {
                $pull: { bookedSeats: { $in: booking.seatNumbers } },
                $inc: { seatsAvailable: booking.seatNumbers.length }
            });
        }
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: 'Booking deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Messages ───────────────────────────────────────────────────────────────
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.markMessageRead = async (req, res) => {
    try {
        const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        if (!msg) return res.status(404).json({ message: 'Message not found' });
        res.json(msg);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
