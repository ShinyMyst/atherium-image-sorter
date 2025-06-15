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
        self.stale = True  # Tracks if active_collection is up-to-date
        self.active_route = self.route_dict[collection_name]
        self.active_collect = self._prep_collect(self.active_route)
        # Note- Use arg bc _prep_collect may use dif routes elsewhere

    # TODO - Make a set active route function rather than setting in init.

    def get_collection(self):
        """Returns the ACTIVE collection"""
        if self.stale:
            self.active_collect = self._prep_collect(self.active_route)
        return self.active_collect

    def update_ranking(self, key_url, change):
        """Changes the ranking of one ACTIVE collection element.
        URL used to determine the target element/image."""
        for image in self.active_collect:
            if image['url'] == key_url:
                image['ranking'] += change
                break
        self._write_changes()

    def _prep_collect(self, route):
        """Given a route, returns an up-to-date sorted collection"""
        collect = self._open_collect(route)
        sorted_collect = self._sort_collect(collect)
        self.stale = False
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

    def format_entry(self, form: SubmitForm, lora_json):
        """Given data from submit form, structures it into a new JSON entry."""
        lora_data = json.loads(lora_json)
        entry_data = {
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
        return entry_data

    def add_entry(self, entry_data):
        """Adds a new entry to the active collection."""
        self.active_collect.append(entry_data)
        self._write_changes()

    def _write_changes(self):
        """Writes pending changes to active JSON.  Change status to stale"""
        with open(self.active_route, 'w') as f:
            json.dump(self.active_collect, f, indent=4)
        self.stale = True


app_data = AppData("Test")
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret-key'


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/gallery')
def gallery():
    collection = app_data.get_collection()
    return render_template('gallery.html',
                           form=GalleryForm(),
                           image_json=collection)


@app.route('/submit')
def get_submit():
    return render_template('submit.html', form=SubmitForm())


@app.route('/new', methods=['POST'])
def post_submit():
    """Adds entry to active collection.  Displays entry in a new tab."""
    form = SubmitForm()
    lora_json = request.form.get('lora_data', '{}')
    # TODO - Integrate this into the form instead?

    new_entry = app_data.format_entry(form, lora_json)
    app_data.add_entry(new_entry)
    return jsonify(new_entry)


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
    app_data.update_ranking(image_url, change)
    return '', 200


@app.route('/favicon.ico')
def favicon():
    return "", 204


if __name__ == '__main__':
    app.run(debug=True)


# TODO - This whole page needs refactored
# TODO - Restructure JSON as a dict with the URL as main key.
# Make sure to only write if key is unique
# TODO - More dynamic way to save elements of the JSON
# TODO - Pagination??
