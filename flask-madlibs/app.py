from flask import Flask, request
from flask_debugtoolbar import DebugToolbarExtension
from jinja2 import Environment, PackageLoader

import stories

app = Flask('__name__')
app.debug = True
app.config['SECRET_KEY'] = 'password1'
debug = DebugToolbarExtension(app)

env = Environment(
    loader=PackageLoader('app', 'templates'),
)

@app.route('/')
def home():
    story = get_story()

    answers = get_answers(story)
    output = None
    if answers != None:
        output = story.generate(answers)

    madlib_temp = env.get_template('madlib.html')
    return madlib_temp.render(prompts=story.prompts, story=output)


def get_story():
    """Gets a madlib story"""
    # probably somehow store the story_id to reference later
    return stories.story

def get_answers(story):
    """Read the answers from the url params for a given story"""
    answers = {}
    valid = False
    for prompt in story.prompts:
        answer = request.args.get(prompt)
        if answer != None and len(answer) > 0:
            valid = True
            answers[prompt] = answer
    if valid:
        return answers
    return None
