const DECK_API = 'https://deckofcardsapi.com/api/deck/';

const $dealtDiv = $('#dealt-cards');
const rotations = [0, 5, 10, 15, 20, 25, 335, 340, 345, 350, 355];

let deck = {
    deck_id: null,

    init: async function() {
        this.deck_id = (await axios.get(`${DECK_API}new/shuffle`))['data'].deck_id;
        console.log(this.deck_id);
    },

    drawCard: async function() {
        const {data} = await axios.get(`${DECK_API}${this.deck_id}/draw`);

        if (data['success']) {
            const card = data['cards'][0];
            console.log(card.code)
            const rotClass = rotations[Math.floor(Math.random() * rotations.length)];
            $dealtDiv.append(`<img class="card rotate-${rotClass}" src="${card.image}"></img>`);
        } else {
            $('#new-card').attr('disabled', true);
            $('#new-card').text('None left!');
        }
    },
}
deck.init();

$('#new-card').click(() => deck.drawCard());
