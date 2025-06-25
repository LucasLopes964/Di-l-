const imagesModel = require('../../models/imagesModel');
const imagesService = require('../../services/imagesService');
const id = '00000000-0000-0000-0000-000000000001';
const record_id = '00000000-0000-0000-0000-000000000002';

jest.mock('../../models/imagesModel');

describe('Images Service', () => {

  test('deve obter todas as imagens', async () => {
    imagesModel.getImages.mockResolvedValue([{ id, record_id, image_data: Buffer.from('abc') }]);
    const result = await imagesService.getImages();
    expect(result).toEqual([{ id, record_id, image_data: Buffer.from('abc') }]);
  });

  test('deve criar uma nova imagem', async () => {
    const file = { buffer: Buffer.from('abc') };
    imagesModel.createImage.mockResolvedValue({ id, record_id, image_data: Buffer.from('abc') });
    const result = await imagesService.createImage({ record_id, file });
    expect(result).toEqual({ id, record_id, image_data: Buffer.from('abc') });
  });

  test('deve atualizar uma imagem', async () => {
    const file = { buffer: Buffer.from('def') };
    imagesModel.updateImage.mockResolvedValue({ id, record_id, image_data: Buffer.from('def') });
    const result = await imagesService.updateImage(id, { record_id, file });
    expect(result).toEqual({ id, record_id, image_data: Buffer.from('def') });
  });

  test('deve deletar uma imagem', async () => {
    imagesModel.deleteImage.mockResolvedValue({ id, record_id, image_data: Buffer.from('abc') });
    const result = await imagesService.deleteImage(id);
    expect(result).toEqual({ id, record_id, image_data: Buffer.from('abc') });
  });

  test('deve obter imagens por record_id', async () => {
    imagesModel.getImagesByRecordId.mockResolvedValue([{ id, record_id, image_data: Buffer.from('abc') }]);
    const result = await imagesService.getImagesByRecordId(record_id);
    expect(result).toEqual([{ id, record_id, image_data: Buffer.from('abc') }]);
  });

  test('deve deletar imagens por record_id', async () => {
    imagesModel.deleteImagesByRecordId.mockResolvedValue([{ id, record_id, image_data: Buffer.from('abc') }]);
    const result = await imagesService.deleteImagesByRecordId(record_id);
    expect(result).toEqual([{ id, record_id, image_data: Buffer.from('abc') }]);
  });


  test('deve lançar erro se faltar campo ao criar imagem', async () => {
    await expect(imagesService.createImage({ record_id: '', file: null }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar campo ao atualizar imagem', async () => {
    await expect(imagesService.updateImage('', { record_id: '', file: null }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar id ao deletar imagem', async () => {
    await expect(imagesService.deleteImage(''))
      .rejects.toThrow('ID da imagem é obrigatório.');
  });

  test('deve lançar erro se imagem não for encontrada ao deletar', async () => {
    imagesModel.deleteImage.mockResolvedValue(undefined);
    await expect(imagesService.deleteImage(id))
      .rejects.toThrow('Imagem não encontrada.');
  });

  test('deve lançar erro se faltar record_id ao buscar imagens', async () => {
    await expect(imagesService.getImagesByRecordId(''))
      .rejects.toThrow('ID do registro é obrigatório.');
  });

  test('deve lançar erro se faltar record_id ao deletar imagens', async () => {
    await expect(imagesService.deleteImagesByRecordId(''))
      .rejects.toThrow('ID do registro é obrigatório.');
  });

  test('deve lançar erro se imagens não forem encontradas ao deletar por record_id', async () => {
    imagesModel.deleteImagesByRecordId.mockResolvedValue(undefined);
    await expect(imagesService.deleteImagesByRecordId(record_id))
      .rejects.toThrow('Imagens não encontradas.');
  });
});