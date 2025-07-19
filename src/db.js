import pg from 'pg';


const { Pool } = pg;
// يقوم بإنشاء مجموعة اتصالات لإدارة الاتصالات بكفاءة
const pool = new Pool({
    user: "postgres",
  host: "localhost",
  database: "taskManagementApp",
  password: "OmarYasser011",
  port: 5432,
  connectionString: process.env.DATABASE_URL,
});

export default pool;