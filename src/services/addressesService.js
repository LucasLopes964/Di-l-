const addressesModel = require('../models/addressesModel');

async function getAddresses() {
    return await addressesModel.getAddresses();
}

async function createAddress({ address, building_name, latitude, longitude }) {
    if (!address || !building_name || !latitude || !longitude) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await addressesModel.createAddress(address, building_name, latitude, longitude);
}

async function updateAddress(id, { address, building_name, latitude, longitude }) {
    if (!id || !address || !building_name || !latitude || !longitude) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await addressesModel.updateAddress(id, address, building_name, latitude, longitude);
}

async function deleteAddress(id) {
    if (!id) {
        throw new Error('ID do endereço é obrigatório.');
    }
    const deletedAddress = await addressesModel.deleteAddress(id);
    if (!deletedAddress) {
        throw new Error('Endereço não encontrado.');
    }
    return deletedAddress;
}

async function getAddressById(id) {
    if (!id) {
        throw new Error('ID do endereço é obrigatório.');
    }
    return await addressesModel.getAddressById(id);
}

module.exports = {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    getAddressById
};
