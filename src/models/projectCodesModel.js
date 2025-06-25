const db = require('../config/database');

async function getAllProjectCodes() {
  const result = await db.query('SELECT * FROM project_codes');
  return result.rows;
}

async function getProjectCodeById(id) {
  const result = await db.query('SELECT * FROM project_codes WHERE id = $1', [id]);
  return result.rows[0];
}

async function createProjectCode(code, description) {
  const result = await db.query(
    'INSERT INTO project_codes (code, description) VALUES ($1, $2) RETURNING *',
    [code, description]
  );
  return result.rows[0];
}

async function updateProjectCode(id, code, description) {
  const result = await db.query(
    'UPDATE project_codes SET code = $1, description = $2 WHERE id = $3 RETURNING *',
    [code, description, id]
  );
  return result.rows[0];
}

async function deleteProjectCode(id) {
  const result = await db.query('DELETE FROM project_codes WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = {
  getAllProjectCodes,
  getProjectCodeById,
  createProjectCode,
  updateProjectCode,
  deleteProjectCode
};
