from flask import Flask, render_template, request, jsonify
import hashlib

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/calculate_file_hash", methods=["POST"])
def calculate_file_hash():
    if "file" not in request.files:
        return jsonify({"error": "Missing file"}), 400

    file = request.files["file"]
    # For checkboxes, we expect multiple values using the same key "algorithms"
    algorithms = request.form.getlist("algorithms")
    if not algorithms:
        return jsonify({"error": "No algorithm selected"}), 400

    file_content = file.read()
    results = {}
    for algo in algorithms:
        try:
            hash_obj = getattr(hashlib, algo)()
        except AttributeError:
            results[algo] = "Invalid algorithm"
            continue
        hash_obj.update(file_content)
        results[algo.upper()] = hash_obj.hexdigest()

    return jsonify({"hashes": results})

@app.route("/calculate_text_hash", methods=["POST"])
def calculate_text_hash():
    data = request.get_json()
    if not data or "text" not in data or "algorithms" not in data:
        return jsonify({"error": "Missing text or algorithms"}), 400

    text = data["text"]
    algorithms = data["algorithms"]
    results = {}
    for algo in algorithms:
        try:
            hash_obj = getattr(hashlib, algo)()
        except AttributeError:
            results[algo] = "Invalid algorithm"
            continue
        hash_obj.update(text.encode())
        results[algo.upper()] = hash_obj.hexdigest()

    return jsonify({"hashes": results})

if __name__ == "__main__":
    app.run(debug=True)