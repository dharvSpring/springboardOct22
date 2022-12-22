from unittest import TestCase
from app import app
from models import db, User, Post, Tag, PostTag

# Use test database and don't clutter tests with SQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False

# Make Flask errors be real errors, rather than HTML pages with error info
app.config['TESTING'] = True

# This is a bit of hack, but don't use Flask DebugToolbar
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

def delete_all():
    """Helper method to clear the tables prior to testing"""

    PostTag.query.delete()
    Tag.query.delete()
    Post.query.delete()
    User.query.delete()

class BloglyUserViewsTestCase(TestCase):
    """Test the user related views"""
    
    def setUp(self):
        """Add a sample user"""

        with app.app_context():
            delete_all()
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
            
            self.assertIn(f"Deleted user {self.full_name}", html)
            self.assertIn('<ul id="user-list">', html)

class BloglyPostViewsTestCase(TestCase):
    """Test the post related views"""
    
    def setUp(self):
        """Add a sample user and post"""

        with app.app_context():
            delete_all()

            user = User(first_name="Morticia", last_name="Addams")
            db.session.add(user)
            db.session.commit()

            post = Post(title="Sic gorgiamus allos subjectatos nunc", content="Not just pretty words", user_id=user.id)
            db.session.add(post)
            db.session.commit()

            self.user_id = user.id
            self.full_name = user.full_name
            self.post_id = post.id
            self.post_title = post.title
            self.post_content = post.content
            self.post_date = post.readable_date

    def tearDown(self):
        """Clean up any transaction data"""

        with app.app_context():
            db.session.rollback()

    def assert_on_post(self, html, post_title, post_content, user_id=None, full_name=None):
        """Helper method to ensure post page is correct"""

        if user_id == None:
            user_id = self.user_id
        if full_name == None:
            full_name = self.full_name
        
        self.assertIn(post_title, html)
        self.assertIn(post_content, html)
        self.assertIn(f'by <a href="/users/{user_id}">{full_name}</a>', html)

    def test_post_view(self):
        """Test viewing a post"""

        with app.test_client() as client:
            response = client.get(f"/posts/{self.post_id}")
            html = response.get_data(as_text=True)

            self.assert_on_post(html, self.post_title, self.post_content)
            self.assertIn(self.post_date, html)
    
    def test_post_edit_view(self):
        """Test edit view for post"""

        with app.test_client() as client:
            response = client.get(f"/posts/{self.post_id}/edit")
            html = response.get_data(as_text=True)

            self.assertIn(self.post_title, html)
            self.assertIn(self.post_content, html)
            self.assertIn(f'by <a href="/users/{self.user_id}">{self.full_name}</a>', html)

            self.assertIn(f'<form action="/posts/{self.post_id}/edit" method="POST">', html)
    
    def test_post_edit_submit(self):
        """Test edit submit for post"""

        with app.test_client() as client:
            data = {"title": "We gladly feast on those who would subdue us.", "content": "In English now"}
            response = client.post(f"/posts/{self.post_id}/edit", data=data, follow_redirects=True)
            html = response.get_data(as_text=True)

            self.assertNotIn(self.post_title, html)
            self.assertNotIn(self.post_content, html)

            self.assert_on_post(html, data['title'], data['content'])

            self.assertNotIn(f'<form action="/posts/{self.post_id}/edit" method="POST">', html)
            self.assertIn(f'formaction="/posts/{self.post_id}/edit"', html)
    
    def test_post_create_view(self):
        """Test post create view"""
        
        with app.test_client() as client:
            response = client.get(f"/users/{self.user_id}/posts/new")
            html = response.get_data(as_text=True)
            self.assertIn(f'<form action="/users/{self.user_id}/posts/new" method="POST">', html)
            self.assertIn(self.full_name, html)
    
    def test_post_create_submit(self):
        """Test post create submit"""
        
        with app.test_client() as client:
            data = {"title": "How long has it been since we waltzed?", "content": "Oh, Gomez... hours."}
            response = client.post(f"/users/{self.user_id}/posts/new", data=data, follow_redirects=True)
            html = response.get_data(as_text=True)
            # new data
            self.assert_on_post(html, data['title'], data['content'])

            self.assertNotIn(f'<form action="/users/{self.user_id}/posts/new" method="POST">', html)

    def test_post_delete(self):
        """Test post delete"""
        
        with app.test_client() as client:
            response = client.post(f"/posts/{self.post_id}/delete", follow_redirects=True)
            html = response.get_data(as_text=True)
            
            self.assertIn(f"Deleted post {self.post_title}", html)
            self.assertIn('<ul id="user-list">', html)

