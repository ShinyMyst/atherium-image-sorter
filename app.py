from flask import Flask, render_template, jsonify, request
from python.submit import SubmitForm
from collection_manager import CollectionManager
from config.config import MODELS, LORAS, SAMPLING_METHODS


app_data = CollectionManager("Test")
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret-key'


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/gallery')
def gallery():
    collection = app_data.get_collection()
    tags = app_data.get_tag_frequency()
    model_choices = MODELS
    sampling_methods = SAMPLING_METHODS
    model_choices.insert(0, 'Any')
    sampling_methods.insert(0, 'Any')

    return render_template('gallery.html',
                           image_json=collection,
                           model_choices=model_choices,
                           loras_data=LORAS,
                           sampling_methods=SAMPLING_METHODS,
                           tag_frequency=tags
                           )


@app.route('/submit')
def get_submit():
    return render_template('submit.html', form=SubmitForm(), submit_url='/new')


@app.route('/new', methods=['POST'])
def post_submit():
    """Adds entry to active collection.  Displays entry in a new tab."""
    # TODO - Collection is choice but this only write to the active.
    # Update this again to account for different or multiple collection updates

    form = SubmitForm()
    lora_json = request.form.get('lora_data', '{}')

    new_entry = app_data.format_entry(form, lora_json)
    app_data.add_entry(new_entry)
    return jsonify(new_entry)


@app.route('/update-rating', methods=['POST'])
def update_rating():
    image_url = request.args.get('image_url')
    change = int(request.args.get('change'))
    app_data.update_ranking(image_url, change)
    return '', 200


@app.route('/update-tags-bulk', methods=['POST'])
def update_tags_bulk():
    data = request.get_json()
    urls = data.get('imageUrls')
    tags = data.get('tags')
    for url in urls:
        app_data.add_tags(url, tags)

    return '', 200


@app.route('/api/update-details', methods=['GET'])
def update_details():
    image_url = request.args.get('image_url')
    entry_data = app_data.get_entry(image_url)

    form_data = {
        'url': entry_data.get('url', ''),
        'model': entry_data.get('model', ''),
        'prompt': entry_data.get('Prompt', ''),
        'sampling_method': entry_data.get('Sampling Method', ''),
        'sampling_steps': entry_data.get('Sampling Steps', 10),
        'cfg_scale': entry_data.get('CFG Scale', 2.0),
        'tags': entry_data.get('Tags', []),
    }

    entry_form = SubmitForm(data=form_data)

    lora_data = entry_data.get('LoRA', {})
    lora_form_field_to_data_key_map = {
        'dmd2': 'DMD2',
        'lcm': 'LCM',
        'bold_outlines': 'Bold Outlines',
        'vivid_edge': 'Vivid Edge',
        'vivid_soft': 'Vivid Soft',
        'cartoony': 'Cartoony'
    }
    for field_name, data_key_name in lora_form_field_to_data_key_map.items():
        getattr(entry_form, field_name).data = lora_data.get(data_key_name, 0.0)  # noqa

    return render_template('submit.html', form=entry_form, submit_url='/edit')


@app.route('/edit', methods=['POST'])
def change_entry():
    form = SubmitForm()
    lora_json = request.form.get('lora_data', '{}')
    entry_data = app_data.format_entry(form, lora_json)
    app_data.edit_entry(entry_data)
    return jsonify(entry_data)


@app.route('/favicon.ico')
def favicon():
    return "", 204


if __name__ == '__main__':
    app.run(debug=True)


# TODO - Restructure JSON as a dict with the URL as main key.
# Make sure to only write if key is unique
# TODO - More dynamic way to save elements of the JSON
# TODO - Pagination??

# TODO - Make the app function do the data format internally?
# TODO - It could return the entry info for the return display json
# TODO - Editing image also resets ranking at the moment.
# TODO - Pop-ups from testing still present.  Repurpose or remove
