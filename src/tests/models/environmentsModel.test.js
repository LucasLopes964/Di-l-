const db = require('../../config/db.js');
const Environments = require('../../models/environmentsModel');
const id = '00000000-0000-0000-0000-000000000001';
const inspection_id = '00000000-0000-0000-0000-000000000002';

jest.mock('../../config/db.js');

describe('Environments Model', () => {

  test('deve criar um novo ambiente', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: id, name: 'Sala 101', inspection_id: inspection_id }]
    });
    const newEnv = await Environments.createEnvironment('Sala 101', inspection_id);
    expect(newEnv).toEqual({ id: id, name: 'Sala 101', inspection_id: inspection_id });
  });

  test('deve atualizar um ambiente', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: id, name: 'Sala 102', inspection_id: inspection_id }]
    });
    const updatedEnv = await Environments.updateEnvironment(id, 'Sala 102', inspection_id);
    expect(updatedEnv).toEqual({ id: id, name: 'Sala 102', inspection_id: inspection_id });
  });

  test('deve deletar um ambiente', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: id }]
    });
    const deletedEnv = await Environments.deleteEnvironment(id);
    expect(deletedEnv).toEqual({ id: id });
  });

  test('deve obter ambientes por inspection_id', async () => {
    db.query.mockResolvedValue({ rows: [{ id: id, name: 'Sala 101', inspection_id: inspection_id }] });
    const envs = await Environments.getEnvironmentsById(inspection_id);
    expect(envs).toEqual([{ id: id, name: 'Sala 101', inspection_id: inspection_id }]);
  });

  test('deve obter inspection_id por environment_id', async () => {
    db.query.mockResolvedValue({
      rows: [{ inspection_id: inspection_id }]
    });
    const inspection = await Environments.getInspectionByEnvironmentId(id);
    expect(inspection).toEqual({ inspection_id: inspection_id });
  });


  test('deve lançar erro ao falhar em criar ambiente', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Environments.createEnvironment('Sala 101', inspection_id))
      .rejects.toThrow('Erro ao criar ambiente: DB error');
  });

  test('deve lançar erro ao falhar em atualizar ambiente', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Environments.updateEnvironment(id, 'Sala 102', inspection_id))
      .rejects.toThrow('Erro ao atualizar ambiente: DB error');
  });

  test('deve lançar erro ao falhar em deletar ambiente', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Environments.deleteEnvironment(id))
      .rejects.toThrow('Erro ao deletar ambiente: DB error');
  });

  test('deve retornar array vazio ao falhar em obter ambientes por inspection_id', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    const envs = await Environments.getEnvironmentsById(inspection_id);
    expect(envs).toEqual([]);
  });

  test('deve lançar erro ao falhar em obter inspection_id por environment_id', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Environments.getInspectionByEnvironmentId(id))
      .rejects.toThrow('Erro ao consultar inspeção por ID de ambiente: DB error');
  });
});