"""Message View tests."""

# run these tests like:
#
#    FLASK_ENV=production python -m unittest test_message_views.py


import os
from unittest import TestCase

from models import db, connect_db, Message, User

# BEFORE we import our app, let's set an environmental variable
# to use a different database for tests (we need to do this
# before we import our app, since that will have already
# connected to the database

os.environ['DATABASE_URL'] = "postgresql:///warbler-test"


# Now we can import app

from app import app, CURR_USER_KEY

# Create our tables (we do this here, so we only create the tables
# once for all tests --- in each test, we'll delete the data
# and create fresh new clean test data

with app.app_context():
    db.create_all()

# Don't have WTForms use CSRF at all, since it's a pain to test

app.config['WTF_CSRF_ENABLED'] = False


class MessageViewTestCase(TestCase):
    """Test views for messages."""

    def setUp(self):
        """Create test client, add sample data."""

        self.client = app.test_client()
        with app.app_context():
            User.query.delete()
            Message.query.delete()


            testuser = User.signup(username="testuser",
                                        email="test@test.com",
                                        password="testuser",
                                        image_url=None)
            self.user_id = 1234
            testuser.id = self.user_id
            db.session.add(testuser)
            db.session.commit()

    def test_add_message(self):
        """Can use add a message?"""

        # Since we need to change the session to mimic logging in,
        # we need to use the changing-session trick:

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.user_id

            # Now, that session setting is saved, so we can have
            # the rest of ours test

            resp = c.post("/messages/new", data={"text": "Hello"})

            # Make sure it redirects
            self.assertEqual(resp.status_code, 302)

            msg = Message.query.one()
            self.assertEqual(msg.text, "Hello")

    def test_unauth_message(self):
        """unauthorized or invalid user should get error"""

        with self.client as c:
            resp = c.post(
                "/messages/new",
                data={"text": "Failure"},
                follow_redirects=True
            )
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Access unauthorized", str(resp.data))

            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = 10000

            resp = c.post(
                "/messages/new",
                data={"text": "Failure"},
                follow_redirects=True
            )
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Access unauthorized", str(resp.data))
    
    def test_view_message(self):
        """View a message"""

        msg_id = 1111
        msg_text = "Hello World!"
        msg = Message (
            id = msg_id,
            text = msg_text,
            user_id = self.user_id,
        )

        with app.app_context():
            db.session.add(msg)
            db.session.commit()

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.user_id
                
            resp = c.get(f"/messages/{msg_id}")
            self.assertEqual(resp.status_code, 200)
            self.assertIn(msg_text, str(resp.data))
    
    def test_view_invalid_message(self):
        """Should 404 a message that doesn't exist"""

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.user_id
                
            resp = c.get("/messages/99999")
            self.assertEqual(resp.status_code, 404)
    
    def test_delete_message(self):
        """user should be able to delete their own message"""

        msg_id = 1111
        msg_text = "Delete Me!"
        msg = Message (
            id = msg_id,
            text = msg_text,
            user_id = self.user_id,
        )

        with app.app_context():
            db.session.add(msg)
            db.session.commit()

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.user_id
                
            resp = c.post(
                f"/messages/{msg_id}/delete",
                follow_redirects=True,
            )
            self.assertEqual(resp.status_code, 200)

            deleted_msg = Message.query.filter(id == msg_id).first()
            self.assertIsNone(deleted_msg)
    
    def test_other_delete_message(self):
        """user should be able to delete other's message"""

        msg_id = 3333
        msg_text = "Can't Delete Me!"
        msg = Message (
            id = msg_id,
            text = msg_text,
            user_id = self.user_id,
        )

        wrong_uid = "9876"
        with app.app_context():
            wrong_user = User.signup("wronguser", "wrong@wronguser.com", "pass123", None)
            wrong_user.id = wrong_uid
            db.session.add_all([msg, wrong_user])
            db.session.commit()

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = wrong_uid
                
            resp = c.post(
                f"/messages/{msg_id}/delete",
                follow_redirects=True,
            )
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Access unauthorized", str(resp.data))
    
    def test_unauth_delete_message(self):
        """unauthed user can't delete messages"""

        msg_id = 2222
        msg_text = "Can't Delete Me!"
        msg = Message (
            id = msg_id,
            text = msg_text,
            user_id = self.user_id,
        )

        with app.app_context():
            db.session.add(msg)
            db.session.commit()

        with self.client as c:
            resp = c.post(
                f"/messages/{msg_id}/delete",
                follow_redirects=True,
            )
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Access unauthorized", str(resp.data))