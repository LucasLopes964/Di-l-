const recordsController = require('../../controllers/recordsController');
const recordsService = require('../../services/recordsService');

jest.mock('../../services/recordsService');

describe('recordsController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('getRecords deve retornar todos os registros', async () => {
    const mockRecords = [
      { id: '1', name: 'Registro 1', description: 'Desc', environment_id: '10', user_id: '20' }
    ];
    recordsService.getRecords.mockResolvedValueOnce(mockRecords);

    await recordsController.getRecords(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRecords);
  });

  test('getRecords deve retornar erro 500 em caso de exceção', async () => {
    recordsService.getRecords.mockRejectedValueOnce(new Error('DB error'));
    await recordsController.getRecords(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao consultar registros: DB error' });
  });

  test('createRecord deve criar um novo registro', async () => {
    req.body = { name: 'Registro 1', description: 'Desc', environment_id: '10', user_id: '20' };
    const mockRecord = { id: '1', ...req.body };
    recordsService.createRecord.mockResolvedValueOnce(mockRecord);

    await recordsController.createRecord(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockRecord);
  });

  test('createRecord deve retornar erro 400 em caso de exceção', async () => {
    req.body = { name: 'Registro 1', description: 'Desc', environment_id: '10', user_id: '20' };
    recordsService.createRecord.mockRejectedValueOnce(new Error('Falha ao criar'));
    await recordsController.createRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao criar' });
  });

  test('updateRecord deve atualizar um registro', async () => {
    req.params = { id: '1' };
    req.body = { name: 'Registro Atualizado', description: 'Nova Desc', environment_id: '10', user_id: '20' };
    const mockRecord = { id: '1', ...req.body };
    recordsService.updateRecord.mockResolvedValueOnce(mockRecord);

    await recordsController.updateRecord(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRecord);
  });

  test('updateRecord deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    req.body = { name: 'Registro Atualizado', description: 'Nova Desc', environment_id: '10', user_id: '20' };
    recordsService.updateRecord.mockRejectedValueOnce(new Error('Falha ao atualizar'));
    await recordsController.updateRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao atualizar' });
  });

  test('deleteRecord deve deletar um registro', async () => {
    req.params = { id: '1' };
    const mockRecord = { id: '1', name: 'Registro Deletado' };
    recordsService.deleteRecord.mockResolvedValueOnce(mockRecord);

    await recordsController.deleteRecord(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRecord);
  });

  test('deleteRecord deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    recordsService.deleteRecord.mockRejectedValueOnce(new Error('Falha ao deletar'));
    await recordsController.deleteRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao deletar' });
  });

  test('getRecordsByEnvironmentId deve retornar registros por environment_id', async () => {
    req.query = { environment_id: '10' };
    const mockRecords = [
      { id: '1', name: 'Registro 1', environment_id: '10' }
    ];
    recordsService.getRecordsByEnvironmentId.mockResolvedValueOnce(mockRecords);

    await recordsController.getRecordsByEnvironmentId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRecords);
  });

  test('getRecordsByEnvironmentId deve retornar erro 400 em caso de exceção', async () => {
    req.query = { environment_id: '10' };
    recordsService.getRecordsByEnvironmentId.mockRejectedValueOnce(new Error('Falha ao buscar'));
    await recordsController.getRecordsByEnvironmentId(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao buscar' });
  });

  test('getRecordById deve retornar registro por id', async () => {
    req.params = { id: '1' };
    const mockRecord = { id: '1', name: 'Registro 1' };
    recordsService.getRecordById.mockResolvedValueOnce(mockRecord);

    await recordsController.getRecordById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRecord);
  });

  test('getRecordById deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    recordsService.getRecordById.mockRejectedValueOnce(new Error('Falha ao buscar'));
    await recordsController.getRecordById(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao buscar' });
  });
});