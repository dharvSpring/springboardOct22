"""User View tests."""

# run these tests like:
#
#    FLASK_ENV=production python -m unittest test_user_views.py


import os
from unittest import TestCase

from models import db, connect_db, Message, User, Likes

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


class UserViewTestCase(TestCase):
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

            testuser2 = User.signup(username="testuser2",
                                    email="test2@test.com",
                                    password="testuser2",
                                    image_url=None)
            self.user_id2 = 5689
            testuser2.id = self.user_id2

            testuser3 = User.signup(username="axelord1",
                                    email="axelord1@test.com",
                                    password="axelord1",
                                    image_url=None)
            testuser4 = User.signup(username="axelord2",
                                    email="axelord2@test.com",
                                    password="axelord2",
                                    image_url=None)

            db.session.add_all([testuser, testuser2, testuser3, testuser4])
            db.session.commit()

    def test_user_index(self):
        """user page should list users"""

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.user_id

            resp = c.get("/users")
            self.assertEqual(resp.status_code, 200)

            self.assertIn("@testuser", str(resp.data))
            self.assertIn("@testuser2", str(resp.data))
            self.assertIn("@axelord1", str(resp.data))
            self.assertIn("@axelord2", str(resp.data))

    def test_user_search(self):
        """search page should list matching users"""

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.user_id

            resp = c.get("/users?q=axe")
            self.assertEqual(resp.status_code, 200)

            self.assertIn("@axelord1", str(resp.data))
            self.assertIn("@axelord2", str(resp.data))

            self.assertNotIn("@testuser", str(resp.data))
            self.assertNotIn("@testuser2", str(resp.data))
    
    def test_user_profile(self):
        """user profile page should match data"""

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.user_id

            resp = c.get(f"/users/{self.user_id}")
            self.assertEqual(resp.status_code, 200)
            self.assertIn("@testuser", str(resp.data))
    
    def test_add_like(self):
        """user can add like"""

        msg_id = 789
        like_me = Message (
            id = msg_id,
            text = "Witty comment",
            user_id = self.user_id,
        )

        with app.app_context():
            db.session.add(like_me)
            db.session.commit()
        
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.user_id2
            
            resp = c.post(
                f"/users/add_like/{msg_id}",
                follow_redirects=True
            )
            self.assertEqual(resp.status_code, 200)

            likes = Likes.query.filter(Likes.message_id == msg_id).all()
            self.assertEqual(len(likes), 1)
    
    def test_remove_like(self):
        """user can add like"""

        msg_id = 7890
        like_me = Message (
            id = msg_id,
            text = "Not so witty comment",
            user_id = self.user_id,
        )

        with app.app_context():
            db.session.add(like_me)
            db.session.commit()
        
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.user_id2
            
            resp = c.post(
                f"/users/add_like/{msg_id}",
                follow_redirects=True
            )
            self.assertEqual(resp.status_code, 200)

            likes = Likes.query.filter(Likes.message_id == msg_id).all()
            self.assertEqual(len(likes), 1)

            # now remove the like!
            resp = c.post(
                f"/users/add_like/{msg_id}",
                follow_redirects=True
            )
            self.assertEqual(resp.status_code, 200)

            likes = Likes.query.filter(Likes.message_id == msg_id).all()
            self.assertEqual(len(likes), 0)
    
    def test_unauth_like(self):
        """unauthed user can't like"""

        msg_id = 2345
        like_me = Message (
            id = msg_id,
            text = "want to like me!",
            user_id = self.user_id,
        )

        with app.app_context():
            db.session.add(like_me)
            db.session.commit()
        
        with self.client as c:
            resp = c.post(
                f"/users/add_like/{msg_id}",
                follow_redirects=True
            )
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Access unauthorized", str(resp.data))
    
    def test_show_following(self):
        """show user's following"""
        
        with app.app_context():
            u1 = User.query.filter(User.id == self.user_id).one()
            u2 = User.query.filter(User.id == self.user_id2).one()

            u1.following.append(u2)
            db.session.commit()

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.user_id

            resp = c.get(f"/users/{self.user_id}/following")
            self.assertEqual(resp.status_code, 200)
            self.assertIn("@testuser2", str(resp.data))

    def test_show_followers(self):
        """show user's followers"""
        
        with app.app_context():
            u1 = User.query.filter(User.id == self.user_id).one()
            u2 = User.query.filter(User.id == self.user_id2).one()

            u1.followers.append(u2)
            db.session.commit()

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.user_id

            resp = c.get(f"/users/{self.user_id}/followers")
            self.assertEqual(resp.status_code, 200)
            self.assertIn("@testuser2", str(resp.data))
    
    def test_unauthed_following(self):
        """unauthed user can't view following"""

        with self.client as c:
            resp = c.get(
                f"/users/{self.user_id}/following",
                follow_redirects=True,
            )
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Access unauthorized", str(resp.data))

    def test_unauthed_followers(self):
        """unauthed user can't view followers"""
        
        with self.client as c:
            resp = c.get(
                f"/users/{self.user_id}/followers",
                follow_redirects=True,
            )
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Access unauthorized", str(resp.data))