const notificationsModel = require('../../models/notificationsModel');
const notificationsService = require('../../services/notificationsService');
const user_id = '00000000-0000-0000-0000-000000000001';

jest.mock('../../models/notificationsModel');

describe('Notifications Service', () => {
  // --- SUCESSO ---
  test('deve obter notificações por usuário', async () => {
    notificationsModel.getNotificationsByUser.mockResolvedValue([
      { id: 1, user_id, message: 'Mensagem 1' }
    ]);
    const result = await notificationsService.getNotificationsByUser(user_id);
    expect(result).toEqual([{ id: 1, user_id, message: 'Mensagem 1' }]);
  });

  // --- VALIDAÇÃO ---
  test('deve lançar erro se faltar user_id', async () => {
    await expect(notificationsService.getNotificationsByUser(''))
      .rejects.toThrow('ID do usuário é obrigatório.');
  });
});