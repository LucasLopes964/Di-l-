const db = require('../config/db.js');

const getAddresses = async () => {
    try{
        const result = await db.query('SELECT * FROM addresses');
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao consultar endereços: ' + error.message);
    }
}

const createAddress = async (address, building_name, latitude, longitude) => {
    try{
        const result = await db.query('INSERT INTO addresses (address, building_name, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *', [address, building_name, latitude, longitude]);
        return result.rows[0]; 
    } catch (error) {
        throw new Error('Erro ao criar endereço: ' + error.message);
    }   
}

const updateAddress = async (id, address, building_name, latitude, longitude) => {
    try{
        const result = await db.query('UPDATE addresses SET address = $2, building_name = $3, latitude = $4, longitude = $5 WHERE id = $1 RETURNING *', [id, address, building_name, latitude, longitude]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao atualizar endereço: ' + error.message);
    }
}

const deleteAddress = async (id) => {
    try{
        const result = await db.query('DELETE FROM addresses WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao deletar endereço: ' + error.message);
    }
}

const createAddressAndReturn = async (address) => {
  try {
    const result = await db.query(
      'INSERT INTO addresses (address, building_name, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *',
      [address, null, null, null]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao criar endereço simplificado: ' + error.message);
  }
};

const getAddressById = async (id) => {
    try {
        const result = await db.query('SELECT * FROM addresses WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error('Endereço não encontrado');
        }
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao consultar endereço: ' + error.message);
    }
}


module.exports = {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    createAddressAndReturn,
    getAddressById
};