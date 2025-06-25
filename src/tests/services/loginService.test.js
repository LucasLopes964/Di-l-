const loginModel = require('../../models/loginModel');
const loginService = require('../../services/loginService');

jest.mock('../../models/loginModel');

describe('Login Service', () => {
  const email = 'user@email.com';
  const password = '123456';
  const user = { id: 1, email, name: 'Usuário Teste' };

  // --- SUCESSO ---
  test('deve realizar login com sucesso', async () => {
    loginModel.login.mockResolvedValue({ success: true, user });
    const result = await loginService.login(email, password);
    expect(result).toEqual({ success: true, user });
  });

  // --- FALHA DE CREDENCIAL ---
  test('deve retornar erro se credenciais inválidas', async () => {
    loginModel.login.mockResolvedValue({ success: false });
    const result = await loginService.login(email, password);
    expect(result).toEqual({ success: false, message: 'Credenciais inválidas.' });
  });

  // --- VALIDAÇÃO ---
  test('deve retornar erro se faltar email', async () => {
    const result = await loginService.login('', password);
    expect(result).toEqual({ success: false, message: 'Email e senha são obrigatórios.' });
  });

  test('deve retornar erro se faltar senha', async () => {
    const result = await loginService.login(email, '');
    expect(result).toEqual({ success: false, message: 'Email e senha são obrigatórios.' });
  });
});