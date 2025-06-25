const teamsModel = require('../models/teamsModel.js');
const { get } = require('../routes/frontRoutes.js');

async function getTeams() {
    return await teamsModel.getTeams();
}

async function createTeam({ name, inspection_id }) {
    if (!name || !inspection_id) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await teamsModel.createTeam(name, inspection_id);
}

async function updateTeam(id, { name, inspection_id }) {
    if (!id || !name || !inspection_id) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await teamsModel.updateTeam(id, name, inspection_id);
}

async function deleteTeam(id) {
    if (!id) {
        throw new Error('ID da equipe é obrigatório.');
    }
    const deletedTeam = await teamsModel.deleteTeam(id);
    if (!deletedTeam) {
        throw new Error('Equipe não encontrada.');
    }
    return deletedTeam;
}

async function getTeamById(id) {
    if (!id) {
        throw new Error('ID da equipe é obrigatório.');
    }
    return await teamsModel.getTeamById(id);
}

async function getByInspectionId(inspection_id) {
    if (!inspection_id) {
        throw new Error('ID de inspeção é obrigatório.');
    }
    return await teamsModel.getByInspectionId(inspection_id);
}

module.exports = {
    getTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeamById,
    getByInspectionId
};