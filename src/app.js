const express = require('express');
const app = express();
require('./spreadsheet-handler');
//app.use(require('./routes/google.routes'));
module.exports = app;
