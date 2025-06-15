import json
import os
from flask import Flask, render_template, jsonify, request
from python.submit import SubmitForm
from python.gallery import GalleryForm


class AppData():
    def __init__(self, collection_name: str):
        self.route_dict = {
            'Test': "collections/test.json",
            'Gallery': "collections/gallery.json",
            'Test2': "collections/llamas.json"
            }
        target_route = self.route_dict[collection_name]
        self.active_collect = self._prep_collect(target_route)

    def get_active_collection(self):
        return self.active_collect

    def _prep_collect(self, route):
        """Given a route, returns a sorted collection"""
        collect = self._open_collect(route)
        sorted_collect = self._sort_collect(collect)
        return sorted_collect

    def _open_collect(self, route):
        """Opens, loads, saves, and returns a JSON collection."""
        with open(route) as f:
            collection = json.load(f)
        return collection

    def _sort_collect(self, collection: list):
        """Sorts a collection by 'ranking' and returns the sorted list."""
        return sorted(collection,
                      key=lambda x: x.get("ranking", 0),
                      reverse=True)


app_data = AppData("Test")
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret-key'


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/gallery')
def gallery():
    collection = app_data.get_active_collection()
    return render_template('gallery.html', form=GalleryForm(), image_json=collection)


@app.route('/api/images')
def get_images():
    with open('data/images.json') as f:
        image_data = json.load(f)

    return jsonify(image_data)


@app.route('/submit')
def get_submit():
    return render_template('submit.html', form=SubmitForm())


@app.route('/new', methods=['POST'])
def post_submit():
    form = SubmitForm()
    # TODO - The below should be integrated into SubmitForm()
    lora_json = request.form.get('lora_data', '{}')
    lora_data = json.loads(lora_json)
    print(lora_data)

    json_data = {
            "url": form.url.data,
            "model": form.model.data,
            "Prompt": form.prompt.data,
            "Tags": [tag.data.lower() for tag in form.tags if tag.data],
            "LoRA": lora_data,
            "Sampling Method": form.sampling_method.data,
            "Sampling Steps": form.sampling_steps.data,
            "CFG Scale": form.cfg_scale.data,
            "ranking": 0
    }
    append_json(form, json_data)

    return jsonify(json_data)


# TODO - This should be seperate file.
def append_json(form, json_data):
    selected_sets = form.data_sets.data
    # print(selected_sets)

    json_dir = 'data'
    for name in selected_sets:
        file_path = os.path.join(json_dir, f"{name}.json")
        try:
            with open(file_path, 'r') as f:
                existing_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            existing_data = []
        existing_data.append(json_data)
        with open(file_path, 'w') as f:
            json.dump(existing_data, f, indent=4)


@app.route('/update-rating', methods=['POST'])
def update_rating():
    image_url = request.args.get('image_url')
    change = int(request.args.get('change'))

    print(f"Received: Image URL - {image_url}, Change - {change}")
    with open(active_data) as f:
        image_data = json.load(f)
    for image in image_data:
        if image['url'] == image_url:
            image['ranking'] += change

    with open(active_data, 'w') as f:
        json.dump(image_data, f, indent=4)

    return '', 200


@app.route('/favicon.ico')
def favicon():
    return "", 204  # No content response to stop the 404


if __name__ == '__main__':
    app.run(debug=True)


# TODO - This whole page needs refactored
# TODO - Consider making this a class to avoid loading the same data
# TODO - Restructure JSON as a dict with the URL as main key.
# Make sure to only write if key is unique
# TODO - More dynamic way to save elements of the JSON
# TODO - Pagination??
# TODO -