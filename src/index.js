const serverless = require("serverless-http");
const express = require("express");
const app = express();

//import { neon } from '@neondatabase/serverless'; //commonjs
const { neon, neonConfig } = require('@neondatabase/serverless');


async function dbClient() {
  //for http connections non-pooling
  neonConfig.fetchConnectionCache = true;
  const sql = neon(process.env.DATABASE_URL);
  return sql;
}

app.get("/", async (req, res, next) => {
  console.log(process.env.DEBUG);
  const sql = await dbClient();
  // const results = await sql`SELECT now();`;
  let results; // Declare `results` outside the try block
  try {
    results = await sql`SELECT now();`;
  } catch (error) {
    console.error('Error querying the database:', error);
  }
  return res.status(200).json({
    message: "Hello from root!",
    DEBUG: process.env.DEBUG ===1 || `${process.env.DEBUG}` === `1`,
    results: results,
    // DATABASE_URL: process.env.DATABASE_URL? process.env.DATABASE_URL : 'not found',
    // NODE_ENV: process.env.NODE_ENV? process.env.NODE_ENV : 'not found',
    // PORT: process.env.PORT? process.env.PORT : 'not found',
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

//server full app
app.listen(3000, () => {
  console.log(`Server started on port 3000  http://localhost:3000`);
});

exports.handler = serverless(app);
