# from app import app
from models import User, Feedback


# db.drop_all()
# db.create_all()

def seed_data(db):
    """Seed test data"""

    u1 = User.register_user(
        username="wednesday",
        password="i<3bats",
        email="wednesday@addams.com",
        first_name="Wednesday",
        last_name="Addams",
    )

    u2 = User.register_user(
        username="morticia",
        password="horror1",
        email="morticia@addams.com",
        first_name="Morticia",
        last_name="Addams",
        is_admin=True,
    )

    db.session.add_all([u1, u2])
    db.session.commit()

    f1 = Feedback(
        title="Not enough black",
        content="Far too cheerful around here, I prefer moody",
        username=u1.username,
    )

    f2 = Feedback(
        title="I require more room for my bathouses",
        content="They need to be setup with good access all around. Preferably under a dark tree.",
        username=u1.username,
    )

    f3 = Feedback(
        title="It has been hours since we waltzed",
        content="Meet me in the ballroom",
        username=u2.username,
    )

    db.session.add_all([f1, f2, f3])
    db.session.commit()
