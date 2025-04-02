from flask import Flask, render_template, jsonify, request
import json

app = Flask(__name__)


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
    return render_template('submit.html')


@app.route('/new', methods=['POST'])
def post_submit():
    # Get all form data
    data_sets = request.form.getlist('Data Set')

    structured_data = {
        "url": request.form["url"],
        "model": request.form["model"],
        "Sampling Method": request.form["Sampling Method"],
        "Sampling Steps": int(request.form["Sampling Steps"]),
        "Data Set": data_sets,
        "LoRA": {},
        "Prompt": request.form["prompt"]
    }

    # Process LoRA parameters
    for key, value in request.form.items():
        if key.startswith('LoRA['):
            param_name = key.split('[')[1].split(']')[0]
            structured_data["LoRA"][param_name] = float(value)

    # Load, update, and save JSON data
    with open("data/images.json", "r") as f:
        images = json.load(f)

    images.append(structured_data)

    with open("data/images.json", "w") as f:
        json.dump(images, f, indent=4)

    return jsonify(structured_data)


@app.route('/favicon.ico')
def favicon():
    return "", 204  # No content response to stop the 404


if __name__ == '__main__':
    app.run(debug=True)
