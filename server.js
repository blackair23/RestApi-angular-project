const express = require('express');
const  mongoose = require('mongoose');
const authController = require('./controllers/authController');
const catalogController = require('./controllers/catalogController');
const cors = require('./middlewares/cors');
const session = require('./middlewares/session');

const CONNECTION_STRING = 'mongodb://127.0.0.1:27017/angularProject'

start();

async function start() {

    await mongoose.connect(CONNECTION_STRING);
    console.log('Database Connected!');

    const app = express();
    
    app.use(express.json());
    app.use(cors());
    app.use(session());
    app.use('/image', express.static('image'))

    app.get('/', (req, res) => {
        res.json({message: 'Rest service operational!'});
    });
    app.use('/users', authController);
    app.use('/data/catalog', catalogController);

    app.listen(3030, () => console.log('RestApi is running on port 3030!'));
}
