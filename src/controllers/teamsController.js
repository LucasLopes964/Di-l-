const teamsService = require('../services/teamsService');

// Controller para obter todas as equipes
const getTeams = async (req, res) => {
    try {
        const teams = await teamsService.getTeams();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar equipes: ' + error.message });
    }
};

// Controller para criar uma nova equipe
const createTeam = async (req, res) => {
    try {
        const newTeam = await teamsService.createTeam(req.body);
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para atualizar uma equipe existente
const updateTeam = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTeam = await teamsService.updateTeam(id, req.body);
        res.status(200).json(updatedTeam);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para deletar uma equipe existente 
const deleteTeam = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTeam = await teamsService.deleteTeam(id);
        res.status(200).json(deletedTeam);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para obter equipe por ID
const getTeamById = async (req, res) => {
    const { id } = req.query;
    try {
        const team = await teamsService.getTeamById(id);
        res.status(200).json(team);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getByInspectionId = async (req, res) => {
    const { inspection_id } = req.query;
    try {
        const teams = await teamsService.getByInspectionId(inspection_id);
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar equipes por ID de inspeção: ' + error.message });
    }
}

module.exports = {
    getTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeamById, 
    getByInspectionId
};