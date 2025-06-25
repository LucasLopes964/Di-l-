const db = require('../../config/db.js');
const Notifications = require('../../models/notificationsModel');
const user_id = '00000000-0000-0000-0000-000000000001';

jest.mock('../../config/db.js');

describe('Notifications Model', () => {
  // --- SUCESSO ---
  test('deve criar uma nova notificação', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: 1, user_id: user_id, message: 'Nova mensagem' }]
    });

    const notification = await Notifications.createNotification(user_id, 'Nova mensagem');
    expect(notification).toEqual({ id: 1, user_id: user_id, message: 'Nova mensagem' });
  });

  test('deve buscar notificações de um usuário', async () => {
    db.query.mockResolvedValue({
      rows: [
        { id: 1, user_id: user_id, message: 'Mensagem 1' },
        { id: 2, user_id: user_id, message: 'Mensagem 2' }
      ]
    });

    const notifications = await Notifications.getNotificationsByUser(user_id);
    expect(notifications).toEqual([
      { id: 1, user_id: user_id, message: 'Mensagem 1' },
      { id: 2, user_id: user_id, message: 'Mensagem 2' }
    ]);
  });

  // --- ERROS ---
  test('deve lançar erro ao falhar em criar notificação', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Notifications.createNotification(user_id, 'Nova mensagem'))
      .rejects.toThrow('Erro ao criar notificação: DB error');
  });

  test('deve lançar erro ao falhar em buscar notificações', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Notifications.getNotificationsByUser(user_id))
      .rejects.toThrow('Erro ao buscar notificações: DB error');
  });
});