const guessURL = '/guess';
const scoreURL = '/score';

const $guessForm = $('#guess-form');
const $guess = $('input[name="guess"]');
const $startGame = $('#start');

const $score = $('#score');
const $highscore = $('#highscore');
const $count = $('#count');
const $timer = $('#timer');

const $words = $('#words');

let game = undefined;
let user = undefined;

responseMessages = {
    'ok' : 'is a valid guess',
    'not-on-board' : 'is not on the board',
    'not-word' : 'is not a word',
    'already-guessed' : 'has already been guessed',
};

class BoggleUser {
    constructor(highscore, gameCount) {
        this.highscore = highscore;
        this.gameCount = gameCount;
    }

    updateScore(highscore, gameCount) {
        this.highscore = highscore;
        this.gameCount = gameCount;

        // TODO probably checking for new highscore?
        // TODO game milestones?
        console.log(this.highscore);
        // this should be elsewhere
        $highscore.text(highscore);
        $count.text(gameCount);
    }
}

class BoggleGame {
    constructor(boggler) {
        this.boggler = boggler;
        this.score = 0;
        this.seconds = 60;
    }

    start(intervalId) {
        this.intervalId = intervalId;
    }

    stop() {
        clearInterval(this.intervalId);
        this.updateScore();
    }

    async updateScore() {
        const {data: {highscore, gameCount}} = await axios.post(scoreURL, {score: this.score});
        this.boggler.updateScore(highscore, gameCount);
    }

    isStarted() {
        return (this.intervalId != undefined);
    }

    isOver() {
        return (this.isStarted() && this.seconds <= 0);
    }

    async makeGuess(curGuess) {
        if (this.isOver()) {
            displayMessage('Game Over!');
        } else {
            const guessFormData = new FormData();
            guessFormData.append('guess', curGuess);
            const {data} = await axios.post(guessURL, guessFormData);
            
            if (data.result == 'ok') {
                this.score += curGuess.length;
                $score.text(this.score);
                $words.append(`<p class="word">${curGuess}</p>`);
            }

            console.log(data.result);
            if (!this.isOver()) {
                displayMessage(`${curGuess} ${responseMessages[data.result]}`);
            }
        }
    }
}

function displayMessage(msg) {
    $('#msg-alert').text(msg);
}

function updateTimer(game) {
    game.seconds -= 1;
    $timer.text(game.seconds);
    if (game.seconds <= 0) {
        game.stop();
        displayMessage('Game Over!');

        $startGame.show();
        $guessForm.hide();
    }
}

function submitGuess(event) {
    event.preventDefault();
    const curGuess = $guess.val();

    // boggle requires words be >= 3 letters
    if (curGuess.length < 3) {
        displayMessage(`${curGuess} is too short!`);
    } else {
        game.makeGuess(curGuess);
        $guess.val('');
    }
}

async function initialize() {
    const {data: {highscore, gameCount}} = await axios.get(scoreURL);

    // if $guessForm exists we are playing the game!
    if ($guessForm != undefined) {
        user = new BoggleUser(highscore, gameCount);
        game = new BoggleGame(user);
        intervalId = setInterval(updateTimer, 1000, game);
        game.start(intervalId);

        $guessForm.on('submit', submitGuess);
        $guessForm.show();
        $guess.focus();
    }

    $highscore.text(highscore);
    $count.text(gameCount);
}

$(initialize);