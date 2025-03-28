from flask import Flask, render_template, jsonify
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


@app.route('/submit')
def get_submit():
    return render_template('submit.html')


@app.route('/favicon.ico')
def favicon():
    return "", 204  # No content response to stop the 404


if __name__ == '__main__':
    app.run(debug=True)
