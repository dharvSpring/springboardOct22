from flask import Flask, request, render_template, redirect, flash, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

boggle_game = Boggle()
BOARD_KEY = "BOGGLE_BOARD"
HS_KEY = "HIGHSCORE"
COUNT_KEY = "NUM_GAMES"
GUESS_KEY = "GUESSES"

app = Flask(__name__)
app.config['SECRET_KEY'] = "password1"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

debug = DebugToolbarExtension(app)

def get_board(new=False):
    """Return the board for the session"""
    if new:
        session[BOARD_KEY] = boggle_game.make_board()
    return session[BOARD_KEY]

@app.route("/")
def show_home():
    """Load Default page and meta data"""
    return render_template("boggle.html", board=[])

@app.route("/start")
def start():
    """Start or restart the game"""
    session[BOARD_KEY] = boggle_game.make_board()
    session[GUESS_KEY] = None

    return redirect("/boggle")

@app.route("/boggle")
def show_board():
    """Display the board to the user"""
    return render_template("boggle.html", board=get_board())

@app.route("/guess", methods=["POST"])
def make_guess():
    """Check the user's guess and return json response"""
    guess = request.form.get('guess')
    result = check_guess(guess)
    ret_val = {'result': result}
    return jsonify(ret_val)

def check_guess(guess):
    guesses = session.get(GUESS_KEY)
    if guesses == None:
        guesses = set()
    else:
        guesses = set(guesses)
    
    if (guess.lower() in guesses):
        return 'already-guessed'
    guesses.add(guess.lower())
    session[GUESS_KEY] = list(guesses)

    return boggle_game.check_valid_word(get_board(), guess.lower())

@app.route("/score")
def get_score():
    """Returns the highscore and gameCount from the session"""
    ret_val = {'highscore': session.get(HS_KEY, 0), 'gameCount': session.get(COUNT_KEY, 0)}
    return jsonify(ret_val)

@app.route("/score", methods=["POST"])
def set_score():
    """Compares new score against high score and increments number of games played"""
    num_games = session.get(COUNT_KEY, 0) + 1
    session[COUNT_KEY] = num_games

    score = request.json.get('score', 0)
    high_score = session.get(HS_KEY, -1)
    if (score > high_score):
        session[HS_KEY] = score
    
    ret_val = {'highscore': session[HS_KEY], 'gameCount': num_games}
    return jsonify(ret_val)
