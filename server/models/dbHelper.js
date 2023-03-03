const mongoose = require('mongoose');

const connectDb = (uri) => {
    const dbName = process.env.NODE_ENV === 'cypress' ? 'stringmate-cypress' : 'stringmate';
    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: dbName
    })
        .then(() => console.log('Connected to Mongo DB.'))
        .catch(error => {
            console.log(error);
            process.exit(1);
        });
}

module.exports = connectDb;