const teamAssignmentsModel = require('../models/teamAssignmentsModel');

async function getTeamAssignments() {
    return await teamAssignmentsModel.getTeamAssignments();
}

async function createTeamAssignment({ user_id, team_id }) {
    if (!user_id || !team_id) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await teamAssignmentsModel.createTeamAssignment(user_id, team_id);
}

async function updateTeamAssignment(id, { user_id, team_id }) {
    if (!id || !user_id || !team_id) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await teamAssignmentsModel.updateTeamAssignment(id, user_id, team_id);
}

async function deleteTeamAssignment(id) {
    if (!id) {
        throw new Error('ID da atribuição de equipe é obrigatório.');
    }
    const deletedAssignment = await teamAssignmentsModel.deleteTeamAssignment(id);
    if (!deletedAssignment) {
        throw new Error('Atribuição de equipe não encontrada.');
    }
    return deletedAssignment;
}

async function getTeamAssignmentsByUserId(user_id) {
    if (!user_id) {
        throw new Error('ID do usuário é obrigatório.');
    }
    return await teamAssignmentsModel.getTeamAssignmentsByUserId(user_id);
}

async function getByTeamId(team_id) {
    if (!team_id) {
        throw new Error('ID da equipe é obrigatório.');
    }
    return await teamAssignmentsModel.getByTeamId(team_id);
}

module.exports = {
    getTeamAssignments,
    createTeamAssignment,
    updateTeamAssignment,
    deleteTeamAssignment,
    getTeamAssignmentsByUserId,
    getByTeamId
};