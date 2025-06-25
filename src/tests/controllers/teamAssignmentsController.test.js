const teamAssignmentsController = require('../../controllers/teamAssignmentsController');
const teamAssignmentsService = require('../../services/teamAssignmentsService');

jest.mock('../../services/teamAssignmentsService');

describe('teamAssignmentsController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('getTeamAssignments deve retornar todas as atribuições', async () => {
    const mockAssignments = [
      { id: '1', user_id: '10', team_id: '20' },
      { id: '2', user_id: '11', team_id: '21' }
    ];
    teamAssignmentsService.getTeamAssignments.mockResolvedValueOnce(mockAssignments);

    await teamAssignmentsController.getTeamAssignments(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAssignments);
  });

  test('getTeamAssignments deve retornar erro 500 em caso de exceção', async () => {
    teamAssignmentsService.getTeamAssignments.mockRejectedValueOnce(new Error('DB error'));
    await teamAssignmentsController.getTeamAssignments(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao consultar atribuições de equipes: DB error' });
  });

  test('createTeamAssignment deve criar uma nova atribuição', async () => {
    req.body = { user_id: '10', team_id: '20' };
    const mockAssignment = { id: '1', user_id: '10', team_id: '20' };
    teamAssignmentsService.createTeamAssignment.mockResolvedValueOnce(mockAssignment);

    await teamAssignmentsController.createTeamAssignment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockAssignment);
  });

  test('createTeamAssignment deve retornar erro 400 em caso de exceção', async () => {
    req.body = { user_id: '10', team_id: '20' };
    teamAssignmentsService.createTeamAssignment.mockRejectedValueOnce(new Error('Falha ao criar'));
    await teamAssignmentsController.createTeamAssignment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao criar' });
  });

  test('updateTeamAssignment deve atualizar uma atribuição', async () => {
    req.params = { id: '1' };
    req.body = { user_id: '10', team_id: '20' };
    const mockAssignment = { id: '1', user_id: '10', team_id: '20' };
    teamAssignmentsService.updateTeamAssignment.mockResolvedValueOnce(mockAssignment);

    await teamAssignmentsController.updateTeamAssignment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAssignment);
  });

  test('updateTeamAssignment deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    req.body = { user_id: '10', team_id: '20' };
    teamAssignmentsService.updateTeamAssignment.mockRejectedValueOnce(new Error('Falha ao atualizar'));
    await teamAssignmentsController.updateTeamAssignment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao atualizar' });
  });

  test('deleteTeamAssignment deve deletar uma atribuição', async () => {
    req.params = { id: '1' };
    const mockAssignment = { id: '1', user_id: '10', team_id: '20' };
    teamAssignmentsService.deleteTeamAssignment.mockResolvedValueOnce(mockAssignment);

    await teamAssignmentsController.deleteTeamAssignment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAssignment);
  });

  test('deleteTeamAssignment deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    teamAssignmentsService.deleteTeamAssignment.mockRejectedValueOnce(new Error('Falha ao deletar'));
    await teamAssignmentsController.deleteTeamAssignment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao deletar' });
  });

  test('getTeamAssignmentsByUserId deve retornar atribuições por usuário', async () => {
    req.query = { user_id: '10' };
    const mockAssignments = [
      { team_id: '20' },
      { team_id: '21' }
    ];
    teamAssignmentsService.getTeamAssignmentsByUserId.mockResolvedValueOnce(mockAssignments);

    await teamAssignmentsController.getTeamAssignmentsByUserId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAssignments);
  });

  test('getTeamAssignmentsByUserId deve retornar erro 400 em caso de exceção', async () => {
    req.query = { user_id: '10' };
    teamAssignmentsService.getTeamAssignmentsByUserId.mockRejectedValueOnce(new Error('Falha ao buscar'));
    await teamAssignmentsController.getTeamAssignmentsByUserId(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao buscar' });
  });
});