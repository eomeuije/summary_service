const axios = require('axios');

// 요약 서비스
const summaryService = {
    /**
     * 요약 실행
     * @param {string} content 원문
     * @returns 요약문
     */
    summarize: async (content) => {
        const response = await axios.post(process.env.FLASK_HOST + '/summarize', {
            content: content
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data.summary;
    },
}

module.exports = summaryService