require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

console.log("DATABASE_URL:", process.env.DATABASE_URL); // teste

module.exports = async function runMigration() {
  const isSSL = process.env.DB_SSL === 'true';
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: isSSL ? { rejectUnauthorized: false } : false,
  });

  let client;
  try {
    client = await pool.connect();
    console.log("Conectado com sucesso!");

    const sql = fs.readFileSync('src/sql/create-tables.sql', 'utf8');
    await client.query(sql);

    console.log("Migração executada com sucesso no Supabase!");
  } catch (error) {
    console.error("Erro ao executar migração:", error.message);
  } finally {
    if (client) client.release();
  }
}


