const axios = require('axios');

const postService = {
    summarize: async (content) => {
        const response = await axios.post(process.env.FLASK_HOST + '/summarize', {
            content: content
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data.summary
    },
}

module.exports = postService