// PART 1

const NUM_API = 'http://numbersapi.com/';

// 1

const FAV_NUM = 27;

async function fetchNumberFact(num) {
    const {data} = await axios.get(`${NUM_API}${num}/trivia?json`);
    console.log(data.text);
}
fetchNumberFact(FAV_NUM);

// 2

const OTHER_FAVS = [3, 9, 27, 33];

async function fetchFacts(nums) {
    const {data} = await axios.get(`${NUM_API}${nums}/trivia?json`);
    for (key of Object.keys(data)) {
        console.log(data[key]);
    }
}
fetchFacts(OTHER_FAVS);

// 3

async function parrallelFetch(factNum, requestNum) {
    const promises = [];
    for (let i = 0; i < requestNum; i++) {
        promises.push(axios.get(`${NUM_API}${factNum}/trivia?json`));
    }
    const responses = await Promise.all(promises);
    const $numFactsDiv = $('#num-facts');
    $numFactsDiv.empty();
    for ({data} of responses) {
        $numFactsDiv.append(`<div>${data['text']}</div>`);
    }
}
parrallelFetch(FAV_NUM, 4);

// PART 2

const DECK_API = 'https://deckofcardsapi.com/api/deck/';

// 1

async function drawCard() {
    const {data: {cards}} = await axios.get(`${DECK_API}new/draw`);
    console.log(`${cards[0].value} of ${cards[0].suit}`);
}
drawCard();

// 2

async function drawTwoCards() {
    const fetchedCards = [];
    let {data: {cards, deck_id}} = await axios.get(`${DECK_API}new/draw`);
    fetchedCards.push(cards[0]);

    ({data: {cards}} = await axios.get(`${DECK_API}${deck_id}/draw`));
    fetchedCards.push(cards[0]);

    for (const card of fetchedCards) {
        console.log(`${card.value} of ${card.suit}`);
    }
}
drawTwoCards();

// 3

// See drawCards.js