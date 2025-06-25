const addressesService = require('../services/addressesService');

// Controller para obter todos os endereços
const getAddresses = async (req, res) => {
    try {
        const addresses = await addressesService.getAddresses();
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar endereços: ' + error.message });
    }
};

// Controller para criar um novo endereço
const createAddress = async (req, res) => {
    try {
        const newAddress = await addressesService.createAddress(req.body);
        res.status(201).json(newAddress);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para atualizar um endereço existente
const updateAddress = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedAddress = await addressesService.updateAddress(id, req.body);
        res.status(200).json(updatedAddress);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para deletar um endereço existente
const deleteAddress = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedAddress = await addressesService.deleteAddress(id);
        res.status(200).json(deletedAddress);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para obter endereço por ID
const getAddressById = async (req, res) => {
    const { id } = req.query;
    try {
        const address = await addressesService.getAddressById(id);
        res.status(200).json(address);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    getAddressById
};