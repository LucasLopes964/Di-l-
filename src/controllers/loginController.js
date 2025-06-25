const loginService = require('../services/loginService');

// Controller para verificar o login de usuários
const loginController = {
    login: async (req, res) => {
        const { email, password } = req.body; // Os dados de login vêm do corpo da requisição
        // Verifica se os campos obrigatórios foram enviados
        const result = await loginService.login(email, password);
        if (result.success){
            req.session.authenticated = true;
            req.session.user = result.user; // Salva o objeto user inteiro na sessão
            res.redirect('/');
        } else {
            res.redirect('/login?error=1');
        }
    }
};

// Controller para gerenciar o logout de usuários
module.exports = loginController;