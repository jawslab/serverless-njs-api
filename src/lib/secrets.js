const { SSMClient, GetParameterCommand, PutParameterCommand } = require("@aws-sdk/client-ssm");


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
  console.log('paramStoreData', paramStoreData)
  //const command = new GetParameterCommand(paramStoreData);
  const command = new GetParameterCommand(paramStoreData);
  const result = await client.send(command);
  return result.Parameter.Value;
}

async function putDatabaseUrl(stage, dbUrlVal){
  const paramStage = stage ? stage : 'dev'
  if (paramStage === 'prod') {
    return
  }
  if (!dbUrlVal) {
    return 
  }
  const DATABASE_URL_SSM_PARAM=`/serverless-njs-api/${paramStage}/databaseurl`
  const client = new SSMClient({region: AWS_REGION})
  const paramStoreData = {
      Name: DATABASE_URL_SSM_PARAM,
      Value: dbUrlVal,
      Type: "SecureString",
      Overwrite: true,
  }
  console.log('paramStoreData', paramStoreData)
  const command = new PutParameterCommand(paramStoreData)
  const result = await client.send(command)
  return result
}


module.exports.getDatabaseUrl = getDatabaseUrl
module.exports.putDatabaseUrl = putDatabaseUrl