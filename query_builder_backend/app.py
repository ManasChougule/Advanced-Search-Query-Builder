import logging
from flask import Flask, request, jsonify
from solarsuggestions import SolarSuggestions
from flask_cors import CORS
solar_suggestions = SolarSuggestions()

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Flask backend!"})

@app.route("/getsuggestions", methods=["POST"])
def get_suggestions():
    text = request.json.get("searchText")
    is_field = request.json.get("is_field")
    selected_networks = request.json.get("network_locations")
    prefix_value = request.json.get("prefix_value")
    advance_suggestions = list(set(solar_suggestions.get_field_data(text,selected_networks,prefix_value,is_field)))
    advance_suggestions.sort()
    return jsonify({"data": advance_suggestions})

if __name__ == '__main__':
    FORMAT = "[%(asctime)s %(filename)s->%(funcName)s():%(lineno)s]%(levelname)s: %(message)s"             
    logging.basicConfig(format=FORMAT)
    app.debug = True
    app.run(host="0.0.0.0", port=5008, threaded=True)
