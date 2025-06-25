const tagCategoriesController = require('../../controllers/tagCategoriesController');
const tagCategoriesService = require('../../services/tagCategoriesService');

jest.mock('../../services/tagCategoriesService');

describe('tagCategoriesController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('getTagCategories deve retornar todas as categorias de tags', async () => {
    const mockCategories = [
      { id: '1', name: 'Categoria 1' },
      { id: '2', name: 'Categoria 2' }
    ];
    tagCategoriesService.getTagCategories.mockResolvedValueOnce(mockCategories);

    await tagCategoriesController.getTagCategories(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCategories);
  });

  test('getTagCategories deve retornar erro 500 em caso de exceção', async () => {
    tagCategoriesService.getTagCategories.mockRejectedValueOnce(new Error('DB error'));

    await tagCategoriesController.getTagCategories(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao consultar categorias de tags: DB error' });
  });

  test('createTagCategory deve criar uma nova categoria de tag', async () => {
    req.body = { name: 'Nova Categoria' };
    const mockCategory = { id: '3', name: 'Nova Categoria' };
    tagCategoriesService.createTagCategory.mockResolvedValueOnce(mockCategory);

    await tagCategoriesController.createTagCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockCategory);
  });

  test('createTagCategory deve retornar erro 400 em caso de exceção', async () => {
    req.body = { name: 'Nova Categoria' };
    tagCategoriesService.createTagCategory.mockRejectedValueOnce(new Error('Falha ao criar'));

    await tagCategoriesController.createTagCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao criar' });
  });

  test('updateTagCategory deve atualizar uma categoria de tag', async () => {
    req.params = { id: '1' };
    req.body = { name: 'Categoria Atualizada' };
    const mockCategory = { id: '1', name: 'Categoria Atualizada' };
    tagCategoriesService.updateTagCategory.mockResolvedValueOnce(mockCategory);

    await tagCategoriesController.updateTagCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCategory);
  });

  test('updateTagCategory deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    req.body = { name: 'Categoria Atualizada' };
    tagCategoriesService.updateTagCategory.mockRejectedValueOnce(new Error('Falha ao atualizar'));

    await tagCategoriesController.updateTagCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao atualizar' });
  });

  test('deleteTagCategory deve deletar uma categoria de tag', async () => {
    req.params = { id: '1' };
    const mockCategory = { id: '1', name: 'Categoria Deletada' };
    tagCategoriesService.deleteTagCategory.mockResolvedValueOnce(mockCategory);

    await tagCategoriesController.deleteTagCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCategory);
  });

  test('deleteTagCategory deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    tagCategoriesService.deleteTagCategory.mockRejectedValueOnce(new Error('Falha ao deletar'));

    await tagCategoriesController.deleteTagCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao deletar' });
  });
});