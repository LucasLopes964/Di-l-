const db = require('../config/db.js');
const { get } = require('../routes/frontRoutes.js');

const getCoordinatorAssignments = async () => {
    try {
        const result = await db.query('SELECT * FROM coordinator_assignments');
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar atribuições de coordenador: ' + error.message);
    }
}

const createCoordinatorAssignment = async (user_id, inspection_id) => {
    try {
        const result = await db.query(
            'INSERT INTO coordinator_assignments (user_id, inspection_id) VALUES ($1, $2) RETURNING *',
            [user_id, inspection_id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao criar atribuição de coordenador: ' + error.message);
    }
}

const updateCoordinatorAssignment = async (id, user_id, inspection_id) => {
    try {
        const result = await db.query(
            'UPDATE coordinator_assignments SET user_id = $2, inspection_id = $3 WHERE id = $1 RETURNING *',
            [id, user_id, inspection_id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao atualizar atribuição de coordenador: ' + error.message);
    }
}

const deleteCoordinatorAssignment = async (id) => {
    try {
        const result = await db.query('DELETE FROM coordinator_assignments WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao deletar atribuição de coordenador: ' + error.message);
    }
}

const getCoordinatorAssignmentsByInspectionId = async (inspection_id) => {
  try {
    const result = await db.query('SELECT * FROM coordinator_assignments WHERE inspection_id = $1',[inspection_id]);
    return result.rows;
} catch (error) {
    throw new Error('Erro ao consultar atribuições de coordenador por ID de inspeção: ' + error.message);
  }
}

const getByInspectionId = async (inspection_id) => {
    try {
        const result = await db.query('SELECT * FROM coordinator_assignments WHERE inspection_id = $1', [inspection_id]);
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar atribuições de coordenador por ID de inspeção: ' + error.message);
    }
}

module.exports = {
    getCoordinatorAssignments,
    createCoordinatorAssignment,
    updateCoordinatorAssignment,
    deleteCoordinatorAssignment,
    getCoordinatorAssignmentsByInspectionId,
    deleteCoordinatorAssignment, 
    getByInspectionId
};