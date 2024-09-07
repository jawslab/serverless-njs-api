const serverless = require("serverless-http");
const express = require("express");
const app = express();

const {getDbClient} = require('./db/clients');

app.get("/", async (req, res, next) => {
  console.log(process.env.DEBUG);
  const sql = await getDbClient();
  // const results = await sql`SELECT now();`;
  let results; // Declare `results` outside the try block
  let delta;
  const now = Date.now();
  try {
    results = await sql`SELECT now();`;
    delta = (Date.now() - now)/1000;
  } catch (error) {
    console.error('Error querying the database:', error);
  }
  return res.status(200).json({
    message: "Hello from root!",
    DEBUG: process.env.DEBUG ===1 || `${process.env.DEBUG}` === `1`,
    results: results,
    now: now,
    delta: delta,
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
