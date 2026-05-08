const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Vehicle = new Schema({
    vehicleCategory: {
        type: String, // 'CAR', 'WATERCRAFT'
        required: true
    },
    type: {
        type: String, //'SUV', 'Motorcsónak'
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    licensePlate: {
        type: String, // Rendszám autókhoz, lajstromszám vízi járművekhez
        required: true,
        unique: true  // Megakadályozza, hogy már létező terméket (járművet) adjunk hozzá
    },
    chassisNumber: {
        type: String,
        required: true
    },
    purchaseDate: {
        type: Date
    },
    serialNumber: {
        type: Number,
        required: true
    },
    dailyRentalFee: {
        type: Number, // Szigorú típusellenőrzés: szám helyett nem fogad el szöveget
        required: true
    },
    perKmFee: {
        type: Number, // Szigorú típusellenőrzés: szám helyett nem fogad el szöveget
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'AVAILABLE' // AVAILABLE, RENTED, SCRAPPED
    }
}, {
    collection: 'vehicles'
})

module.exports = mongoose.model('vehicles', Vehicle)