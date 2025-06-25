const coordinatorAssignmentsModel = require('../models/coordinatorAssignmentsModel.js');
const notificationsModel = require('../models/notificationsModel.js');

async function getCoordinatorAssignments() {
    return await coordinatorAssignmentsModel.getCoordinatorAssignments();
}

async function createCoordinatorAssignment({ user_id, inspection_id }) {
    if (!user_id || !inspection_id) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    const newAssignment = await coordinatorAssignmentsModel.createCoordinatorAssignment(user_id, inspection_id);
    await notificationsModel.createNotification(user_id, `Você foi atribuído à inspeção ${inspection_id}`);
    return newAssignment;
}

async function updateCoordinatorAssignment(id, { user_id, inspection_id }) {
    if (!id || !user_id || !inspection_id) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await coordinatorAssignmentsModel.updateCoordinatorAssignment(id, user_id, inspection_id);
}

async function deleteCoordinatorAssignment(id) {
    if (!id) {
        throw new Error('ID da atribuição de coordenador é obrigatório.');
    }
    const deletedAssignment = await coordinatorAssignmentsModel.deleteCoordinatorAssignment(id);
    if (!deletedAssignment) {
        throw new Error('Atribuição de coordenador não encontrada.');
    }
    return deletedAssignment;
}

async function getByInspectionId(inspection_id) {
    if (!inspection_id) {
        throw new Error('ID de inspeção é obrigatório.');
    }
    return await coordinatorAssignmentsModel.getByInspectionId(inspection_id);
}

module.exports = {
    getCoordinatorAssignments,
    createCoordinatorAssignment,
    updateCoordinatorAssignment,
    deleteCoordinatorAssignment,
    getByInspectionId
};
