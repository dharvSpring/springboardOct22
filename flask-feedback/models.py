"""Models for Feedback App"""

from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

def connect_db(app):
    """Connect ot the database."""

    db.app = app
    db.init_app(app)


class User(db.Model):
    """User Model"""

    __tablename__ = "users"

    username = db.Column(db.String(20), unique=True, primary_key=True)
    password = db.Column(db.Text, nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    def full_name(self):
        """Concatenates the first and last name for display"""

        return f"{self.first_name} {self.last_name}"

    @classmethod
    def register_user(cls, username, password, email, first_name, last_name, is_admin=False):
        """Create the User"""

        hashed_pwd = bcrypt.generate_password_hash(password)
        #convert to utf8 string to store in DB
        hashed_pwd_utf8 = hashed_pwd.decode('utf8')

        new_user = cls(
            username=username,
            password=hashed_pwd_utf8,
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_admin=is_admin,
            )
        return new_user
    
    @classmethod
    def auth_user(cls, username, password):
        """
        Authenticate the given user and password.
        
        Return User if they match, False otherwise.
        """

        check_me = User.query.filter_by(username=username).first()
        if check_me and bcrypt.check_password_hash(check_me.password, password):
            return check_me
        else:
            return False
        
class Feedback(db.Model):
    """Feedback Model"""

    __tablename__ = "feedbacks"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    username = db.Column(db.String(20), db.ForeignKey('users.username'))

    user = db.relationship('User', backref='feedback')

    @classmethod
    def register_feedback(cls, title, content, username):
        """Create feedback"""

        new_feedback = cls(
            title=title,
            content=content,
            username=username,
        )
        return new_feedback