import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db.js'; // استيراد الاتصال بقاعدة البيانات
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/auth.js';
import passport from 'passport';
const router = express.Router();

// POST /api/register
router.post('/register', authMiddleware, async (req, res) => {
  try {
    // 1. استخلاص البيانات من جسم الطلب
    const { username, email, password } = req.body;

    // 2. التحقق من أن كل البيانات موجودة
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    // 3. التحقق مما إذا كان المستخدم موجودًا بالفعل
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // 4. تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. إضافة المستخدم الجديد إلى قاعدة البيانات
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, passwordHash]
    );

    // 6. إرسال رد بالنجاح مع بيانات المستخدم الجديد
    res.status(201).json(newUser.rows[0]);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});
router.post('/login', authMiddleware, async (req, res) => {
  try {
    // 1. استخلاص البيانات من الطلب
    const { email, password } = req.body;

    // 2. التحقق من أن الحقول ليست فارغة
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    // 3. البحث عن المستخدم في قاعدة البيانات
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' }); // لا تخبر المهاجم أن الإيميل غير موجود
    }
    const user = userResult.rows[0];

    // 4. مقارنة كلمة المرور المُرسلة مع الهاش المخزن
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' }); // رسالة خطأ عامة للأمان
    }

    // 5. إنشاء حمولة (Payload) للـ JWT
    const payload = {
      id: user.id,
      username: user.username,
    };

    // 6. توقيع التوكن وإرساله
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // صلاحية التوكن: ساعة واحدة
    );

    res.json({ token });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});
router.get('/auth/google', passport.authenticate('google'));

// --- المسار الثاني: الرابط الذي يعود إليه جوجل ---
// هذا المسار يستقبل بيانات المستخدم من جوجل
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // إذا نجحت المصادقة، سيكون req.user متاحًا
    // الآن ننشئ JWT تمامًا كما في تسجيل الدخول العادي
    const payload = {
      id: req.user.id,
      username: req.user.username,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // إعادة توجيه المستخدم إلى الواجهة الأمامية مع إرسال التوكن
    res.redirect(`http://localhost:3000/google-callback?token=${token}`);
  }
);

export default router;