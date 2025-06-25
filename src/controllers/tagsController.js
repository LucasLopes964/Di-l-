const tagsService = require('../services/tagsService');

// Controller para selecionar as tags com base no ID da categoria
const getTags = async (req, res) => {
    const { category_id } = req.query;
    try {
        const tags = await tagsService.getTags(category_id);
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar tags: ' + error.message });
    }
};

// Controller para criar uma nova tag
const createTag = async (req, res) => {
    try {
        const newTag = await tagsService.createTag(req.body);
        res.status(201).json(newTag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para atualizar uma tag existente
const updateTag = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTag = await tagsService.updateTag(id, req.body);
        res.status(200).json(updatedTag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para deletar uma tag existente
const deleteTag = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTag = await tagsService.deleteTag(id);
        res.status(200).json(deletedTag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para obter tag por ID
const getTagsById = async (req, res) => {
    const { id } = req.query;
    try {
        const tag = await tagsService.getTagsById(id);
        res.status(200).json(tag);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Controller para obter todas as tags
const getAllTags = async (req, res) => {
    try {
        const tags = await tagsService.getAllTags();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar todas as tags: ' + error.message });
    }
};

module.exports = {
    getTags,
    createTag,
    updateTag,
    deleteTag,
    getTagsById,
    getAllTags
};