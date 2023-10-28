const express = require('express');
const { router: pointsRouter } = require('./backend/Routes/pointRoutes');
// Core node module that provides utilities for working with file and directory paths
const path = require('path');
const app = express();
// const port = 3001;


// Our middleware for parsing JSON bodies
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, './frontend/build')));

// API routes
//  Mounting a router at a particular path so that all the routes defined within this router are prefixed with the given path
//  In this case, we're mounting it at the root path of "/", meaning the routes within pointsRouter will be accessible from the root of the URL of the server
app.use('/', pointsRouter);

// Anything that doesn't match the above, send back the index.html file
// Wildcard for any path.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './frontend/build/index.html'));
});

// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });

module.exports = app;