from models import Pet

def seed_data(db):
    """Seed test data"""

    auggy_doggy = Pet(name="Auggy Doggy", species="dog", age="2", notes="Rambuncious, good with kids!",
                      photo_url="https://i.pinimg.com/originals/34/73/83/34738390cd2b0a4d80b1ebd465c9af66.jpg")
    doggy_daddy = Pet(name="Doggy Daddy", species="dog", age="8", notes="What a grump!",
                      photo_url="https://i.pinimg.com/originals/28/4e/9e/284e9e738aae2caa01b9c8d233a72e3d.jpg")
    fritz = Pet(name="Fritz", species="cat", age="12", notes="Always looking for something to eat.",
                photo_url="https://cdn.meowguide.com/theme-content/uploads/2020/01/nebelung-cat-looking-to-the-side.jpg")
    sonic = Pet(name="Sonic", species="hedgehog", age="1", notes="Quick!",
                photo_url="https://teddyfeed.com/wp-content/uploads/2019/03/e6fc2f75a041940873a68e27c68d2ef7-1024x683.jpg")

    for pet in (auggy_doggy, doggy_daddy, fritz, sonic):
        db.session.add(pet)
    db.session.commit()