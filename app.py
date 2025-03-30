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
    form_data = request.form.to_dict()
    print(form_data)
    structured_data = {
        "url": form_data["url"],
        "model": form_data["model"],
        "Sampling Method": form_data["Sampling Method"],
        "Sampling Steps": int(form_data["Sampling Steps"]),
        "LoRA": {},
        "Prompt": form_data["prompt"]
    }

    for key, value in form_data.items():
        if key.startswith('LoRA['):
            param_name = key.split('[')[1].split(']')[0]
            structured_data["LoRA"][param_name] = float(value)

    print(structured_data)

    # TODO - Don't load to write
    # It was simpler to just load/append but should append w/o loading all
    with open("data/images.json", "r") as f:
        images = json.load(f)

    images.append(structured_data)

    with open("data/images.json", "w") as f:
        json.dump(images, f, indent=4)

    return jsonify(structured_data)
    # return render_template('index.html', image_json=json.dumps(images))


@app.route('/favicon.ico')
def favicon():
    return "", 204  # No content response to stop the 404


if __name__ == '__main__':
    app.run(debug=True)
