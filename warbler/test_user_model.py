"""User model tests."""

# run these tests like:
#
#    python -m unittest test_user_model.py


import os
from unittest import TestCase
from sqlalchemy import exc

from models import db, User, Message, Follows

# BEFORE we import our app, let's set an environmental variable
# to use a different database for tests (we need to do this
# before we import our app, since that will have already
# connected to the database

os.environ['DATABASE_URL'] = "postgresql:///warbler-test"


# Now we can import app

from app import app

# Create our tables (we do this here, so we only create the tables
# once for all tests --- in each test, we'll delete the data
# and create fresh new clean test data

with app.app_context():
    db.create_all()


class UserModelTestCase(TestCase):
    """Test model for users"""

    def setUp(self):
        """Create test client, add sample data."""
        
        with app.app_context():
            User.query.delete()
            Message.query.delete()
            Follows.query.delete()

        self.client = app.test_client()

    def tearDown(self):
        """Clean up"""

        with app.app_context():
            db.session.rollback()

    @classmethod
    def create_test_user(cls, username):
        """Create test User from username"""

        return User(
            email=f"{username}@test.com",
            username=username,
            password="HASHED_PASSWORD"
        )

    def test_user_model(self):
        """Does basic model work?"""

        u = User(
            email="test@test.com",
            username="testuser",
            password="HASHED_PASSWORD"
        )

        with app.app_context():
            db.session.add(u)
            db.session.commit()

            # User should have no messages & no followers
            self.assertEqual(len(u.messages), 0)
            self.assertEqual(len(u.followers), 0)
    
    def test_repr_user(self):
        """Does user __repr__ work?"""

        u = UserModelTestCase.create_test_user("test_user1")
        with app.app_context():
            db.session.add(u)
            db.session.commit()

            expected = f"<User #{u.id}: {u.username}, {u.email}>"
            self.assertEqual(u.__repr__(), expected)
    
    def test_is_following(self):
        """Does is_following successfully detect when user1 is following user2?"""

        u1 = UserModelTestCase.create_test_user("follow_test1")
        u2 = UserModelTestCase.create_test_user("follow_test2")
        with app.app_context():
            db.session.add_all([u1, u2])
            db.session.commit()
            u1.following.append(u2)
            db.session.commit()

            self.assertEqual(u1.is_following(u2), True)
    
    def test_is_not_following(self):
        """Does is_following successfully detect when user1 is not following user2?"""

        u1 = UserModelTestCase.create_test_user("not_follow_test1")
        u2 = UserModelTestCase.create_test_user("not_follow_test2")
        with app.app_context():
            db.session.add_all([u1, u2])
            db.session.commit()

            self.assertEqual(u1.is_following(u2), False)

    def test_is_followed(self):
        """Does is_followed_by successfully detect when user1 is followed by user2?"""

        u1 = UserModelTestCase.create_test_user("followed_test1")
        u2 = UserModelTestCase.create_test_user("followed_test2")
        with app.app_context():
            db.session.add_all([u1, u2])
            db.session.commit()
            u1.followers.append(u2)
            db.session.commit()

            self.assertEqual(u1.is_followed_by(u2), True)
    
    def test_is_not_followed(self):
        """Does is_followed_by successfully detect when user1 is not followed by user2?"""

        u1 = UserModelTestCase.create_test_user("not_followed_test1")
        u2 = UserModelTestCase.create_test_user("not_followed_test2")
        with app.app_context():
            db.session.add_all([u1, u2])
            db.session.commit()

            self.assertEqual(u1.is_followed_by(u2), False)

    def test_user_create(self):
        """Does User.signup successfully create a new user given valid credentials?"""
        
        with app.app_context():
            created_user = User.signup("created_user", "created_user@test.com", "welcome1", None)
        
        self.assertIsNotNone(created_user)
        self.assertEqual(created_user.username, "created_user")
        self.assertEqual(created_user.email, "created_user@test.com")
    
    def test_user_create_fail(self):
        """Does User.create fail to create a new user if any of the validations (e.g. uniqueness, non-nullable fields) fail?"""
        
        with app.app_context():
            created_user = User.signup("created_user", "created_user@test.com", "welcome1", None)
            created_user_dup = User.signup("created_user", "created_user@test.com", "welcome1", None)
            with self.assertRaises(exc.IntegrityError) as context:
                db.session.commit()
                db.session.rollback()
            
            with self.assertRaises(ValueError) as context:
                noname_user = User.signup(None, "noname_user@test.com", "welcome1", None)
            
            with self.assertRaises(ValueError) as context:
                noemail_user = User.signup("noemail", None, "welcome1", None)
                
            with self.assertRaises(ValueError) as context:
                nopass_user = User.signup("no_password", "no_password@test.com", None, None)
    

    def test_auth_valid(self):
        """Does User.authenticate successfully return a user when given a valid username and password?"""

        with app.app_context():
            user = User.signup("testme", "testme@test.com", "welcome1", None)
            db.session.commit()
            auth_user = User.authenticate(user.username, "welcome1")
            self.assertIsNotNone(auth_user)
            self.assertEqual(user.id, auth_user.id)
    
    def test_auth_invalid(self):
        """Does User.authenticate fail to return a user when the username or password is invalid?"""

        with app.app_context():
            user = User.signup("testme_fake", "testme2@test.com", "welcome1", None)
            db.session.commit()

            auth_user = User.authenticate("BadUsername", "welcome1")
            self.assertFalse(auth_user)
            auth_user2 = User.authenticate("user.username", "badPassword")
            self.assertFalse(auth_user2)