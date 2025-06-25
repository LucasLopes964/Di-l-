const db = require('../config/db');

const login = async (email, password) => {
    try {
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1 AND password = $2',
            [email, password]
        );
        if (result.rows.length === 0) {
            throw new Error('Usuário ou senha inválidos');
        }
        return { success: true, user: result.rows[0] };
    } catch (error) {
        return { success: false, message: error.message};
    }
}

module.exports = {
    login
};
