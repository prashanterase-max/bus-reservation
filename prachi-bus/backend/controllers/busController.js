const Bus = require('../models/Bus');

exports.searchBuses = async (req, res) => {
    try {
        const source = (req.query.source || '').trim();
        const destination = (req.query.destination || '').trim();
        const buses = await Bus.find({ 
            source: new RegExp(source, 'i'), 
            destination: new RegExp(destination, 'i') 
        });
        res.json(buses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBusById = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) return res.status(404).json({ message: 'Bus not found' });
        res.json(bus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find({});
        res.json(buses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addBus = async (req, res) => {
    try {
        const bus = new Bus(req.body);
        await bus.save();
        res.status(201).json(bus);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
