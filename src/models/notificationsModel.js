const db = require('../config/db.js');

const createNotification = async (user_id, message) => {
    try {
        const result = await db.query(
            'INSERT INTO notifications (user_id, message) VALUES ($1, $2) RETURNING *',
            [user_id, message]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao criar notificação: ' + error.message);
    }
};

const getNotificationsByUser = async (user_id) => {
    try {
        const result = await db.query(
            'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
            [user_id]
        );
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao buscar notificações: ' + error.message);
    }
};

module.exports = {
    createNotification,
    getNotificationsByUser
};