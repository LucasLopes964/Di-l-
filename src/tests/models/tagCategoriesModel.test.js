const db = require('../../config/db.js');
const TagCategories = require('../../models/tagCategoriesModel');
const id = '00000000-0000-0000-0000-000000000001';
const name = 'Categoria Teste';

jest.mock('../../config/db.js');

describe('TagCategories Model', () => {
  // --- SUCESSO ---
  test('deve obter todas as categorias de tags', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name }]
    });

    const categories = await TagCategories.getTagCategories();
    expect(categories).toEqual([{ id, name }]);
  });

  test('deve criar uma nova categoria de tag', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name }]
    });

    const newCategory = await TagCategories.createTagCategory(name);
    expect(newCategory).toEqual({ id, name });
  });

  test('deve atualizar uma categoria de tag', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name: 'Nova Categoria' }]
    });

    const updated = await TagCategories.updateTagCategory(id, 'Nova Categoria');
    expect(updated).toEqual({ id, name: 'Nova Categoria' });
  });

  test('deve deletar uma categoria de tag', async () => {
    db.query.mockResolvedValue({
      rows: [{ id, name }]
    });

    const deleted = await TagCategories.deleteTagCategory(id);
    expect(deleted).toEqual({ id, name });
  });

  // --- ERROS ---
  test('deve lançar erro ao falhar em obter categorias de tags', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(TagCategories.getTagCategories())
      .rejects.toThrow('Erro ao consultar categorias de tags: DB error');
  });

  test('deve lançar erro ao falhar em criar categoria de tag', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(TagCategories.createTagCategory(name))
      .rejects.toThrow('Erro ao criar categoria de tag: DB error');
  });

  test('deve lançar erro ao falhar em atualizar categoria de tag', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(TagCategories.updateTagCategory(id, name))
      .rejects.toThrow('Erro ao atualizar categoria de tag: DB error');
  });

  test('deve lançar erro ao falhar em deletar categoria de tag', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(TagCategories.deleteTagCategory(id))
      .rejects.toThrow('Erro ao deletar categoria de tag: DB error');
  });
});