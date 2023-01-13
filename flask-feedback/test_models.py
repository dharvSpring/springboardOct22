from unittest import TestCase
from app import app
from models import db, User, Feedback

# Use test database and don't clutter tests with SQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///feedback'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False

with app.app_context():
    db.drop_all()
    db.create_all()

def delete_all():
    """Helper method to clear the tables prior to testing"""
    
    Feedback.query.delete()
    User.query.delete()


class UserModelTestCase(TestCase):
    """Tests for model User"""

    def setUp(self):
        """Clean up existing users"""
        with app.app_context():
            delete_all()
    
    def tearDown(self):
        """Clean up any remaining transaction"""
        with app.app_context():
            db.session.rollback()
    
    def test_there_should_be_some(self):
        """There should be tests for User"""

        self.assertEqual(True, False)


class FeedbackModelTestCase(TestCase):
    """Tests for model Feedback"""

    def setUp(self):
        """Clean up existing users and feedback"""
        with app.app_context():
            delete_all()
    
    def tearDown(self):
        """Clean up any remaining transaction"""
        with app.app_context():
            db.session.rollback()
    
    def test_there_should_be_some(self):
        """There should be tests for Feedback"""

        self.assertEqual(True, False)