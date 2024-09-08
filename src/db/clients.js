const AWS = require('aws-sdk');
//import { neon } from '@neondatabase/serverless'; //commonjs
const { neon, neonConfig } = require('@neondatabase/serverless');
const secrets = require('../lib/secrets');
const {drizzle} = require('drizzle-orm/neon-http');

const AWS_REGION = 'ca-central-1'
const STAGE = process.env.STAGE || 'prod'
const ssm = new AWS.SSM({ region: AWS_REGION });


async function getDbClient() {
    const dburl = await secrets.getDatabaseUrl();
    neonConfig.fetchConnectionCache = true;
    const sql = neon(dburl);
    console.log('STAGE is:', STAGE);
    return sql;
  }

async function getDrizzleDbClient() {
    const sql = await getDbClient();
    return drizzle(sql);
  }
    
module.exports.getDbClient = getDbClient; // Export the function as a module
module.exports.getDrizzleDbClient = getDrizzleDbClient;