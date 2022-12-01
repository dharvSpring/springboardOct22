const guessURL = '/guess';
const scoreURL = '/score';

const $guessForm = $('#guess-form');
const $guess = $('input[name="guess"]');
const $startGame = $('#start');

const $score = $('#score');
const $highscore = $('#highscore');
const $count = $('#count');
const $timer = $('#timer');

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
            }

            console.log(data.result);
            displayMessage(`${curGuess} ${responseMessages[data.result]}`);
        }
    }
}

function displayMessage(msg) {
    $('#demo-alert').text(msg);
}

async function updateTimer(game) {
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

    if (curGuess.length < 3) {
        displayMessage(`${curGuess} is too short!`);
    } else {
        game.makeGuess(curGuess);
        $guess.val('');
    }
}

async function startGame(event) {
    $startGame.hide();
    $guessForm.show();

    await axios.get('/start');

    game = new BoggleGame(user);
    intervalId = setInterval(updateTimer, 1000, game);
    game.start(intervalId);
}

async function load() {
    const {data: {highscore, gameCount}} = await axios.get(scoreURL);
    user = new BoggleUser(highscore, gameCount);
    $highscore.text(highscore);
    $count.text(gameCount);
}


$guessForm.on('submit', submitGuess);
$startGame.on('click', startGame);

$(load);