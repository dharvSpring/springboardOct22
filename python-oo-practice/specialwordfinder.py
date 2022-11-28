from wordfinder import WordFinder

class SpecialWordFinder(WordFinder):
    """
    Specialized WordFinder that discards empty lines and ignores comments.
    Comments are lines which start with '#'

    >>> wf = SpecialWordFinder("food.txt")
    4 words read

    >>> wf.random() in ["kale", "parsnips", "apple", "mango"]
    True

    >>> wf.random() in ["kale", "parsnips", "apple", "mango"]
    True

    >>> wf.random() in ["kale", "parsnips", "apple", "mango"]
    True

    >>> wf.random() in ["kale", "parsnips", "apple", "mango"]
    True
    """

    def read_words(self):
        """Process words but ignore blank lines and comments"""
        with open(self.filepath, encoding="utf-8") as f:
            for line in f:
                cur_word = line.strip()
                if len(cur_word) > 0 and cur_word[0] != '#':
                    self.word_count += 1
                    self.words.append(cur_word)
        print(f"{self.word_count} words read")