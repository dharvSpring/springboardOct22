from models import User, Post


def seed_data(db):
    """Seed test data"""

    alan = User(first_name="Alan", last_name="Alda", bio="Hawkeye", 
                image_url="https://s1.stabroeknews.com/images/2019/01/alda.jpg")
    joel = User(first_name="Joel", last_name="Burton", bio="I'm lost")
    jane = User(first_name="Jane", last_name="Smith")
    wed = User(first_name="Wednesday", last_name="Addams", bio="Of course I talk to myself, sometimes I need expert advice.",
               image_url="https://media.boingboing.net/wp-content/uploads/2018/07/Wednesday-Addams.jpg")
    for user in (alan, joel, jane, wed):
        db.session.add(user)
    db.session.commit()

    wedPost = Post(title="Wednesday's Musings", content="I myself am strange and unusual", user_id=4)
    janePost = Post(title="Jane", content="whoami", user_id=3)
    for post in (wedPost, janePost):
        db.session.add(post)
    db.session.commit()