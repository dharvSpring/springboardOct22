"""Blogly application."""

from flask import Flask, request, redirect, render_template, flash
from models import db, connect_db, User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)
with app.app_context():
    db.drop_all()
    db.create_all()
    User.init_data()

from flask_debugtoolbar import DebugToolbarExtension
app.config['SECRET_KEY'] = "SECRET!"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

@app.route("/")
def redirect_home():
    """redirect from / to /users"""

    return redirect("/users")

@app.route("/users/")
def redirect_users_dir():
    """redirect from /users/ to /users"""

    return redirect("/users")

@app.route("/users")
def list_users():
    """Display a list of all users"""

    # Order by last_name, first_name
    users = User.query.order_by(User.last_name, User.first_name).all()
    return render_template('user_list.html', users=users)

@app.route("/users/new")
def new_user_form():
    """Form to create new users"""

    return render_template('new_user.html')

@app.route("/users/new", methods=['POST'])
def create_new_user():
    """Create new user"""

    first_name = request.form.get('first-name')
    last_name = request.form.get('last-name')
    image_url = request.form.get('image-url')
    if len(image_url) < 1:
        image_url = None

    new_user = User(first_name=first_name, last_name=last_name, image_url=image_url)
    db.session.add(new_user)
    db.session.commit()

    return redirect(f"/users/{new_user.id}")

@app.route("/users/<int:user_id>")
def display_user(user_id):
    """Display user with user_id"""

    user = User.query.get_or_404(user_id)
    return render_template('user_profile.html', user=user)

@app.route("/users/<int:user_id>/edit")
def display_user_edit(user_id):
    """Display edit form for user with user_id"""

    user = User.query.get_or_404(user_id)
    return render_template('edit_user.html', user=user)

@app.route("/users/<int:user_id>/edit", methods=['POST'])
def edit_user(user_id):
    """Update user with user_id"""

    first_name = request.form.get('first-name')
    last_name = request.form.get('last-name')
    image_url = request.form.get('image-url')
    if image_url == None or len(image_url) < 1:
        image_url = User.DEFAULT_PROFILE_IMAGE
    
    user = User.query.get_or_404(user_id)
    user.first_name = first_name
    user.last_name = last_name
    user.image_url = image_url

    db.session.add(user)
    db.session.commit()

    return redirect(f"/users/{user.id}")

@app.route("/users/<int:user_id>/delete", methods=['POST'])
def delete_user(user_id):
    """Delete user with user_id"""

    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()

    flash(f"Deleted {user.full_name}", "success")
    
    return redirect("/users")