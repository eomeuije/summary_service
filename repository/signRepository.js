const pool = require('./index')

// DB 연결 함수 정의
const signRepository = {
    // id로 회원정보 검색
    findUserById: async (id) => {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(`
SELECT OWNER_CODE, ID, PASSWORD, NAME, MEMBERSHIP_TIER
FROM USER
WHERE ID = ?
`, [id]);
            return result;
        } catch (error) {
            console.error('Error while find user: ', error);
        }
        await connection.release();
    },
    // 회원가입
    addSign: async (id, name, password) => {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
`INSERT INTO USER (
    ID
    , NAME
    , PASSWORD
) VALUES (?, ?, ?)`, [id, name, password]);
            return result;
        } catch (error) {
            console.error('Error while insert sign: ', error);
        }
        await connection.release();
    }
}

module.exports = signRepository