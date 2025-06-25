const usersController = require('../../controllers/usersController');
const usersService = require('../../services/usersService');

jest.mock('../../services/usersService');

describe('usersController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('getUsers deve retornar todos os usuários', async () => {
    const mockUsers = [
      { id: '1', name: 'User 1', email: 'user1@email.com', is_admin: false },
      { id: '2', name: 'User 2', email: 'user2@email.com', is_admin: true }
    ];
    usersService.getUsers.mockResolvedValueOnce(mockUsers);

    await usersController.getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  test('getUsers deve retornar erro 500 em caso de exceção', async () => {
    usersService.getUsers.mockRejectedValueOnce(new Error('DB error'));
    await usersController.getUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao consultar usuários: DB error' });
  });

  test('createUser deve criar um novo usuário', async () => {
    req.body = { name: 'Novo Usuário', email: 'novo@email.com', password: '123', is_admin: false };
    const mockUser = { id: '3', ...req.body };
    usersService.createUser.mockResolvedValueOnce(mockUser);

    await usersController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test('createUser deve retornar erro 400 em caso de exceção', async () => {
    req.body = { name: 'Novo Usuário', email: 'novo@email.com', password: '123', is_admin: false };
    usersService.createUser.mockRejectedValueOnce(new Error('Falha ao criar'));
    await usersController.createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao criar' });
  });

  test('updateUser deve atualizar um usuário', async () => {
    req.params = { id: '1' };
    req.body = { name: 'Atualizado', email: 'atualizado@email.com', password: '321', is_admin: true };
    const mockUser = { id: '1', ...req.body };
    usersService.updateUser.mockResolvedValueOnce(mockUser);

    await usersController.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test('updateUser deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    req.body = { name: 'Atualizado', email: 'atualizado@email.com', password: '321', is_admin: true };
    usersService.updateUser.mockRejectedValueOnce(new Error('Falha ao atualizar'));
    await usersController.updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao atualizar' });
  });

  test('deleteUser deve deletar um usuário', async () => {
    req.params = { id: '1' };
    const mockUser = { id: '1', name: 'Deletado', email: 'del@email.com', is_admin: false };
    usersService.deleteUser.mockResolvedValueOnce(mockUser);

    await usersController.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test('deleteUser deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    usersService.deleteUser.mockRejectedValueOnce(new Error('Falha ao deletar'));
    await usersController.deleteUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao deletar' });
  });
});