const projectCodesModel = require('../models/projectCodesModel');

async function getAllProjectCodes() {
  return await projectCodesModel.getAllProjectCodes();
}

async function getProjectCodeById(id) {
  return await projectCodesModel.getProjectCodeById(id);
}

async function createProjectCode(data) {
  const { code, description } = data;
  if (!code) throw new Error('O campo "code" é obrigatório.');
  return await projectCodesModel.createProjectCode(code, description);
}

async function updateProjectCode(id, data) {
  const { code, description } = data;
  if (!code) throw new Error('O campo "code" é obrigatório.');
  return await projectCodesModel.updateProjectCode(id, code, description);
}

async function deleteProjectCode(id) {
  return await projectCodesModel.deleteProjectCode(id);
}

module.exports = {
  getAllProjectCodes,
  getProjectCodeById,
  createProjectCode,
  updateProjectCode,
  deleteProjectCode
};
