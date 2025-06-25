const db = require('../config/db.js');

const getTags = async (category_id) => {
    try {
        const result = await db.query('SELECT * FROM tags WHERE category_id = $1', [category_id]);
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar tags: ' + error.message);
    }
}

const createTag = async (name, category_id) => {
    try {
        const result = await db.query(
            'INSERT INTO tags (name, category_id) VALUES ($1, $2) RETURNING *',
            [name, category_id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao criar tag: ' + error.message);
    }
}

const updateTag = async (id, name, category_id) => {
    try {
        const result = await db.query(
            'UPDATE tags SET name = $2, category_id = $3 WHERE id = $1 RETURNING *',
            [id, name, category_id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao atualizar tag: ' + error.message);
    }
}

const deleteTag = async (id) => {
    try {
        const result = await db.query('DELETE FROM tags WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao deletar tag: ' + error.message);
    }
}

const getTagsById = async (id) => {
    try {
        const result = await db.query('SELECT * FROM tags WHERE id = $1', [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao consultar tag por ID: ' + error.message);
    }
}

const getAllTags = async () => {
    try {
        const result = await db.query('SELECT * FROM tags');
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar todas as tags: ' + error.message);
    }
}

module.exports = {
    getTags,
    createTag,
    updateTag,
    deleteTag,
    getTagsById, 
    getAllTags
};