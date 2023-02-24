/** Command-line tool to generate Markov text. */

const {MarkovMachine} = require('./markov');
const fs = require('fs');
const axios = require('axios');


function handleError(err) {
    console.log(err);
    process.exit(1);
}

function handleData(data) {
    const mm = new MarkovMachine(data);
    console.log(mm.makeText());
}

//
//  Process arguments
//

const urlRegExp = new RegExp(/^(http|https):\/\/[^ "]+$/);
if (process.argv.length > 2) {
    const args = process.argv.slice(2);
    const src = args[0];
    if (urlRegExp.test(src)) {
        axios.get(src).then((response) => {
            handleData(response.data);
        }).catch((err) => {
            handleError(`Error loading ${src}`);
        });
    } else {
        fs.readFile(src, 'utf8', (err, fileData) => {
            if (err) {
                handleError(err.toString());
            }
            handleData(fileData);
        });
    }
}