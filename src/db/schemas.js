// const { serial } = require("drizzle-orm/mysql-core");
// const { text, timestamp, pgTable } = require("drizzle-orm/pg-core");
const { pgTable, serial, text, varchar, integer, timestamp, boolean } = require('drizzle-orm/pg-core'); 
const { relations } = require('drizzle-orm') ; 

const LeadTable = pgTable('leads', {
  id: serial('id').primaryKey().notNull(),
  email: text('email').notNull(),
  description: text('description').default('This is my comment'),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports.LeadTable = LeadTable