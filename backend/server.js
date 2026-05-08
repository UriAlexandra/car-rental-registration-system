let express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    dbConfig = require('./database/db'); //MongoDB csatlakozás URI-nak

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db).then(() => {
    let now = new Date();
    console.log('Database connected successfully ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds());
}).catch(err => {
    console.log('Could not connect to database : ' + err);
});

// A projekt specifikus útválasztói (Routes)
const vehicleRoute = require('./routes/vehicle.routes'); // A járművek (autók, hajók) kezelésére
const userRoute = require('./routes/user.routes');       // A dolgozók és ügyfelek kezelésére, hitelesítésre

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors());

// Az Angular buildelt fájljainak kiszolgálása
app.use('/', express.static(path.join(__dirname, '..', 'dist', 'car-rental-registration-system', 'browser')));

// API végpontok regisztrálása
app.use('/api', vehicleRoute);
app.use('/api', userRoute);

// Minden egyéb kérést (ami nem /api-val kezdődik) az Angular index.html-jéhez irányítunk,
// így az Angular belső routere (SPA) tudja kezelni a navigációt.
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(__dirname, '..', 'dist', 'car-rental-registration-system', 'browser', 'index.html'));
});

// Szerver indítása
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port );
});