const db = require('../config/db.js');

const getImages = async () => {
    try {
        const result = await db.query('SELECT * FROM images');
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar imagens: ' + error.message);
    }
}

const createImage = async (record_id, imageBuffer) => {
    const query = 'INSERT INTO images (record_id, image_data) VALUES ($1, $2) RETURNING *';
    const values = [record_id, imageBuffer];
    const result = await db.query(query, values);
    return result.rows[0];
}

const updateImage = async (id, record_id, imageBuffer) => {
    try {
        const query = 'UPDATE images SET record_id = $1, image_data = $2 WHERE id = $3 RETURNING *';
        const values = [record_id, imageBuffer, id];
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao atualizar imagem: ' + error.message);
    }
}

const deleteImage = async (id) => {
    try {
        const result = await db.query('DELETE FROM images WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao deletar imagem: ' + error.message);
    }
}

const getImagesByRecordId = async (record_id) => {
    try {
        const result = await db.query('SELECT * FROM images WHERE record_id = $1', [record_id]);
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar imagens por ID de registro: ' + error.message);
    }
}

const deleteImagesByRecordId = async (record_id) => {
    try {
        const result = await db.query('DELETE FROM images WHERE record_id = $1 RETURNING *', [record_id]);
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao deletar imagens por ID de registro: ' + error.message);
    }
}

module.exports = {
    getImages,
    createImage,
    updateImage,
    deleteImage,
    getImagesByRecordId, 
    deleteImagesByRecordId
};