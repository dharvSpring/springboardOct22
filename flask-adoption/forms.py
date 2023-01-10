"""Forms for Adoption Agency"""

from flask_wtf import FlaskForm
from wtforms import BooleanField, StringField, IntegerField, SelectField
from wtforms.validators import InputRequired, NumberRange, Optional, URL

class AddPetForm(FlaskForm):
    """Form to add a pet for adoption"""

    name = StringField("Name", validators=[InputRequired()])
    species = SelectField("Species", choices=[("cat","Cat"), ("dog","Dog"), ("hedgehog","Hedgehog")])
    photo_url = StringField("Photo URL", validators=[Optional(), URL()])
    age = IntegerField("Age (in years)", validators=[Optional(), NumberRange(0, 30)])
    notes = StringField("Notes")
    # available = BooleanField("Available") This is going to be true when creating a Pet

class EditPetForm(FlaskForm):
    """Form to edit a pet """

    photo_url = StringField("Photo URL", validators=[Optional(), URL()])
    notes = StringField("Notes")
    available = BooleanField("Available?")