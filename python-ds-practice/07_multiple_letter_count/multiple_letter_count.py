def multiple_letter_count(phrase):
    """Return dict of {ltr: frequency} from phrase.

        >>> multiple_letter_count('yay')
        {'y': 2, 'a': 1}

        >>> multiple_letter_count('Yay')
        {'Y': 1, 'a': 1, 'y': 1}
    """
    # this is out of order, maybe because I'm using 3.8?
    # return {ltr:phrase.count(ltr) for ltr in set(phrase)}
    letterCounts = {}
    for char in phrase:
        letterCounts[char] = letterCounts.get(char, 0) + 1
    return letterCounts;