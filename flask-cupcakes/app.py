"""Flask app for Cupcakes"""

from flask import Flask, request, redirect, jsonify, render_template
from models import db, connect_db, Cupcake
from forms import AddCupcakeForm
from seed import seed_data

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcake'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)
with app.app_context():
    db.drop_all()
    db.create_all()
    seed_data(db)

app.config['SECRET_KEY'] = "SECRET!"

API_PREFIX = "/api/cupcakes"

@app.route("/")
def show_index():
    """Return simple cupcake page"""

    form = AddCupcakeForm()

    return render_template('index.html', form=form)

#
# All Cupcakes
#

@app.route(f"{API_PREFIX}")
def get_all_cupcakes():
    """Return JSON info on all cupcakes"""

    cupcakes = Cupcake.query.all()
    cupcake_list = [cupcake.serialize() for cupcake in cupcakes]
    return jsonify(cupcakes=cupcake_list)

@app.route(f"{API_PREFIX}", methods=['POST'])
def create_cupcake():
    """Create a new cupcake"""

    new_cupcake = Cupcake(
        flavor=request.json.get('flavor', None),
        size=request.json.get('size', None),
        rating=request.json.get('rating', None),
        image=request.json.get('image', None),
    )

    db.session.add(new_cupcake)
    db.session.commit()

    return (jsonify(cupcake=new_cupcake.serialize()), 201)

#
# Specific Cupcake
#

@app.route(f"{API_PREFIX}/<int:cupcake_id>")
def get_cupcake(cupcake_id):
    """Return JSON info for given cupcake_id"""

    cupcake = Cupcake.query.get_or_404(cupcake_id)

    return jsonify(cupcake=cupcake.serialize())

@app.route(f"{API_PREFIX}/<int:cupcake_id>", methods=['PATCH'])
def update_cupcake(cupcake_id):
    """Update the given cupcake"""

    cupcake = Cupcake.query.get_or_404(cupcake_id)
    cupcake.flavor = request.json.get('flavor', cupcake.flavor)
    cupcake.size = request.json.get('size', cupcake.size)
    cupcake.rating = request.json.get('rating', cupcake.rating)
    cupcake.image = request.json.get('image', cupcake.image)
    db.session.commit()

    return jsonify(cupcake=cupcake.serialize())

@app.route(f"{API_PREFIX}/<int:cupcake_id>", methods=['DELETE'])
def delete_cupcake(cupcake_id):
    """Delete given cupcake"""

    cupcake = Cupcake.query.get_or_404(cupcake_id)
    db.session.delete(cupcake)
    db.session.commit()

    return jsonify(message="Deleted")
