const environmentsController = require('../../controllers/environmentsController');
const environmentsService = require('../../services/environmentsService');

jest.mock('../../services/environmentsService');

describe('environmentsController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('createEnvironment deve criar um novo ambiente', async () => {
    req.body = { name: 'Ambiente 1', inspection_id: '123' };
    const mockEnv = { id: '1', name: 'Ambiente 1', inspection_id: '123' };
    environmentsService.createEnvironment.mockResolvedValueOnce(mockEnv);

    await environmentsController.createEnvironment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockEnv);
  });

  test('updateEnvironment deve atualizar um ambiente', async () => {
    req.params = { id: '1' };
    req.body = { name: 'Ambiente Atualizado' };
    const mockEnv = { id: '1', name: 'Ambiente Atualizado' };
    environmentsService.updateEnvironment.mockResolvedValueOnce(mockEnv);

    await environmentsController.updateEnvironment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEnv);
  });

  test('deleteEnvironment deve deletar um ambiente', async () => {
    req.params = { id: '1' };
    const mockEnv = { id: '1', name: 'Ambiente Deletado' };
    environmentsService.deleteEnvironment.mockResolvedValueOnce(mockEnv);

    await environmentsController.deleteEnvironment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEnv);
  });

  test('getEnvironmentsById deve retornar ambientes por inspeção', async () => {
    req.query = { inspection_id: '123' };
    const mockAmbientes = [
      { id: '1', name: 'Ambiente 1', inspection_id: '123' },
      { id: '2', name: 'Ambiente 2', inspection_id: '123' }
    ];
    environmentsService.getEnvironmentsById.mockResolvedValueOnce(mockAmbientes);

    await environmentsController.getEnvironmentsById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAmbientes);
  });

  test('getInspectionByEnvironmentId deve retornar inspeção por ambiente', async () => {
    req.query = { environment_id: '1' };
    const mockInspection = { id: '123', name: 'Inspeção 1' };
    environmentsService.getInspectionByEnvironmentId.mockResolvedValueOnce(mockInspection);

    await environmentsController.getInspectionByEnvironmentId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockInspection);
  });

  test('createEnvironment deve retornar erro 400 em caso de exceção', async () => {
    req.body = { name: 'Ambiente 1', inspection_id: '123' };
    environmentsService.createEnvironment.mockRejectedValueOnce(new Error('Falha ao criar'));
    await environmentsController.createEnvironment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao criar' });
  });

  test('updateEnvironment deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    req.body = { name: 'Ambiente Atualizado' };
    environmentsService.updateEnvironment.mockRejectedValueOnce(new Error('Falha ao atualizar'));
    await environmentsController.updateEnvironment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao atualizar' });
  });

  test('deleteEnvironment deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    environmentsService.deleteEnvironment.mockRejectedValueOnce(new Error('Falha ao deletar'));
    await environmentsController.deleteEnvironment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao deletar' });
  });

  test('getEnvironmentsById deve retornar erro 400 em caso de exceção', async () => {
    req.query = { inspection_id: '123' };
    environmentsService.getEnvironmentsById.mockRejectedValueOnce(new Error('Falha ao buscar ambientes'));
    await environmentsController.getEnvironmentsById(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao buscar ambientes' });
  });

  test('getInspectionByEnvironmentId deve retornar erro 400 em caso de exceção', async () => {
    req.query = { environment_id: '1' };
    environmentsService.getInspectionByEnvironmentId.mockRejectedValueOnce(new Error('Falha ao buscar inspeção'));
    await environmentsController.getInspectionByEnvironmentId(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao buscar inspeção' });
  });
});