const db = require('../../config/db.js');
const CoordinatorAssignments = require('../../models/coordinatorAssignmentsModel');
const id = '00000000-0000-0000-0000-000000000001';
const user_id = '00000000-0000-0000-0000-000000000002';
const inspection_id = '00000000-0000-0000-0000-000000000003';


jest.mock('../../config/db.js');

describe('CoordinatorAssignments Model', () => {
  test('deve obter todas as atribuições de coordenador', async () => {
    db.query.mockResolvedValue({
      rows: [
        { id: id, user_id: user_id, inspection_id: inspection_id }
      ]
    });

    const newAssignments = await CoordinatorAssignments.getCoordinatorAssignments();

    expect(newAssignments).toEqual([
      { id: id, user_id: user_id, inspection_id: inspection_id }
    ]);
  });
  test('deve criar uma nova atribuição de coordenador', async () => {
    db.query.mockResolvedValue({
      rows: [
        { user_id: user_id, inspection_id: inspection_id }
      ]
    });

    const newAssignment = await CoordinatorAssignments.createCoordinatorAssignment(2, 3);

    expect(newAssignment).toEqual({ user_id: user_id, inspection_id: inspection_id });
  });

  test('deve atualizar uma atribuição de coordenador', async () => {
    db.query.mockResolvedValue({
      rows: [
        { id: id, user_id: user_id, inspection_id: inspection_id }
      ]
    });

    const updatedAssignment = await CoordinatorAssignments.updateCoordinatorAssignment(1, 2, 3);

    expect(updatedAssignment).toEqual({ id: id, user_id: user_id, inspection_id: inspection_id });
  });

  test('deve deletar uma atribuição de coordenador', async () => {
    db.query.mockResolvedValue({ rows: [ { id: id, user_id: user_id, inspection_id: inspection_id } ], rowCount: 1 });

    const isDeleted = await CoordinatorAssignments.deleteCoordinatorAssignment(1);

    expect(isDeleted).toEqual({ id: id, user_id: user_id, inspection_id: inspection_id });
  });
  
  test('deve lançar erro ao falhar em obter atribuições', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(CoordinatorAssignments.getCoordinatorAssignments()).rejects.toThrow('Erro ao consultar atribuições de coordenador');
  });

  test('deve lançar erro ao falhar em criar atribuição', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(CoordinatorAssignments.createCoordinatorAssignment(user_id, inspection_id)).rejects.toThrow('Erro ao criar atribuição de coordenador');
  });

  test('deve lançar erro ao falhar em atualizar atribuição', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(CoordinatorAssignments.updateCoordinatorAssignment(id, user_id, inspection_id)).rejects.toThrow('Erro ao atualizar atribuição de coordenador');
  });

  test('deve lançar erro ao falhar em deletar atribuição', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(CoordinatorAssignments.deleteCoordinatorAssignment(id)).rejects.toThrow('Erro ao deletar atribuição de coordenador');
  });
});

