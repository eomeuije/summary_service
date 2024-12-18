const { execSync } = require('child_process');
const path = require('path');

const INTERPRETER_PATH = process.env.PYTHON_INTERPRETER_PATH || path.join(__dirname, '..', '..', 'venv', 'Scripts', 'python')
const SCRIPT_PATH = path.join(__dirname, 'hwp.py');

const hwpParser = {
    parseHwpToText : async (file) => {
        const command = `${INTERPRETER_PATH} ${SCRIPT_PATH} "${file}"`;
        const output = execSync(command, { encoding: 'utf-8' });
        return JSON.parse(output);
    }
}


module.exports = hwpParser;
