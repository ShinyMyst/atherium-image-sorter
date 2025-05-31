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
    # TODO - The below should be integrated into SubmitForm()
    lora_json = request.form.get('lora_data', '{}')
    lora_data = json.loads(lora_json)

    json_data = {
            "URL": form.url.data,
            "Model": form.model.data,
            "Prompt": form.prompt.data,
            "Tags": [tag.data.lower() for tag in form.tags if tag.data],
            "LoRA": lora_data,
            "Sampling Method": form.sampling_method.data,
            "Sampling Steps": form.sampling_steps.data,
            "CFG Scale": form.cfg_scale.data
    }
    write_json(form, json_data)

    return jsonify(json_data)


# TODO - This should be seperate file.
def write_json(form, json_data):
    data_sets = []
    # TODO - The below should be integrated into SubmitForm()
    if form.test_data.data:
        data_sets.append("Test Data")
    if form.test_data_hidden.data:
        data_sets.append("Test Data Ignore")
    if form.gallery.data:
        data_sets.append("Gallery")
        data_set = set()
    for item in request.form.getlist('Data Set'):
        data_set.add(item.split()[0])


@app.route('/favicon.ico')
def favicon():
    return "", 204  # No content response to stop the 404


if __name__ == '__main__':
    app.run(debug=True)
