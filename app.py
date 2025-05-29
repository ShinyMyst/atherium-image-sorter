import json
from flask import Flask, render_template, jsonify, request
from forms.submit import SubmitForm
from forms.gallery import GalleryForm


json_dict = {
    'Gallery': "data/images.json",
    'Style': "data/styles.json"
}

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret-key'
# TODO - This is a place holder since it's required for forms


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/gallery')
def gallery():
    form = GalleryForm()
    with open('data/images.json') as f:
        images = json.load(f)
    return render_template('gallery.html', form=form, image_json=images)


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
    # TODO - Stucturing form needs elsewhere
    # TODO - This also should only be changed in one place
    # TODO - The HTML should not need hardcoded nor should this reference
    # all the names should be in the submit.py only

    data_sets = []
    print(dict(request.form))
    print(form)

    # TODO - Needto change the form to avoid hardcoding but giving up for now
    if form.test_data.data:
        data_sets.append("Test Data")
    if form.test_data_hidden.data:
        data_sets.append("Test Data Ignore")
    if form.gallery.data:
        data_sets.append("Gallery")
    print(data_sets)
    tags = [tag.data.lower() for tag in form.tags if tag.data]

    structured_data = {
            # Direct access via form.field.data
            "url": form.url.data,
            "model": form.model.data,
            "prompt": form.prompt.data,
            "Tags": tags,
            "LoRA": {
                "dmd2": form.dmd2.data,
                "lcm": form.lcm.data,
                "bold_outlines": form.bold_outlines.data,
                "vivid_edge": form.vivid_edge.data,
                "vivid_soft": form.vivid_soft.data
            },
            "Sampling Method": form.sampling_method.data,
            "Sampling Steps": form.sampling_steps.data,
            "CFG Scale": form.cfg_scale.data
    }
    print(structured_data)
    data_set = set()
    for item in request.form.getlist('Data Set'):
        data_set.add(item.split()[0])

    return jsonify(structured_data)


@app.route('/favicon.ico')
def favicon():
    return "", 204  # No content response to stop the 404


if __name__ == '__main__':
    app.run(debug=True)
