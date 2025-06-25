const db = require('../../config/db.js');
const Images = require('../../models/imagesModel');

jest.mock('../../config/db.js');

describe('Images Model', () => {

  test('deve obter todas as imagens', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: 1, record_id: 2, image_data: Buffer.from('abc') }]
    });

    const images = await Images.getImages();
    expect(images).toEqual([{ id: 1, record_id: 2, image_data: Buffer.from('abc') }]);
  });

  test('deve criar uma nova imagem', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: 1, record_id: 2, image_data: Buffer.from('abc') }]
    });

    const newImage = await Images.createImage(2, Buffer.from('abc'));
    expect(newImage).toEqual({ id: 1, record_id: 2, image_data: Buffer.from('abc') });
  });

  test('deve atualizar uma imagem', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: 1, record_id: 2, image_data: Buffer.from('def') }]
    });

    const updatedImage = await Images.updateImage(1, 2, Buffer.from('def'));
    expect(updatedImage).toEqual({ id: 1, record_id: 2, image_data: Buffer.from('def') });
  });

  test('deve deletar uma imagem', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: 1 }]
    });

    const deletedImage = await Images.deleteImage(1);
    expect(deletedImage).toEqual({ id: 1 });
  });

  test('deve obter imagens por record_id', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: 1, record_id: 2, image_data: Buffer.from('abc') }]
    });

    const images = await Images.getImagesByRecordId(2);
    expect(images).toEqual([{ id: 1, record_id: 2, image_data: Buffer.from('abc') }]);
  });

  test('deve deletar imagens por record_id', async () => {
    db.query.mockResolvedValue({
      rows: [{ record_id: 2 }]
    });

    const deletedImages = await Images.deleteImagesByRecordId(2);
    expect(deletedImages).toEqual([{ record_id: 2 }]);
  });

  // --- ERROS ---
  test('deve lançar erro ao falhar em obter todas as imagens', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Images.getImages()).rejects.toThrow('Erro ao consultar imagens: DB error');
  });

  test('deve lançar erro ao falhar em criar imagem', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Images.createImage(2, Buffer.from('abc')))
      .rejects.toThrow('DB error');
  });

  test('deve lançar erro ao falhar em atualizar imagem', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Images.updateImage(1, 2, Buffer.from('def')))
      .rejects.toThrow('Erro ao atualizar imagem: DB error');
  });

  test('deve lançar erro ao falhar em deletar imagem', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Images.deleteImage(1))
      .rejects.toThrow('Erro ao deletar imagem: DB error');
  });

  test('deve lançar erro ao falhar em obter imagens por record_id', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Images.getImagesByRecordId(2))
      .rejects.toThrow('Erro ao consultar imagens por ID de registro: DB error');
  });

  test('deve lançar erro ao falhar em deletar imagens por record_id', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Images.deleteImagesByRecordId(2))
      .rejects.toThrow('Erro ao deletar imagens por ID de registro: DB error');
  });
});