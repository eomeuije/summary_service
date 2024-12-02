const signRepository = require('../../repository/signRepository');
const bcrypt = require('bcrypt');
const salt = 10;

const signService = {
    /**
     * 회원 검색
     * @param {string} id 
     * @returns {Object} 회원 객체
     */
    findUserById: async (id) => {
        const user = (await signRepository.findUserById(id))[0];
        if (!user) {
            throw new Error('ID is not Found');
        }
        
        return user;
    },
    /**
     * 비밀번호 대조
     * @param {string} plainPassword 원본 비밀번호
     * @param {string} passwordFromDB 암호화된 비밀번호
     * @returns {boolean} 비밀번호 일치 여부
     */
    correctPasswordOrThrow: async (plainPassword, passwordFromDB) => {
        const isCorrect = await bcrypt.compare(plainPassword, passwordFromDB);
        if (!isCorrect) {
            throw new Error('Password is incorrect');
        }
        return isCorrect;
    },
    /**
     * 폼 회원가입
     * @param {string} id 
     * @param {string} name 
     * @param {string} password 
     * @returns {*} DB 조회결과
     */
    signup: async (id, name, password) => {
        const user = (await signRepository.findUserById(id))[0]
        if (user?.OWNER_CODE) {
            throw new Error('ID is duplicated');
        }
        password = await bcrypt.hash(password, salt);
        return signRepository.addSign(id, name, password);
    },
    /**
     * OAUTH2 비밀번호 없는 회원가입
     * @param {string} id 
     * @param {string} name 
     * @returns {*} DB 조회결과
     */
    signupAuth: async (id, name) => {
        const user = (await signRepository.findUserById(id))[0]
        if (user?.OWNER_CODE) {
            throw new Error('ID is duplicated');
        }
        return signRepository.addSign(id, name, null);
    }
}

module.exports = signService