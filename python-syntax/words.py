def print_upper_words(words, must_start_with=['e']):
    """
    Print each of the words in UPPER CASE that start
    with letters in must_start_with. Defaults to 'e'
    """
    for word in words:
        if word[0] in must_start_with:
            print(word.upper())

print_upper_words(['all','else','elephant','oliphant'])
print_upper_words(["hello", "hey", "goodbye", "yo", "yes"],
        must_start_with={"h", "y"})
