const environmentsModel = require('../models/environmentsModel');

async function createEnvironment({ name, inspection_id }) {
    if (!name || !inspection_id) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await environmentsModel.createEnvironment(name, inspection_id);
}

async function updateEnvironment(id, { name, inspection_id }) {
    if (!id || !name || !inspection_id) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await environmentsModel.updateEnvironment(id, name, inspection_id);
}

async function deleteEnvironment(id) {
    if (!id) {
        throw new Error('ID do ambiente é obrigatório.');
    }
    const deletedEnvironment = await environmentsModel.deleteEnvironment(id);
    if (!deletedEnvironment) {
        throw new Error('Ambiente não encontrado.');
    }
    return deletedEnvironment;
}

async function getEnvironmentsById(inspection_id) {
    if (!inspection_id) {
        throw new Error('ID da inspeção é obrigatório.');
    }
    return await environmentsModel.getEnvironmentsById(inspection_id);
}

async function getInspectionByEnvironmentId(environment_id) {
    if (!environment_id) {
        throw new Error('ID do ambiente é obrigatório.');
    }
    const inspection = await environmentsModel.getInspectionByEnvironmentId(environment_id);
    if (!inspection) {
        throw new Error('Inspeção não encontrada.');
    }
    return inspection;
}

module.exports = {
    createEnvironment,
    updateEnvironment,
    deleteEnvironment,
    getEnvironmentsById,
    getInspectionByEnvironmentId
};
