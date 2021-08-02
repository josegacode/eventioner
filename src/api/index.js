// Express and server modules
const express = require("express");
const app = express();
const morgan = require('morgan');

// OpenAPI
const swaggerUi = require('swagger-ui-express');

// All data serve by the API
// is through this object which
// represens the bot instance.
const { client } = require('../index');

// Routing modules
const members = require('./routes/member');
const guild = require('./routes/guild');

// Basic setup of server
app.use(morgan('dev'));
app.set('port', process.env.API_PORT || 3000);
app.use(express.json()); // Parses JSON requests

const baseURI = `127.0.0.1:${app.get('port')}`;
const swaggerDocument = {
  "title": "Eventioner API",
	"openapi": "3.0.0",
  "description": "An API for Eventioner which serves Discord Legion Hack server data to frontend clients",
  "termsOfService": "http://swagger.io/terms/",
	"host": baseURI,
  "contact": {
    "name": "API Support",
    "email": "josegarcia.dev@gmail.com"
  },
  "license": {
    "name": "Apache 2.0",
    "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
  },
  "version": "1.0.0"
} 

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Users routing handler (actually works as a middleware)
app.use('/api/members', members);

app.use('/api/guild', guild);

exports.app = app;

