require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function runMigrations(folderPath) {
    const fullPath = path.resolve(folderPath);
    const files = fs.readdirSync(fullPath)
        .filter(file => file.endsWith('.js'))
        .sort();

    for (const file of files) {
        const filePath = path.join(fullPath, file);
        console.log(`Executando migração: ${file}...`);

        try {
            const migration = require(filePath);
            
            if (typeof migration !== 'function') {
                console.warn(`O arquivo ${file} não exporta uma função. Pulando.`);
                continue;
            }

            await migration();
            console.log(`Migração ${file} executada com sucesso.`);
        } catch (err) {
            console.error(`Erro ao executar ${file}:`, err);
            throw err;
        }
    }
}

module.exports = runMigrations;

const env = process.argv[2] || 'production'; // 'production' ou 'development'
const folder = `src/scripts/migrations/${env}`;

runMigrations(folder)
    .then(() => console.log("Todas as migrações foram executadas."))
    .catch(err => console.error("Falha ao executar as migrações:", err));
