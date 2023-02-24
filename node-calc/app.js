const express = require('express');
const {mean, median, mode} = require('./calc');
const {parseNums} = require('./utilities');

const app = express();

//
// Routes
//

app.get('/mean', (req, res, next) => {
    try {
        const nums = parseNums(req.query);
        return res.json({
            operation: 'mean',
            value: mean(nums),
        });
    } catch (err) {
        next(err);
    }
});

app.get('/median', (req, res, next) => {
    try {
        const nums = parseNums(req.query);
        return res.json({
            operation: 'median',
            value: median(nums),
        });
    } catch (err) {
        next(err);
    }
});

app.get('/mode', (req, res, next) => {
    try {
        const nums = parseNums(req.query);
        return res.json({
            operation: 'mode',
            value: mode(nums),
        });
    } catch (err) {
        next(err);
    }
});

app.get('/all', (req, res, next) => {
    const nums = parseNums(req.query);
    return res.json({
        operation: 'all',
        mean: mean(nums),
        median: median(nums),
        mode: mode(nums),
    });
})


app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message;
    return res.status(status).json({
        status,
        message,
    });
})

app.listen(3000, () => {
    console.log('server started');
})
