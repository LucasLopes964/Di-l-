const imagesController = require('../../controllers/imagesController');
const imagesService = require('../../services/imagesService');

jest.mock('../../services/imagesService');

describe('imagesController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('getImages deve retornar todas as imagens', async () => {
    const mockImages = [{ id: '1', record_id: '10', image_data: Buffer.from('abc') }];
    imagesService.getImages.mockResolvedValueOnce(mockImages);

    await imagesController.getImages(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockImages);
  });

  test('createImage deve criar uma nova imagem', async () => {
    req.body = { record_id: '10' };
    req.file = { buffer: Buffer.from('abc') };
    const mockImage = { id: '1', record_id: '10', image_data: Buffer.from('abc') };
    imagesService.createImage.mockResolvedValueOnce(mockImage);

    await imagesController.createImage(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockImage);
  });

  test('updateImage deve atualizar uma imagem', async () => {
    req.params = { id: '1' };
    req.body = { record_id: '10' };
    req.file = { buffer: Buffer.from('abc') };
    const mockImage = { id: '1', record_id: '10', image_data: Buffer.from('abc') };
    imagesService.updateImage.mockResolvedValueOnce(mockImage);

    await imagesController.updateImage(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockImage);
  });

  test('deleteImage deve deletar uma imagem', async () => {
    req.params = { id: '1' };
    const mockImage = { id: '1', record_id: '10', image_data: Buffer.from('abc') };
    imagesService.deleteImage.mockResolvedValueOnce(mockImage);

    await imagesController.deleteImage(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockImage);
  });

  test('getImagesByRecordId deve retornar imagens por record_id', async () => {
    req.query = { record_id: '10' };
    const mockImages = [{ id: '1', record_id: '10', image_data: Buffer.from('abc') }];
    imagesService.getImagesByRecordId.mockResolvedValueOnce(mockImages);

    await imagesController.getImagesByRecordId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockImages);
  });

  test('deleteImagesByRecordId deve deletar imagens por record_id', async () => {
    req.params = { record_id: '10' };
    const mockImages = [{ id: '1', record_id: '10', image_data: Buffer.from('abc') }];
    imagesService.deleteImagesByRecordId.mockResolvedValueOnce(mockImages);

    await imagesController.deleteImagesByRecordId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockImages);
  });

  test('getImages deve retornar erro 500 em caso de exceção', async () => {
    imagesService.getImages.mockRejectedValueOnce(new Error('DB error'));
    await imagesController.getImages(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao consultar imagens: DB error' });
  });

  test('createImage deve retornar erro 400 em caso de exceção', async () => {
    req.body = { record_id: '10' };
    req.file = { buffer: Buffer.from('abc') };
    imagesService.createImage.mockRejectedValueOnce(new Error('Falha ao criar'));
    await imagesController.createImage(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao criar' });
  });

  test('updateImage deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    req.body = { record_id: '10' };
    req.file = { buffer: Buffer.from('abc') };
    imagesService.updateImage.mockRejectedValueOnce(new Error('Falha ao atualizar'));
    await imagesController.updateImage(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao atualizar' });
  });

  test('deleteImage deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    imagesService.deleteImage.mockRejectedValueOnce(new Error('Falha ao deletar'));
    await imagesController.deleteImage(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao deletar' });
  });

  test('getImagesByRecordId deve retornar erro 400 em caso de exceção', async () => {
    req.query = { record_id: '10' };
    imagesService.getImagesByRecordId.mockRejectedValueOnce(new Error('Falha ao buscar imagens'));
    await imagesController.getImagesByRecordId(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao buscar imagens' });
  });

  test('deleteImagesByRecordId deve retornar erro 400 em caso de exceção', async () => {
    req.params = { record_id: '10' };
    imagesService.deleteImagesByRecordId.mockRejectedValueOnce(new Error('Falha ao deletar imagens'));
    await imagesController.deleteImagesByRecordId(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao deletar imagens' });
  });
});