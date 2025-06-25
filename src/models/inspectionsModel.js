const db = require('../config/db.js');

const getInspections = async () => {
    try {
        const result = await db.query('SELECT * FROM inspections');
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar inspeções: ' + error.message);
    }
}

const createInspection = async (inspection_title, address_id, starting_date, due_date, building_type, description, status, image_url, project_code_id) => {
    try {
        const result = await db.query(
            `INSERT INTO inspections (
        inspection_title, address_id, starting_date, due_date, building_type, description, status, image_url, project_code_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [inspection_title, address_id, starting_date, due_date, building_type, description, status, image_url, project_code_id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao criar inspeção: ' + error.message);
    }
};


const updateInspection = async (id, inspection_title, address_id, starting_date, due_date, building_type, description, status, project_code_id) => {
    try {
        const result = await db.query(
            'UPDATE inspections SET inspection_title = $2, address_id = $3, starting_date = $4, due_date = $5, building_type = $6, description = $7, status = $8, project_code_id = $9, WHERE id = $1 RETURNING *',
            [id, inspection_title, address_id, starting_date, due_date, building_type, description, status, project_code_id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao atualizar inspeção: ' + error.message);
    }
}

const deleteInspection = async (id) => {
    try {
        const result = await db.query('DELETE FROM inspections WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao deletar inspeção: ' + error.message);
    }
}

const getInspectionsById = async (id) => {
    try {
        const result = await db.query('SELECT * FROM inspections WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error('Inspeção não encontrada');
        }
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao consultar inspeção por ID: ' + error.message);
    }
}

const getInspectionsForCalendar = async () => {
    try {
        const query = `
            SELECT id, inspection_title, starting_date, due_date, description, status
            FROM inspections
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao carregar inspeções para o calendário: ' + error.message);
    }
};

const getInspectionsWithAddress = async () => {
    try {
        const result = await db.query(`
            SELECT inspections.*, addresses.address AS address
            FROM inspections
            LEFT JOIN addresses ON inspections.address_id = addresses.id
        `);
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar inspeções com endereço: ' + error.message);
    }
};

const getInspectionsNextDueDate = async () => {
    try {
        const result = await db.query(`
            SELECT id, inspection_title, due_date
            FROM inspections
            WHERE due_date > NOW()
            ORDER BY due_date ASC
            LIMIT 1
        `);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao consultar próxima inspeção: ' + error.message);
    }
};

const getInspectionsForCalendarByUserId = async (user_id) => {
    const teamAssignments = await db.query('SELECT team_id FROM team_assignments WHERE user_id = $1', [user_id]);
    const teamIds = teamAssignments.rows.map(row => row.team_id);

    if (teamIds.length === 0) return [];

    const teams = await db.query('SELECT inspection_id FROM teams WHERE id = ANY($1)', [teamIds]);
    const inspectionIds = teams.rows.map(row => row.inspection_id);

    if (inspectionIds.length === 0) return [];

    const inspections = await db.query(
        'SELECT id, inspection_title, starting_date, due_date, description, status FROM inspections WHERE id = ANY($1)',
        [inspectionIds]
    );
    return inspections.rows;
};

const getInspectionsWithAddressByUserId = async (user_id) => {
    const teamAssignments = await db.query('SELECT team_id FROM team_assignments WHERE user_id = $1', [user_id]);
    const teamIds = teamAssignments.rows.map(row => row.team_id);

    if (teamIds.length === 0) return [];

    const teams = await db.query('SELECT inspection_id FROM teams WHERE id = ANY($1)', [teamIds]);
    const inspectionIds = teams.rows.map(row => row.inspection_id);

    if (inspectionIds.length === 0) return [];

    const result = await db.query(`
    SELECT inspections.*, addresses.address AS address
    FROM inspections
    LEFT JOIN addresses ON inspections.address_id = addresses.id
    WHERE inspections.id = ANY($1)
  `, [inspectionIds]);
    return result.rows;
};

const updateInspectionStatus = async (id, status) => {
    try {
        const result = await db.query(
            'UPDATE inspections SET status = $2 WHERE id = $1 RETURNING *',
            [id, status]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao atualizar status da inspeção: ' + error.message);
    }
}

module.exports = {
    getInspections,
    createInspection,
    updateInspection,
    deleteInspection,
    getInspectionsById,
    getInspectionsWithAddress,
    getInspectionsWithAddressByUserId,
    getInspectionsForCalendar,
    getInspectionsNextDueDate,
    getInspectionsForCalendarByUserId,
    updateInspectionStatus
};