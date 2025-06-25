const recordTagsModel = require('../models/recordTagsModel');

async function getRecordTags() {
    return await recordTagsModel.getRecordTags();
}

async function createRecordTag({ record_id, tag_id }) {
    if (!record_id || !tag_id) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await recordTagsModel.createRecordTag(record_id, tag_id);
}

async function updateRecordTag(id, { record_id, tag_id }) {
    if (!id || !record_id || !tag_id) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await recordTagsModel.updateRecordTag(id, record_id, tag_id);
}

async function deleteRecordTag(id) {
    if (!id) {
        throw new Error('ID do registro de tag é obrigatório.');
    }
    const deletedRecordTag = await recordTagsModel.deleteRecordTag(id);
    if (!deletedRecordTag) {
        throw new Error('Registro de tag não encontrado.');
    }
    return deletedRecordTag;
}

async function getRecordTagsByRecordId(record_id) {
    if (!record_id) {
        throw new Error('ID do registro é obrigatório.');
    }
    return await recordTagsModel.getRecordTagsByRecordId(record_id);
}

async function deleteRecordTagsByRecordId(record_id) {
    if (!record_id) {
        throw new Error('ID do registro é obrigatório.');
    }
    const deletedRecordTags = await recordTagsModel.deleteRecordTagsByRecordId(record_id);
    if (!deletedRecordTags) {
        throw new Error('Registro de tags não encontrado.');
    }
    return deletedRecordTags;
}

async function getRecordTagsByTagId(tag_id) {
    if (!tag_id) {
        throw new Error('ID da tag é obrigatório.');
    }
    return await recordTagsModel.getRecordTagsByTagId(tag_id);
}

module.exports = {
    getRecordTags,
    createRecordTag,
    updateRecordTag,
    deleteRecordTag,
    getRecordTagsByRecordId,
    deleteRecordTagsByRecordId,
    getRecordTagsByTagId
};