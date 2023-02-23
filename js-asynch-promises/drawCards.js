const DECK_API = 'https://deckofcardsapi.com/api/deck/';

let deckId;
const $dealtDiv = $('#dealt-cards');

const rotations = [0, 5, 10, 15, 20, 25, 335, 340, 345, 350, 355];

$('#new-card').click(evt => {
    $.getJSON(`${DECK_API}${deckId}/draw`)
        .then(response => {
            if (response['success']) {
                const card = response['cards'][0];
                console.log(card.code)
                const rotClass = rotations[Math.floor(Math.random() * rotations.length)];
                $dealtDiv.append(`<img class="card rotate-${rotClass}" src="${card.image}"></img>`);
            } else {
                $('#new-card').attr('disabled', true);
                $('#new-card').text('None left!');
            }
        })
})

$.getJSON(`${DECK_API}new/shuffle`)
    .then(response => {
        deckId = response['deck_id'];
    });
