"""Forms for Feedback"""

from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField
from wtforms.validators import InputRequired, Email, Length

class RegisterUserForm(FlaskForm):
    """Form to register a user"""
    
    username = StringField("Username", validators=[InputRequired(), Length(max=20)])
    password = PasswordField("Password", validators=[InputRequired()])
    email = StringField("Email", validators=[InputRequired(), Email(), Length(max=50)])
    first_name = StringField("First Name", validators=[InputRequired(), Length(max=30)])
    last_name = StringField("Last name", validators=[InputRequired(), Length(max=30)])

class LoginUserForm(FlaskForm):
    """Form to login a user"""
    
    username = StringField("Username", validators=[InputRequired()])
    password = PasswordField("Password", validators=[InputRequired()])

class AddUserFeedbackForm(FlaskForm):
    """Form to add feedback"""

    title = StringField("Title", validators=[InputRequired(), Length(max=100)])
    content = TextAreaField("Content", validators=[InputRequired()])