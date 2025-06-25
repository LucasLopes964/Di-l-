const db = require('../config/database.js')
const express = require('express');
const path = require('path');
const router = express.Router();
const multer = require('multer');
const upload = multer();

/*
 As rotas abaixo são para a API, que não requer autenticação.
 Ela serve para a execução de operações CRUD (Create, Read, Update, Delete) em diferentes entidades do sistema.
*/

//  Rotas para addresses

const addressesController = require('../controllers/addressesController');

router.get('/api/addresses', addressesController.getAddresses); 
router.post('/api/addresses', addressesController.createAddress); 
router.put('/api/addresses/:id', addressesController.updateAddress); 
router.delete('/api/addresses/:id', addressesController.deleteAddress); 
router.get('/api/addresses/getById', addressesController.getAddressById);

// Rotas para project_codes
const projectCodesController = require('../controllers/projectCodesController');

router.get('/api/project_codes', projectCodesController.getAllProjectCodes);
router.get('/api/project_codes/:id', projectCodesController.getProjectCodeById);
router.post('/api/project_codes', projectCodesController.createProjectCode);
router.put('/api/project_codes/:id', projectCodesController.updateProjectCode);
router.delete('/api/project_codes/:id', projectCodesController.deleteProjectCode);


// Rotas para inspeções 

const inspectionsController = require('../controllers/inspectionsController');

router.get('/api/inspections', inspectionsController.getInspections);
router.post('/api/inspections', inspectionsController.createInspection);
router.put('/api/inspections/:id', inspectionsController.updateInspection);
router.delete('/api/inspections/:id', inspectionsController.deleteInspection);
router.get('/api/inspections/getById', inspectionsController.getInspectionsById);
router.get('/api/inspections/calendar', inspectionsController.getInspectionsForCalendar);
router.get('/api/inspections/nextDueDate', inspectionsController.getInspectionsNextDueDate);
router.put('/api/inspections/:id/status', inspectionsController.updateInspectionStatus);

// Rotas para users
const usersController = require('../controllers/usersController');

router.get('/api/users/getById', usersController.getById);

// Rotas para configurações
const settingsController = require('../scripts/settings');

// Rotas para configurações de usuário
router.get('/api/user/profile', settingsController.getUserProfile);
router.post('/api/user/profile', settingsController.updateUserProfile);

router.get('/api/users', usersController.getUsers);
router.post('/api/users', usersController.createUser);
router.put('/api/users/:id', usersController.updateUser);
router.delete('/api/users/:id', usersController.deleteUser);

// Rotas para coordinator_assignments

const coordinatorAssignmentsController = require('../controllers/coordinatorAssignmentsController');

router.get('/api/coordinator_assignments', coordinatorAssignmentsController.getCoordinatorAssignments);
router.post('/api/coordinator_assignments', coordinatorAssignmentsController.createCoordinatorAssignment);
router.put('/api/coordinator_assignments/:id', coordinatorAssignmentsController.updateCoordinatorAssignment);
router.delete('/api/coordinator_assignments/:id', coordinatorAssignmentsController.deleteCoordinatorAssignment); 
router.get('/api/coordinator_assignments/getByInspectionId', coordinatorAssignmentsController.getByInspectionId);

// Rotas para teams

const teamsController = require('../controllers/teamsController');

router.get('/api/teams', teamsController.getTeams);
router.post('/api/teams', teamsController.createTeam);
router.put('/api/teams/:id', teamsController.updateTeam);
router.delete('/api/teams/:id', teamsController.deleteTeam);
router.get('/api/teams/getById', teamsController.getTeamById);
router.get('/api/teams/getByInspectionId', teamsController.getByInspectionId);

// Rotas para environments 

const environmentsController = require('../controllers/environmentsController');  

router.get('/api/environments', environmentsController.getEnvironmentsById);
router.post('/api/environments', environmentsController.createEnvironment);
router.put('/api/environments/:id', environmentsController.updateEnvironment);
router.delete('/api/environments/:id', environmentsController.deleteEnvironment);
router.get('/api/environments/getInspectionId', environmentsController.getInspectionByEnvironmentId);

// Rotas para team_assignments

const teamAssignmentsController = require('../controllers/teamAssignmentsController');

router.get('/api/team_assignments', teamAssignmentsController.getTeamAssignments);
router.post('/api/team_assignments', teamAssignmentsController.createTeamAssignment);
router.put('/api/team_assignments/:id', teamAssignmentsController.updateTeamAssignment);
router.delete('/api/team_assignments/:id', teamAssignmentsController.deleteTeamAssignment);
router.get('/api/team_assignments/getByUserId', teamAssignmentsController.getTeamAssignmentsByUserId);
router.get('/api/team_assignments/getByTeamId', teamAssignmentsController.getByTeamId);

// Rotas para tag_categories

const tagCategoriesController = require('../controllers/tagCategoriesController');

router.get('/api/tag_categories', tagCategoriesController.getTagCategories);
router.post('/api/tag_categories', tagCategoriesController.createTagCategory);
router.put('/api/tag_categories/:id', tagCategoriesController.updateTagCategory);
router.delete('/api/tag_categories/:id', tagCategoriesController.deleteTagCategory);

// Rotas para tags

const tagsController = require('../controllers/tagsController');

router.get('/api/tags', tagsController.getTags);
router.post('/api/tags', tagsController.createTag);
router.put('/api/tags/:id', tagsController.updateTag);
router.delete('/api/tags/:id', tagsController.deleteTag);
router.get('/api/tags/getById', tagsController.getTagsById);
router.get('/api/tags/getAll', tagsController.getAllTags);

// Rotas para records

const recordsController = require('../controllers/recordsController');

router.get('/api/records', recordsController.getRecords);
router.post('/api/records', recordsController.createRecord);
router.put('/api/records/:id', recordsController.updateRecord);
router.delete('/api/records/:id', recordsController.deleteRecord);
router.get('/api/records/getByEnvironmentId', recordsController.getRecordsByEnvironmentId);
router.get('/api/records/:id', recordsController.getRecordById);

// Rotas para record_tags

const recordTagsController = require('../controllers/recordTagsController');

router.get('/api/record_tags', recordTagsController.getRecordTags);
router.post('/api/record_tags', recordTagsController.createRecordTag);
router.put('/api/record_tags/:id', recordTagsController.updateRecordTag);
router.delete('/api/record_tags/:id', recordTagsController.deleteRecordTag);
router.get('/api/record_tags/getByRecordId', recordTagsController.getRecordTagsByRecordId);
router.delete('/api/record_tags/deleteByRecordId/:record_id', recordTagsController.deleteRecordTagsByRecordId);
router.get('/api/record_tags/getByTagId', recordTagsController.getRecordTagsByTagId);

// Rotas para images

const imagesController = require('../controllers/imagesController');

router.get('/api/images', imagesController.getImages);
router.post('/api/images', upload.single('image'), async (req, res) => {
  const { record_id } = req.body;
  const imageBuffer = req.file.buffer; // Aqui está o buffer binário
  // Salve imageBuffer no banco, campo BYTEA
  await db.query('INSERT INTO images (record_id, image_data) VALUES ($1, $2)', [record_id, imageBuffer]);
  res.status(201).json({ message: 'Imagem salva!' });
});
router.put('/api/images/:id', imagesController.upload.single('image'), imagesController.updateImage);
router.delete('/api/images/:id', imagesController.deleteImage);
router.get('/api/images/getByRecordId', imagesController.getImagesByRecordId);
router.delete('/api/images/deleteByRecordId/:record_id', imagesController.deleteImagesByRecordId);

module.exports = router;
