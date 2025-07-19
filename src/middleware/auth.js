import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // 1. احصل على التوكن من الهيدر
  const authHeader = req.header('Authorization');

  // 2. تحقق مما إذا كان الهيدر موجودًا
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // 3. تحقق من أن التنسيق صحيح ("Bearer token")
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid token format.' });
  }

  const token = tokenParts[1];

  try {
    // 4. تحقق من صحة التوكن باستخدام المفتاح السري
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. أضف بيانات المستخدم إلى كائن الطلب (req)
    req.user = decoded;
    
    // 6. اسمح للطلب بالمرور إلى وجهته التالية
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export default authMiddleware;