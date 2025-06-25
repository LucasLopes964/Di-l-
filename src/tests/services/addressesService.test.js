const addressesModel = require('../../models/addressesModel');
const addressesService = require('../../services/addressesService');
const id = '00000000-0000-0000-0000-000000000001';

jest.mock('../../models/addressesModel');

describe('Addresses Service', () => {
  // --- SUCESSO ---
  test('deve obter todos os endereços', async () => {
    addressesModel.getAddresses.mockResolvedValue([{ id, address: 'Rua X' }]);
    const result = await addressesService.getAddresses();
    expect(result).toEqual([{ id, address: 'Rua X' }]);
  });

  test('deve criar um novo endereço', async () => {
    const data = { address: 'Rua X', building_name: 'Prédio', latitude: 1, longitude: 2 };
    addressesModel.createAddress.mockResolvedValue({ ...data });
    const result = await addressesService.createAddress(data);
    expect(result).toEqual(data);
  });

  test('deve atualizar um endereço', async () => {
    const data = { address: 'Rua Y', building_name: 'Prédio', latitude: 1, longitude: 2 };
    addressesModel.updateAddress.mockResolvedValue({ id, ...data });
    const result = await addressesService.updateAddress(id, data);
    expect(result).toEqual({ id, ...data });
  });

  test('deve deletar um endereço', async () => {
    addressesModel.deleteAddress.mockResolvedValue({ id });
    const result = await addressesService.deleteAddress(id);
    expect(result).toEqual({ id });
  });

  test('deve obter endereço por id', async () => {
    addressesModel.getAddressById.mockResolvedValue({ id });
    const result = await addressesService.getAddressById(id);
    expect(result).toEqual({ id });
  });

  // --- VALIDAÇÃO ---
  test('deve lançar erro se faltar campo ao criar endereço', async () => {
    await expect(addressesService.createAddress({ address: '', building_name: '', latitude: '', longitude: '' }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar campo ao atualizar endereço', async () => {
    await expect(addressesService.updateAddress(id, { address: '', building_name: '', latitude: '', longitude: '' }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar id ao atualizar endereço', async () => {
    await expect(addressesService.updateAddress('', { address: 'Rua', building_name: 'Prédio', latitude: 1, longitude: 2 }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar id ao deletar endereço', async () => {
    await expect(addressesService.deleteAddress('')).rejects.toThrow('ID do endereço é obrigatório.');
  });

  test('deve lançar erro se endereço não for encontrado ao deletar', async () => {
    addressesModel.deleteAddress.mockResolvedValue(undefined);
    await expect(addressesService.deleteAddress(id)).rejects.toThrow('Endereço não encontrado.');
  });

  test('deve lançar erro se faltar id ao buscar endereço', async () => {
    await expect(addressesService.getAddressById('')).rejects.toThrow('ID do endereço é obrigatório.');
  });
});