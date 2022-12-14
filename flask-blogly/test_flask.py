from unittest import TestCase
from app import app
from models import db, User

# Use test database and don't clutter tests with SQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False

# Make Flask errors be real errors, rather than HTML pages with error info
app.config['TESTING'] = True

# This is a bit of hack, but don't use Flask DebugToolbar
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

class BloglyUserViewsTestCase(TestCase):
    """Test the user related views"""
    
    def setUp(self):
        """Add a sample user"""
        with app.app_context():
            User.query.delete()
            self.USER_IMG = "https://64.media.tumblr.com/a175e713588a8cdfc753479a7013c68a/tumblr_oymcoayh5a1sriyo0o1_1280.jpg"
            user = User(first_name="Morticia",
                        last_name="Addams",
                        image_url=self.USER_IMG)
            db.session.add(user)
            db.session.commit()
            self.user_id = user.id
            self.full_name = user.full_name

    def tearDown(self):
        """Clean up any transaction data"""

        with app.app_context():
            db.session.rollback()

    def test_root_user_list(self):
        """Redirect to user list"""

        with app.test_client() as client:
            response = client.get("/", follow_redirects=True)
            html = response.get_data(as_text=True)
            self.assertIn(self.full_name, html)
            self.assertIn('<ul id="user-list">', html)

    def test_user_profile(self):
        """Test user profile"""
        
        with app.test_client() as client:
            response = client.get(f"/users/{self.user_id}")
            html = response.get_data(as_text=True)
            self.assertIn(self.full_name, html)
            self.assertIn(self.USER_IMG, html)
            self.assertNotIn(User.DEFAULT_PROFILE_IMAGE, html)
    
    def test_user_profile_edit_view(self):
        """Test user profile edit view"""
        
        with app.test_client() as client:
            response = client.get(f"/users/{self.user_id}/edit")
            html = response.get_data(as_text=True)
            self.assertIn(self.full_name, html)
            self.assertIn(self.USER_IMG, html)
            self.assertNotIn(User.DEFAULT_PROFILE_IMAGE, html)
            self.assertIn(f'<form action="/users/{self.user_id}/edit" method="POST">', html)
    
    def test_user_profile_edit_submit(self):
        """Test user profile edit submit"""
        
        with app.test_client() as client:
            NEW_IMAGE = "https://www.famefocus.com/wp-content/uploads/2016/05/uncle-fester-1024x776.jpg"
            data = {"first-name": "Uncle", "last-name": "Fester", "image-url": NEW_IMAGE}
            response = client.post(f"/users/{self.user_id}/edit", data=data, follow_redirects=True)
            html = response.get_data(as_text=True)
            # new data
            self.assertIn("Uncle Fester", html)
            self.assertIn(NEW_IMAGE, html)
            # not old data
            self.assertNotIn(self.full_name, html)
            self.assertNotIn(self.USER_IMG, html)

            self.assertNotIn(User.DEFAULT_PROFILE_IMAGE, html)
            self.assertNotIn(f'<form action="/users/{self.user_id}/edit" method="POST">', html)
    
    def test_user_create_view(self):
        """Test user create view"""
        
        with app.test_client() as client:
            response = client.get(f"/users/new")
            html = response.get_data(as_text=True)
            self.assertIn(f'<form action="/users/new" method="POST">', html)
    
    def test_user_create_submit(self):
        """Test user create submit"""
        
        with app.test_client() as client:
            NEW_IMAGE = "https://www.famefocus.com/wp-content/uploads/2016/05/uncle-fester-1024x776.jpg"
            data = {"first-name": "Uncle", "last-name": "Fester", "image-url": NEW_IMAGE}
            response = client.post("/users/new", data=data, follow_redirects=True)
            html = response.get_data(as_text=True)
            # new data
            self.assertIn("Uncle Fester", html)
            self.assertIn(NEW_IMAGE, html)

            self.assertNotIn(User.DEFAULT_PROFILE_IMAGE, html)
            self.assertNotIn(f'<form action="/users/new" method="POST">', html)

    def test_user_delete(self):
        """Test user delete"""
        
        with app.test_client() as client:
            response = client.post(f"/users/{self.user_id}/delete", follow_redirects=True)
            html = response.get_data(as_text=True)
            
            self.assertIn(f"Deleted {self.full_name}", html)
            self.assertIn('<ul id="user-list">', html)