const db = require('../../config/db.js');
const Tags = require('../../models/tagsModel');
const id = '00000000-0000-0000-0000-000000000001';
const category_id = '00000000-0000-0000-0000-000000000002';

jest.mock('../../config/db.js');

describe('Tags Model', () => {
  // --- SUCESSO ---
  test('deve obter tags por categoria', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name: 'Tag 1', category_id }]
    });

    const tags = await Tags.getTags(category_id);
    expect(tags).toEqual([{ id, name: 'Tag 1', category_id }]);
  });

  test('deve criar uma nova tag', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name: 'Tag 1', category_id }]
    });

    const newTag = await Tags.createTag('Tag 1', category_id);
    expect(newTag).toEqual({ id, name: 'Tag 1', category_id });
  });

  test('deve atualizar uma tag', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name: 'Tag Atualizada', category_id }]
    });

    const updated = await Tags.updateTag(id, 'Tag Atualizada', category_id);
    expect(updated).toEqual({ id, name: 'Tag Atualizada', category_id });
  });

  test('deve deletar uma tag', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name: 'Tag 1', category_id }]
    });

    const deleted = await Tags.deleteTag(id);
    expect(deleted).toEqual({ id, name: 'Tag 1', category_id });
  });

  test('deve obter tag por id', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name: 'Tag 1', category_id }]
    });

    const tag = await Tags.getTagsById(id);
    expect(tag).toEqual({ id, name: 'Tag 1', category_id });
  });

  test('deve obter todas as tags', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name: 'Tag 1', category_id }]
    });

    const tags = await Tags.getAllTags();
    expect(tags).toEqual([{ id, name: 'Tag 1', category_id }]);
  });

  // --- ERROS ---
  test('deve lançar erro ao falhar em obter tags por categoria', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Tags.getTags(category_id))
      .rejects.toThrow('Erro ao consultar tags: DB error');
  });

  test('deve lançar erro ao falhar em criar tag', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Tags.createTag('Tag 1', category_id))
      .rejects.toThrow('Erro ao criar tag: DB error');
  });

  test('deve lançar erro ao falhar em atualizar tag', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Tags.updateTag(id, 'Tag Atualizada', category_id))
      .rejects.toThrow('Erro ao atualizar tag: DB error');
  });

  test('deve lançar erro ao falhar em deletar tag', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Tags.deleteTag(id))
      .rejects.toThrow('Erro ao deletar tag: DB error');
  });

  test('deve lançar erro ao falhar em obter tag por id', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Tags.getTagsById(id))
      .rejects.toThrow('Erro ao consultar tag por ID: DB error');
  });

  test('deve lançar erro ao falhar em obter todas as tags', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Tags.getAllTags())
      .rejects.toThrow('Erro ao consultar todas as tags: DB error');
  });
});