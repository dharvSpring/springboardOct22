"""Flask app for Feedback"""

from flask import Flask, flash, request, redirect, render_template, session
from models import db, connect_db, User
from forms import RegisterUserForm, LoginUserForm
# from seed import seed_data

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///feedback'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)
with app.app_context():
    db.drop_all()
    db.create_all()
    # seed_data(db)

app.config['SECRET_KEY'] = "SECRET!"
USER_ID_KEY = "username"

@app.route("/")
def get_home():
    """Redirect to /register"""

    return redirect("/register")

@app.route("/register", methods=['GET', 'POST'])
def handle_register():
    """Registration view"""

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
        db.session.commit()

        session[USER_ID_KEY] = new_user.username
        flash(f"Created new user {new_user.username}", "success")
        
        return redirect(f"/users/{new_user.username}")
    else:
        return render_template("register.html", form=register_form)

@app.route("/login", methods=['GET', 'POST'])
def handle_login():
    """Login view"""

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

@app.route("/secret")
def get_secret():
    """The Secret Page"""

    if session.get(USER_ID_KEY, False):
        return render_template("secret.html")
    else:
        flash("You must be logged in to view the secret page!", "danger")
        return redirect("/login")

@app.route("/users/<username>")
def get_user_page(username):
    """Access the userpage"""

    if session.get(USER_ID_KEY, False):
        user = User.query.get_or_404(username)

        return render_template("user.html", user=user)
    else:
        flash("You must be logged in to view that page!", "danger")
        return redirect("/login")

@app.route("/logout")
def logout():
    """Clear the user data and redirect to root"""

    session.pop(USER_ID_KEY)
    return redirect("/")
