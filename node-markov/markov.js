/** Textual markov chain generator */


class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.makeChains();
  }

  static choose(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    let chains = new Map();
    for (let idx = 0; idx < this.words.length; idx++) {
      const w = this.words[idx];
      if (!chains.has(w)) {
        chains.set(w, []);
      }

      const nextW = (idx + 1 < this.words.length) ? this.words[idx + 1] : null;
      
      // if (chains.has(w)) {
        chains.get(w).push(nextW);
      // } else {
        // chains.set(w, [nextW]);
      // }
    }
    this.chains = chains;
  }


  /** return random text from chains */

  makeText(numWords = 100) {
    let words = [];
    const keys = Array.from(this.chains.keys());
    let curWord = null;

    while (words.length < numWords) {
      if (curWord == null) {
        curWord = MarkovMachine.choose(keys);
      }
      const wordChain = this.chains.get(curWord);
      const nextWord = MarkovMachine.choose(wordChain);
      if (nextWord) {
        words.push(nextWord);
      }
      curWord = nextWord;
    }

    return words.join(' ');
  }
}

module.exports = {
  MarkovMachine,
};

// const mm = new MarkovMachine("the cat in the hat");
// console.log(mm.makeText(50));