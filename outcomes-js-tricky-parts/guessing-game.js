function guessingGame() {
    let found = false;
    let guessCount = 0;
    let secret = Math.floor(Math.random() * 100);
    return (guess) => {
        if (!found) {
            guessCount++;
            if (guess == secret) {
                found = true;
                return `You win! You found ${secret} in ${guessCount} guesses.`;
            } else if (guess > secret) {
                return `${guess} is too high!`;
            } else {
                return `${guess} is too low!`;
            }
        } else {
            return "The game is over, you already won!";
        }
    }
}

module.exports = { guessingGame };
