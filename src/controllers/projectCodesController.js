const projectCodesService = require('../services/projectCodesService');

const getAllProjectCodes = async (req, res) => {
  try {
    const codes = await projectCodesService.getAllProjectCodes();
    res.status(200).json(codes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os códigos de projeto: ' + error.message });
  }
};

const getProjectCodeById = async (req, res) => {
  try {
    const code = await projectCodesService.getProjectCodeById(req.params.id);
    res.status(200).json(code);
  } catch (error) {
    res.status(404).json({ error: 'Código de projeto não encontrado: ' + error.message });
  }
};

const createProjectCode = async (req, res) => {
  try {
    const newCode = await projectCodesService.createProjectCode(req.body);
    res.status(201).json(newCode);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar código de projeto: ' + error.message });
  }
};

const updateProjectCode = async (req, res) => {
  try {
    const updatedCode = await projectCodesService.updateProjectCode(req.params.id, req.body);
    res.status(200).json(updatedCode);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar código de projeto: ' + error.message });
  }
};

const deleteProjectCode = async (req, res) => {
  try {
    const deleted = await projectCodesService.deleteProjectCode(req.params.id);
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar código de projeto: ' + error.message });
  }
};

module.exports = {
  getAllProjectCodes,
  getProjectCodeById,
  createProjectCode,
  updateProjectCode,
  deleteProjectCode
};
