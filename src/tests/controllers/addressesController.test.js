const addressesController = require('../../controllers/addressesController');
const addressesService = require('../../services/addressesService');

jest.mock('../../services/addressesService');

describe('addressesController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('getAddresses deve retornar todos os endereços', async () => {
    const mockAddresses = [
      { id: '1', address: 'Rua X', building_name: 'Edifício A', latitude: -23.5505, longitude: -46.6333 },
      { id: '2', address: 'Rua Y', building_name: 'Edifício B', latitude: -23.5506, longitude: -46.6334 },
    ];
    addressesService.getAddresses.mockResolvedValueOnce(mockAddresses);

    await addressesController.getAddresses(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAddresses);
  });

  test('createAddress deve criar um novo endereço', async () => {
    const mockCreate = {
      address: 'Rua X',
      building_name: 'Edifício A',
      latitude: -23.5505,
      longitude: -46.6333,
    };
    const mockAddress = { id: '1', address: 'Rua X', building_name: 'Edifício A', latitude: -23.5505, longitude: -46.6333 };

    addressesService.createAddress.mockResolvedValueOnce(mockAddress);

    await addressesController.createAddress(req, res);
    expect(res.status).toHaveBeenCalledWith(201); // Corrigido para 201
    expect(res.json).toHaveBeenCalledWith(mockAddress);
  });

  test('updateAddress deve atualizar o endereço', async () => {
    req.params = { id: '1' };
    req.body = { address: 'Rua X', building_name: 'Edifício A', latitude: -23.5505, longitude: -46.6333 };

    const mockAddress = [{ id: '1', address: 'Rua X', building_name: 'Edifício A', latitude: -23.5505, longitude: -46.6333 }];

    addressesService.updateAddress.mockResolvedValueOnce(mockAddress);

    await addressesController.updateAddress(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAddress);
  });

  test('deleteAddress deve deletar o endereço', async () => {
    req.params = { id: '1' };
    const mockAddress = { id: '1', address: 'Rua X', building_name: 'Edifício A', latitude: -23.5505, longitude: -46.6333 };

    addressesService.deleteAddress.mockResolvedValueOnce(mockAddress); // Corrigido

    await addressesController.deleteAddress(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAddress);
  });

  test('getAddressById deve encontrar um endereço por id', async () => {
    req.query = { id: '1' };
    const mockAddress = { id: '1', address: 'Rua X', building_name: 'Edifício A', latitude: -23.5505, longitude: -46.6333 };

    addressesService.getAddressById.mockResolvedValueOnce(mockAddress); // Corrigido

    await addressesController.getAddressById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAddress);
  });

  test('getAddresses deve retornar erro 500 em caso de exceção', async () => {
    addressesService.getAddresses.mockRejectedValueOnce(new Error('DB error'));
    await addressesController.getAddresses(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao consultar endereços: DB error' });
  });

  test('createAddress deve retornar erro 400 em caso de exceção', async () => {
    addressesService.createAddress.mockRejectedValueOnce(new Error('Falha ao criar'));
    req.body = { address: 'Rua X' };
    await addressesController.createAddress(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao criar' });
  });

  test('updateAddress deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    req.body = { address: 'Rua X' };
    addressesService.updateAddress.mockRejectedValueOnce(new Error('Falha ao atualizar'));
    await addressesController.updateAddress(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao atualizar' });
  });

  test('deleteAddress deve retornar erro 400 em caso de exceção', async () => {
    req.params = { id: '1' };
    addressesService.deleteAddress.mockRejectedValueOnce(new Error('Falha ao deletar'));
    await addressesController.deleteAddress(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao deletar' });
  });

  test('getAddressById deve retornar erro 400 em caso de exceção', async () => {
    req.query = { id: '1' };
    addressesService.getAddressById.mockRejectedValueOnce(new Error('Falha ao buscar'));
    await addressesController.getAddressById(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao buscar' });
  });
});

