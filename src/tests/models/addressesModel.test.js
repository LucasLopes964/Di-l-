const db = require('../../config/db.js');
const Addresses = require('../../models/addressesModel');
const id = '00000000-0000-0000-0000-000000000001';

jest.mock('../../config/db.js');

describe('Addresses Model', () => {
  test('deve obter todos os endereços', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: id, address: 'Av. Prof. Almeida Prado, 520', building_name: 'Inteli', latitude: -23.5557501, longitude: -46.7338920 }]
    });

    const addresses = await Addresses.getAddresses();

    expect(addresses).toEqual([
      { id: id, address: 'Av. Prof. Almeida Prado, 520', building_name: 'Inteli', latitude: -23.5557501, longitude: -46.7338920 }
    ]);
  });

  test('deve criar um novo endereço', async () => {
    db.query.mockResolvedValue({
      rows: [{ address: 'Av. Prof. Almeida Prado, 520', building_name: 'Inteli', latitude: -23.5557501, longitude: -46.7338920 }]
    });

    const newAddress = await Addresses.createAddress('Av. Prof. Almeida Prado, 520', 'Inteli', -23.5557501, -46.7338920);

    expect(newAddress).toEqual({ address: 'Av. Prof. Almeida Prado, 520', building_name: 'Inteli', latitude: -23.5557501, longitude: -46.7338920 });
  });

  test('deve atualizar um endereço', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: id, address: 'Av. Prof. Almeida Prado, 520', building_name: 'Inteli', latitude: -23.5557501, longitude: -46.7338920 }]
    });

    const updatedAddress = await Addresses.updateAddress(id, 'Av. Prof. Almeida Prado, 520', 'Inteli', -23.5557501, -46.7338920);

    expect(updatedAddress).toEqual({ id: id, address: 'Av. Prof. Almeida Prado, 520', building_name: 'Inteli', latitude: -23.5557501, longitude: -46.7338920 });
  });

  test('deve deletar um endereço', async () => {
    db.query.mockResolvedValue({ rows: [{ id: id }], rowCount: 1 });

    const deleted = await Addresses.deleteAddress(id);

    expect(deleted).toEqual({ id: id });
  });

  test('deve criar um endereço e retornar os dados recém-inseridos', async () => {
    db.query.mockResolvedValue({
      rows: [{ address: 'Av. Prof. Almeida Prado, 520' }]
    });

    const newAddress = await Addresses.createAddressAndReturn('Av. Prof. Almeida Prado, 520');

    expect(newAddress).toEqual({ address: 'Av. Prof. Almeida Prado, 520' });
  });

  test('deve obter um endereço com o id informado', async () => {
    db.query.mockResolvedValue({ rows: [{ id: id }], rowCount: 1 });

    const address = await Addresses.getAddressById(id);

    expect(address).toEqual({ id: id });
  });

  test('deve lançar erro ao falhar em obter todos os endereços', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Addresses.getAddresses()).rejects.toThrow('Erro ao consultar endereços');
  });

  test('deve lançar erro ao falhar em criar endereço', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Addresses.createAddress('Av. Prof. Almeida Prado, 520', 'Inteli', -23.5557501, -46.7338920))
      .rejects.toThrow('Erro ao criar endereço');
  });

  test('deve lançar erro ao falhar em atualizar endereço', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Addresses.updateAddress(id, 'Av. Prof. Almeida Prado, 520', 'Inteli', -23.5557501, -46.7338920))
      .rejects.toThrow('Erro ao atualizar endereço');
  });

  test('deve lançar erro ao falhar em deletar endereço', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Addresses.deleteAddress(id)).rejects.toThrow('Erro ao deletar endereço');
  });

  test('deve lançar erro ao falhar em criar endereço e retornar os dados', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Addresses.createAddressAndReturn('Av. Prof. Almeida Prado, 520'))
      .rejects.toThrow('Erro ao criar endereço simplificado: DB error');
  });

  test('deve lançar erro ao falhar em obter endereço por id', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Addresses.getAddressById(id)).rejects.toThrow('Erro ao consultar endereço');
  });

  test('deve lançar erro se o endereço não for encontrado pelo id', async () => {
  db.query.mockResolvedValue({ rows: [] });

  await expect(Addresses.getAddressById('id-invalido'))
    .rejects.toThrow('Endereço não encontrado');
  });
});


