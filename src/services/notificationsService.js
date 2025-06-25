const notificationsModel = require('../models/notificationsModel');

async function getNotificationsByUser(user_id) {
    if (!user_id) {
        throw new Error('ID do usuário é obrigatório.');
    }
    return await notificationsModel.getNotificationsByUser(user_id);
}

module.exports = {
    getNotificationsByUser
};