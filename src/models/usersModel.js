const db = require('../config/db');

const getUsers = async () => {
    try {
        const result = await db.query('SELECT * FROM users');
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar usuários: ' + error.message);
    }
}

const createUser = async (name, email, password, is_admin) => {
    try {
        const result = await db.query(
            'INSERT INTO users (name, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, password, is_admin]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao criar usuário: ' + error.message);
    }
}

const updateUser = async (id, name, email, password, is_admin) => {
    try {
        const result = await db.query(
            'UPDATE users SET name = $2, email = $3, password = $4, is_admin = $5 WHERE id = $1 RETURNING *',
            [id, name, email, password, is_admin]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao atualizar usuário: ' + error.message);
    }
}

const deleteUser = async (id) => {
    try {
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao deletar usuário: ' + error.message);
    }
}

const getUserById = async (id) => {
    try {
        const result = await db.query('SELECT id, name, email, is_admin FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error('Usuário não encontrado');
        }
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao consultar usuário por ID: ' + error.message);
    }
}

const getUserByIdWithPassword = async (id) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error('Usuário não encontrado');
        }
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao consultar usuário por ID: ' + error.message);
    }
}

const getById = async (id) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error('Usuário não encontrado');
        }
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao consultar usuário por ID: ' + error.message);
    }
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    getUserByIdWithPassword,
    getById
}