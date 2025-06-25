const teamAssignmentsModel = require('../../models/teamAssignmentsModel');
const teamAssignmentsService = require('../../services/teamAssignmentsService');
const id = '00000000-0000-0000-0000-000000000001';
const user_id = '00000000-0000-0000-0000-000000000002';
const team_id = '00000000-0000-0000-0000-000000000003';

jest.mock('../../models/teamAssignmentsModel');

describe('TeamAssignments Service', () => {
  // --- SUCESSO ---
  test('deve obter todas as atribuições de equipes', async () => {
    teamAssignmentsModel.getTeamAssignments.mockResolvedValue([{ id, user_id, team_id }]);
    const result = await teamAssignmentsService.getTeamAssignments();
    expect(result).toEqual([{ id, user_id, team_id }]);
  });

  test('deve criar uma nova atribuição de equipe', async () => {
    teamAssignmentsModel.createTeamAssignment.mockResolvedValue({ id, user_id, team_id });
    const result = await teamAssignmentsService.createTeamAssignment({ user_id, team_id });
    expect(result).toEqual({ id, user_id, team_id });
  });

  test('deve atualizar uma atribuição de equipe', async () => {
    teamAssignmentsModel.updateTeamAssignment.mockResolvedValue({ id, user_id, team_id });
    const result = await teamAssignmentsService.updateTeamAssignment(id, { user_id, team_id });
    expect(result).toEqual({ id, user_id, team_id });
  });

  test('deve deletar uma atribuição de equipe', async () => {
    teamAssignmentsModel.deleteTeamAssignment.mockResolvedValue({ id, user_id, team_id });
    const result = await teamAssignmentsService.deleteTeamAssignment(id);
    expect(result).toEqual({ id, user_id, team_id });
  });

  test('deve obter atribuições de equipe por user_id', async () => {
    teamAssignmentsModel.getTeamAssignmentsByUserId.mockResolvedValue([{ team_id }]);
    const result = await teamAssignmentsService.getTeamAssignmentsByUserId(user_id);
    expect(result).toEqual([{ team_id }]);
  });

  // --- VALIDAÇÃO ---
  test('deve lançar erro se faltar campo ao criar atribuição', async () => {
    await expect(teamAssignmentsService.createTeamAssignment({ user_id: '', team_id: '' }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar campo ao atualizar atribuição', async () => {
    await expect(teamAssignmentsService.updateTeamAssignment('', { user_id: '', team_id: '' }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar id ao deletar atribuição', async () => {
    await expect(teamAssignmentsService.deleteTeamAssignment(''))
      .rejects.toThrow('ID da atribuição de equipe é obrigatório.');
  });

  test('deve lançar erro se atribuição não for encontrada ao deletar', async () => {
    teamAssignmentsModel.deleteTeamAssignment.mockResolvedValue(undefined);
    await expect(teamAssignmentsService.deleteTeamAssignment(id))
      .rejects.toThrow('Atribuição de equipe não encontrada.');
  });

  test('deve lançar erro se faltar user_id ao buscar atribuições', async () => {
    await expect(teamAssignmentsService.getTeamAssignmentsByUserId(''))
      .rejects.toThrow('ID do usuário é obrigatório.');
  });
});