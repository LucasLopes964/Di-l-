const db = require('../../config/db.js');
const TeamAssignments = require('../../models/teamAssignmentsModel');
const id = '00000000-0000-0000-0000-000000000001';
const user_id = '00000000-0000-0000-0000-000000000002';
const team_id = '00000000-0000-0000-0000-000000000003';

jest.mock('../../config/db.js');

describe('TeamAssignments Model', () => {
  // --- SUCESSO ---
  test('deve obter todas as atribuições de equipes', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, user_id, team_id }]
    });

    const assignments = await TeamAssignments.getTeamAssignments();
    expect(assignments).toEqual([{ id, user_id, team_id }]);
  });

  test('deve criar uma nova atribuição de equipe', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, user_id, team_id }]
    });

    const newAssignment = await TeamAssignments.createTeamAssignment(user_id, team_id);
    expect(newAssignment).toEqual({ id, user_id, team_id });
  });

  test('deve atualizar uma atribuição de equipe', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, user_id, team_id }]
    });

    const updated = await TeamAssignments.updateTeamAssignment(id, user_id, team_id);
    expect(updated).toEqual({ id, user_id, team_id });
  });

  test('deve deletar uma atribuição de equipe', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, user_id, team_id }]
    });

    const deleted = await TeamAssignments.deleteTeamAssignment(id);
    expect(deleted).toEqual({ id, user_id, team_id });
  });

  test('deve obter atribuições de equipe por user_id', async () => {
    db.query.mockResolvedValue({
      rows: [{ team_id }]
    });

    const assignments = await TeamAssignments.getTeamAssignmentsByUserId(user_id);
    expect(assignments).toEqual([{ team_id }]);
  });

  // --- ERROS ---
  test('deve lançar erro ao falhar em obter atribuições de equipes', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(TeamAssignments.getTeamAssignments())
      .rejects.toThrow('Erro ao consultar atribuições de equipes: DB error');
  });

  test('deve lançar erro ao falhar em criar atribuição de equipe', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(TeamAssignments.createTeamAssignment(user_id, team_id))
      .rejects.toThrow('Erro ao criar atribuição de equipe: DB error');
  });

  test('deve lançar erro ao falhar em atualizar atribuição de equipe', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(TeamAssignments.updateTeamAssignment(id, user_id, team_id))
      .rejects.toThrow('Erro ao atualizar atribuição de equipe: DB error');
  });

  test('deve lançar erro ao falhar em deletar atribuição de equipe', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(TeamAssignments.deleteTeamAssignment(id))
      .rejects.toThrow('Erro ao deletar atribuição de equipe: DB error');
  });

  test('deve lançar erro ao falhar em obter atribuições de equipe por usuário', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(TeamAssignments.getTeamAssignmentsByUserId(user_id))
      .rejects.toThrow('Erro ao consultar atribuições de equipe por usuário: DB error');
  });
});