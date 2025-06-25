const recordTagsService = require('../services/recordTagsService');

// Controller para selecionar registros de tags
const getRecordTags = async (req, res) => {
    try {
        const recordTags = await recordTagsService.getRecordTags();
        res.status(200).json(recordTags);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar registros de tags: ' + error.message });
    }
};

// Controller para criar um novo registro de tag
const createRecordTag = async (req, res) => {
    try {
        const newRecordTag = await recordTagsService.createRecordTag(req.body);
        res.status(201).json(newRecordTag);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar registro de tag: ' + error.message });
    }
};

// Controller para atualizar um registro de tag existente
const updateRecordTag = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedRecordTag = await recordTagsService.updateRecordTag(id, req.body);
        res.status(200).json(updatedRecordTag);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar registro de tag: ' + error.message });
    }
};

// Controller para deletar um registro de tag existente
const deleteRecordTag = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRecordTag = await recordTagsService.deleteRecordTag(id);
        res.status(200).json(deletedRecordTag);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar registro de tag: ' + error.message });
    }
};

const getRecordTagsByRecordId = async (req, res) => {
    const { record_id } = req.query;
    try {
        const recordTags = await recordTagsService.getRecordTagsByRecordId(record_id);
        res.status(200).json(recordTags);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar registros de tags por ID de registro: ' + error.message });
    }
};

const deleteRecordTagsByRecordId = async (req, res) => {
    const { record_id } = req.params;
    try {
        const deletedRecordTags = await recordTagsService.deleteRecordTagsByRecordId(record_id);
        res.status(200).json(deletedRecordTags);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar registros de tags por ID de registro: ' + error.message });
    }
};

const getRecordTagsByTagId = async (req, res) => {
    const { tag_id } = req.query;
    try {
        const recordTags = await recordTagsService.getRecordTagsByTagId(tag_id);
        res.status(200).json(recordTags);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar registros de tags por ID de tag: ' + error.message });
    }
};

module.exports = {
    getRecordTags,
    createRecordTag,
    updateRecordTag,
    deleteRecordTag,
    getRecordTagsByRecordId,
    deleteRecordTagsByRecordId,
    getRecordTagsByTagId
};