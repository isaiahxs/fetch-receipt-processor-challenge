const express = require('express');
const { router: pointsRouter } = require('./backend/points');
const path = require('path');
const app = express();

// Our middleware for parsing JSON bodies
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, './frontend/build')));

// API routes
app.use('/', pointsRouter);

// Anything that doesn't match the above, send back the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './frontend/build/index.html'));
});

module.exports = app;