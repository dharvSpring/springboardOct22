def same_frequency(num1, num2):
    """Do these nums have same frequencies of digits?
    
        >>> same_frequency(551122, 221515)
        True
        
        >>> same_frequency(321142, 3212215)
        False
        
        >>> same_frequency(1212, 2211)
        True
    """
    def _countFreq(string):
        counts = {}
        for char in string:
            counts[char] = counts.get(char, 0) + 1
        return counts
    
    return _countFreq(str(num1)) == _countFreq(str(num2))