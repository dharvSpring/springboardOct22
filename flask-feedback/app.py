"""Flask app for Feedback"""

from flask import Flask, flash, request, redirect, render_template, session
from models import db, connect_db, User, Feedback
from forms import RegisterUserForm, LoginUserForm, AddUserFeedbackForm
from sqlalchemy.exc import IntegrityError
from seed import seed_data

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///feedback'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)
with app.app_context():
    db.drop_all()
    db.create_all()
    seed_data(db)

app.config['SECRET_KEY'] = "SECRET!"
USER_ID_KEY = "username"

def get_authenticated_user():
    """Return the authenticated user or None"""

    username = session.get(USER_ID_KEY, None)
    if username == None:
        return None

    auth_user = User.query.get(username)
    return auth_user


def user_authenticated(username=None):
    """
    Helper method to confirm the user specified is the user in the session

    If username is None: return True if any user is in the session
    """

    if username == None:
        return session.get(USER_ID_KEY, None) != None

    user = User.query.get_or_404(username)
    return username == session.get(USER_ID_KEY, None)

def login_error_redirect():
    """Inform the user they are not authorized for this page and return 401"""
    
    return render_template("401.html"), 401

@app.route("/")
def get_home():
    """Redirect to /register"""

    return redirect("/register")

@app.errorhandler(404)
def page_not_found(error):
    return render_template("404.html"), 404

#
# Users
#

@app.route("/register", methods=['GET', 'POST'])
def handle_register():
    """Registration view"""

    if user_authenticated():
        username = session.get(USER_ID_KEY)
        flash(f"Already signed in", "warning")
        return redirect(f"/users/{username}")
    
    register_form = RegisterUserForm()
    if register_form.validate_on_submit():
        new_user = User.register_user(
            username=register_form.username.data,
            password=register_form.password.data,
            email=register_form.email.data,
            first_name=register_form.first_name.data,
            last_name=register_form.last_name.data,
        )
        db.session.add(new_user)
        try:
            db.session.commit()
        except IntegrityError:
            register_form.username.errors.append('Username taken! Please pick another.')
            return render_template('register.html', form=register_form)

        session[USER_ID_KEY] = new_user.username
        flash(f"Created new user {new_user.username}", "success")
        
        return redirect(f"/users/{new_user.username}")
    else:
        return render_template("register.html", form=register_form)

@app.route("/login", methods=['GET', 'POST'])
def handle_login():
    """Login view"""

    if user_authenticated():
        username = session.get(USER_ID_KEY)
        flash(f"Already signed in", "warning")
        return redirect(f"/users/{username}")

    login_form = LoginUserForm()
    if login_form.validate_on_submit():
        valid_user = User.auth_user(
            username=login_form.username.data,
            password=login_form.password.data,
        )
        if valid_user:
            session[USER_ID_KEY] = valid_user.username
            return redirect(f"/users/{valid_user.username}")
        else:
            login_form.username.errors = ["Invalid username/password!"]
    
    return render_template("login.html", form=login_form)

# @app.route("/secret")
# def get_secret():
#     """The Secret Page"""

#     if session.get(USER_ID_KEY, False):
#         return render_template("secret.html")
#     else:
#         flash("You must be logged in to view the secret page!", "danger")
#         return redirect("/login")

@app.route("/logout")
def logout():
    """Clear the user data and redirect to root"""

    session.pop(USER_ID_KEY)
    return redirect("/")

@app.route("/users/<username>")
def get_user_page(username):
    """Access the userpage"""
    
    if user_authenticated():
        user = User.query.get_or_404(username)
        auth_user=get_authenticated_user()

        return render_template("user.html", user=user, auth_user=auth_user)
    else:
        return login_error_redirect()

@app.route("/users/<username>/delete", methods=['POST'])
def delete_user(username):
    """Allowed user to delete their account"""

    auth_user = get_authenticated_user()
    if user_authenticated(auth_user.username) or auth_user.is_admin:
        user = User.query.get_or_404(username)
        db.session.delete(user)
        db.session.commit()

        return redirect("/logout")
    else:
        return login_error_redirect()

#
# Feedback
#

@app.route("/users/<username>/feedback/add", methods=['GET', 'POST'])
def add_user_feedback(username):
    """Allow user to add feedback"""

    auth_user = get_authenticated_user()
    if user_authenticated(auth_user.username) or auth_user.is_admin:
        feedback_form = AddUserFeedbackForm()
        if feedback_form.validate_on_submit():
            new_feedback = Feedback.register_feedback(
                title=feedback_form.title.data,
                content=feedback_form.content.data,
                username=username,
            )
            db.session.add(new_feedback)
            db.session.commit()

            flash("Feedback submitted!", "success")
            return redirect(f"/users/{username}")
    
        return render_template("add_feedback.html", form=feedback_form, username=username)
    else:
        return login_error_redirect()

@app.route("/feedback/<int:feedback_id>")
def show_user_feedback(feedback_id):
    """Display the user feedback"""

    feedback = Feedback.query.get_or_404(feedback_id)
    auth_user = get_authenticated_user()

    return render_template("show_feedback.html", feedback=feedback, auth_user=auth_user)


@app.route("/feedback/<int:feedback_id>/update", methods=['GET', 'POST'])
def update_user_feedback(feedback_id):
    """User can update their feedback"""
    
    feedback = Feedback.query.get_or_404(feedback_id)
    auth_user = get_authenticated_user()

    if user_authenticated(auth_user.username) or auth_user.is_admin:
        feedback_form = AddUserFeedbackForm(obj=feedback)
        if feedback_form.validate_on_submit():
            feedback.title = feedback_form.title.data
            feedback.content = feedback_form.content.data
            db.session.commit()

            flash("Feedback updated!", "success")
            return redirect(f"/users/{feedback.username}")
    
        return render_template("update_feedback.html", form=feedback_form, username=feedback.username)
    else:
        return login_error_redirect()

@app.route("/feedback/<int:feedback_id>/delete", methods=['POST'])
def delete_feedback(feedback_id):
    """Allowed user to delete their feedback"""
    
    feedback = Feedback.query.get_or_404(feedback_id)
    auth_user = get_authenticated_user()

    if user_authenticated(auth_user.username) or auth_user.is_admin:
        db.session.delete(feedback)
        db.session.commit()

        flash("Feedback deleted!", "success")
        return redirect(f"/users/{feedback.username}")
    else:
        return login_error_redirect()