const db = require('../../config/db.js');
const RecordTags = require('../../models/recordTagsModel');
const id = '00000000-0000-0000-0000-000000000001';
const record_id = '00000000-0000-0000-0000-000000000002';
const tag_id = '00000000-0000-0000-0000-000000000003';

jest.mock('../../config/db.js');

describe('RecordTags Model', () => {
  // --- SUCESSO ---
  test('deve obter todos os registros de tags', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, record_id, tag_id }]
    });

    const tags = await RecordTags.getRecordTags();
    expect(tags).toEqual([{ id, record_id, tag_id }]);
  });

  test('deve criar um novo registro de tag', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, record_id, tag_id }]
    });

    const newTag = await RecordTags.createRecordTag(record_id, tag_id);
    expect(newTag).toEqual({ id, record_id, tag_id });
  });

  test('deve atualizar um registro de tag', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, record_id, tag_id }]
    });

    const updated = await RecordTags.updateRecordTag(id, record_id, tag_id);
    expect(updated).toEqual({ id, record_id, tag_id });
  });

  test('deve deletar um registro de tag', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, record_id, tag_id }]
    });

    const deleted = await RecordTags.deleteRecordTag(id);
    expect(deleted).toEqual({ id, record_id, tag_id });
  });

  test('deve obter registros de tags por record_id', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, record_id, tag_id }]
    });

    const tags = await RecordTags.getRecordTagsByRecordId(record_id);
    expect(tags).toEqual([{ id, record_id, tag_id }]);
  });

  test('deve deletar registros de tags por record_id', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, record_id, tag_id }]
    });

    const deleted = await RecordTags.deleteRecordTagsByRecordId(record_id);
    expect(deleted).toEqual([{ id, record_id, tag_id }]);
  });

  test('deve obter registros de tags por tag_id', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, record_id, tag_id }]
    });

    const tags = await RecordTags.getRecordTagsByTagId(tag_id);
    expect(tags).toEqual([{ id, record_id, tag_id }]);
  });

  // --- ERROS ---
  test('deve lançar erro ao falhar em obter registros de tags', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(RecordTags.getRecordTags())
      .rejects.toThrow('Erro ao consultar registros de tags: DB error');
  });

  test('deve lançar erro ao falhar em criar registro de tag', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(RecordTags.createRecordTag(record_id, tag_id))
      .rejects.toThrow('Erro ao criar registro de tag: DB error');
  });

  test('deve lançar erro ao falhar em atualizar registro de tag', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(RecordTags.updateRecordTag(id, record_id, tag_id))
      .rejects.toThrow('Erro ao atualizar registro de tag: DB error');
  });

  test('deve lançar erro ao falhar em deletar registro de tag', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(RecordTags.deleteRecordTag(id))
      .rejects.toThrow('Erro ao deletar registro de tag: DB error');
  });

  test('deve lançar erro ao falhar em obter registros de tags por record_id', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(RecordTags.getRecordTagsByRecordId(record_id))
      .rejects.toThrow('Erro ao consultar registros de tags por ID de registro: DB error');
  });

  test('deve lançar erro ao falhar em deletar registros de tags por record_id', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(RecordTags.deleteRecordTagsByRecordId(record_id))
      .rejects.toThrow('Erro ao deletar registros de tags por ID de registro: DB error');
  });

  test('deve lançar erro ao falhar em obter registros de tags por tag_id', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(RecordTags.getRecordTagsByTagId(tag_id))
      .rejects.toThrow('Erro ao consultar registros de tags por ID de tag: DB error');
  });
});