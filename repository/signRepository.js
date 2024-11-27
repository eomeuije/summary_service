const pool = require('./index')

const signRepository = {
    findUserById: async (id) => {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(`
SELECT OWNER_CODE, ID, PASSWORD, NAME
FROM USER
WHERE ID = ?
`, [id]);
            return result;
        } catch (error) {
            console.error('Error while find user: ', error);
        }
        await connection.release();
    },
    
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