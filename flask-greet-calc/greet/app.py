from flask import Flask

app = Flask('__name__')

@app.route('/welcome')
def say_welcome():
    return 'welcome'

@app.route('/welcome/<postfix>')
def say_welcome_postfix(postfix):
    return f"welcome {postfix}"

