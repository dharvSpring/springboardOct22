"""Flask app for Cupcakes"""

from flask import Flask, request, redirect, render_template, flash
from models import db, connect_db, Cupcake
from seed import seed_data

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcake'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)
with app.app_context():
    db.drop_all()
    db.create_all()
    seed_data(db)

