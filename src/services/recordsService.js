const recordsModel = require('../models/recordsModel');

async function getRecords() {
    return await recordsModel.getRecords();
}

async function createRecord({ name, description, environment_id, user_id }) {
    if (!name || !description || !environment_id || !user_id) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await recordsModel.createRecord(name, description, environment_id, user_id);
}

async function updateRecord(id, { name, description, environment_id, user_id }) {
    if (!id || !name || !description || !environment_id || !user_id) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await recordsModel.updateRecord(id, name, description, environment_id, user_id);
}

async function deleteRecord(id) {
    if (!id) {
        throw new Error('ID do registro é obrigatório.');
    }
    const deletedRecord = await recordsModel.deleteRecord(id);
    if (!deletedRecord) {
        throw new Error('Registro não encontrado.');
    }
    return deletedRecord;
}

async function getRecordsByEnvironmentId(environment_id) {
    if (!environment_id) {
        throw new Error('ID do ambiente é obrigatório.');
    }
    return await recordsModel.getRecordsByEnvironmentId(environment_id);
}

async function getRecordById(id) {
    if (!id) {
        throw new Error('ID do registro é obrigatório.');
    }
    return await recordsModel.getRecordsById(id);
}

module.exports = {
    getRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    getRecordsByEnvironmentId,
    getRecordById
};