require('dotenv').config();
const mongoose = require('mongoose');
const connectDb = require('./dbHelper');
const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@stringermate.tduofoz.mongodb.net/?retryWrites=true&w=majority`;

if (process.env.NODE_ENV !== 'test') connectDb(MONGODB_URI);

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
                main_string: { type: String, required: true },    // TODO: separating gauge?
                main_tension: { type: Number, required: true },
                main_pre_stretch: String,    // TODO: establish relationship with PS table
                cross_string: { type: String, required: true },
                cross_tension: { type: Number, required: true },
                cross_pre_stretch: String,
                tension_measuring_unit: { type: String, required: true },     // TODO: establish relationship with units table
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