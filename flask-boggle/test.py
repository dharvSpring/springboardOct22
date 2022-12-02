from unittest import TestCase
from app import app, check_guess
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        """setup for each test"""
        self.valid_responses = {'ok', 'not-word', 'not-on-board', 'already-guessed'}
        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_home(self):
        """Test the home page"""

        with self.client:
            response = self.client.get('/')
            html = response.get_data(as_text=True)

            # Ensure nothing has yet been initialized
            self.assertIsNone(session.get('BOARD'))
            self.assertIsNone(session.get('HIGHSCORE'))
            self.assertIsNone(session.get('NUM_GAMES'))
            self.assertIsNone(session.get('GUESSES'))

            # html check: start is visible, board is not present
            self.assertIn('<form id="start" action="/start">', html)
            self.assertNotIn('<table id="board">', html)
    
    def test_start(self):
        """Test game start"""

        with self.client:
            response = self.client.get('/start', follow_redirects=True) # ends up at /boggle
            html = response.get_data(as_text=True)

            # Ensure only board has been initialized
            self.assertIn('BOARD', session)
            self.assertIsNone(session.get('HIGHSCORE'))
            self.assertIsNone(session.get('NUM_GAMES'))
            self.assertIsNone(session.get('GUESSES'))

            # html check: start is hidden, board is initialized
            self.assertIn('<form id="start" action="/start" style="display: none;">', html)
            self.assertIn('<table id="board">', html)

            # score and time are added
            self.assertIn('<h3>Score:', html)
            self.assertIn('<h3>Time:', html)

    def test_invalid_word(self):
        """Test if word is in the dictionary"""

        self.client.get('/start', follow_redirects=True)
        response = self.client.get('/guess?guess=overplenteously')
        self.assertEqual(response.json['result'], 'not-on-board')
    
    def test_jibberish_word(self):
        """Test if nonsense is in the dictionary"""

        self.client.get('/start', follow_redirects=True)
        response = self.client.get('/guess?guess=gidkwdoxx')
        self.assertEqual(response.json['result'], 'not-word')

    def test_check_guess(self):
        """Test for valid words being detected, case insensitive"""

        with self.client as client:
            client.get('/start', follow_redirects=True)
            with client.session_transaction() as change_session:
                change_session['BOARD'] = [['B', 'A', 'D', 'A', 'D'],
                                           ['B', 'A', 'D', 'P', 'D'],
                                           ['B', 'A', 'D', 'P', 'D'],
                                           ['B', 'A', 'D', 'L', 'A'],
                                           ['B', 'A', 'D', 'E', 'D']]
            # case insensitive
            for word in ['bad', 'Apple', 'DEAD']:
                response = client.get(f'/guess?guess={word}')
                self.assertEqual(response.json['result'], 'ok')
    
    def test_check_already_guessed(self):
        """Test for already guessed words"""

        with self.client as client:
            client.get('/start', follow_redirects=True)
            with client.session_transaction() as change_session:
                change_session['BOARD'] = [['B', 'A', 'D', 'A', 'D'],
                                           ['B', 'A', 'D', 'P', 'D'],
                                           ['B', 'A', 'D', 'P', 'D'],
                                           ['B', 'A', 'D', 'L', 'A'],
                                           ['B', 'A', 'D', 'E', 'D']]
            # case insensitive
            for word in ['bad', 'Apple', 'DEAD', 'qwerty', 'lAQ']:
                response = client.get(f'/guess?guess={word}')
                self.assertIn(response.json['result'], self.valid_responses)
            
            # case insensitive
            for word in ['baD', 'ApPle', 'Dead', 'QWERTY', 'Laq']:
                response = client.get(f'/guess?guess={word}')
                self.assertEqual(response.json['result'], 'already-guessed')

    def score_eq_helper(self, response, highscore, game_count):
        """Helper method to confirm correct scores"""

        self.assertEqual(response.json['highscore'], highscore)
        self.assertEqual(response.json['gameCount'], game_count)

    def test_read_score(self):
        """Test read score"""

        response = self.client.get('/score')
        self.score_eq_helper(response, 0, 0)

    def test_write_score(self):
        """Test write score"""

        response = self.client.get('/score')
        self.score_eq_helper(response, 0, 0)

        response = self.client.post('/score', json={'score': 12})
        self.score_eq_helper(response, 12, 1)

        # new score is not a new highscore
        response = self.client.post('/score', json={'score': 8})
        self.score_eq_helper(response, 12, 2)

        # new score is a new highscore
        response = self.client.post('/score', json={'score': 20})
        self.score_eq_helper(response, 20, 3)
        
        # confirm read score is correct at the end
        response = self.client.get('/score')
        self.score_eq_helper(response, 20, 3)