const recordsModel = require('../../models/recordsModel');
const recordsService = require('../../services/recordsService');
const id = '00000000-0000-0000-0000-000000000001';
const environment_id = '00000000-0000-0000-0000-000000000002';
const user_id = '00000000-0000-0000-0000-000000000003';

jest.mock('../../models/recordsModel');

describe('Records Service', () => {
  // --- SUCESSO ---
  test('deve obter todos os registros', async () => {
    recordsModel.getRecords.mockResolvedValue([{ id, name: 'Registro', description: 'desc', environment_id, user_id }]);
    const result = await recordsService.getRecords();
    expect(result).toEqual([{ id, name: 'Registro', description: 'desc', environment_id, user_id }]);
  });

  test('deve criar um novo registro', async () => {
    recordsModel.createRecord.mockResolvedValue({ id, name: 'Registro', description: 'desc', environment_id, user_id });
    const data = { name: 'Registro', description: 'desc', environment_id, user_id };
    const result = await recordsService.createRecord(data);
    expect(result).toEqual({ id, name: 'Registro', description: 'desc', environment_id, user_id });
  });

  test('deve atualizar um registro', async () => {
    recordsModel.updateRecord.mockResolvedValue({ id, name: 'Registro Atualizado', description: 'desc2', environment_id, user_id });
    const data = { name: 'Registro Atualizado', description: 'desc2', environment_id, user_id };
    const result = await recordsService.updateRecord(id, data);
    expect(result).toEqual({ id, name: 'Registro Atualizado', description: 'desc2', environment_id, user_id });
  });

  test('deve deletar um registro', async () => {
    recordsModel.deleteRecord.mockResolvedValue({ id });
    const result = await recordsService.deleteRecord(id);
    expect(result).toEqual({ id });
  });

  test('deve obter registros por environment_id', async () => {
    recordsModel.getRecordsByEnvironmentId.mockResolvedValue([{ id, name: 'Registro', description: 'desc', environment_id, user_id }]);
    const result = await recordsService.getRecordsByEnvironmentId(environment_id);
    expect(result).toEqual([{ id, name: 'Registro', description: 'desc', environment_id, user_id }]);
  });

  test('deve obter registro por id', async () => {
    recordsModel.getRecordsById.mockResolvedValue({ id, name: 'Registro', description: 'desc', environment_id, user_id });
    const result = await recordsService.getRecordById(id);
    expect(result).toEqual({ id, name: 'Registro', description: 'desc', environment_id, user_id });
  });

  // --- VALIDAÇÃO ---
  test('deve lançar erro se faltar campo ao criar registro', async () => {
    await expect(recordsService.createRecord({ name: '', description: '', environment_id: '', user_id: '' }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar campo ao atualizar registro', async () => {
    await expect(recordsService.updateRecord('', { name: '', description: '', environment_id: '', user_id: '' }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar id ao deletar registro', async () => {
    await expect(recordsService.deleteRecord('')).rejects.toThrow('ID do registro é obrigatório.');
  });

  test('deve lançar erro se registro não for encontrado ao deletar', async () => {
    recordsModel.deleteRecord.mockResolvedValue(undefined);
    await expect(recordsService.deleteRecord(id)).rejects.toThrow('Registro não encontrado.');
  });

  test('deve lançar erro se faltar environment_id ao buscar registros', async () => {
    await expect(recordsService.getRecordsByEnvironmentId('')).rejects.toThrow('ID do ambiente é obrigatório.');
  });

  test('deve lançar erro se faltar id ao buscar registro', async () => {
    await expect(recordsService.getRecordById('')).rejects.toThrow('ID do registro é obrigatório.');
  });
});