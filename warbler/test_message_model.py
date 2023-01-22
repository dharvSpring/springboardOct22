"""Message model tests."""

# run these tests like:
#
#    python -m unittest test_user_model.py


import os
from unittest import TestCase
from sqlalchemy import exc

from models import db, User, Message, Likes

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


class MessageModelTestCase(TestCase):
    """Test model for messages."""

    def setUp(self):
        """Create test client, add sample data."""
        
        with app.app_context():
            User.query.delete()
            Message.query.delete()
            Likes.query.delete()

            msg_user = User.signup("sendWarble", "warble@test.org", "welcome1", None)
            self.user_id = 1111
            msg_user.id = self.user_id
            self.msg_user = msg_user

            db.session.add(msg_user)
            db.session.commit()

        self.client = app.test_client()

    def tearDown(self):
        """Clean up"""

        with app.app_context():
            db.session.rollback()


    def test_msg_model(self):
        """Does basic model work?"""

        msg = Message (
            text = "Hello World!",
            user_id = self.user_id,
        )

        with app.app_context():
            db.session.add(msg)
            db.session.commit()

            msg_user = User.query.filter(User.id == self.user_id).one()
            self.assertEqual(len(msg_user.messages), 1)
            self.assertEqual(msg_user.messages[0].text, "Hello World!")
    
    def test_msg_likes(self):
        """Do message likes work?"""

        msg1 = Message (
            text = "Hola Mundo",
            user_id = self.user_id,
        )

        msg2 = Message (
            text = "Race car",
            user_id = self.user_id,
        )

        with app.app_context():
            liking_user = User.signup("likespost", "like@email.com", "welcome1", None)
            liking_user.id = 2222
            db.session.add_all([msg1, msg2, liking_user])
            db.session.commit()

            liking_user.likes.append(msg1)
            db.session.commit()

            like_count = Likes.query.filter(Likes.user_id == liking_user.id).all()
            self.assertEqual(len(like_count), 1)