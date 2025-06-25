const usersModel = require('../../models/usersModel');
const usersService = require('../../services/usersService');
const id = '00000000-0000-0000-0000-000000000001';

jest.mock('../../models/usersModel');

describe('Users Service', () => {
  // --- SUCESSO ---
  test('deve obter todos os usuários', async () => {
    usersModel.getUsers.mockResolvedValue([
      { id, name: 'User', email: 'user@email.com', is_admin: false }
    ]);
    const result = await usersService.getUsers();
    expect(result).toEqual([{ id, name: 'User', email: 'user@email.com', is_admin: false }]);
  });

  test('deve criar um novo usuário', async () => {
    usersModel.createUser.mockResolvedValue({ id, name: 'User', email: 'user@email.com', password: '123', is_admin: false });
    const data = { name: 'User', email: 'user@email.com', password: '123', is_admin: false };
    const result = await usersService.createUser(data);
    expect(result).toEqual({ id, name: 'User', email: 'user@email.com', password: '123', is_admin: false });
  });

  test('deve atualizar um usuário', async () => {
    usersModel.updateUser.mockResolvedValue({ id, name: 'User2', email: 'user2@email.com', password: '456', is_admin: true });
    const data = { name: 'User2', email: 'user2@email.com', password: '456', is_admin: true };
    const result = await usersService.updateUser(id, data);
    expect(result).toEqual({ id, name: 'User2', email: 'user2@email.com', password: '456', is_admin: true });
  });

  test('deve deletar um usuário', async () => {
    usersModel.deleteUser.mockResolvedValue({ id, name: 'User', email: 'user@email.com', password: '123', is_admin: false });
    const result = await usersService.deleteUser(id);
    expect(result).toEqual({ id, name: 'User', email: 'user@email.com', password: '123', is_admin: false });
  });

  // --- VALIDAÇÃO ---
  test('deve lançar erro se faltar campo ao criar usuário', async () => {
    await expect(usersService.createUser({ name: '', email: '', password: '', is_admin: undefined }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar campo ao atualizar usuário', async () => {
    await expect(usersService.updateUser('', { name: '', email: '', password: '', is_admin: undefined }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar id ao deletar usuário', async () => {
    await expect(usersService.deleteUser('')).rejects.toThrow('ID do usuário é obrigatório.');
  });

  test('deve lançar erro se usuário não for encontrado ao deletar', async () => {
    usersModel.deleteUser.mockResolvedValue(undefined);
    await expect(usersService.deleteUser(id)).rejects.toThrow('Usuário não encontrado.');
  });
});