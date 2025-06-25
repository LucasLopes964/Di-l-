const recordTagsModel = require('../../models/recordTagsModel');
const recordTagsService = require('../../services/recordTagsService');
const id = '00000000-0000-0000-0000-000000000001';
const record_id = '00000000-0000-0000-0000-000000000002';
const tag_id = '00000000-0000-0000-0000-000000000003';

jest.mock('../../models/recordTagsModel');

describe('RecordTags Service', () => {
  // --- SUCESSO ---
  test('deve obter todos os registros de tags', async () => {
    recordTagsModel.getRecordTags.mockResolvedValue([{ id, record_id, tag_id }]);
    const result = await recordTagsService.getRecordTags();
    expect(result).toEqual([{ id, record_id, tag_id }]);
  });

  test('deve criar um novo registro de tag', async () => {
    recordTagsModel.createRecordTag.mockResolvedValue({ id, record_id, tag_id });
    const data = { record_id, tag_id };
    const result = await recordTagsService.createRecordTag(data);
    expect(result).toEqual({ id, record_id, tag_id });
  });

  test('deve atualizar um registro de tag', async () => {
    recordTagsModel.updateRecordTag.mockResolvedValue({ id, record_id, tag_id });
    const data = { record_id, tag_id };
    const result = await recordTagsService.updateRecordTag(id, data);
    expect(result).toEqual({ id, record_id, tag_id });
  });

  test('deve deletar um registro de tag', async () => {
    recordTagsModel.deleteRecordTag.mockResolvedValue({ id, record_id, tag_id });
    const result = await recordTagsService.deleteRecordTag(id);
    expect(result).toEqual({ id, record_id, tag_id });
  });

  test('deve obter registros de tags por record_id', async () => {
    recordTagsModel.getRecordTagsByRecordId.mockResolvedValue([{ id, record_id, tag_id }]);
    const result = await recordTagsService.getRecordTagsByRecordId(record_id);
    expect(result).toEqual([{ id, record_id, tag_id }]);
  });

  test('deve deletar registros de tags por record_id', async () => {
    recordTagsModel.deleteRecordTagsByRecordId.mockResolvedValue([{ id, record_id, tag_id }]);
    const result = await recordTagsService.deleteRecordTagsByRecordId(record_id);
    expect(result).toEqual([{ id, record_id, tag_id }]);
  });

  test('deve obter registros de tags por tag_id', async () => {
    recordTagsModel.getRecordTagsByTagId.mockResolvedValue([{ id, record_id, tag_id }]);
    const result = await recordTagsService.getRecordTagsByTagId(tag_id);
    expect(result).toEqual([{ id, record_id, tag_id }]);
  });

  // --- VALIDAÇÃO ---
  test('deve lançar erro se faltar campo ao criar registro de tag', async () => {
    await expect(recordTagsService.createRecordTag({ record_id: '', tag_id: '' }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar campo ao atualizar registro de tag', async () => {
    await expect(recordTagsService.updateRecordTag('', { record_id: '', tag_id: '' }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar id ao deletar registro de tag', async () => {
    await expect(recordTagsService.deleteRecordTag(''))
      .rejects.toThrow('ID do registro de tag é obrigatório.');
  });

  test('deve lançar erro se registro de tag não for encontrado ao deletar', async () => {
    recordTagsModel.deleteRecordTag.mockResolvedValue(undefined);
    await expect(recordTagsService.deleteRecordTag(id))
      .rejects.toThrow('Registro de tag não encontrado.');
  });

  test('deve lançar erro se faltar record_id ao buscar registros de tags', async () => {
    await expect(recordTagsService.getRecordTagsByRecordId(''))
      .rejects.toThrow('ID do registro é obrigatório.');
  });

  test('deve lançar erro se faltar record_id ao deletar registros de tags', async () => {
    await expect(recordTagsService.deleteRecordTagsByRecordId(''))
      .rejects.toThrow('ID do registro é obrigatório.');
  });

  test('deve lançar erro se registros de tags não forem encontrados ao deletar por record_id', async () => {
    recordTagsModel.deleteRecordTagsByRecordId.mockResolvedValue(undefined);
    await expect(recordTagsService.deleteRecordTagsByRecordId(record_id))
      .rejects.toThrow('Registro de tags não encontrado.');
  });

  test('deve lançar erro se faltar tag_id ao buscar registros de tags', async () => {
    await expect(recordTagsService.getRecordTagsByTagId(''))
      .rejects.toThrow('ID da tag é obrigatório.');
  });
});