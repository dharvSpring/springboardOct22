"""Python serial number generator."""

class SerialGenerator:
    """Machine to create unique incrementing serial numbers.
    
    >>> serial = SerialGenerator(start=100)

    >>> serial.generate()
    100

    >>> serial.generate()
    101

    >>> serial.generate()
    102

    >>> serial.reset()

    >>> serial.generate()
    100
    """
    def __init__(self, start):
        """Initialize a serial generator starting at start"""
        self.start = start
        self.current = start

    def __repr__(self):
        """Show representation of the generator"""
        return f"SerialGenerator start={self.start} next={self.current}"

    def generate(self):
        """Generate a new serial number, in order"""
        new_serial = self.current
        self.current += 1
        return new_serial
    
    def reset(self):
        """Reset the generator to the starting serial number"""
        self.current = self.start
