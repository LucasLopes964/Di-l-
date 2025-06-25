// O Controller atualmente está dentro da página de configurações por motivos de testes,
// mas ele será movido para src/controllers/userController.js posteriormente.
const usersModel = require('../models/usersModel');
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { name, currentPassword, newPassword } = req.body;
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }
        const currentUser = await usersModel.getUserByIdWithPassword(userId);
        if (!currentUser) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        if (newPassword && newPassword.trim() !== '') {
            if (!currentPassword) {
                return res.status(400).json({ error: 'Senha atual é obrigatória para alterar a senha' });
            }
            if (currentUser.password !==    currentPassword) {
                return res.status(400).json({ error: 'Senha atual incorreta' });
            }
            await usersModel.updateUser(userId, name, currentUser.email, newPassword, currentUser.is_admin);
        } else {
            await usersModel.updateUser(userId, name, currentUser.email, currentUser.password, currentUser.is_admin);
        }
        res.json({ success: true, message: 'Perfil atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
const getUserProfile = async (req, res) => {
    try {
        const userId = req.session.userId;
        console.log('getUserProfile - userId da sessão:', userId);
        if (!userId) {
            console.log('getUserProfile - Usuário não autenticado');
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }
        console.log('getUserProfile - Buscando usuário no banco...');
        const user = await usersModel.getUserById(userId);
        console.log('getUserProfile - Usuário encontrado:', user);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            is_admin: user.is_admin
        });
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
module.exports = {
    updateUserProfile,
    getUserProfile
};