const db = require('../config/db.js');

const getRecordTags = async () => {
    try {
        const result = await db.query('SELECT * FROM record_tags');
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar registros de tags: ' + error.message);
    }
}

const createRecordTag = async (registros_id, tag_id) => {
    try {
        const result = await db.query(
            'INSERT INTO record_tags (record_id, tag_id) VALUES ($1, $2) RETURNING *',
            [registros_id, tag_id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao criar registro de tag: ' + error.message);
    }
}

const updateRecordTag = async (id, registros_id, tag_id) => {
    try {
        const result = await db.query(
            'UPDATE record_tags SET record_id = $2, tag_id = $3 WHERE id = $1 RETURNING *',
            [id, registros_id, tag_id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao atualizar registro de tag: ' + error.message);
    }
}

const deleteRecordTag = async (id) => {
    try {
        const result = await db.query('DELETE FROM record_tags WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao deletar registro de tag: ' + error.message);
    }
}

const getRecordTagsByRecordId = async (record_id) => {
    try {
        const result = await db.query('SELECT * FROM record_tags WHERE record_id = $1', [record_id]);
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar registros de tags por ID de registro: ' + error.message);
    }
}

const deleteRecordTagsByRecordId = async (record_id) => {
    try {
        const result = await db.query('DELETE FROM record_tags WHERE record_id = $1 RETURNING *', [record_id]);
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao deletar registros de tags por ID de registro: ' + error.message);
    }
}

const getRecordTagsByTagId = async (tag_id) => {
    try {
        const result = await db.query('SELECT * FROM record_tags WHERE tag_id = $1', [tag_id]);
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar registros de tags por ID de tag: ' + error.message);
    }
}

module.exports = {
    getRecordTags,
    createRecordTag,
    updateRecordTag,
    deleteRecordTag, 
    getRecordTagsByRecordId,
    deleteRecordTagsByRecordId,
    getRecordTagsByTagId
};