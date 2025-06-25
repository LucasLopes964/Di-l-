const coordinatorAssignmentsService = require('../services/coordinatorAssignmentsService.js');

// Controller para obter todas as atribuições de coordenadores
const getCoordinatorAssignments = async (req, res) => {
    try {
        const assignments = await coordinatorAssignmentsService.getCoordinatorAssignments();
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar atribuições de coordenador: ' + error.message });
    }
};

// Controller para criar uma nova atribuição de coordenador
const createCoordinatorAssignment = async (req, res) => {
    try {
        const newAssignment = await coordinatorAssignmentsService.createCoordinatorAssignment(req.body);
        res.status(201).json(newAssignment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para atualizar uma atribuição de coordenador existente
const updateCoordinatorAssignment = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedAssignment = await coordinatorAssignmentsService.updateCoordinatorAssignment(id, req.body);
        res.status(200).json(updatedAssignment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para deletar uma atribuição de coordenador existente
const deleteCoordinatorAssignment = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedAssignment = await coordinatorAssignmentsService.deleteCoordinatorAssignment(id);
        res.status(200).json(deletedAssignment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getByInspectionId = async (req, res) => {
    const { inspection_id } = req.query;
    try {
        const assignments = await coordinatorAssignmentsService.getByInspectionId(inspection_id);
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar atribuições de coordenador por ID de inspeção: ' + error.message });
    }
}

module.exports = {
    getCoordinatorAssignments,
    createCoordinatorAssignment,
    updateCoordinatorAssignment,
    deleteCoordinatorAssignment, 
    getByInspectionId
};