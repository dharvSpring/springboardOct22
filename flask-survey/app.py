from flask import Flask, request, render_template, redirect, flash, session
from flask_debugtoolbar import DebugToolbarExtension
from surveys import satisfaction_survey as survey

app = Flask(__name__)
app.config['SECRET_KEY'] = "password1"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

debug = DebugToolbarExtension(app)

RESPONSES_KEY = "response"

@app.route("/")
def show_home():
    """Display the survey page with the default survey"""
    return render_template("survey.html", survey=survey)

@app.route("/start", methods=['POST'])
def start_survey():
    """Clear response and start survey"""
    session[RESPONSES_KEY] = []
    return redirect("/question/0")

@app.route("/question/<int:qid>")
def show_question(qid):
    """Display the requested question for the survery"""
    responses = session.get(RESPONSES_KEY)
    if responses == None:
        return redirect('/')
    if len(responses) != qid:
        flash("Attempting to access invalid question, redirecting!")
        return redirect(f"/question/{len(responses)}")
    if qid >= len(survey.questions):
        return redirect('/completed')

    cur_q = survey.questions[qid]
    return render_template("question.html", survey=survey, question=cur_q)

@app.route("/answer", methods=['POST'])
def answer_question():
    cur_answer = request.form.get('answer')
    responses = session.get(RESPONSES_KEY, [])
    responses.append(cur_answer)
    session[RESPONSES_KEY] = responses

    if len(responses) >= len(survey.questions):
        return redirect("/completed")

    return redirect(f"/question/{len(responses)}")

@app.route("/completed")
def completed_survey():
    responses = session.get(RESPONSES_KEY)
    if responses == None:
        return redirect('/')
    if len(responses) != len(survey.questions):
        flash("You're not done yet!")
        return redirect(f"/question/{len(responses)}")
    
    return render_template("completed.html", survey=survey, responses=responses)