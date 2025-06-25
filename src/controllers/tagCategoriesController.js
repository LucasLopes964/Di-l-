const tagCategoriesService = require('../services/tagCategoriesService');

// Controller para selecionar categorias de tags
const getTagCategories = async (req, res) => {
    try {
        const tagCategories = await tagCategoriesService.getTagCategories();
        res.status(200).json(tagCategories);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar categorias de tags: ' + error.message });
    }
};

// Controller para criar uma nova categoria de tag
const createTagCategory = async (req, res) => {
    try {
        const newTagCategory = await tagCategoriesService.createTagCategory(req.body);
        res.status(201).json(newTagCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para atualizar uma categoria de tag existente
const updateTagCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTagCategory = await tagCategoriesService.updateTagCategory(id, req.body);
        res.status(200).json(updatedTagCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para deletar uma categoria de tag existente
const deleteTagCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTagCategory = await tagCategoriesService.deleteTagCategory(id);
        res.status(200).json(deletedTagCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getTagCategories,
    createTagCategory,
    updateTagCategory,
    deleteTagCategory
};