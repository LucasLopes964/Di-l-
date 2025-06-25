const db = require('../config/db.js');

const getTagCategories = async () => {
    try {
        const result = await db.query('SELECT * FROM tag_categories');
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar categorias de tags: ' + error.message);
    }
}

const createTagCategory = async (name) => {
    try {
        const result = await db.query(
            'INSERT INTO tag_categories (name) VALUES ($1) RETURNING *',
            [name]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao criar categoria de tag: ' + error.message);
    }
}

const updateTagCategory = async (id, name) => {
    try {
        const result = await db.query(
            'UPDATE tag_categories SET name = $2 WHERE id = $1 RETURNING *',
            [id, name]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao atualizar categoria de tag: ' + error.message);
    }
}

const deleteTagCategory = async (id) => {
    try {
        const result = await db.query('DELETE FROM tag_categories WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao deletar categoria de tag: ' + error.message);
    }
}

module.exports = {
    getTagCategories,
    createTagCategory,
    updateTagCategory,
    deleteTagCategory
};