from flask import Flask, request, jsonify
from summary_model import summary_model
import os
from dotenv import load_dotenv

from asgiref.wsgi import WsgiToAsgi

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

app = Flask(__name__)

PORT = int(os.getenv("FLASK_PORT", 5000))

summary_model_dir = os.getenv("SUMMARY_MODEL", os.path.join(os.path.dirname(__file__), '..', 'korean_paper_summary'))
summary_tokenizer_dir = os.getenv("SUMMARY_TOKENIZER", os.path.join(os.path.dirname(__file__), '..', 'korean_paper_summary'))
summary_obj = summary_model(summary_model_dir, summary_tokenizer_dir)

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
    asgi_app = WsgiToAsgi(app)
    import uvicorn
    uvicorn.run(asgi_app, port=PORT)
