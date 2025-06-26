from flask import Flask, render_template, jsonify, request
from python.submit import SubmitForm
from collection_manager import CollectionManager
from config.config import MODELS, LORAS, SAMPLING_METHODS

app_data = CollectionManager("Gallery")
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret-key'


##############################
#     GET ROUTES
##############################
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/gallery', methods=['GET'])
def gallery():
    collection = app_data.get_collection()
    tags = app_data.get_tags()
    model_choices = ['Any'] + MODELS
    sampling_methods = ['Any'] + SAMPLING_METHODS

    return render_template('gallery.html',
                           image_json=collection,
                           model_choices=model_choices,
                           loras_data=LORAS,
                           sampling_methods=sampling_methods,
                           sorted_tags=tags
                           )


@app.route('/submit/new', methods=['GET'])
def submit_new():
    return render_template('submit.html',
                           form=SubmitForm(),
                           submit_url='/entry/new'
                           )


@app.route('/submit/edit', methods=['GET'])
def submit_edit():
    image_url = request.args.get('image_url')
    entry_form = app_data.get_submit_form(image_url)

    return render_template('submit.html',
                           form=entry_form,
                           submit_url='/entry/edit'
                           )


##############################
#     SUBMIT PAGE ROUTES
##############################
@app.route('/entry/new', methods=['POST'])
def new_entry():
    """Adds entry to active collection.  Displays entry in a new tab."""
    form = SubmitForm()
    lora_json = request.form.get('lora_data', '{}')

    new_entry = app_data.format_entry(form, lora_json)
    app_data.add_entry(new_entry)
    return jsonify(new_entry)


@app.route('/entry/quick', methods=['POST'])
def quick_entry():
    """Adds entry to active collection using JSON entry."""
    entry_string = request.form.get('quick_entry_data')
    url = request.form.get('url')
    new_entry = app_data.format_quick_entry(entry_string, url)
    app_data.add_entry(new_entry)
    return jsonify(new_entry)


##############################
#     PUT ROUTES
##############################
@app.route('/entry/edit', methods=['PUT', 'POST'])
def edit_entry():
    form = SubmitForm()
    lora_json = request.form.get('lora_data', '{}')

    entry_data = app_data.format_entry(form, lora_json)
    app_data.edit_entry(entry_data)
    return jsonify(entry_data)


##############################
#     PATCH ROUTES
##############################
@app.route('/entry/rating', methods=['PATCH', 'POST'])
def update_rating():
    image_url = request.args.get('image_url')
    change = int(request.args.get('change'))
    app_data.edit_ranking(image_url, change)
    return '', 200


@app.route('/entries/tags', methods=['PATCH', 'POST'])
def update_tags():
    data = request.get_json()
    urls = data.get('imageUrls')
    tags = data.get('tags')
    for url in urls:
        app_data.add_tags(url, tags)
    return '', 200


##############################
#     UTILITY ROUTES
##############################
@app.route('/favicon.ico')
def favicon():
    return "", 204


##############################
#     MAIN
##############################
if __name__ == '__main__':
    app.run(debug=True)
