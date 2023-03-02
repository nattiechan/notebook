const mongoose = require('mongoose');

const connectDb = (uri) => {
    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'stringmate'
    })
        .then(() => console.log('Connected to Mongo DB.'))
        .catch(error => {
            console.log(error);
            process.exit(1);
        });
}

module.exports = connectDb;