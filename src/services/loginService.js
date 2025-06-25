const loginModel = require('../models/loginModel');

async function login(email, password) {
    if (!email || !password) {
        return { success: false, message: 'Email e senha são obrigatórios.' };
    }
    const result = await loginModel.login(email, password);
    if (!result.success) {
        return { success: false, message: 'Credenciais inválidas.' };
    }
    return { success: true, user: result.user };
}

module.exports = {
    login
};
