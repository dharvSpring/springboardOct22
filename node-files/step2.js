const fs = require('fs');
const axios = require('axios');

function cat(path) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.log(err.toString());
            process.exit(1);
        }
        console.log(data);
    });
}

function webCat(url) {
    axios.get(url).then((response) => {
        console.log(response.data);
    }).catch((err) => {
        console.log(err.cause.toString());
        process.exit(1);
    })
}

const urlRegExp = new RegExp(/^(http|https):\/\/[^ "]+$/);
if (process.argv.length > 2) {
    const arg = process.argv[2];
    if (urlRegExp.test(arg)) {
        webCat(arg);
    } else {
        cat(arg);
    }
}