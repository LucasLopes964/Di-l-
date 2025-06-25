const recordsService = require('../services/recordsService');

// Controller para selecionar registros
const getRecords = async (req, res) => {
    try {
        const records = await recordsService.getRecords();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar registros: ' + error.message });
    }
};

// Controller para criar um novo registro
const createRecord = async (req, res) => {
    try {
        const newRecord = await recordsService.createRecord(req.body);
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para atualizar um registro existente
const updateRecord = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedRecord = await recordsService.updateRecord(id, req.body);
        res.status(200).json(updatedRecord);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para deletar um registro existente
const deleteRecord = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRecord = await recordsService.deleteRecord(id);
        res.status(200).json(deletedRecord);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getRecordsByEnvironmentId = async (req, res) => {
    const { environment_id } = req.query;
    try {
        const records = await recordsService.getRecordsByEnvironmentId(environment_id);
        res.status(200).json(records);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getRecordById = async (req, res) => {
    const { id } = req.params;
    try {
        const record = await recordsService.getRecordById(id);
        res.status(200).json(record);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    getRecordsByEnvironmentId,
    getRecordById
};