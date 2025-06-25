const db = require('../../config/db.js');
const LoginModel = require('../../models/loginModel');

jest.mock('../../config/db.js');

describe('Login Model', () => {
  const email = 'user@email.com';
  const password = '123456';
  const user = { id: 1, email, password, name: 'Usuário Teste' };

  // --- SUCESSO ---
  test('deve realizar login com sucesso', async () => {
    db.query.mockResolvedValue({ rows: [user] });

    const result = await LoginModel.login(email, password);

    expect(result).toEqual({ success: true, user });
  });

  test('deve retornar erro se usuário ou senha inválidos', async () => {
    db.query.mockResolvedValue({ rows: [] });

    const result = await LoginModel.login(email, password);

    expect(result).toEqual({ success: false, message: 'Usuário ou senha inválidos' });
  });

  // --- ERRO BANCO ---
  test('deve retornar erro ao ocorrer falha no banco', async () => {
    db.query.mockRejectedValue(new Error('DB error'));

    const result = await LoginModel.login(email, password);

    expect(result).toEqual({ success: false, message: 'DB error' });
  });
});