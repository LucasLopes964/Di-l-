const usersModel = require('../models/usersModel');

async function getUsers() {
    return await usersModel.getUsers();
}

async function createUser({ name, email, password, is_admin }) {
    if (!name || !email || !password || is_admin === undefined) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await usersModel.createUser(name, email, password, is_admin);
}

async function updateUser(id, { name, email, password, is_admin }) {
    if (!id || !name || !email || !password || is_admin === undefined) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await usersModel.updateUser(id, name, email, password, is_admin);
}

async function deleteUser(id) {
    if (!id) {
        throw new Error('ID do usuário é obrigatório.');
    }
    const deletedUser = await usersModel.deleteUser(id);
    if (!deletedUser) {
        throw new Error('Usuário não encontrado.');
    }
    return deletedUser;
}

async function getById(id) {
    if (!id) {
        throw new Error('ID do usuário é obrigatório.');
    }
    return await usersModel.getById(id);
}

async function getUserById(id) {
  return usersModel.getUserById(id);
}


module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getById, 
    getUserById
};