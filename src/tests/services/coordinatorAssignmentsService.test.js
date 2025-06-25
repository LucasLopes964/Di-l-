const coordinatorAssignmentsModel = require('../../models/coordinatorAssignmentsModel');
const notificationsModel = require('../../models/notificationsModel');
const coordinatorAssignmentsService = require('../../services/coordinatorAssignmentsService');
const id = '00000000-0000-0000-0000-000000000001';
const user_id = '00000000-0000-0000-0000-000000000002';
const inspection_id = '00000000-0000-0000-0000-000000000003';

jest.mock('../../models/coordinatorAssignmentsModel');
jest.mock('../../models/notificationsModel');

describe('CoordinatorAssignments Service', () => {
  // --- SUCESSO ---
  test('deve obter todas as atribuições de coordenador', async () => {
    coordinatorAssignmentsModel.getCoordinatorAssignments.mockResolvedValue([{ id, user_id, inspection_id }]);
    const result = await coordinatorAssignmentsService.getCoordinatorAssignments();
    expect(result).toEqual([{ id, user_id, inspection_id }]);
  });

  test('deve criar uma nova atribuição de coordenador', async () => {
    coordinatorAssignmentsModel.createCoordinatorAssignment.mockResolvedValue({ id, user_id, inspection_id });
    notificationsModel.createNotification.mockResolvedValue({ id: 1, user_id, message: expect.any(String) });

    const result = await coordinatorAssignmentsService.createCoordinatorAssignment({ user_id, inspection_id });
    expect(result).toEqual({ id, user_id, inspection_id });
    expect(notificationsModel.createNotification).toHaveBeenCalledWith(
      user_id,
      expect.stringContaining(inspection_id)
    );
  });

  test('deve atualizar uma atribuição de coordenador', async () => {
    coordinatorAssignmentsModel.updateCoordinatorAssignment.mockResolvedValue({ id, user_id, inspection_id });

    const result = await coordinatorAssignmentsService.updateCoordinatorAssignment(id, { user_id, inspection_id });
    expect(result).toEqual({ id, user_id, inspection_id });
  });

  test('deve deletar uma atribuição de coordenador', async () => {
    coordinatorAssignmentsModel.deleteCoordinatorAssignment.mockResolvedValue({ id, user_id, inspection_id });

    const result = await coordinatorAssignmentsService.deleteCoordinatorAssignment(id);
    expect(result).toEqual({ id, user_id, inspection_id });
  });

  // --- VALIDAÇÃO ---
  test('deve lançar erro se faltar campo ao criar atribuição', async () => {
    await expect(coordinatorAssignmentsService.createCoordinatorAssignment({ user_id: '', inspection_id: '' }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar campo ao atualizar atribuição', async () => {
    await expect(coordinatorAssignmentsService.updateCoordinatorAssignment('', { user_id: '', inspection_id: '' }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar id ao deletar atribuição', async () => {
    await expect(coordinatorAssignmentsService.deleteCoordinatorAssignment(''))
      .rejects.toThrow('ID da atribuição de coordenador é obrigatório.');
  });

  test('deve lançar erro se atribuição não for encontrada ao deletar', async () => {
    coordinatorAssignmentsModel.deleteCoordinatorAssignment.mockResolvedValue(undefined);
    await expect(coordinatorAssignmentsService.deleteCoordinatorAssignment(id))
      .rejects.toThrow('Atribuição de coordenador não encontrada.');
  });
});