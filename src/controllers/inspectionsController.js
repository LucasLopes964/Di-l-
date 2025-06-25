const inspectionsService = require('../services/inspectionsService');
const usersService = require('../services/usersService');
const path = require('path');

// Controller para obter todas as inspeções
const getInspections = async (req, res) => {
    try {
        const inspections = await inspectionsService.getInspections(req.query.user_id);
        res.status(200).json(inspections);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar inspeções: ' + error.message });
    }
};

const createInspection = async (req, res) => {
    try {
        const newInspection = await inspectionsService.createInspection(req.body);
        res.status(201).json(newInspection);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar inspeção: ' + error.message });
    }
};

const updateInspection = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedInspection = await inspectionsService.updateInspection(id, req.body);
        res.status(200).json(updatedInspection);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar inspeção: ' + error.message });
    }
};

const deleteInspection = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedInspection = await inspectionsService.deleteInspection(id);
        res.status(200).json(deletedInspection);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar inspeção: ' + error.message });
    }
};

const getInspectionsById = async (req, res) => {
    const { id } = req.query;
    try {
        const inspection = await inspectionsService.getInspectionsById(id);
        res.status(200).json([inspection]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar inspeção por ID: ' + error.message });
    }
};

const getInspectionsForCalendar = async (req, res) => {
    try {
        const events = await inspectionsService.getInspectionsForCalendar(req.query.user_id);
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar inspeções para o calendário: ' + error.message });
    }
};

const getInspectionsNextDueDate = async (req, res) => {
    try {
        const inspection = await inspectionsService.getInspectionsNextDueDate();
        res.json(inspection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editInspectionPage = async (req, res) => {
  const userId = req.session.user.id;
  const user = await usersService.getUserById(userId);
  const users = await usersService.getUsers(); 
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Editar Inspeção',
    content: path.join(__dirname, '../views/pages/inspectionEdit'),
    activePage: '',
    user,
    users 
  });
};

const updateInspectionStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await inspectionsService.updateInspectionStatus(id, status);
        res.status(200).json({ message: 'Status atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar status: ' + error.message });
    }
};

module.exports = {
    getInspections,
    createInspection,
    updateInspection,
    deleteInspection,
    getInspectionsById,
    getInspectionsForCalendar,
    getInspectionsNextDueDate,
    editInspectionPage,
    updateInspectionStatus
};