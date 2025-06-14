# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def generate():
    try:
        image_file = request.files['image']
        mask_file = request.files['mask']
        prompt = request.form['prompt']

        response = openai.Image.create_edit(
            image=image_file,
            mask=mask_file,
            prompt=prompt,
            size="512x512",
            n=1
        )

        return jsonify({"url": response['data'][0]['url']})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
