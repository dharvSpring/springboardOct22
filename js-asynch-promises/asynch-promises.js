// PART 1

const NUM_API = 'http://numbersapi.com/';

// 1

const FAV_NUM = 27;
$.getJSON(`${NUM_API}${FAV_NUM}/trivia?json`)
    .then(fact => {
        console.log(fact['text']);
    }
);

// 2

const OTHER_FAVS = [3, 9, 27, 33];
$.getJSON(`${NUM_API}${OTHER_FAVS}/trivia?json`)
    .then(facts => {
        for (const num of Object.keys(facts)) {
            console.log(facts[num]);
        }
    }
);

// 3

Promise.all([
    $.getJSON(`${NUM_API}${FAV_NUM}/trivia?json`),
    $.getJSON(`${NUM_API}${FAV_NUM}/trivia?json`),
    $.getJSON(`${NUM_API}${FAV_NUM}/trivia?json`),
    $.getJSON(`${NUM_API}${FAV_NUM}/trivia?json`),
]).then(facts => {
    const $numFactsDiv = $('#num-facts');
    $numFactsDiv.empty();
    for (fact of facts) {
        $numFactsDiv.append(`<div>${fact['text']}</div>`);
    }
})

// PART 2

const DECK_API = 'https://deckofcardsapi.com/api/deck/';

// 1

$.getJSON(`${DECK_API}new/draw`)
    .then(response => {
        const card = response['cards'][0];
        console.log(`${card.value} of ${card.suit}`);
    }
);

// 2
const cards = [];
$.getJSON(`${DECK_API}new/draw`)
    .then(response => {
        cards.push(response['cards'][0]);
        const deckId = response['deck_id'];
        return $.getJSON(`${DECK_API}${deckId}/draw`);
    }).then(response => {
    cards.push(response['cards'][0]);

    for (const card of cards) {
        console.log(`${card.value} of ${card.suit}`);
    }
});

// 3

// See drawCards.js