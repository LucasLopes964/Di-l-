const db = require('../../config/db.js');
const Teams = require('../../models/teamsModel');
const id = '00000000-0000-0000-0000-000000000001';
const inspection_id = '00000000-0000-0000-0000-000000000002';

jest.mock('../../config/db.js');

describe('Teams Model', () => {
  // --- SUCESSO ---
  test('deve obter todas as equipes', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name: 'Equipe 1', inspection_id }]
    });

    const teams = await Teams.getTeams();
    expect(teams).toEqual([{ id, name: 'Equipe 1', inspection_id }]);
  });

  test('deve criar uma nova equipe', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name: 'Equipe 1', inspection_id }]
    });

    const newTeam = await Teams.createTeam('Equipe 1', inspection_id);
    expect(newTeam).toEqual({ id, name: 'Equipe 1', inspection_id });
  });

  test('deve atualizar uma equipe', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name: 'Equipe Atualizada', inspection_id }]
    });

    const updated = await Teams.updateTeam(id, 'Equipe Atualizada', inspection_id);
    expect(updated).toEqual({ id, name: 'Equipe Atualizada', inspection_id });
  });

  test('deve deletar uma equipe', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name: 'Equipe 1', inspection_id }]
    });

    const deleted = await Teams.deleteTeam(id);
    expect(deleted).toEqual({ id, name: 'Equipe 1', inspection_id });
  });

  test('deve obter equipe por id', async () => {
    db.query.mockResolvedValue({
      rows: [{ inspection_id }]
    });

    const team = await Teams.getTeamById(id);
    expect(team).toEqual({ inspection_id });
  });

  // --- ERROS ---
  test('deve lançar erro ao falhar em obter equipes', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Teams.getTeams())
      .rejects.toThrow('Erro ao consultar equipes: DB error');
  });

  test('deve lançar erro ao falhar em criar equipe', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Teams.createTeam('Equipe 1', inspection_id))
      .rejects.toThrow('Erro ao criar equipe: DB error');
  });

  test('deve lançar erro ao falhar em atualizar equipe', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Teams.updateTeam(id, 'Equipe Atualizada', inspection_id))
      .rejects.toThrow('Erro ao atualizar equipe: DB error');
  });

  test('deve lançar erro ao falhar em deletar equipe', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Teams.deleteTeam(id))
      .rejects.toThrow('Erro ao deletar equipe: DB error');
  });

  test('deve lançar erro ao falhar em obter equipe por id', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Teams.getTeamById(id))
      .rejects.toThrow('Erro ao consultar equipe por ID: DB error');
  });

  test('deve lançar erro se equipe não for encontrada por id', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await expect(Teams.getTeamById('id-invalido'))
      .rejects.toThrow('Equipe não encontrada');
  });
});