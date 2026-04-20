const mongoose = require('mongoose');
const Bus = require('./models/Bus');
require('dotenv').config();

const buses = [
    // Ahmedabad → Mumbai
    { name: "Prachi Travels", type: "AC", source: "Ahmedabad", destination: "Mumbai", departureTime: "21:00", arrivalTime: "06:00", duration: "09h 00m", fare: 1200, totalSeats: 40, seatsAvailable: 40, bookedSeats: [], rating: 4.5, reviewsCount: 150 },
    { name: "Prachi Express", type: "Non-AC", source: "Ahmedabad", destination: "Mumbai", departureTime: "19:00", arrivalTime: "05:00", duration: "10h 00m", fare: 800, totalSeats: 40, seatsAvailable: 40, bookedSeats: [], rating: 4.0, reviewsCount: 85 },
    { name: "Prachi Sleeper Plus", type: "Sleeper", source: "Ahmedabad", destination: "Mumbai", departureTime: "22:00", arrivalTime: "07:30", duration: "09h 30m", fare: 1000, totalSeats: 30, seatsAvailable: 30, bookedSeats: [], rating: 4.3, reviewsCount: 60 },
    { name: "Prachi Luxury AC", type: "AC", source: "Ahmedabad", destination: "Mumbai", departureTime: "08:00", arrivalTime: "17:00", duration: "09h 00m", fare: 1500, totalSeats: 36, seatsAvailable: 36, bookedSeats: [], rating: 4.7, reviewsCount: 210 },

    // Mumbai → Ahmedabad
    { name: "Prachi Gold", type: "AC", source: "Mumbai", destination: "Ahmedabad", departureTime: "20:30", arrivalTime: "05:30", duration: "09h 00m", fare: 1200, totalSeats: 40, seatsAvailable: 40, bookedSeats: [], rating: 4.4, reviewsCount: 130 },
    { name: "Prachi Budget", type: "Non-AC", source: "Mumbai", destination: "Ahmedabad", departureTime: "18:00", arrivalTime: "04:30", duration: "10h 30m", fare: 750, totalSeats: 40, seatsAvailable: 40, bookedSeats: [], rating: 3.9, reviewsCount: 70 },

    // Mumbai → Pune
    { name: "Prachi Pune Express", type: "AC", source: "Mumbai", destination: "Pune", departureTime: "07:00", arrivalTime: "10:30", duration: "03h 30m", fare: 450, totalSeats: 40, seatsAvailable: 40, bookedSeats: [], rating: 4.6, reviewsCount: 180 },
    { name: "Prachi Pune Sleeper", type: "Sleeper", source: "Mumbai", destination: "Pune", departureTime: "22:30", arrivalTime: "02:30", duration: "04h 00m", fare: 600, totalSeats: 25, seatsAvailable: 25, bookedSeats: [], rating: 4.2, reviewsCount: 45 },
    { name: "Prachi Pune Seater", type: "Seater", source: "Mumbai", destination: "Pune", departureTime: "14:00", arrivalTime: "17:30", duration: "03h 30m", fare: 350, totalSeats: 40, seatsAvailable: 40, bookedSeats: [], rating: 4.0, reviewsCount: 55 },

    // Surat → Ahmedabad
    { name: "Prachi Luxury", type: "AC", source: "Surat", destination: "Ahmedabad", departureTime: "08:00", arrivalTime: "12:30", duration: "04h 30m", fare: 500, totalSeats: 38, seatsAvailable: 38, bookedSeats: [], rating: 4.8, reviewsCount: 200 },
    { name: "Prachi Surat Fast", type: "Non-AC", source: "Surat", destination: "Ahmedabad", departureTime: "06:00", arrivalTime: "10:00", duration: "04h 00m", fare: 300, totalSeats: 40, seatsAvailable: 40, bookedSeats: [], rating: 4.1, reviewsCount: 90 },

    // Delhi → Jaipur
    { name: "Prachi Rajasthan AC", type: "AC", source: "Delhi", destination: "Jaipur", departureTime: "06:00", arrivalTime: "11:00", duration: "05h 00m", fare: 700, totalSeats: 40, seatsAvailable: 40, bookedSeats: [], rating: 4.5, reviewsCount: 160 },
    { name: "Prachi Rajasthan Sleeper", type: "Sleeper", source: "Delhi", destination: "Jaipur", departureTime: "23:00", arrivalTime: "04:30", duration: "05h 30m", fare: 850, totalSeats: 30, seatsAvailable: 30, bookedSeats: [], rating: 4.3, reviewsCount: 95 },
    { name: "Prachi Delhi Express", type: "Non-AC", source: "Delhi", destination: "Jaipur", departureTime: "09:00", arrivalTime: "14:30", duration: "05h 30m", fare: 450, totalSeats: 40, seatsAvailable: 40, bookedSeats: [], rating: 3.8, reviewsCount: 50 },

    // Pune → Mumbai
    { name: "Prachi Pune-Mumbai AC", type: "AC", source: "Pune", destination: "Mumbai", departureTime: "06:30", arrivalTime: "10:00", duration: "03h 30m", fare: 450, totalSeats: 40, seatsAvailable: 40, bookedSeats: [], rating: 4.5, reviewsCount: 140 },
    { name: "Prachi Pune-Mumbai Night", type: "Sleeper", source: "Pune", destination: "Mumbai", departureTime: "23:30", arrivalTime: "03:30", duration: "04h 00m", fare: 550, totalSeats: 25, seatsAvailable: 25, bookedSeats: [], rating: 4.2, reviewsCount: 60 },
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await Bus.deleteMany({});
        const result = await Bus.insertMany(buses);
        console.log(`✅ Seeded ${result.length} buses successfully`);
        process.exit();
    })
    .catch(err => {
        console.error('Error seeding data:', err);
        process.exit(1);
    });
