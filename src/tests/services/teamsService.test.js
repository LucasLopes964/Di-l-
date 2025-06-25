const teamsModel = require('../../models/teamsModel');
const teamsService = require('../../services/teamsService');
const id = '00000000-0000-0000-0000-000000000001';
const inspection_id = '00000000-0000-0000-0000-000000000002';

jest.mock('../../models/teamsModel');

describe('Teams Service', () => {
  // --- SUCESSO ---
  test('deve obter todas as equipes', async () => {
    teamsModel.getTeams.mockResolvedValue([{ id, name: 'Equipe 1', inspection_id }]);
    const result = await teamsService.getTeams();
    expect(result).toEqual([{ id, name: 'Equipe 1', inspection_id }]);
  });

  test('deve criar uma nova equipe', async () => {
    teamsModel.createTeam.mockResolvedValue({ id, name: 'Equipe 1', inspection_id });
    const result = await teamsService.createTeam({ name: 'Equipe 1', inspection_id });
    expect(result).toEqual({ id, name: 'Equipe 1', inspection_id });
  });

  test('deve atualizar uma equipe', async () => {
    teamsModel.updateTeam.mockResolvedValue({ id, name: 'Equipe Atualizada', inspection_id });
    const result = await teamsService.updateTeam(id, { name: 'Equipe Atualizada', inspection_id });
    expect(result).toEqual({ id, name: 'Equipe Atualizada', inspection_id });
  });

  test('deve deletar uma equipe', async () => {
    teamsModel.deleteTeam.mockResolvedValue({ id, name: 'Equipe 1', inspection_id });
    const result = await teamsService.deleteTeam(id);
    expect(result).toEqual({ id, name: 'Equipe 1', inspection_id });
  });

  test('deve obter equipe por id', async () => {
    teamsModel.getTeamById.mockResolvedValue({ id, name: 'Equipe 1', inspection_id });
    const result = await teamsService.getTeamById(id);
    expect(result).toEqual({ id, name: 'Equipe 1', inspection_id });
  });

  // --- VALIDAÇÃO ---
  test('deve lançar erro se faltar campo ao criar equipe', async () => {
    await expect(teamsService.createTeam({ name: '', inspection_id: '' }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar campo ao atualizar equipe', async () => {
    await expect(teamsService.updateTeam('', { name: '', inspection_id: '' }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar id ao deletar equipe', async () => {
    await expect(teamsService.deleteTeam('')).rejects.toThrow('ID da equipe é obrigatório.');
  });

  test('deve lançar erro se equipe não for encontrada ao deletar', async () => {
    teamsModel.deleteTeam.mockResolvedValue(undefined);
    await expect(teamsService.deleteTeam(id)).rejects.toThrow('Equipe não encontrada.');
  });

  test('deve lançar erro se faltar id ao buscar equipe', async () => {
    await expect(teamsService.getTeamById('')).rejects.toThrow('ID da equipe é obrigatório.');
  });
});