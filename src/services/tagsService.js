const tagsModel = require('../models/tagsModel');

async function getTags(category_id) {
    return await tagsModel.getTags(category_id);
}

async function createTag({ name, category_id }) {
    if (!name || !category_id) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await tagsModel.createTag(name, category_id);
}

async function updateTag(id, { name, category_id }) {
    if (!id || !name || !category_id) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await tagsModel.updateTag(id, name, category_id);
}

async function deleteTag(id) {
    if (!id) {
        throw new Error('ID da tag é obrigatório.');
    }
    const deletedTag = await tagsModel.deleteTag(id);
    if (!deletedTag) {
        throw new Error('Tag não encontrada.');
    }
    return deletedTag;
}

async function getTagsById(id) {
    if (!id) {
        throw new Error('ID da tag é obrigatório.');
    }
    const tag = await tagsModel.getTagsById(id);
    if (!tag) {
        throw new Error('Tag não encontrada.');
    }
    return tag;
}

async function getAllTags() {
    return await tagsModel.getAllTags();
}

module.exports = {
    getTags,
    createTag,
    updateTag,
    deleteTag,
    getTagsById,
    getAllTags
};