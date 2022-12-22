from unittest import TestCase
from app import app
from models import db, User, Post, Tag, PostTag
import datetime

# Use test database and don't clutter tests with SQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False

with app.app_context():
    db.drop_all()
    db.create_all()

def delete_all():
    """Helper method to clear the tables prior to testing"""
    
    PostTag.query.delete()
    Tag.query.delete()
    Post.query.delete()
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

class PostModelTestCase(TestCase):
    """Tests for model Post"""

    def setUp(self):
        """Clean up existing posts and users"""
        with app.app_context():
            delete_all()

            user = User(first_name="Morticia", last_name="Addams")
            db.session.add(user)
            db.session.commit()

            self.user_id = user.id
    
    def tearDown(self):
        """Clean up any remaining transaction"""
        with app.app_context():
            db.session.rollback()
    
    def test_readable_date(self):
        """Ensure readable date works properly"""
        
        with app.app_context():
            date = datetime.datetime(1991, 11, 19, 13, 13, 13) # Tue Nov 19 1991, 1:13 PM
            post = Post(title="Addams Family Film", content="Released Today!", created_at=date, user_id=self.user_id)
            db.session.add(post)
            db.session.commit()

            self.assertEqual("Tue Nov 19 1991, 1:13 PM", post.readable_date)

class TagModelTestCast(TestCase):
    """Tests for tags"""

    def setUp(self):
        """Clean up existing posts and users"""
        with app.app_context():
            delete_all()

            user = User(first_name="Morticia", last_name="Addams")
            db.session.add(user)
            db.session.commit()

            date = datetime.datetime(1991, 11, 19, 13, 13, 13) # Tue Nov 19 1991, 1:13 PM
            post = Post(title="Addams Family Film", content="Released Today!", created_at=date, user_id=user.id)
            db.session.add(post)
            db.session.commit()

            self.post_id = post.id
    
    def tearDown(self):
        """Clean up any remaining transaction"""
        with app.app_context():
            db.session.rollback()
    
    def test_tag_post(self):
        """Create a tag for a post"""

        with app.app_context():
            new_tag = Tag(name="Movies")
            db.session.add(new_tag)
            db.session.commit()
            post = Post.query.get(self.post_id)
            self.assertNotIn(new_tag, post.tags)

            post.tags.append(new_tag)
            db.session.add(post)
            db.session.commit()

            post_again = Post.query.get(self.post_id)
            self.assertIn(new_tag, post_again.tags)
            self.assertIn(post_again, new_tag.posts)
