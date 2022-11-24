def reverse_vowels(s):
    """Reverse vowels in a string.

    Characters which are not vowels do not change position in string, but all
    vowels (y is not a vowel), should reverse their order.

    >>> reverse_vowels("Hello!")
    'Holle!'

    >>> reverse_vowels("Tomatoes")
    'Temotaos'

    >>> reverse_vowels("Reverse Vowels In A String")
    'RivArsI Vewols en e Streng'

    reverse_vowels("aeiou")
    'uoiea'

    reverse_vowels("why try, shy fly?")
    'why try, shy fly?''
    """
    vowel_stack = []
    vowels = set('aeiou')
    for char in s:
        if char.lower() in vowels:
            vowel_stack.append(char)
    str_list = list(s)
    for idx in range(len(s)):
        if str_list[idx].lower() in vowels:
            str_list[idx] = vowel_stack.pop()
    return ''.join(str_list)