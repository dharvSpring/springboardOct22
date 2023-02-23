const fs = require('fs');

function cat(path) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.log(err.toString());
            process.exit(1);
        }
        console.log(data);
    });
}

if (process.argv.length > 2) {
    cat(process.argv[2]);
}