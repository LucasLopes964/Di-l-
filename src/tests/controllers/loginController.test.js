const loginController = require('../../controllers/loginController');
const loginService = require('../../services/loginService');

jest.mock('../../services/loginService');

describe('loginController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { email: 'user@email.com', password: '123456' },
      session: {}
    };
    res = {
      redirect: jest.fn()
    };
  });

  test('login deve autenticar e redirecionar para "/" em caso de sucesso', async () => {
    const mockUser = { id: '1', email: 'user@email.com', name: 'User' };
    loginService.login.mockResolvedValueOnce({ success: true, user: mockUser });

    await loginController.login(req, res);

    expect(req.session.authenticated).toBe(true);
    expect(req.session.user).toEqual(mockUser);
    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  test('login deve redirecionar para "/login?error=1" em caso de falha', async () => {
    loginService.login.mockResolvedValueOnce({ success: false, message: 'Usuário ou senha inválidos' });

    await loginController.login(req, res);

    expect(req.session.authenticated).not.toBe(true);
    expect(req.session.user).toBeUndefined();
    expect(res.redirect).toHaveBeenCalledWith('/login?error=1');
  });
});