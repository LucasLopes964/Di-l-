const imagesModel = require('../models/imagesModel');

async function getImages() {
    return await imagesModel.getImages();
}

async function createImage({ record_id, file }) {
    if (!record_id || !file) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await imagesModel.createImage(record_id, file.buffer);
}

async function updateImage(id, { record_id, file }) {
    if (!id || !record_id || !file) {
        throw new Error('Todos os campos são obrigatórios.');
    }
    return await imagesModel.updateImage(id, record_id, file.buffer);
}

async function deleteImage(id) {
    if (!id) {
        throw new Error('ID da imagem é obrigatório.');
    }
    const deletedImage = await imagesModel.deleteImage(id);
    if (!deletedImage) {
        throw new Error('Imagem não encontrada.');
    }
    return deletedImage;
}

async function getImagesByRecordId(record_id) {
    if (!record_id) {
        throw new Error('ID do registro é obrigatório.');
    }
    return await imagesModel.getImagesByRecordId(record_id);
}

async function deleteImagesByRecordId(record_id) {
    if (!record_id) {
        throw new Error('ID do registro é obrigatório.');
    }
    const deletedImages = await imagesModel.deleteImagesByRecordId(record_id);
    if (!deletedImages) {
        throw new Error('Imagens não encontradas.');
    }
    return deletedImages;
}

module.exports = {
    getImages,
    createImage,
    updateImage,
    deleteImage,
    getImagesByRecordId,
    deleteImagesByRecordId
};
