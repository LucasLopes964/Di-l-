const teamsController = require('../../controllers/teamsController');
const teamsService = require('../../services/teamsService');

jest.mock('../../services/teamsService');

describe('teamsController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('getTeams deve retornar todas as equipes', async () => {
    const mockTeams = [
      { id: '1', name: 'Equipe 1', inspection_id: '10' },
      { id: '2', name: 'Equipe 2', inspection_id: '11' }
    ];
    teamsService.getTeams.mockResolvedValueOnce(mockTeams);

    await teamsController.getTeams(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTeams);
  });

  test('getTeams deve retornar erro 500 em caso de exceção', async () => {
    teamsService.getTeams.mockRejectedValueOnce(new Error('DB error'));
    await teamsController.getTeams(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao consultar equipes: DB error' });
  });

  test('createTeam deve criar uma nova equipe', async () => {
    req.body = { name: 'Equipe Nova', inspection_id: '12' };
    const mockTeam = { id: '3', name: 'Equipe Nova', inspection_id: '12' };
    teamsService.createTeam.mockResolvedValueOnce(mockTeam);

    await teamsController.createTeam(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockTeam);
  });

  test('createTeam deve retornar erro 400 em caso de exceção', async () => {
    req.body = { name: 'Equipe Nova', inspection_id: '12' };
    teamsService.createTeam.mockRejectedValueOnce(new Error('Falha ao criar'));
    await teamsController.createTeam(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao criar' });
  });

  test('updateTeam deve atualizar uma equipe', async () => {
    req.params = { id: '1' };
    req.body = { name: 'Equipe Atualizada', inspection_id: '10' };
    const mockTeam = { id: '1', name: 'Equipe Atualizada', inspection_id: '10' };
    teamsService.updateTeam.mockResolvedValueOnce(mockTeam);

    await teamsController.updateTeam(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTeam);
  });

  test('updateTeam deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    req.body = { name: 'Equipe Atualizada', inspection_id: '10' };
    teamsService.updateTeam.mockRejectedValueOnce(new Error('Falha ao atualizar'));
    await teamsController.updateTeam(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao atualizar' });
  });

  test('deleteTeam deve deletar uma equipe', async () => {
    req.params = { id: '1' };
    const mockTeam = { id: '1', name: 'Equipe Deletada', inspection_id: '10' };
    teamsService.deleteTeam.mockResolvedValueOnce(mockTeam);

    await teamsController.deleteTeam(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTeam);
  });

  test('deleteTeam deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    teamsService.deleteTeam.mockRejectedValueOnce(new Error('Falha ao deletar'));
    await teamsController.deleteTeam(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao deletar' });
  });

  test('getTeamById deve retornar equipe por id', async () => {
    req.query = { id: '1' };
    const mockTeam = { id: '1', inspection_id: '10' };
    teamsService.getTeamById.mockResolvedValueOnce(mockTeam);

    await teamsController.getTeamById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTeam);
  });

  test('getTeamById deve retornar erro 400 em caso de exceção', async () => {
    req.query = { id: '1' };
    teamsService.getTeamById.mockRejectedValueOnce(new Error('Falha ao buscar'));
    await teamsController.getTeamById(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao buscar' });
  });
});