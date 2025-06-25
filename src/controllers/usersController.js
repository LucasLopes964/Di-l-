const usersService = require('../services/usersService');

// Controller para selecionar os usuários
const getUsers = async (req, res) => {
    try {
        const users = await usersService.getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar usuários: ' + error.message });
    }
};

// Controller para criar um novo usuário
const createUser = async (req, res) => {
    try {
        const newUser = await usersService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para atualizar um usuário existente
const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await usersService.updateUser(id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para deletar um usuário existente
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await usersService.deleteUser(id);
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    const { id } = req.query;
    try {
        const user = await usersService.getById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getById
};