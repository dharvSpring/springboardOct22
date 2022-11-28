# Put your app in here.
from flask import Flask, request
from operations import add, sub, mult, div

app = Flask('__name__')

operation_dict = {
    "add": add,
    "sub": sub,
    "mult": mult,
    "div": div,
}

@app.route("/add")
def perform_add():
    """Add params a and b"""
    return calculate("add")

@app.route("/sub")
def perform_sub():
    """Subtract param b from a"""
    return calculate("sub")

@app.route("/mult")
def perform_mult():
    """Multiply params a and b"""
    return calculate("mult")

@app.route("/div")
def perform_div():
    """Divide param a by b"""
    return calculate("div")

@app.route("/math/<operation>")
def calculate(operation):
    """Perform the specificed operation on the params"""
    a = int(request.args['a'])
    b = int(request.args['b'])
    try:
        returnVal = operation_dict[operation](a, b)
    except KeyError:
        return f"<h1>Operation {operation} is not supported</h1>"

    return str(returnVal)
