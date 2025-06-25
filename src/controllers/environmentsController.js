const environmentsService = require('../services/environmentsService');

// Controller para criar um ambiente novo
const createEnvironment = async (req, res) => {
    try {
        const newEnvironment = await environmentsService.createEnvironment(req.body);
        res.status(201).json(newEnvironment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para atualizar um ambiente existente
const updateEnvironment = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedEnvironment = await environmentsService.updateEnvironment(id, req.body);
        res.status(200).json(updatedEnvironment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para deletar um ambiente existente
const deleteEnvironment = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEnvironment = await environmentsService.deleteEnvironment(id);
        res.status(200).json(deletedEnvironment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para selecionar ambientes por inspeção
const getEnvironmentsById = async (req, res) => {
    const { inspection_id } = req.query;
    try {
        const ambientes = await environmentsService.getEnvironmentsById(inspection_id);
        res.status(200).json(ambientes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para obter inspeção por ambiente
const getInspectionByEnvironmentId = async (req, res) => {
    const { environment_id } = req.query;
    try {
        const inspection = await environmentsService.getInspectionByEnvironmentId(environment_id);
        res.status(200).json(inspection);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createEnvironment,
    updateEnvironment,
    deleteEnvironment,
    getEnvironmentsById,
    getInspectionByEnvironmentId
};