const db = require('../../config/db.js');
const Users = require('../../models/usersModel');
const id = '00000000-0000-0000-0000-000000000001';

jest.mock('../../config/db.js');

describe('Users Model', () => {
  // --- SUCESSO ---
  test('deve obter todos os usuários', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name: 'User', email: 'user@email.com', is_admin: false }]
    });

    const users = await Users.getUsers();
    expect(users).toEqual([{ id, name: 'User', email: 'user@email.com', is_admin: false }]);
  });

  test('deve criar um novo usuário', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name: 'User', email: 'user@email.com', password: '123', is_admin: false }]
    });

    const newUser = await Users.createUser('User', 'user@email.com', '123', false);
    expect(newUser).toEqual({ id, name: 'User', email: 'user@email.com', password: '123', is_admin: false });
  });

  test('deve atualizar um usuário', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name: 'User2', email: 'user2@email.com', password: '456', is_admin: true }]
    });

    const updated = await Users.updateUser(id, 'User2', 'user2@email.com', '456', true);
    expect(updated).toEqual({ id, name: 'User2', email: 'user2@email.com', password: '456', is_admin: true });
  });

  test('deve deletar um usuário', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name: 'User', email: 'user@email.com', password: '123', is_admin: false }]
    });

    const deleted = await Users.deleteUser(id);
    expect(deleted).toEqual({ id, name: 'User', email: 'user@email.com', password: '123', is_admin: false });
  });

  test('deve obter usuário por id', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name: 'User', email: 'user@email.com', is_admin: false }]
    });

    const user = await Users.getUserById(id);
    expect(user).toEqual({ id, name: 'User', email: 'user@email.com', is_admin: false });
  });

  test('deve obter usuário por id com senha', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name: 'User', email: 'user@email.com', password: '123', is_admin: false }]
    });

    const user = await Users.getUserByIdWithPassword(id);
    expect(user).toEqual({ id, name: 'User', email: 'user@email.com', password: '123', is_admin: false });
  });

  // --- ERROS ---
  test('deve lançar erro ao falhar em obter usuários', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Users.getUsers())
      .rejects.toThrow('Erro ao consultar usuários: DB error');
  });

  test('deve lançar erro ao falhar em criar usuário', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Users.createUser('User', 'user@email.com', '123', false))
      .rejects.toThrow('Erro ao criar usuário: DB error');
  });

  test('deve lançar erro ao falhar em atualizar usuário', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Users.updateUser(id, 'User2', 'user2@email.com', '456', true))
      .rejects.toThrow('Erro ao atualizar usuário: DB error');
  });

  test('deve lançar erro ao falhar em deletar usuário', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Users.deleteUser(id))
      .rejects.toThrow('Erro ao deletar usuário: DB error');
  });

  test('deve lançar erro ao falhar em obter usuário por id', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Users.getUserById(id))
      .rejects.toThrow('Erro ao consultar usuário por ID: DB error');
  });

  test('deve lançar erro se usuário não for encontrado por id', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await expect(Users.getUserById('id-invalido'))
      .rejects.toThrow('Usuário não encontrado');
  });

  test('deve lançar erro ao falhar em obter usuário por id com senha', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Users.getUserByIdWithPassword(id))
      .rejects.toThrow('Erro ao consultar usuário por ID: DB error');
  });

  test('deve lançar erro se usuário não for encontrado por id com senha', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await expect(Users.getUserByIdWithPassword('id-invalido'))
      .rejects.toThrow('Usuário não encontrado');
  });
});

