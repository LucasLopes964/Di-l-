const recordTagsController = require('../../controllers/recordTagsController');
const recordTagsService = require('../../services/recordTagsService');

jest.mock('../../services/recordTagsService');

describe('recordTagsController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('getRecordTags deve retornar todos os registros de tags', async () => {
    const mockTags = [{ id: '1', record_id: '10', tag_id: '20' }];
    recordTagsService.getRecordTags.mockResolvedValueOnce(mockTags);

    await recordTagsController.getRecordTags(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTags);
  });

  test('getRecordTags deve retornar erro 500 em caso de exceção', async () => {
    recordTagsService.getRecordTags.mockRejectedValueOnce(new Error('DB error'));
    await recordTagsController.getRecordTags(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao consultar registros de tags: DB error' });
  });

  test('createRecordTag deve criar um novo registro de tag', async () => {
    req.body = { record_id: '10', tag_id: '20' };
    const mockTag = { id: '1', record_id: '10', tag_id: '20' };
    recordTagsService.createRecordTag.mockResolvedValueOnce(mockTag);

    await recordTagsController.createRecordTag(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockTag);
  });

  test('createRecordTag deve retornar erro 500 em caso de exceção', async () => {
    req.body = { record_id: '10', tag_id: '20' };
    recordTagsService.createRecordTag.mockRejectedValueOnce(new Error('Falha ao criar'));
    await recordTagsController.createRecordTag(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar registro de tag: Falha ao criar' });
  });

  test('updateRecordTag deve atualizar um registro de tag', async () => {
    req.params = { id: '1' };
    req.body = { record_id: '10', tag_id: '20' };
    const mockTag = { id: '1', record_id: '10', tag_id: '20' };
    recordTagsService.updateRecordTag.mockResolvedValueOnce(mockTag);

    await recordTagsController.updateRecordTag(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTag);
  });

  test('updateRecordTag deve retornar erro 500 em caso de exceção', async () => {
    req.params = { id: '1' };
    req.body = { record_id: '10', tag_id: '20' };
    recordTagsService.updateRecordTag.mockRejectedValueOnce(new Error('Falha ao atualizar'));
    await recordTagsController.updateRecordTag(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar registro de tag: Falha ao atualizar' });
  });

  test('deleteRecordTag deve deletar um registro de tag', async () => {
    req.params = { id: '1' };
    const mockTag = { id: '1', record_id: '10', tag_id: '20' };
    recordTagsService.deleteRecordTag.mockResolvedValueOnce(mockTag);

    await recordTagsController.deleteRecordTag(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTag);
  });

  test('deleteRecordTag deve retornar erro 500 em caso de exceção', async () => {
    req.params = { id: '1' };
    recordTagsService.deleteRecordTag.mockRejectedValueOnce(new Error('Falha ao deletar'));
    await recordTagsController.deleteRecordTag(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao deletar registro de tag: Falha ao deletar' });
  });

  test('getRecordTagsByRecordId deve retornar registros de tags por record_id', async () => {
    req.query = { record_id: '10' };
    const mockTags = [{ id: '1', record_id: '10', tag_id: '20' }];
    recordTagsService.getRecordTagsByRecordId.mockResolvedValueOnce(mockTags);

    await recordTagsController.getRecordTagsByRecordId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTags);
  });

  test('getRecordTagsByRecordId deve retornar erro 500 em caso de exceção', async () => {
    req.query = { record_id: '10' };
    recordTagsService.getRecordTagsByRecordId.mockRejectedValueOnce(new Error('Falha ao buscar'));
    await recordTagsController.getRecordTagsByRecordId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao consultar registros de tags por ID de registro: Falha ao buscar' });
  });

  test('deleteRecordTagsByRecordId deve deletar registros de tags por record_id', async () => {
    req.params = { record_id: '10' };
    const mockTags = [{ id: '1', record_id: '10', tag_id: '20' }];
    recordTagsService.deleteRecordTagsByRecordId.mockResolvedValueOnce(mockTags);

    await recordTagsController.deleteRecordTagsByRecordId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTags);
  });

  test('deleteRecordTagsByRecordId deve retornar erro 500 em caso de exceção', async () => {
    req.params = { record_id: '10' };
    recordTagsService.deleteRecordTagsByRecordId.mockRejectedValueOnce(new Error('Falha ao deletar'));
    await recordTagsController.deleteRecordTagsByRecordId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao deletar registros de tags por ID de registro: Falha ao deletar' });
  });

  test('getRecordTagsByTagId deve retornar registros de tags por tag_id', async () => {
    req.query = { tag_id: '20' };
    const mockTags = [{ id: '1', record_id: '10', tag_id: '20' }];
    recordTagsService.getRecordTagsByTagId.mockResolvedValueOnce(mockTags);

    await recordTagsController.getRecordTagsByTagId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTags);
  });

  test('getRecordTagsByTagId deve retornar erro 500 em caso de exceção', async () => {
    req.query = { tag_id: '20' };
    recordTagsService.getRecordTagsByTagId.mockRejectedValueOnce(new Error('Falha ao buscar'));
    await recordTagsController.getRecordTagsByTagId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao consultar registros de tags por ID de tag: Falha ao buscar' });
  });
});