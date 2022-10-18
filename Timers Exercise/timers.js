function countDown(num) {
    if (num === 0) {
        console.log('DONE!');
    } else {
        console.log(num);
        setTimeout (function () {
            countDown(num - 1);
        }, 1000);
    }
}

countDown(4);

function randomGame() {
    let count = 0;
    const id = setInterval(function () {
        count++;
        let rand = Math.random();
        if (rand > 0.75) {
            clearInterval(id);
            console.log(`It took ${count} attempts to get over 0.75`);
        }
    }, 1000);
}

// randomGame();