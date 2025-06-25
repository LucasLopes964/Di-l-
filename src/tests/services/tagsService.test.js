const tagsModel = require('../../models/tagsModel');
const tagsService = require('../../services/tagsService');
const id = '00000000-0000-0000-0000-000000000001';
const category_id = '00000000-0000-0000-0000-000000000002';

jest.mock('../../models/tagsModel');

describe('Tags Service', () => {
  // --- SUCESSO ---
  test('deve obter tags por categoria', async () => {
    tagsModel.getTags.mockResolvedValue([{ id, name: 'Tag 1', category_id }]);
    const result = await tagsService.getTags(category_id);
    expect(result).toEqual([{ id, name: 'Tag 1', category_id }]);
  });

  test('deve criar uma nova tag', async () => {
    tagsModel.createTag.mockResolvedValue({ id, name: 'Tag 1', category_id });
    const result = await tagsService.createTag({ name: 'Tag 1', category_id });
    expect(result).toEqual({ id, name: 'Tag 1', category_id });
  });

  test('deve atualizar uma tag', async () => {
    tagsModel.updateTag.mockResolvedValue({ id, name: 'Tag Atualizada', category_id });
    const result = await tagsService.updateTag(id, { name: 'Tag Atualizada', category_id });
    expect(result).toEqual({ id, name: 'Tag Atualizada', category_id });
  });

  test('deve deletar uma tag', async () => {
    tagsModel.deleteTag.mockResolvedValue({ id, name: 'Tag 1', category_id });
    const result = await tagsService.deleteTag(id);
    expect(result).toEqual({ id, name: 'Tag 1', category_id });
  });

  test('deve obter tag por id', async () => {
    tagsModel.getTagsById.mockResolvedValue({ id, name: 'Tag 1', category_id });
    const result = await tagsService.getTagsById(id);
    expect(result).toEqual({ id, name: 'Tag 1', category_id });
  });

  test('deve obter todas as tags', async () => {
    tagsModel.getAllTags.mockResolvedValue([{ id, name: 'Tag 1', category_id }]);
    const result = await tagsService.getAllTags();
    expect(result).toEqual([{ id, name: 'Tag 1', category_id }]);
  });

  // --- VALIDAÇÃO ---
  test('deve lançar erro se faltar campo ao criar tag', async () => {
    await expect(tagsService.createTag({ name: '', category_id: '' }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar campo ao atualizar tag', async () => {
    await expect(tagsService.updateTag('', { name: '', category_id: '' }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar id ao deletar tag', async () => {
    await expect(tagsService.deleteTag('')).rejects.toThrow('ID da tag é obrigatório.');
  });

  test('deve lançar erro se tag não for encontrada ao deletar', async () => {
    tagsModel.deleteTag.mockResolvedValue(undefined);
    await expect(tagsService.deleteTag(id)).rejects.toThrow('Tag não encontrada.');
  });

  test('deve lançar erro se faltar id ao buscar tag', async () => {
    await expect(tagsService.getTagsById('')).rejects.toThrow('ID da tag é obrigatório.');
  });

  test('deve lançar erro se tag não for encontrada ao buscar por id', async () => {
    tagsModel.getTagsById.mockResolvedValue(undefined);
    await expect(tagsService.getTagsById(id)).rejects.toThrow('Tag não encontrada.');
  });
});