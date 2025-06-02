import json
import os
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
            "CFG Scale": form.cfg_scale.data,
            "ranking": 0
    }
    write_json(form, json_data)

    return jsonify(json_data)


# TODO - This should be seperate file.
def write_json(form, json_data):
    selected_sets = form.data_sets.data  # NEW method
    print(selected_sets)

    json_dir = 'data'
    for name in selected_sets:
        file_path = os.path.join(json_dir, f"{name}.json")
        with open(file_path, 'w') as f:
            json.dump(json_data, f, indent=4)


@app.route('/favicon.ico')
def favicon():
    return "", 204  # No content response to stop the 404


if __name__ == '__main__':
    app.run(debug=True)
