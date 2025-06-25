const tagCategoriesModel = require('../../models/tagCategoriesModel');
const tagCategoriesService = require('../../services/tagCategoriesService');
const id = '00000000-0000-0000-0000-000000000001';
const name = 'Categoria Teste';

jest.mock('../../models/tagCategoriesModel');

describe('TagCategories Service', () => {
  // --- SUCESSO ---
  test('deve obter todas as categorias de tags', async () => {
    tagCategoriesModel.getTagCategories.mockResolvedValue([{ id, name }]);
    const result = await tagCategoriesService.getTagCategories();
    expect(result).toEqual([{ id, name }]);
  });

  test('deve criar uma nova categoria de tag', async () => {
    tagCategoriesModel.createTagCategory.mockResolvedValue({ id, name });
    const result = await tagCategoriesService.createTagCategory({ name });
    expect(result).toEqual({ id, name });
  });

  test('deve atualizar uma categoria de tag', async () => {
    tagCategoriesModel.updateTagCategory.mockResolvedValue({ id, name: 'Nova Categoria' });
    const result = await tagCategoriesService.updateTagCategory(id, { name: 'Nova Categoria' });
    expect(result).toEqual({ id, name: 'Nova Categoria' });
  });

  test('deve deletar uma categoria de tag', async () => {
    tagCategoriesModel.deleteTagCategory.mockResolvedValue({ id, name });
    const result = await tagCategoriesService.deleteTagCategory(id);
    expect(result).toEqual({ id, name });
  });

  // --- VALIDAÇÃO ---
  test('deve lançar erro se faltar nome ao criar categoria', async () => {
    await expect(tagCategoriesService.createTagCategory({ name: '' }))
      .rejects.toThrow('O campo nome é obrigatório.');
  });

  test('deve lançar erro se faltar id ou nome ao atualizar categoria', async () => {
    await expect(tagCategoriesService.updateTagCategory('', { name: 'Nova Categoria' }))
      .rejects.toThrow('ID e nome são obrigatórios.');
    await expect(tagCategoriesService.updateTagCategory(id, { name: '' }))
      .rejects.toThrow('ID e nome são obrigatórios.');
  });

  test('deve lançar erro se faltar id ao deletar categoria', async () => {
    await expect(tagCategoriesService.deleteTagCategory(''))
      .rejects.toThrow('ID da categoria de tag é obrigatório.');
  });

  test('deve lançar erro se categoria não for encontrada ao deletar', async () => {
    tagCategoriesModel.deleteTagCategory.mockResolvedValue(undefined);
    await expect(tagCategoriesService.deleteTagCategory(id))
      .rejects.toThrow('Categoria de tag não encontrada.');
  });
});