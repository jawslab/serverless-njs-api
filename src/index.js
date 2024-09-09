const serverless = require("serverless-http");
const express = require("express");
const app = express();

const {getDbClient} = require('./db/clients');
const crud = require('./db/crud');
const validators = require('./db/validators');


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

app.get("/leads", async (req, res, next) => {
  const results = await crud.listLeads()
  return res.status(200).json({
    results: results,
  });
});

app.post("/leads", async (req, res, next) => {
  // post -> create data
  const postData = await req.body;
  console.log('post data is',postData,typeof(postData));
  const jsonString = postData.toString(); // Convert Buffer to string
  const parsedData = JSON.parse(jsonString); // Parse JSON string to object
  // Destructure the email from the parsed data
  const { email } = parsedData;
  console.log('jsonString is',jsonString, typeof(jsonString)); 
  console.log('parsedData is',parsedData, typeof(parsedData));
  console.log('postData email is',email,typeof(email));

  // validation???
  const {vData, hasError, message} = await validators.validateLead(parsedData)  //in JSON format - type: Object
  if (hasError === true) {
    return res.status(400).json({
      message: message ? message : "Invalid request. please try again",
    });
  } else if (hasError === undefined) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
  const result = await crud.newLead(email);
  return res.status(201).json({
    results: result,
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from hello path!",
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
