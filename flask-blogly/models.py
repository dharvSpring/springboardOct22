"""Models for Blogly."""

import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)

class User(db.Model):
    """Blogly User"""

    def __repr__(self):
        """Show info about user."""

        p = self
        return f"<user {p.id} {p.first_name} {p.last_name} {p.image_url}>"

    def get_full_name(self):
        """Return the full name of the user"""

        return f"{self.first_name} {self.last_name}"

    __tablename__ = "users"

    DEFAULT_PROFILE_IMAGE = "https://www.oseyo.co.uk/wp-content/uploads/2020/05/empty-profile-picture-png-2-2.png"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.Text, nullable=False)
    last_name = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.Text, default=DEFAULT_PROFILE_IMAGE)
    bio = db.Column(db.Text, default="I'm new here, say hi!")

    full_name = property(fget=get_full_name)

    posts = db.relationship("Post", backref="user", cascade="all, delete-orphan")

class Post(db.Model):
    """Blogly Post"""

    def __repr__(self):
        """Show info about post."""

        p = self
        return f"<post {p.id} {p.user_id} {p.title} {p.created_at}>"

    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    @property
    def readable_date(self):
        """Return a user readable date"""

        return self.created_at.strftime("%a %b %d %Y, %-I:%M %p") # Sun Mar 01 2002, 7:33 pm
