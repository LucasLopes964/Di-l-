const notificationsController = require('../../controllers/notificationsController');
const notificationsService = require('../../services/notificationsService');

jest.mock('../../services/notificationsService');

describe('notificationsController', () => {
  let req, res;

  beforeEach(() => {
    req = { query: { user_id: '1' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('getNotificationsByUser deve retornar notificações do usuário', async () => {
    const mockNotifications = [
      { id: '1', user_id: '1', message: 'Notificação 1' },
      { id: '2', user_id: '1', message: 'Notificação 2' }
    ];
    notificationsService.getNotificationsByUser.mockResolvedValueOnce(mockNotifications);

    await notificationsController.getNotificationsByUser(req, res);

    expect(res.json).toHaveBeenCalledWith(mockNotifications);
  });

  test('getNotificationsByUser deve retornar erro 500 em caso de exceção', async () => {
    notificationsService.getNotificationsByUser.mockRejectedValueOnce(new Error('DB error'));

    await notificationsController.getNotificationsByUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
  });
});