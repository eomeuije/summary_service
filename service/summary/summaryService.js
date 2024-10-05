const { execFile } = require('child_process');
const path = require('path');

const pythonScript = path.join(__dirname, '..', '..', 'venv', 'Scripts', 'python');

const postService = {
    summarize: async (content) =>  new Promise((resolve, reject) => {

        const args = [path.join(__dirname, 'summarize.py'), '-c', content];

        execFile(pythonScript, args, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                reject(`Stderr: ${stderr}`);
                return;
            }

            try {
                const result = JSON.parse(stdout);
                resolve(result.summary);
            } catch (parseError) {
                reject(`Parsing Error: ${parseError.message}`);
            }
        });
    }),
}

module.exports = postService