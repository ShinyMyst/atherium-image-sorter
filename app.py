from flask import Flask, render_template, jsonify, request
from python.submit import SubmitForm
from python.gallery import GalleryForm
from collection_manager import CollectionManager


app_data = CollectionManager("Test")
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
    # TODO - Collection is choice but this only write to the active.
    # Update this again to account for different or multiple collection updates

    form = SubmitForm()
    lora_json = request.form.get('lora_data', '{}')
    # TODO - Integrate this into the form instead?

    new_entry = app_data.format_entry(form, lora_json)
    app_data.add_entry(new_entry)
    return jsonify(new_entry)


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


# TODO - Restructure JSON as a dict with the URL as main key.
# Make sure to only write if key is unique
# TODO - More dynamic way to save elements of the JSON
# TODO - Pagination??
