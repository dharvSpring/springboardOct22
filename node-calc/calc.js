const express = require('express');

const app = express();

//
// Calculation Functions
//

function mean(nums) {
    const sum = nums.reduce((sum, n) => (sum + n), 0);
    return (sum / nums.length);
}

function median(nums) {
    const sorted = nums.sort();
    const midPoint = Math.floor(sorted.length / 2);
    if (sorted.length % 2 == 0) {
        const medLow = Number.parseFloat(sorted[midPoint - 1]);
        const medHigh = Number.parseFloat(sorted[midPoint]);
        return (medLow + medHigh) / 2;
    } else {
        return Number.parseFloat(sorted[midPoint]);
    }
}

function mode(nums) {
    const numCounts = new Map();
    for (n of nums) {
        float = Number.parseFloat(n);
        numCounts.set(float, numCounts.has(float) ? numCounts.get(float) + 1 : 1);
    }
    
    modeEntry = Array.from(numCounts.entries()).reduce((mostEntry, curEntry) => {
        // take the first mode if there are multiple
        return mostEntry[1] < curEntry[1] ? curEntry : mostEntry;
    }, [0,0]);

    return modeEntry[0];
}

//
// Utilities
//

function parseNums(query) {
    return Array.from(query.nums.split(',')).map((val) => {
        // TODO Error Handling
        return Number.parseFloat(val);
    });
}


function createResponse(op, val) {
    return {
        response: {
            operation: op,
            value: val,
        }
    }
}

//
// Routes
//

app.get('/mean', (req, res, next) => {
    try {
        const nums = parseNums(req.query);
        throw "aaaa";
        return res.json(createResponse('mean', mean(nums)));
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.get('/median', (req, res, next) => {
    const nums = parseNums(req.query);
    
    return res.json(createResponse('median', median(nums)));
});

app.get('/mode', (req, res, next) => {
    const nums = parseNums(req.query);
    
    return res.json(createResponse('mode', mode(nums)));
});

app.get('/all', (req, res, next) => {
    const nums = parseNums(req.query);
    const calcJson = {
        operation: 'all',
        mean: mean(nums),
        median: median(nums),
        mode: mode(nums),
    }
    return res.json(calcJson);
})


app.use((err, req, res, next) => {
    // TODO Errors!
    console.log('ERRRRRR');
})

app.listen(3000, () => {
    console.log('server started');
})

module.exports = {
    mean,
    median,
    mode,
    parseNums,
    createResponse,
};