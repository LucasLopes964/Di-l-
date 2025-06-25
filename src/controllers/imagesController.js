const imagesService = require('../services/imagesService');
const multer = require('multer');

// Configuração do multer para armazenar em memória
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Controller para obter todas as imagens
const getImages = async (req, res) => {
    try {
        const images = await imagesService.getImages();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar imagens: ' + error.message });
    }
};

// Controller para criar uma nova imagem (recebendo arquivo)
const createImage = async (req, res) => {
    try {
        const newImage = await imagesService.createImage({ record_id: req.body.record_id, file: req.file });
        res.status(201).json(newImage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para atualizar uma imagem existente
const updateImage = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedImage = await imagesService.updateImage(id, { record_id: req.body.record_id, file: req.file });
        res.status(200).json(updatedImage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller para deletar uma imagem existente
const deleteImage = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedImage = await imagesService.deleteImage(id);
        res.status(200).json(deletedImage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getImagesByRecordId = async (req, res) => {
    const { record_id } = req.query;
    try {
        const images = await imagesService.getImagesByRecordId(record_id);
        res.status(200).json(images);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteImagesByRecordId = async (req, res) => {
    const { record_id } = req.params;
    try {
        const deletedImages = await imagesService.deleteImagesByRecordId(record_id);
        res.status(200).json(deletedImages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateInspectionStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await inspectionsService.updateInspectionStatus(id, status);
        res.status(200).json({ message: 'Status atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar status: ' + error.message });
    }
};

module.exports = {
    getImages,
    createImage,
    updateImage,
    deleteImage,
    getImagesByRecordId,
    deleteImagesByRecordId,
    updateInspectionStatus,
    upload // exporta o middleware para uso na rota
};