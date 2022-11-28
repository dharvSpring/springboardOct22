"""Word Finder: finds random words from a dictionary."""

from random import randrange

class WordFinder:
    """Find random words in a dictionary
    
    >>> wf = WordFinder("shortwords.txt")
    3 words read

    >>> wf.random() in ["flumph", "ooze", "goblin"]
    True

    >>> wf.random() in ["flumph", "ooze", "goblin"]
    True

    >>> wf.random() in ["flumph", "ooze", "goblin"]
    True

    >>> wf.random() in ["flumph", "ooze", "goblin"]
    True
    """
    def __init__(self, filepath):
        """
        Create a WordFinder for the given filepath
        File should have 1 word per line
        """

        self.filepath = filepath
        self.word_count = 0
        self.words = []

        self.read_words()
    
    def __repr__(self):
        return f"WordFinder filepath={self.filepath}"

    def read_words(self):
        """Process the words in the file for use"""
        with open(self.filepath, encoding="utf-8") as f:
            for line in f:
                self.word_count += 1
                self.words.append(line.strip('\n'))
        print(f"{self.word_count} words read")

    def random(self):
        """Returns a random word from the filepath"""
        selected = randrange(self.word_count)
        return self.words[selected]
    