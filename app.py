from flask import Flask, render_template, jsonify, request
import json

app = Flask(__name__)


@app.route('/')
def index():
    with open('data/images.json') as f:
        images = json.load(f)
    return render_template('index.html', image_json=json.dumps(images))


@app.route('/api/images')
def get_images():
    with open('data/images.json') as f:
        image_data = json.load(f)
    return jsonify(image_data)


@app.route('/new')
def get_submit():
    return render_template('submit.html')


@app.route('/submit', methods=['POST'])
def post_submit():
    form_data = request.form.to_dict()
    structured_data = {
        "url": form_data["url"],
        "model": form_data["model"],
        "LoRA": {
            "DMD2": float(form_data["LoRA[DMD2]"]),
            "Bold & Soft": float(form_data["LoRA[Bold & Soft]"]),
            "Bold & Brash": float(form_data["LoRA[Bold & Brash]"])
        },
        "Sampling Method": form_data["Sampling Method"],
        "Sampling Steps": int(form_data["Sampling Steps"])
    }

    # TODO - Don't load to write
    # It was simpler to just load/append but should append w/o loading all
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
