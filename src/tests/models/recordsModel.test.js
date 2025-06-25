const db = require('../../config/db.js');
const Records = require('../../models/recordsModel');
const id = '00000000-0000-0000-0000-000000000001';
const environment_id = '00000000-0000-0000-0000-000000000002';
const user_id = '00000000-0000-0000-0000-000000000003';

jest.mock('../../config/db.js');

describe('Records Model', () => {
  // --- SUCESSO ---
  test('deve obter todos os registros', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: id, name: 'Registro 1', description: 'desc', environment_id, user_id }]
    });

    const records = await Records.getRecords();
    expect(records).toEqual([{ id: id, name: 'Registro 1', description: 'desc', environment_id, user_id }]);
  });

  test('deve criar um novo registro', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: id, name: 'Registro 1', description: 'desc', environment_id, user_id }]
    });

    const newRecord = await Records.createRecord('Registro 1', 'desc', environment_id, user_id);
    expect(newRecord).toEqual({ id: id, name: 'Registro 1', description: 'desc', environment_id, user_id });
  });

  test('deve atualizar um registro', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: id, name: 'Registro Atualizado', description: 'desc2', environment_id, user_id }]
    });

    const updated = await Records.updateRecord(id, 'Registro Atualizado', 'desc2', environment_id, user_id);
    expect(updated).toEqual({ id: id, name: 'Registro Atualizado', description: 'desc2', environment_id, user_id });
  });

  test('deve deletar um registro', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: id }]
    });

    const deleted = await Records.deleteRecord(id);
    expect(deleted).toEqual({ id: id });
  });

  test('deve obter registros por environment_id', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: id, name: 'Registro 1', description: 'desc', environment_id, user_id }]
    });

    const records = await Records.getRecordsByEnvironmentId(environment_id);
    expect(records).toEqual([{ id: id, name: 'Registro 1', description: 'desc', environment_id, user_id }]);
  });

  test('deve obter registro por id', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: id, name: 'Registro 1', description: 'desc', environment_id, user_id }]
    });

    const record = await Records.getRecordsById(id);
    expect(record).toEqual({ id: id, name: 'Registro 1', description: 'desc', environment_id, user_id });
  });

  // --- ERROS ---
  test('deve lançar erro ao falhar em obter registros', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Records.getRecords()).rejects.toThrow('Erro ao consultar registros: DB error');
  });

  test('deve lançar erro ao falhar em criar registro', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Records.createRecord('Registro 1', 'desc', environment_id, user_id))
      .rejects.toThrow('Erro ao criar registro: DB error');
  });

  test('deve lançar erro ao falhar em atualizar registro', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Records.updateRecord(id, 'Registro Atualizado', 'desc2', environment_id, user_id))
      .rejects.toThrow('Erro ao atualizar registro: DB error');
  });

  test('deve lançar erro ao falhar em deletar registro', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Records.deleteRecord(id))
      .rejects.toThrow('Erro ao deletar registro: DB error');
  });

  test('deve lançar erro ao falhar em obter registros por environment_id', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Records.getRecordsByEnvironmentId(environment_id))
      .rejects.toThrow('Erro ao consultar registros por ID de ambiente: DB error');
  });

  test('deve lançar erro ao falhar em obter registro por id', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Records.getRecordsById(id))
      .rejects.toThrow('Erro ao consultar registro por ID: DB error');
  });

  test('deve lançar erro se registro não for encontrado por id', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await expect(Records.getRecordsById('id-invalido'))
      .rejects.toThrow('Registro não encontrado');
  });
});