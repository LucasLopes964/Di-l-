const coordinatorAssignmentsController = require('../../controllers/coordinatorAssignmentsController');
const coordinatorAssignmentsService = require('../../services/coordinatorAssignmentsService');

jest.mock('../../services/coordinatorAssignmentsService');

describe('coordinatorAssignmentsController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('getCoordinatorAssignments deve retornar todas as atribuições', async () => {
    const mockAssignments = [
      { id: '1', user_id: '2', inspection_id: '3' }
    ];
    coordinatorAssignmentsService.getCoordinatorAssignments.mockResolvedValueOnce(mockAssignments);

    await coordinatorAssignmentsController.getCoordinatorAssignments(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAssignments);
  });

  test('createCoordinatorAssignment deve criar uma nova atribuição', async () => {
    req.body = { user_id: '2', inspection_id: '3' };
    const mockAssignment = { id: '1', user_id: '2', inspection_id: '3' };
    coordinatorAssignmentsService.createCoordinatorAssignment.mockResolvedValueOnce(mockAssignment);

    await coordinatorAssignmentsController.createCoordinatorAssignment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockAssignment);
  });

  test('updateCoordinatorAssignment deve atualizar uma atribuição', async () => {
    req.params = { id: '1' };
    req.body = { user_id: '2', inspection_id: '3' };
    const mockAssignment = { id: '1', user_id: '2', inspection_id: '3' };
    coordinatorAssignmentsService.updateCoordinatorAssignment.mockResolvedValueOnce(mockAssignment);

    await coordinatorAssignmentsController.updateCoordinatorAssignment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAssignment);
  });

  test('deleteCoordinatorAssignment deve deletar uma atribuição', async () => {
    req.params = { id: '1' };
    const mockAssignment = { id: '1', user_id: '2', inspection_id: '3' };
    coordinatorAssignmentsService.deleteCoordinatorAssignment.mockResolvedValueOnce(mockAssignment);

    await coordinatorAssignmentsController.deleteCoordinatorAssignment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAssignment);
  });

  test('getCoordinatorAssignments deve retornar erro 500 em caso de exceção', async () => {
    coordinatorAssignmentsService.getCoordinatorAssignments.mockRejectedValueOnce(new Error('DB error'));
    await coordinatorAssignmentsController.getCoordinatorAssignments(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao consultar atribuições de coordenador: DB error' });
  });

  test('createCoordinatorAssignment deve retornar erro 400 em caso de exceção', async () => {
    req.body = { user_id: '2', inspection_id: '3' };
    coordinatorAssignmentsService.createCoordinatorAssignment.mockRejectedValueOnce(new Error('Falha ao criar'));
    await coordinatorAssignmentsController.createCoordinatorAssignment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao criar' });
  });

  test('updateCoordinatorAssignment deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    req.body = { user_id: '2', inspection_id: '3' };
    coordinatorAssignmentsService.updateCoordinatorAssignment.mockRejectedValueOnce(new Error('Falha ao atualizar'));
    await coordinatorAssignmentsController.updateCoordinatorAssignment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao atualizar' });
  });

  test('deleteCoordinatorAssignment deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    coordinatorAssignmentsService.deleteCoordinatorAssignment.mockRejectedValueOnce(new Error('Falha ao deletar'));
    await coordinatorAssignmentsController.deleteCoordinatorAssignment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao deletar' });
  });
});