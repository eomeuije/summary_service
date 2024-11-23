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

def convert_speech_to_text(file_path):
    try:
        with open(file_path, 'rb') as audio_file:
            files = {'media': audio_file}
            headers = {'X-CLOVASPEECH-API-KEY': CLOVA_SPEECH_SECRET_KEY}
            params = {
                'language': 'ko-KR',
                'completion': 'sync',
                'wordAlignment': True,
                'fullText': True
            }
            response = requests.post(
                f'{CLOVA_SPEECH_INVOKE_URL}/recognizer/upload',
                headers=headers,
                files=files,
                data={'params': json.dumps(params)}  
            )
            response.raise_for_status()  
            return response.json().get('text', '')

    except requests.exceptions.RequestException as e:
        return None

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    content = data.get('content')
    try:
        result = summary_obj.summarize(content)
        return jsonify({'summary': result})
    except Exception as e:
        return jsonify({'error': 'Summary generation failed'}), 500

@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    audio_file = request.files['audio']
    file_path = os.path.join(UPLOAD_FOLDER, audio_file.filename)
    
    audio_file.save(file_path)
    
    text = convert_speech_to_text(file_path)
    if text:
        return jsonify({'text': text})
    else:
        return jsonify({'error': 'Failed to convert speech to text'}), 500

@app.route('/', methods=['GET'])
def index():
    return 'hello world'

if __name__ == '__main__':
    app.run(port=PORT)
