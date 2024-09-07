const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");


//import { neon } from '@neondatabase/serverless'; //commonjs
const { neon, neonConfig } = require('@neondatabase/serverless');

const AWS_REGION = 'ca-central-1'
const STAGE = process.env.STAGE || 'prod'
const DATABASE_URL_SSM_PARM = `/serverless-njs-api/${STAGE}/databaseurl`


async function getDatabaseUrl() {
  //for http connections non-pooling
  const client = new SSMClient({ region: AWS_REGION });
  const paramStoreData = { 
    Name: DATABASE_URL_SSM_PARM, 
    WithDecryption: true 
  };
  const command = new GetParameterCommand(paramStoreData);
  const result = await client.send(command);
  return result.Parameter.Value;
}

module.exports.getDatabaseUrl = getDatabaseUrl