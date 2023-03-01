require('dotenv').config();
const mongoose = require('mongoose');
const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@stringermate.tduofoz.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'stringmate'
})
    .then(() => console.log('Connected to Mongo DB.'))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });

const Schema = mongoose.Schema;

const ordersSchema = new Schema(
    {
        date_in: { type: Date, required: true },
        due_timestamp: { type: Date, required: true },        // timestamp in UTC
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },        // TODO: establish relationship with player table
        isOnCourt: Boolean,
        orders: [
            {
                num_of_racquets: Number,
                racquet_name: String,   // TODO: establish relationship with racquet table
                main_string: String,    // TODO: separating gauge?
                main_tension: Number,
                main_pre_stretch: String,    // TODO: establish relationship with PS table
                cross_string: String,
                cross_tension: Number,
                cross_pre_stretch: String,
                tension_measuring_unit: String,     // TODO: establish relationship with units table
                num_of_knots: Number,   // Possible TODO: establish relationship with knots table
                logo: String,
            }
        ],
        notes: String,
        stringer: String,   // TODO: establish relationship with stringers table
        total_cost: Number,
        isPaid: Boolean,
        payment_method: String  // TODO: establish relationship with payment methods table
    }
);


const Orders = mongoose.model('order', ordersSchema);

module.exports = { Orders };