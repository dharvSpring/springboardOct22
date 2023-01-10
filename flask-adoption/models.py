"""Models for Pet Adoption"""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)

DEFAULT_PROFILE_IMAGE = "https://www.oseyo.co.uk/wp-content/uploads/2020/05/empty-profile-picture-png-2-2.png"

class Pet(db.Model):
    """Pet for Adoption"""

    __tablename__ = "pets"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text, nullable=False)
    species = db.Column(db.Text, nullable=False)
    photo_url = db.Column(db.Text, nullable=False, default=DEFAULT_PROFILE_IMAGE)
    age = db.Column(db.Integer)
    notes = db.Column(db.Text)
    available = db.Column(db.Boolean, nullable=False, default=True)

    def image_url(self):
        """profile image or default if None"""

        if self.photo_url != None and len(self.photo_url) > 0:
            return self.photo_url
        else:
            return DEFAULT_PROFILE_IMAGE