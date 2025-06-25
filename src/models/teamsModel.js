const db = require('../config/db.js');
const { get } = require('../routes/frontRoutes.js');

const getTeams = async () => {
    try {
        const result = await db.query('SELECT * FROM teams');
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar equipes: ' + error.message);
    }
}

const createTeam = async (name, inspection_id) => { 
    try {
        const result = await db.query(
            'INSERT INTO teams (name, inspection_id) VALUES ($1, $2) RETURNING *',
            [name, inspection_id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao criar equipe: ' + error.message);
    }
}

const updateTeam = async (id, name, inspection_id) => {
    try {
        const result = await db.query(
            'UPDATE teams SET name = $2, inspection_id = $3 WHERE id = $1 RETURNING *',
            [id, name, inspection_id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao atualizar equipe: ' + error.message);
    }
}

const deleteTeam = async (id) => {
    try {
        const result = await db.query('DELETE FROM teams WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao deletar equipe: ' + error.message);
    }
}

const getTeamById = async (id) => {
    try {
        const result = await db.query('SELECT inspection_id FROM teams WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error('Equipe não encontrada');
        }
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao consultar equipe por ID: ' + error.message);
    }
}

const getByInspectionId = async (inspection_id) => {
    try {
        const result = await db.query('SELECT * FROM teams WHERE inspection_id = $1', [inspection_id]);
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar equipes por ID de inspeção: ' + error.message);
    }
}

module.exports = {
    getTeams, 
    createTeam,
    updateTeam,
    deleteTeam,
    getTeamById,
    getByInspectionId
};
