const tagsController = require('../../controllers/tagsController');
const tagsService = require('../../services/tagsService');

jest.mock('../../services/tagsService');

describe('tagsController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('getTags deve retornar tags filtradas por categoria', async () => {
    req.query = { category_id: '1' };
    const mockTags = [{ id: '1', name: 'Tag 1', category_id: '1' }];
    tagsService.getTags.mockResolvedValueOnce(mockTags);

    await tagsController.getTags(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTags);
  });

  test('getTags deve retornar erro 500 em caso de exceção', async () => {
    req.query = { category_id: '1' };
    tagsService.getTags.mockRejectedValueOnce(new Error('DB error'));

    await tagsController.getTags(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao consultar tags: DB error' });
  });

  test('createTag deve criar uma nova tag', async () => {
    req.body = { name: 'Nova Tag', category_id: '1' };
    const mockTag = { id: '2', name: 'Nova Tag', category_id: '1' };
    tagsService.createTag.mockResolvedValueOnce(mockTag);

    await tagsController.createTag(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockTag);
  });

  test('createTag deve retornar erro 400 em caso de exceção', async () => {
    req.body = { name: 'Nova Tag', category_id: '1' };
    tagsService.createTag.mockRejectedValueOnce(new Error('Falha ao criar'));

    await tagsController.createTag(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao criar' });
  });

  test('updateTag deve atualizar uma tag', async () => {
    req.params = { id: '1' };
    req.body = { name: 'Tag Atualizada', category_id: '1' };
    const mockTag = { id: '1', name: 'Tag Atualizada', category_id: '1' };
    tagsService.updateTag.mockResolvedValueOnce(mockTag);

    await tagsController.updateTag(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTag);
  });

  test('updateTag deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    req.body = { name: 'Tag Atualizada', category_id: '1' };
    tagsService.updateTag.mockRejectedValueOnce(new Error('Falha ao atualizar'));

    await tagsController.updateTag(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao atualizar' });
  });

  test('deleteTag deve deletar uma tag', async () => {
    req.params = { id: '1' };
    const mockTag = { id: '1', name: 'Tag Deletada', category_id: '1' };
    tagsService.deleteTag.mockResolvedValueOnce(mockTag);

    await tagsController.deleteTag(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTag);
  });

  test('deleteTag deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    tagsService.deleteTag.mockRejectedValueOnce(new Error('Falha ao deletar'));

    await tagsController.deleteTag(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao deletar' });
  });

  test('getTagsById deve retornar tag por id', async () => {
    req.query = { id: '1' };
    const mockTag = { id: '1', name: 'Tag 1', category_id: '1' };
    tagsService.getTagsById.mockResolvedValueOnce(mockTag);

    await tagsController.getTagsById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTag);
  });

  test('getTagsById deve retornar erro 404 em caso de exceção', async () => {
    req.query = { id: '1' };
    tagsService.getTagsById.mockRejectedValueOnce(new Error('Não encontrada'));

    await tagsController.getTagsById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Não encontrada' });
  });

  test('getAllTags deve retornar todas as tags', async () => {
    const mockTags = [
      { id: '1', name: 'Tag 1', category_id: '1' },
      { id: '2', name: 'Tag 2', category_id: '2' }
    ];
    tagsService.getAllTags.mockResolvedValueOnce(mockTags);

    await tagsController.getAllTags(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTags);
  });

  test('getAllTags deve retornar erro 500 em caso de exceção', async () => {
    tagsService.getAllTags.mockRejectedValueOnce(new Error('DB error'));

    await tagsController.getAllTags(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao consultar todas as tags: DB error' });
  });
});