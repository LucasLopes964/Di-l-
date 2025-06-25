const db = require('../config/db.js');
const { get } = require('../routes/frontRoutes.js');

const getRecords = async () => { 
    try {
        const result = await db.query('SELECT * FROM records');
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar registros: ' + error.message);
    }
}

const createRecord = async (name, description, environment_id, user_id) => {
    try {
        const result = await db.query(
            'INSERT INTO records (name, description, environment_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, environment_id, user_id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao criar registro: ' + error.message);
    }
}

const updateRecord = async (id, name, description, environment_id, user_id) => {
    try {
        const result = await db.query(
            'UPDATE records SET name = $2, description = $3, environment_id = $4, user_id = $5 WHERE id = $1 RETURNING *',
            [id, name, description, environment_id, user_id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao atualizar registro: ' + error.message);
    }
}

const deleteRecord = async (id) => {
    try {
        const result = await db.query('DELETE FROM records WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao deletar registro: ' + error.message);
    }
}

const getRecordsByEnvironmentId = async (environment_id) => {
    try {
        const records = await db.query('SELECT * FROM records WHERE environment_id = $1', [environment_id]);
        return records.rows;
    } catch (error) {
        throw new Error('Erro ao consultar registros por ID de ambiente: ' + error.message);
    }
}

const getRecordsById = async (id) => {
    try {
        const result = await db.query('SELECT * FROM records WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error('Registro não encontrado');
        }
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao consultar registro por ID: ' + error.message);
    }
}

module.exports = {
    getRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    getRecordsByEnvironmentId,
    getRecordsById
};