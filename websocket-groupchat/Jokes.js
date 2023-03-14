/** Fetch a joke! */

const axios = require('axios');

const JOKE_URL = 'https://v2.jokeapi.dev/joke/Any?safe-mode&type=single';

async function getJoke() {
    try {
        const joke = await axios.get(JOKE_URL);
        if (joke.data.joke) {
            return joke.data.joke;
        }
    } catch (e) {
        console.error(e)
    }
    return 'If a cop pulls over a uhaul, did they bust a move?';
}

module.exports = getJoke;