from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app)  # Allows your frontend (e.g., React) to access this backend

# Set your OpenAI API Key
openai.api_key = "YOUR_OPENAI_API_KEY"  # Replace with your actual key

@app.route('/')
def home():
    return 'Flask backend is running!'

@app.route('/generate', methods=['POST'])
def generate_design():
    try:
        data = request.json
        image_data = data.get("image")
        style = data.get("style", "modern")

        if not image_data:
            return jsonify({"error": "No image provided"}), 400

        # Create prompt using the selected style
        prompt = f"A {style} interior design for a modern living room"

        # Generate image using OpenAI DALL·E
        response = openai.Image.create(
            prompt=prompt,
            n=1,
            size="512x512"
        )

        generated_image_url = response['data'][0]['url']
        return jsonify({"generated_image": generated_image_url})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