class BloglyTagViewsTestCase(TestCase):
    """Test the tag related views"""
    
    def setUp(self):
        """Add a sample user, post, and tag"""

        with app.app_context():
            delete_all()

            user = User(first_name="Morticia", last_name="Addams")
            db.session.add(user)
            db.session.commit()

            post = Post(title="Sic gorgiamus allos subjectatos nunc", content="Not just pretty words", user_id=user.id)
            tag = Tag(name="Motto")
            post.tags.append(tag)
            db.session.add(post)
            db.session.commit()

            self.user_id = user.id
            self.post_id = post.id
            self.post_title = post.title
            self.tag_id = tag.id
            self.tag_name = tag.name

    def tearDown(self):
        """Clean up any transaction data"""

        with app.app_context():
            db.session.rollback()
    
    def test_tags_list_view(self):
        """Test tag list"""

        with app.test_client() as client:
            response = client.get(f"/tags")
            html = response.get_data(as_text=True)

            self.assertIn('<ul id="tag-list">', html)
    
    def test_tags_list_view(self):
        """Test tag post list"""

        with app.test_client() as client:
            response = client.get(f"/tags/{self.tag_id}")
            html = response.get_data(as_text=True)

            self.assertIn('<ul id="post-list">', html)
            self.assertIn(self.tag_name, html)
            self.assertIn(self.post_title, html)

    def test_tag_edit_view(self):
        """Test edit view for tag"""

        with app.test_client() as client:
            response = client.get(f"/tags/{self.tag_id}/edit")
            html = response.get_data(as_text=True)

            self.assertIn(self.tag_name, html)
            self.assertIn(f'<form action="/tags/{self.tag_id}/edit" method="POST">', html)
    
    def test_tag_edit_submit(self):
        """Test edit submit for tag"""

        with app.test_client() as client:
            data = {"name": "Goals"}
            response = client.post(f"/tags/{self.tag_id}/edit", data=data, follow_redirects=True)
            html = response.get_data(as_text=True)

            self.assertNotIn(self.tag_name, html)
            self.assertNotIn(f'<form action="/tags/{self.tag_id}/edit" method="POST">', html)
            self.assertIn(f'formaction="/tags/{self.tag_id}/edit"', html)
            self.assertIn(self.post_title, html)
    
    def test_tag_create_view(self):
        """Test tag create view"""
        
        with app.test_client() as client:
            response = client.get(f"/tags/new")
            html = response.get_data(as_text=True)
            self.assertIn(f'<form action="/tags/new" method="POST">', html)
    
    def test_tag_create_submit(self):
        """Test tag create submit"""
        
        with app.test_client() as client:
            data = {"name": "Test Tag"}
            response = client.post(f"/tags/new", data=data, follow_redirects=True)
            html = response.get_data(as_text=True)
            # new data
            self.assertIn(data['name'], html)

            self.assertNotIn(f'<form action="/tags/new" method="POST">', html)

    def test_tag_delete(self):
        """Test tag delete"""
        
        with app.test_client() as client:
            response = client.post(f"/tags/{self.tag_id}/delete", follow_redirects=True)
            html = response.get_data(as_text=True)
            
            self.assertIn(f"Deleted tag {self.tag_name}", html)
            self.assertIn('<ul id="tag-list">', html)