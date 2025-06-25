require('dotenv').config();
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

module.exports = async function insertTags() {
  console.log("Conectando ao banco...");

  const isSSL = process.env.DB_SSL === 'true';
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: isSSL ? { rejectUnauthorized: false } : false,
  });

  try {
    const client = await pool.connect();

    const categoriesAndTags = {
      "Teto/cobertura": [
        "Fissuração",
        "Fungos, algas ou manchas de umidade",
        "Destacamento de revestimentos (p. ex. pintura)",
        "Deformações excessivas em laje ou forro",
        "Biodeterioração de componentes de madeira",
        "Corrosão de armadura de aço ou de estruturas metálicas da cobertura",
        "Carbonatação do concreto"
      ],
      "Parede": [
        "Destacamento de revestimentos (pintura ou placas cerâmicas)",
        "Empolamento da pintura",
        "Fissuração",
        "Carbonatação do concreto",
        "Danos decorrentes de choques mecânicos e de demais sobrecargas",
        "Fungos, algas ou manchas de umidade",
        "Biodeterioração de componentes de madeira",
        "Eflorescência"
      ],
      "Piso": [
        "Delaminação do revestimento do piso",
        "Destacamento do revestimento cerâmico",
        "Abrasão",
        "Eflorescência em placas cerâmicas",
        "Fissuração",
        "Recalque",
        "Empenamento (piso de madeira, placas cerâmicas ou concreto)",
        "Deterioração de juntas de assentamento",
        "Fungos, algas ou manchas de umidade",
        "Corrosão de armadura de aço",
        "Eflorescência"
      ]
    };

    for (const [categoryName, tags] of Object.entries(categoriesAndTags)) {
      const categoryId = uuidv4();

      console.log(`Inserindo categoria: ${categoryName}`);

      await client.query(
        'INSERT INTO tag_categories (id, name) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [categoryId, categoryName]
      );

      const { rows } = await client.query(
        'SELECT id FROM tag_categories WHERE name = $1',
        [categoryName]
      );
      const realCategoryId = rows[0].id;

      for (const tagName of tags) {
        const tagId = uuidv4();
        console.log(`→ Inserindo tag: ${tagName}`);

        await client.query(
          'INSERT INTO tags (id, name, category_id) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
          [tagId, tagName, realCategoryId]
        );
      }
    }

    console.log("Tags inseridas com sucesso!");
    client.release();
  } catch (error) {
    console.error("Erro durante a execução do script:", error);
  } finally {
    await pool.end();
    console.log("Conexão encerrada.");
  }
}
