from unittest import TestCase
from app import app
from models import db, User

# Use test database and don't clutter tests with SQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False

with app.app_context():
    db.drop_all()
    db.create_all()

class UserModelTestCase(TestCase):
    """Tests for model User"""

    def setUp(self):
        """Clean up existing users"""
        with app.app_context():
            User.query.delete()
    
    def tearDown(self):
        """Clean up any remaining transaction"""
        with app.app_context():
            db.session.rollback()
    
    def test_full_name(self):
        """Ensure full name works properly"""

        user = User(first_name="Pugsley", last_name="Addams")
        self.assertEqual(user.full_name, "Pugsley Addams")
    
    def test_default_image(self):
        """Test default image"""

        with app.app_context():
            user = User(first_name="Gomez", last_name="Addams")
            db.session.add(user)
            db.session.commit()
            self.assertEqual(user.image_url, User.DEFAULT_PROFILE_IMAGE)