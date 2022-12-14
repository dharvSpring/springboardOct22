"""Blogly application."""

from flask import Flask, request, redirect, render_template, flash
from models import db, connect_db, User, Post
from seed import seed_data

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly'
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
def redirect_home():
    """redirect from / to /users"""

    return redirect("/users")

#
# Users
#

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

    flash(f"Deleted user {user.full_name}", "success")
    
    return redirect("/users")

#
# Posts
#

@app.route("/posts/<int:post_id>")
def display_post(post_id):
    """Display post with post_id"""

    post = Post.query.get_or_404(post_id)
    return render_template('display_post.html', post=post)

@app.route("/users/<int:user_id>/posts/new")
def new_post_form(user_id):
    """Form to create new posts"""

    user = User.query.get_or_404(user_id)
    return render_template('new_post.html', user=user)

@app.route("/users/<int:user_id>/posts/new", methods=['POST'])
def create_new_post(user_id):
    """Create new post for user_id"""

    title = request.form.get('title')
    content = request.form.get('content')

    new_post = Post(title=title, content=content, user_id=user_id)
    db.session.add(new_post)
    db.session.commit()

    return redirect(f"/posts/{new_post.id}")

@app.route("/posts/<int:post_id>/edit")
def display_post_edit(post_id):
    """Display edit form for post with post_id"""

    post = Post.query.get_or_404(post_id)
    return render_template('edit_post.html', post=post)

@app.route("/posts/<int:post_id>/edit", methods=['POST'])
def edit_post(post_id):
    """Update post with post_id"""

    title = request.form.get('title')
    content = request.form.get('content')
    
    post = Post.query.get_or_404(post_id)
    post.title = title
    post.content = content
    # update timestamp?

    db.session.add(post)
    db.session.commit()

    return redirect(f"/posts/{post.id}")

@app.route("/posts/<int:post_id>/delete", methods=['POST'])
def delete_post(post_id):
    """Delete post with post_id"""

    post = Post.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()

    flash(f"Deleted post {post.title}", "success")
    
    return redirect("/users")