/**
 * Dependencies
 * @type {*|createApplication}
 */
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');

/**
 * Controllers
 */
const Route = require('./src/controllers/Route');

//Create an express server and define a parsing strategy on it.
const server = express();

server.use(function(req, res, next) {
    // log each request to the console
    console.log(req.method, req.url);

    // continue doing what we were doing and go to the route
    next();
});

server.use(bodyParser.urlencoded({
    //Use deep parsing to deal with nested objects
    extended: true
}));

//Specify the use of json
server.use(bodyParser.json());

/**
 * Routes
 */
server.post('/', Route.route);

server.listen(3000, () => console.log('Listening on port 3000'));