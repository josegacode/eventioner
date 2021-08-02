const express = require("express");
const app = express();
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
//const { Router } = require('express');
//const router = new Router();
const { client } = require('../index');
const members = require('./routes/member');

app.use(morgan('dev'));
app.set('port', process.env.API_PORT || 3000);
app.use(express.json()); // Parses JSON requests

/*
app.use(require('./routes')); 
app.use('/api/v1/eventioner', require('./routes/discord-server'));
*/
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

exports.app = app;

