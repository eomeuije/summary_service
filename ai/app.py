from flask import Flask, request, jsonify
from flask_cors import CORS
from summary_model import summary_model
import os
import requests
import json
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

app = Flask(__name__)
CORS(app)  

PORT = os.getenv("FLASK_PORT", 5000)
CLOVA_SPEECH_SECRET_KEY = os.getenv("CLOVA_SPEECH_SECRET_KEY")
CLOVA_SPEECH_INVOKE_URL = os.getenv("CLOVA_SPEECH_INVOKE_URL")

summary_model_dir = os.getenv("SUMMARY_MODEL", os.path.join(os.path.dirname(__file__), '..', 'korean_paper_summary'))
summary_tokenizer_dir = os.getenv("SUMMARY_TOKENIZER", os.path.join(os.path.dirname(__file__), '..', 'korean_paper_summary'))
summary_obj = summary_model(summary_model_dir, summary_tokenizer_dir)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    content = data.get('content')
    try:
        result = summary_obj.summarize(content)
        return jsonify({'summary': result})
    except Exception as e:
        return jsonify({'error': 'Summary generation failed'}), 500

@app.route('/', methods=['GET'])
def index():
    return 'hello world'

if __name__ == '__main__':
    app.run(port=PORT)
