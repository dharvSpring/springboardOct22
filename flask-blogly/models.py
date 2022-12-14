"""Models for Blogly."""

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
        """Return the first_name and last_name of the user"""

        return f"{self.first_name} {self.last_name}"

    __tablename__ = "users"

    DEFAULT_PROFILE_IMAGE = "https://www.oseyo.co.uk/wp-content/uploads/2020/05/empty-profile-picture-png-2-2.png"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.Text, nullable=False)
    last_name = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.Text, default=DEFAULT_PROFILE_IMAGE)

    full_name = property(fget=get_full_name)

    @classmethod
    def init_data(cls):
        alan = cls(first_name="Alan", last_name="Alda", image_url="https://s1.stabroeknews.com/images/2019/01/alda.jpg")
        joel = cls(first_name="Joel", last_name="Burton")
        jane = cls(first_name="Jane", last_name="Smith")
        wed = cls(first_name="Wednesday", last_name="Addams", image_url="https://media.boingboing.net/wp-content/uploads/2018/07/Wednesday-Addams.jpg")
        for user in (alan, joel, jane, wed):
            db.session.add(user)
        db.session.commit()