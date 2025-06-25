const db = require('../config/db.js');

const getTeamAssignments = async () => {
    try {
        const result = await db.query('SELECT * FROM team_assignments');
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar atribuições de equipes: ' + error.message);
    }
}

const createTeamAssignment = async (user_id, team_id) => {
    try {
        const result = await db.query(
            'INSERT INTO team_assignments (user_id, team_id) VALUES ($1, $2) RETURNING *',
            [user_id, team_id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao criar atribuição de equipe: ' + error.message);
    }
};

const updateTeamAssignment = async (id, user_id, team_id) => {
    try {
        const result = await db.query(
            'UPDATE team_assignments SET user_id = $2, team_id = $3 WHERE id = $1 RETURNING *',
            [id, user_id, team_id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao atualizar atribuição de equipe: ' + error.message);
    }
}

const deleteTeamAssignment = async (id) => {
    try {
        const result = await db.query('DELETE FROM team_assignments WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao deletar atribuição de equipe: ' + error.message);
    }
}

const getTeamAssignmentsByUserId = async (user_id) => {
    try {
        const result = await db.query('SELECT team_id FROM team_assignments WHERE user_id = $1', [user_id]);
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar atribuições de equipe por usuário: ' + error.message);
    }
}

const getByTeamId = async (team_id) => {
    try {
        const result = await db.query('SELECT * FROM team_assignments WHERE team_id = $1', [team_id]);
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar atribuições de equipe por ID de equipe: ' + error.message);
    }
}

module.exports = {
    getTeamAssignments,
    createTeamAssignment,
    updateTeamAssignment,
    deleteTeamAssignment,
    getTeamAssignmentsByUserId, 
    getByTeamId
};