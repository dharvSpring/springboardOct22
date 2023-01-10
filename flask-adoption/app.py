"""Adoption Agency app"""

from flask import Flask, request, redirect, render_template, flash
from models import db, connect_db, Pet
from forms import AddPetForm, EditPetForm
from seed import seed_data

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///adopt'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)
with app.app_context():
    db.drop_all()
    db.create_all()
    seed_data(db)

from flask_debugtoolbar import DebugToolbarExtension
app.config['SECRET_KEY'] = "SECRET!"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

@app.route("/")
def home_page():
    """Show the list of pets"""

    pets = Pet.query.all()

    return render_template("pet_list.html", pets=pets)

@app.route("/add", methods=['GET', 'POST'])
def add_pet():
    """Add a pet"""

    add_pet_form = AddPetForm()

    if add_pet_form.validate_on_submit():
        new_pet = Pet(name=add_pet_form.name.data,
                      species=add_pet_form.species.data,
                      age=add_pet_form.age.data,
                      photo_url=add_pet_form.photo_url.data if len(add_pet_form.photo_url.data) > 0 else None,
                      notes=add_pet_form.notes.data)
        
        db.session.add(new_pet)
        db.session.commit()

        flash(f"Added {new_pet.name}", "success")
        return redirect("/")
    else:
        return render_template("add_pet.html", form=add_pet_form)

@app.route("/<int:pet_id>", methods=['GET', 'POST'])
def display_pet(pet_id):
    """Display/edit the given pet"""

    pet = Pet.query.get_or_404(pet_id)
    form = EditPetForm(obj=pet)

    if form.validate_on_submit():
        pet.photo_url = form.photo_url.data
        pet.notes = form.notes.data
        pet.available = form.available.data
        db.session.commit()

        flash(f"Edited {pet.name}", "success")
        return redirect(f"/")
    else:
        return render_template("show_pet.html", pet=pet, form=form)