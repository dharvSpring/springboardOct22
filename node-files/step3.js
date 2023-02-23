const fs = require('fs');
const axios = require('axios');


//
//  Output and Error helper methods
//

let outFile = null;

function handleError(err) {
    console.log(err);
    process.exit(1);
}

function handleData(data) {
    if (outFile == null) {
        console.log(data);
    } else {
        fs.writeFile(outFile, data, 'utf8', (err) => {
            if (err) {
                handleError(err.toString());
            }
        });
    }
}


//
//  cat methods
//

function cat(path) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            handleError(err.toString());
        }
        handleData(data);
    });
}

function webCat(url) {
    axios.get(url).then((response) => {
        handleData(response.data);
    }).catch((err) => {
        handleError(err.cause.toString());
    })
}


//
//  Process arguments
//

const urlRegExp = new RegExp(/^(http|https):\/\/[^ "]+$/);
if (process.argv.length > 2) {
    // let arg = process.argv[2];

    const args = process.argv.slice(2);

    let startIdx = 0;
    if (args[0] == '--out') {
        outFile = args[1];
        startIdx = 2;
    }

    for (let idx = startIdx; idx < args.length; idx++) {
        if (urlRegExp.test(args[idx])) {
            webCat(args[idx]);
        } else {
            cat(args[idx]);
        }
    }
}