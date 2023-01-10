"""Forms for Cupcakes"""

from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, SelectField
from wtforms.validators import InputRequired, NumberRange, Optional, URL

# this is overkill and the JS isn't going to actually enforce this validation
# I just wanted to use WTForms again, since I just learned it
class AddCupcakeForm(FlaskForm):
    """Form to add a cupcake"""

    flavor = StringField("Flavor", validators=[InputRequired()])
    size = StringField("Size", validators=[InputRequired()])
    # size = SelectField("Size", choices=[("small","Small"), ("medium","Medium"), ("large","Large")])
    rating = FloatField("Rating", validators=[NumberRange(0, 10)])
    image = StringField("Image URL", validators=[Optional(), URL()])
    