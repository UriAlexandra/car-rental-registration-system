const express = require('express');
const userRoutes = express.Router();

let User = require('../models/user');

// 1. Ügyfél/Dolgozó regisztrációja (Create user)
// Előfeltétel a kölcsönzéshez.
userRoutes.route('/users').post(async (req, res) => {
    try {
        // Ellenőrizzük, hogy létezik-e már ilyen felhasználónév
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ message: 'Ez a felhasználónév már foglalt!' });
        }

        const data = await User.create(req.body);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// 2. Bejelentkezés (Login)
// A feladat által kifejezetten kért bejelentkező felület kiszolgálása.
userRoutes.route('/users/login').post(async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username,
            password: req.body.password
        });

        if (!user) {
            return res.status(401).json({ message: 'Hibás felhasználónév vagy jelszó!' });
        }
        
        res.status(200).json({ 
            message: 'Sikeres bejelentkezés!',
            user: user 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// 3. Ügyfelek listázása (List users)
// Szükséges ahhoz, hogy a kölcsönzés rögzítésekor ki tudjuk választani az ügyfelet.
userRoutes.route('/users').get(async (req, res) => {
    try {
        const data = await User.find();
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = userRoutes;