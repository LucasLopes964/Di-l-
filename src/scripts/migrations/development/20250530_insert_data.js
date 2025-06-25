require('dotenv').config();
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

module.exports = async function insertInitialData() {
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

    console.log("Inserindo endereço...");
    await client.query(
      `INSERT INTO addresses (id, address, building_name, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING`,
      [
        "c83badf7-2480-45fe-9c8a-77b0383716f1",
        "Av. Prof. Almeida Prado, 520 - Butantã, São Paulo",
        "INTELI",
        "-23.555868613604936",
        "46.73386657017275"
      ]
    );
    console.log("Endereço inserido ou já existente.");

    console.log("Inserindo usuário...");
    await client.query(
      `INSERT INTO users (id, name, email, password, is_admin)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING`,
      [
        "97d7e303-c34f-4855-aab6-1112f491e204",
        "Teste Inspetor",
        "inspetor@ipt.br",
        "123",
        false
      ]
    );
    console.log("Usuário inspetor inserido ou já existente.");

    await client.query(
      `INSERT INTO users (id, name, email, password, is_admin)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING`,
      [
        "97d7e303-c34f-4855-aab6-1112f491e205",
        "Teste Administrador",
        "administrador@ipt.br",
        "123",
        true
      ]
    );
    console.log("Usuário inspetor inserido ou já existente.");

    console.log("Inserindo inspeção...");
    await client.query(
      `INSERT INTO inspections (id, inspection_title, address_id, starting_date, due_date, building_type, description, status, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO NOTHING`,
      [
        "f3229ed1-35ed-4cc3-a56c-97da4f3aaae3",
        "Inspeção - INTELI",
        "c83badf7-2480-45fe-9c8a-77b0383716f1",
        "2026-01-01T13:00:00.000Z",
        "2026-01-10T13:00:00.000Z",
        "Edifício",
        "Inspeção de rotina no edifício do INTELI.",
        "Pendente",
        "https://placehold.co/96x156"
      ]
    );
    console.log("Inspeção inserida ou já existente.");

    const environments = [
      {
        id: "8cbcb937-1431-4cc8-bbb0-372ddf59e6b8",
        name: "Ateliê 1",
        inspection_id: "f3229ed1-35ed-4cc3-a56c-97da4f3aaae3"
      },
      {
        id: "4358200e-76fc-4406-8199-dbc6d2de1212",
        name: "Ateliê 2",
        inspection_id: "f3229ed1-35ed-4cc3-a56c-97da4f3aaae3"
      },
      {
        id: "66dc4a9a-f7f5-4399-a88d-9d170ba6f8ba",
        name: "Ateliê 3",
        inspection_id: "f3229ed1-35ed-4cc3-a56c-97da4f3aaae3"
      }
    ];

    for (const env of environments) {
      console.log(`Inserindo ambiente: ${env.name}...`);
      await client.query(
        `INSERT INTO environments (id, name, inspection_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO NOTHING`,
        [env.id, env.name, env.inspection_id]
      );
      console.log(`Ambiente "${env.name}" inserido ou já existente.`);
    }

    console.log("Inserindo equipe...");
    await client.query(
      `INSERT INTO teams (id, name, inspection_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
      [
        "c83badf7-2480-45fe-9c8a-77b0394716f1",
        "Equipe 1",
        "f3229ed1-35ed-4cc3-a56c-97da4f3aaae3"
      ]
    );
    console.log("Equipe inserida ou já existente.");

    console.log("Inserindo atribuição de equipe...");
    await client.query(
      `INSERT INTO team_assignments (id, user_id, team_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
      [
        "c83badf7-2480-45fe-9c8a-77b0364716f1",
        "97d7e303-c34f-4855-aab6-1112f491e204",
        "c83badf7-2480-45fe-9c8a-77b0394716f1"
      ]
    );
    console.log("Equipe inserida ou já existente.");












    console.log("Dados de teste inseridos com sucesso!");
    client.release();
  } catch (error) {
    console.error("Erro ao inserir dados:", error);
  } finally {
    await pool.end();
    console.log("Conexão encerrada.");
  }
}
