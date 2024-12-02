const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// 클로바 api 키 초기화
const CLOVA_SPEECH_INVOKE_URL = process.env.CLOVA_SPEECH_INVOKE_URL;
const CLOVA_SPEECH_SECRET_KEY = process.env.CLOVA_SPEECH_SECRET_KEY;

const speachService = {
    /**
     * 
     * @param {string} file 음성 파일 경로
     * @returns {string} 인식 결과 문자열
     */
    convert_speech_to_text: async (file) => {
        const params = {
            language: 'ko-KR',
            completion: 'sync',
            wordAlignment: true,
            fullText: true,
        };
        const formData = new FormData();
        formData.append('media', fs.createReadStream(file));
        formData.append('params', JSON.stringify(params));

        const response = await axios.post(CLOVA_SPEECH_INVOKE_URL + '/recognizer/upload', formData, {
            headers: {
                ...formData.getHeaders(),
                'X-CLOVASPEECH-API-KEY': CLOVA_SPEECH_SECRET_KEY,
            },
        })
        return response.data.text;
    },
}

module.exports = speachService