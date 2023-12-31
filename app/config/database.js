const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

// mongoose.connect(,);
// const connection = mongoose.connection;
// connection.once('open', () => {
//     console.log('Database connected...');
// }).catch(err => {
//     console.log('Connection failed...')
// });

const configOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const connectToDB = async () => {
    mongoose
        .connect(process.env.MONGO_CONNECTION_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log('Ecommerce database connected successfully!'))
        .catch((err) =>
            console.log(`Getting Error from DB connection ${err.message}`)
        );

    // const connection = mongoose.connection    
    // let mongoStore = new MongoDbStoreSession({
    //     mongooseConnection: connection,
    //     collection: 'sessions'
    // })

    // app.use(
    //     session({
    //         secret: process.env.COOKIE_SECRET,
    //         resave: false,
    //         store: new mongoStore(),
    //         saveUninitialized: false,
    //         cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hour
    //     })
    // );
};

module.exports = connectToDB;
