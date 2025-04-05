import json
from flask import Flask, render_template, jsonify, request
from form_gallery import GalleryForm

# TODO Rename gallery form to like submit form

json_dict = {
    'Gallery': "data/images.json",
    'Style': "data/styles.json"
}

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret-key'

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/gallery')
def gallery():
    with open('data/images.json') as f:
        images = json.load(f)
    return render_template('gallery.html', image_json=json.dumps(images))


@app.route('/api/images')
def get_images():
    with open('data/images.json') as f:
        image_data = json.load(f)
    return jsonify(image_data)


@app.route('/submit')
def get_submit():
    return render_template('submit.html', form=GalleryForm())


@app.route('/new', methods=['POST'])
def post_submit():
    form = GalleryForm()
    data_sets = []
    if form.gallery:
        data_sets.append("Gallery")
    if form.style_kagerou:
        data_sets.append("Style Kagerou")
    if form.style_holo:
        data_sets.append("Style Holo")

    structured_data = {
            # Direct access via form.field.data
            "url": form.url.data,
            "model": form.model.data,
            "prompt": form.prompt.data,
            "LoRA": {
                "dmd2": form.dmd2.data,
                "lcm": form.lcm.data,
                "bold_outlines": form.bold_outlines.data,
                "vivid_edge": form.vivid_edge.data,
                "vivid_soft": form.vivid_soft.data
            },
            "Sampling Method": form.sampling_method.data,
            "Sampling Steps": form.sampling_steps.data,
            "Data Set": data_sets
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
