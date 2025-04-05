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
    # Get all form data

    structured_data = {
        "url": request.form["url"],
        "model": request.form["model"],
        "Sampling Method": request.form["Sampling Method"],
        "Sampling Steps": int(request.form["Sampling Steps"]),
        "Data Set": request.form.getlist('Data Set'),
        "LoRA": {},
        "Prompt": request.form["prompt"]
    }

    print(structured_data)
    data_set = set()
    for item in request.form.getlist('Data Set'):
        data_set.add(item.split()[0])

    print(data_set)

    # Process LoRA parameters
    for key, value in request.form.items():
        if key.startswith('LoRA['):
            param_name = key.split('[')[1].split(']')[0]
            structured_data["LoRA"][param_name] = float(value)

    for key in data_set:
        print(key)
        with open(json_dict[key], "r") as f:
            json_file = json.load(f)
        json_file.append(structured_data)
        with open(json_dict[key], "w") as f:
            json.dump(json_file, f, indent=4)

    return jsonify(structured_data)


@app.route('/favicon.ico')
def favicon():
    return "", 204  # No content response to stop the 404


if __name__ == '__main__':
    app.run(debug=True)
