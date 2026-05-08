const express = require('express');
const vehicleRoutes = express.Router();

let Vehicle = require('../models/vehicle');

// Új jármű hozzáadása (Create)
vehicleRoutes.route('/vehicles').post(async (req, res) => {
    try {
        const data = await Vehicle.create(req.body);
        res.json(data);
    } catch (error) {
        console.log(error);
        // Ha az adatbázis validáció elbukik (pl. szöveget adtunk számnak, 
        // vagy a rendszám nem egyedi), itt kapjuk el a hibát.
        res.status(500).json({ error: error.message });
    }
});

// Az összes jármű listázása (Read)
vehicleRoutes.route('/vehicles').get(async (req, res) => {
    try {
        const data = await Vehicle.find();
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// Jármű lekérése azonosító alapján (Read by ID)
vehicleRoutes.route('/vehicles/:id').get(async (req, res) => {
    try {
        const data = await Vehicle.findById(req.params.id);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// Jármű adatainak szerkesztése (Update)
vehicleRoutes.route('/vehicles/:id').put(async (req, res) => {
    try {
        const data = await Vehicle.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true } // A runValidators gondoskodik a módosításkori típusellenőrzésről
        );
        res.json(data);
        console.log('Vehicle updated successfully!');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// Jármű törlése (Delete)
vehicleRoutes.route('/vehicles/:id').delete(async (req, res) => {
    try {
        const data = await Vehicle.findByIdAndDelete(req.params.id);
        res.status(200).json({
            msg: data
        });
        console.log('Vehicle deleted successfully!');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = vehicleRoutes;