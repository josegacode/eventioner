const express = require("express");
const app = express();
const path = require('path');

app.set('port', process.env.API_PORT || 3000);
app.use(express.json()); // Parses JSON requests
app.use(require('./routes')); 
app.use('/api/v1/', require('./routes/index'));

module.exports = { api: app }

