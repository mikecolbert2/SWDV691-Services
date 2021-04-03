require('dotenv').config();

const { Pool } = require('pg');
const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
//const connectionString = "postgres://whyjnokydpzjbh:37867f2b1eab9083720ef8ccd9b98ff9ce4accb43893843181ee66e03169ddeb@ec2-3-91-127-228.compute-1.amazonaws.com:5432/dde0r75jqai4n4?sslmode=require";
//const connectionString = process.env.DATABASE_URL;

// const client = new Client({
//     connectionString: connectionString,
//     ssl: { rejectUnauthorized: false }
//   })

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl:{ rejectUnauthorized: false }
});

module.exports = { pool }