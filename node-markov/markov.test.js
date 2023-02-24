const {MarkovMachine} = require('./markov');

describe('Basic Markov tests', () => {

    test('Count cat in the hat', () => {
        const mm = new MarkovMachine("the cat in the hat");
        const mmText = mm.makeText(50);
        expect(mmText).toEqual(expect.any(String));

        const mmWords = mmText.split(' ');
        expect(mmWords.length).toEqual(50);
    });

    test('Verify cat in the hat words', () => {
        const mm = new MarkovMachine("the cat in the hat");
        const mmText = mm.makeText(50);
        const mmWords = mmText.split(' ');

        const expectedWords = "the cat in the hat".split(' ');
        for (w of mmWords) {
            expect(expectedWords).toContainEqual(w);
        }

    }); 
});