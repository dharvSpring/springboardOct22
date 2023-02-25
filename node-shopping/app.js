const express = require('express');
const app = express();

const itemRouter = require('./items');
const ExpressError = require("./expressError")


app.use(express.json());
app.use('/items', itemRouter);

// 404 handler
app.use(function (req, res, next) {
    return next(new ExpressError("Not Found", 404));
});

// Global Error Handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message;
    return res.status(status).json({
        status,
        message,
    });
});

module.exports = app;