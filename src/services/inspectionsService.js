const inspectionsModel = require('../models/inspectionsModel');
const addressesModel = require('../models/addressesModel');
const teamsModel = require('../models/teamsModel');
const teamAssignmentsModel = require('../models/teamAssignmentsModel');
const coordinatorAssignmentsModel = require('../models/coordinatorAssignmentsModel');

async function getInspections() {
    return await inspectionsModel.getInspections();
}

async function createInspection(data) {
    const {
        inspection_title, endereco, starting_date, due_date, building_type,
        description, status, image_url, latitude, longitude, coordinator_id, members, project_code_id
    } = data;

    if (!inspection_title || !endereco || !starting_date || !due_date || !building_type || !description || !status || !project_code_id) {
        throw new Error('Todos os campos são obrigatórios.');
    }

    // Cria o endereço e obtém o UUID
    const address = await addressesModel.createAddress(endereco, endereco, latitude, longitude);
    const address_id = address.id;

    // Cria a inspeção
    const newInspection = await inspectionsModel.createInspection(
        inspection_title, address_id, starting_date, due_date, building_type, description, status, image_url, project_code_id
    );

    // Criar uma equipe com base no título da inspeção (ou outro nome)
    const teamName = `Equipe - ${inspection_title}`;
    const team = await teamsModel.createTeam(teamName, newInspection.id);

    // Associar os membros selecionados à equipe
    if (Array.isArray(members)) {
        for (const user_id of members) {
            await teamAssignmentsModel.createTeamAssignment(user_id, team.id);
        }
    }

    // Associar o coordenador, se houver
    if (coordinator_id) {
        await coordinatorAssignmentsModel.createCoordinatorAssignment(coordinator_id, newInspection.id);
    }

    return newInspection;
}

async function updateInspection(id, data) {
    const { inspection_title, address_id, starting_date, due_date, building_type, description, status, image_url, project_code_id } = data;
    if (!id || !inspection_title || !address_id || !starting_date || !due_date || !building_type || !description || !status || !project_code_id) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await inspectionsModel.updateInspection(
        id, inspection_title, address_id, starting_date, due_date, building_type, description, status, image_url, project_code_id
    );
}

async function deleteInspection(id) {
    if (!id) {
        throw new Error('ID da inspeção é obrigatório.');
    }
    const deletedInspection = await inspectionsModel.deleteInspection(id);
    if (!deletedInspection) {
        throw new Error('Inspeção não encontrada.');
    }
    return deletedInspection;
}

async function getInspectionsById(id) {
    if (!id) throw new Error('ID da inspeção é obrigatório.');
    return await inspectionsModel.getInspectionsById(id);
}

async function getInspectionsForCalendar(user_id) {
    let inspections;
    if (user_id) {
        inspections = await inspectionsModel.getInspectionsForCalendarByUserId(user_id);
    } else {
        inspections = await inspectionsModel.getInspectionsForCalendar();
    }
    return inspections.map(inspection => ({
        id: inspection.id,
        title: inspection.inspection_title,
        start: inspection.starting_date,
        end: inspection.due_date,
        description: inspection.description,
        status: inspection.status,
        allDay: true
    }));
}

async function getInspectionsNextDueDate() {
    return await inspectionsModel.getInspectionsNextDueDate();
}

async function updateInspectionStatus(id, status) {
    if (!id || !status) throw new Error('ID e status são obrigatórios');
    return await inspectionsModel.updateInspectionStatus(id, status);
}


module.exports = {
    getInspections,
    createInspection,
    updateInspection,
    deleteInspection,
    getInspectionsById,
    getInspectionsForCalendar,
    getInspectionsNextDueDate,
    updateInspectionStatus  
};
