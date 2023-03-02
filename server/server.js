require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || process.env.CLIENT_PORT;

const ordersRouter = require('./routes/orders');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/orders', ordersRouter);

app.get('/', (_, res) => res.sendFile(path.join(__dirname, '../client/index.html')));

// unknown route handler
app.use((_, res) => res.status(404).send('Not found'));

// global catch-all error handler
app.use((err, _, res, __) => {
    const defaultError = {
        log: 'Express error handler caught unknown middleware error',
        status: 500,
        message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign(defaultError, err);
    return res.status(errorObj.status).json(errorObj.message);
})

const server = app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

module.exports = { app, server };