const notificationsService = require('../services/notificationsService');

const getNotificationsByUser = async (req, res) => {
    const { user_id } = req.query;
    try {
        const notifications = await notificationsService.getNotificationsByUser(user_id);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getNotificationsByUser
};