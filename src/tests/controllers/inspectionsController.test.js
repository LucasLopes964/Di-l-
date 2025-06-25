const inspectionsController = require('../../controllers/inspectionsController');
const inspectionsService = require('../../services/inspectionsService');

jest.mock('../../services/inspectionsService');

describe('inspectionsController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('getInspections deve retornar todas as inspeções', async () => {
    req.query = { user_id: '1' };
    const mockInspections = [{ id: '1', inspection_title: 'Inspeção 1' }];
    inspectionsService.getInspections.mockResolvedValueOnce(mockInspections);

    await inspectionsController.getInspections(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockInspections);
  });

  test('getInspections deve retornar erro 500 em caso de exceção', async () => {
    req.query = { user_id: '1' };
    inspectionsService.getInspections.mockRejectedValueOnce(new Error('DB error'));
    await inspectionsController.getInspections(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao consultar inspeções: DB error' });
  });

  test('createInspection deve criar uma nova inspeção', async () => {
    req.body = { inspection_title: 'Nova Inspeção' };
    const mockInspection = { id: '1', inspection_title: 'Nova Inspeção' };
    inspectionsService.createInspection.mockResolvedValueOnce(mockInspection);

    await inspectionsController.createInspection(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockInspection);
  });

  test('createInspection deve retornar erro 500 em caso de exceção', async () => {
    req.body = { inspection_title: 'Nova Inspeção' };
    inspectionsService.createInspection.mockRejectedValueOnce(new Error('Falha ao criar'));
    await inspectionsController.createInspection(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar inspeção: Falha ao criar' });
  });

  test('updateInspection deve atualizar uma inspeção', async () => {
    req.params = { id: '1' };
    req.body = { inspection_title: 'Atualizada' };
    const mockInspection = { id: '1', inspection_title: 'Atualizada' };
    inspectionsService.updateInspection.mockResolvedValueOnce(mockInspection);

    await inspectionsController.updateInspection(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockInspection);
  });

  test('updateInspection deve retornar erro 500 em caso de exceção', async () => {
    req.params = { id: '1' };
    req.body = { inspection_title: 'Atualizada' };
    inspectionsService.updateInspection.mockRejectedValueOnce(new Error('Falha ao atualizar'));
    await inspectionsController.updateInspection(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar inspeção: Falha ao atualizar' });
  });

  test('deleteInspection deve deletar uma inspeção', async () => {
    req.params = { id: '1' };
    const mockInspection = { id: '1', inspection_title: 'Deletada' };
    inspectionsService.deleteInspection.mockResolvedValueOnce(mockInspection);

    await inspectionsController.deleteInspection(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockInspection);
  });

  test('deleteInspection deve retornar erro 500 em caso de exceção', async () => {
    req.params = { id: '1' };
    inspectionsService.deleteInspection.mockRejectedValueOnce(new Error('Falha ao deletar'));
    await inspectionsController.deleteInspection(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao deletar inspeção: Falha ao deletar' });
  });

  test('getInspectionsById deve retornar inspeção por id', async () => {
    req.query = { id: '1' };
    const mockInspection = { id: '1', inspection_title: 'Inspeção 1' };
    inspectionsService.getInspectionsById.mockResolvedValueOnce(mockInspection);

    await inspectionsController.getInspectionsById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([mockInspection]);
  });

  test('getInspectionsById deve retornar erro 500 em caso de exceção', async () => {
    req.query = { id: '1' };
    inspectionsService.getInspectionsById.mockRejectedValueOnce(new Error('Falha ao buscar'));
    await inspectionsController.getInspectionsById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao consultar inspeção por ID: Falha ao buscar' });
  });

  test('getInspectionsForCalendar deve retornar inspeções para o calendário', async () => {
    req.query = { user_id: '1' };
    const mockEvents = [{ id: '1', inspection_title: 'Inspeção 1' }];
    inspectionsService.getInspectionsForCalendar.mockResolvedValueOnce(mockEvents);

    await inspectionsController.getInspectionsForCalendar(req, res);

    expect(res.json).toHaveBeenCalledWith(mockEvents);
  });

  test('getInspectionsForCalendar deve retornar erro 500 em caso de exceção', async () => {
    req.query = { user_id: '1' };
    inspectionsService.getInspectionsForCalendar.mockRejectedValueOnce(new Error('Falha ao buscar eventos'));
    await inspectionsController.getInspectionsForCalendar(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao carregar inspeções para o calendário: Falha ao buscar eventos' });
  });

  test('getInspectionsNextDueDate deve retornar próxima inspeção', async () => {
    const mockInspection = { id: '1', inspection_title: 'Próxima' };
    inspectionsService.getInspectionsNextDueDate.mockResolvedValueOnce(mockInspection);

    await inspectionsController.getInspectionsNextDueDate(req, res);

    expect(res.json).toHaveBeenCalledWith(mockInspection);
  });

  test('getInspectionsNextDueDate deve retornar erro 500 em caso de exceção', async () => {
    inspectionsService.getInspectionsNextDueDate.mockRejectedValueOnce(new Error('Falha ao buscar próxima'));
    await inspectionsController.getInspectionsNextDueDate(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao buscar próxima' });
  });
});