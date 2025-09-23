import { createPool } from 'mysql2/promise.js'

export const pool = createPool({
   host: 'localhost',
   user: 'root',
   password: 'Asamblea01@',
   port: 3306,
   database: 'coopserp_tamizaje'
});