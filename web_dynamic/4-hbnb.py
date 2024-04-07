#!/usr/bin/python3
""" Starts a Flash Web Application """
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from flask import Flask, render_template
from operator import attrgetter
import uuid

app = Flask(__name__)


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/4-hbnb/', strict_slashes=False)
def hbnb():
    """ HBNB is alive! """
    states = storage.all(State).values()
    states = sorted(states, key=attrgetter('name'))
    states_cities = []

    for state in states:
        states_cities.append([state, sorted(state.cities,
                                            key=attrgetter('name'))])

    amenities = storage.all(Amenity).values()
    amenities = sorted(amenities, key=attrgetter('name'))

    return render_template('4-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           cache_id=uuid.uuid4())


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)
