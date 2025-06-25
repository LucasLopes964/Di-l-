const tagCategoriesModel = require('../models/tagCategoriesModel');

async function getTagCategories() {
    return await tagCategoriesModel.getTagCategories();
}

async function createTagCategory({ name }) {
    if (!name) {
        throw new Error('O campo nome é obrigatório.');
    }
    return await tagCategoriesModel.createTagCategory(name);
}

async function updateTagCategory(id, { name }) {
    if (!id || !name) {
        throw new Error('ID e nome são obrigatórios.');
    }
    return await tagCategoriesModel.updateTagCategory(id, name);
}

async function deleteTagCategory(id) {
    if (!id) {
        throw new Error('ID da categoria de tag é obrigatório.');
    }
    const deletedTagCategory = await tagCategoriesModel.deleteTagCategory(id);
    if (!deletedTagCategory) {
        throw new Error('Categoria de tag não encontrada.');
    }
    return deletedTagCategory;
}

module.exports = {
    getTagCategories,
    createTagCategory,
    updateTagCategory,
    deleteTagCategory
};