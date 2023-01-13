from unittest import TestCase
from app import app
from models import db, User, Feedback

# Use test database and don't clutter tests with SQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///feedback'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False

# Make Flask errors be real errors, rather than HTML pages with error info
app.config['TESTING'] = True

# This is a bit of hack, but don't use Flask DebugToolbar
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

with app.app_context():
    db.drop_all()
    db.create_all()

def delete_all():
    """Helper method to clear the tables prior to testing"""
    
    Feedback.query.delete()
    User.query.delete()

class UserViewsTestCase(TestCase):
    """Test the user related views"""

    def setUp(self):
        """Add a sample user"""

        with app.app_context():
            delete_all()
            u1 = User.register_user(
                username="gomez",
                password="caramia",
                email="gomez@addams.com",
                first_name="Gomez",
                last_name="Addams",
            )
            db.session.add(u1)
            db.session.commit()

    def tearDown(self):
        """Clean up any transaction data"""

        with app.app_context():
            db.session.rollback()
    
    def test_there_should_be_some(self):
        """There should be tests for User"""

        self.assertEqual(True, False)


class FeedbackViewsTestCase(TestCase):
    """Test the feedback related views"""

    def setUp(self):
        """Add a sample user and feedback"""

        with app.app_context():
            delete_all()
            u1 = User.register_user(
                username="thing",
                password="digits",
                email="thing@addams.com",
                first_name="Thing",
                last_name="Addams",
            )
            db.session.add(u1)
            db.session.commit()

            f1 = Feedback.register_feedback(
                title="12345",
                content="asdfg",
                username=u1.username,
            )
            db.session.add(f1)
            db.session.commit()

    def tearDown(self):
        """Clean up any transaction data"""

        with app.app_context():
            db.session.rollback()
    
    def test_there_should_be_some(self):
        """There should be tests for Feedback"""

        self.assertEqual(True, False)