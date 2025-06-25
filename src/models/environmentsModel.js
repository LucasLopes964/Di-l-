const db = require('../config/db.js');
const { get } = require('../routes/frontRoutes.js');

const createEnvironment = async (name, inspection_id) => {
    try {
        const result = await db.query(
            'INSERT INTO environments (name, inspection_id) VALUES ($1, $2) RETURNING *',
            [name, inspection_id]
        );  
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao criar ambiente: ' + error.message);
    }
}

const updateEnvironment = async (id, name, inspection_id) => {
    try {
        const result = await db.query(
            'UPDATE environments SET name = $2, inspection_id = $3 WHERE id = $1 RETURNING *',
            [id, name, inspection_id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao atualizar ambiente: ' + error.message);
    }
}

const deleteEnvironment = async (id) => {
    try {
        const result = await db.query('DELETE FROM environments WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao deletar ambiente: ' + error.message);
    }
}

const getEnvironmentsById = async (inspection_id) => {
    try {
        const ambientes =  await db.query('SELECT * FROM environments WHERE inspection_id = $1', [inspection_id]);
        return ambientes.rows;
    } catch (error) {
        return [];
    }
}

const getInspectionByEnvironmentId = async (environment_id) => {
    try {
        const result = await db.query('SELECT inspection_id FROM environments WHERE id = $1', [environment_id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao consultar inspeção por ID de ambiente: ' + error.message);
    }
}

module.exports = {
    createEnvironment,
    updateEnvironment,
    deleteEnvironment,
    getEnvironmentsById, 
    getInspectionByEnvironmentId
}
