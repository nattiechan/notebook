const path = require('path');
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || process.env.CLIENT_PORT;

app.get('/', (_, res) => res.sendFile(path.join(__dirname, '../client/index.html')));

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

module.exports = app;