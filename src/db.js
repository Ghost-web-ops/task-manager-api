import pg from 'pg';


const { Pool } = pg;
// يقوم بإنشاء مجموعة اتصالات لإدارة الاتصالات بكفاءة
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;