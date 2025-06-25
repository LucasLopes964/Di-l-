const teamAssignmentsService = require('../services/teamAssignmentsService');

// Controller para obter todas as atribuições de equipes
const getTeamAssignments = async (req, res) => {
    try {
        const assignments = await teamAssignmentsService.getTeamAssignments();
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar atribuições de equipes: ' + error.message });
    }
};

// Controller para criar uma nova atribuição de equipe
const createTeamAssignment = async (req, res) => {
    try {
        const newAssignment = await teamAssignmentsService.createTeamAssignment(req.body);
        res.status(201).json(newAssignment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para atualizar uma atribuição de equipe existente
const updateTeamAssignment = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedAssignment = await teamAssignmentsService.updateTeamAssignment(id, req.body);
        res.status(200).json(updatedAssignment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para deletar uma atribuição de equipe existente
const deleteTeamAssignment = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedAssignment = await teamAssignmentsService.deleteTeamAssignment(id);
        res.status(200).json(deletedAssignment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para obter atribuições de equipe por usuário
const getTeamAssignmentsByUserId = async (req, res) => {
    const { user_id } = req.query;
    try {
        const assignments = await teamAssignmentsService.getTeamAssignmentsByUserId(user_id);
        res.status(200).json(assignments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getByTeamId = async (req, res) => {
    const { team_id } = req.query;
    try {
        const assignments = await teamAssignmentsService.getByTeamId(team_id);
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar atribuições de equipe por ID de equipe: ' + error.message });
    }
};


module.exports = {
    getTeamAssignments,
    createTeamAssignment,
    updateTeamAssignment,
    deleteTeamAssignment,
    getTeamAssignmentsByUserId, 
    getByTeamId
};