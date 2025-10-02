const express = require('express');
const path = require('path');
const indexApp = require('./index');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// =============================================================================
// ENVIRONMENT VALIDATION
// =============================================================================
const requiredEnvVars = [
  'SUPABASE_SERVICE_KEY',
  'JWT_SECRET',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD_HASH'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

// =============================================================================
// SUPABASE CONFIGURATION
// =============================================================================
const SUPABASE_URL = 'https://rxjwcncdubqkoqgcpqjo.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// =============================================================================
// MIDDLEWARE
// =============================================================================
//app.use(cors());
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://127.0.0.1:5501'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json());

// Rate Limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Quá nhiều lần upload. Vui lòng thử lại sau.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Quá nhiều requests. Vui lòng thử lại sau.' }
});

app.use(generalLimiter);

// Authentication Middleware
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Yêu cầu đăng nhập (thiếu token)' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Token không hợp lệ hoặc đã hết hạn' 
      });
    }
    
    req.user = decoded;
    next();
  });
};

// Admin Middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Yêu cầu token admin' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền admin' });
    }
    req.user = decoded;
    next();
  });
};

// Ownership Check Middleware
const checkOwnership = (req, res, next) => {
  const userId = req.params.userId || req.body.userId;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu userId'
    });
  }

  // Cho phép admin truy cập tất cả tài nguyên
  if (req.user.role === 'admin') {
    return next();
  }

  // Kiểm tra quyền sở hữu cho user thông thường
  if (req.user.userId !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Không có quyền truy cập tài nguyên này'
    });
  }
  
  next();
};

// =============================================================================
// MULTER CONFIGURATION
// =============================================================================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)!'), false);
    }
  }
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
function generateFileName(originalName) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(originalName);
  const safeName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9]/g, '_');
  return `${timestamp}_${random}_${safeName}${ext}`.substring(0, 100);
}

function validateUserId(userId) {
  if (!userId) {
    throw new Error('userId là bắt buộc');
  }
  
  const userIdStr = validator.trim(userId.toString());
  
  if (/^\d+$/.test(userIdStr)) {
    const userIdNum = parseInt(userIdStr);
    if (userIdNum <= 0) {
      throw new Error('userId phải là số nguyên dương');
    }
    return userIdStr;
  }
  
  if (/^(user_|usr)\d+_\d+$/i.test(userIdStr)) {
    return userIdStr.toLowerCase();
  }
  
  throw new Error('userId không hợp lệ');
}

function validatePosition(position) {
  if (position === null || position === undefined) {
    return null;
  }
  
  const pos = parseInt(position);
  
  if (isNaN(pos)) {
    throw new Error('Position phải là số');
  }
  
  if (pos < 1 || pos > 20) {
    throw new Error('Position phải từ 1 đến 20');
  }
  
  return pos;
}

function sanitizeInput(input, maxLength = 1000) {
  if (!input) return '';
  
  let sanitized = validator.trim(input.toString());
  sanitized = validator.escape(sanitized);
  
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.user_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
}

async function logAudit(userId, action, req, metadata = {}) {
  try {
    await supabase.from('audit_logs').insert([{
      user_id: userId,
      action,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.headers['user-agent'],
      metadata
    }]);
  } catch (error) {
    console.error('Audit log error:', error);
  }
}

function generateUserId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `user_${timestamp}_${random}`;
}

async function checkPositionAvailability(userId, position) {
  if (position === null) return true;
  
  const { data } = await supabase
    .from('user_photos')
    .select('id')
    .eq('user_id', userId)
    .eq('position', position)
    .maybeSingle();
  
  return !data;
}

// =============================================================================
// ADMIN ENDPOINTS
// =============================================================================
app.post('/api/admin/login/simple', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username và password là bắt buộc' 
      });
    }
    
    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(401).json({ 
        success: false, 
        message: 'Thông tin đăng nhập không đúng' 
      });
    }
    
    const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    
    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Thông tin đăng nhập không đúng' 
      });
    }
    
    const token = jwt.sign(
      { 
        username: process.env.ADMIN_USERNAME,
        role: 'admin' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    
    res.json({
      success: true,
      message: 'Đăng nhập admin thành công',
      data: { token }
    });
    
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Đăng nhập thất bại' 
    });
  }
});

// =============================================================================
// AUTH ENDPOINTS
// =============================================================================
// Lấy tất cả ảnh (chỉ admin)
// Lấy tất cả ảnh (chỉ admin)
// Lấy tất cả users và ảnh của họ (nếu có)
app.get('/api/users/all', authenticateUser, async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Chỉ admin mới có quyền truy cập'
        });
      }
  
      // Lấy tất cả users - chỉ user_id và email
      const { data: users, error } = await supabase
        .from('users')
        .select('user_id, email')
        .order('created_at', { ascending: false });
  
      if (error) throw error;
  
      res.json({
        success: true,
        data: users || [],
        total: users?.length || 0
      });
    } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách users',
        error: error.message
      });
    }
  });

app.post('/api/auth/verify-passcode', authLimiter, async (req, res) => {
  try {
    let { userId, passcode } = req.body;
    if (!userId || !passcode) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID và passcode là bắt buộc' 
      });
    }

    userId = validator.trim(userId);
    passcode = validator.trim(passcode);

    const validUserId = validateUserId(userId);

    const { data: user, error } = await supabase
      .from('users')
      .select('user_id, email, passcode_hash, is_active')
      .eq('user_id', validUserId)
      .single();

    if (error || !user) {
      await logAudit(validUserId, 'passcode_failed', req, { reason: 'user_not_found' });
      return res.status(404).json({ 
        success: false, 
        message: 'Người dùng không tồn tại' 
      });
    }

    if (!user.is_active) {
      await logAudit(validUserId, 'passcode_failed', req, { reason: 'account_disabled' });
      return res.status(403).json({ 
        success: false, 
        message: 'Tài khoản đã bị vô hiệu hóa' 
      });
    }

    const isPasscodeValid = await bcrypt.compare(passcode, user.passcode_hash);
    
    if (!isPasscodeValid) {
      await logAudit(validUserId, 'passcode_failed', req, { reason: 'wrong_passcode' });
      return res.status(401).json({ 
        success: false, 
        message: 'Passcode không đúng' 
      });
    }

    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('user_id', validUserId);

    await logAudit(validUserId, 'passcode_verified', req);

    const accessToken = generateAccessToken(user);

    res.json({
      success: true,
      message: 'Xác thực thành công',
      data: {
        user: { userId: user.user_id, email: user.email },
        accessToken
      }
    });
  } catch (error) {
    console.error('Verify passcode error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server',
      error: error.message
    });
  }
});
// Admin tạo tài khoản mới cho user
app.post('/api/auth/register', authenticateUser, async (req, res) => {
  try {
    // Chỉ admin mới có quyền tạo tài khoản
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ admin mới có quyền tạo tài khoản mới'
      });
    }

    const { email, full_name, passcode, phone } = req.body;

    // Validate input
    if (!email || !full_name || !passcode) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin (email, họ tên và passcode)'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email không hợp lệ'
      });
    }

    if (passcode.length < 4 ) {
      return res.status(400).json({
        success: false,
        message: 'Passcode phải có từ 4 đến 6 ký tự'
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle(); // Dùng maybeSingle() thay vì single()

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    if (userCheckError) {
      throw userCheckError;
    }

    // Tạo user_id unique
    const userId = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Hash passcode trước khi lưu
    const bcrypt = require('bcrypt');
    const passcodeHash = await bcrypt.hash(passcode, 10);

    // Tạo user mới trong database
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{
        user_id: userId,           // Dùng user_id thay vì id
        email: email,
        full_name: full_name,
        phone: phone || null,      // Phone có thể null
        passcode_hash: passcodeHash, // Lưu hash thay vì plain text
        role: 'user',              // Mặc định là user
        is_active: true,           // Active ngay
        email_verified: false      // Chưa verify email
      }])
      .select()
      .single();

    if (createError) throw createError;

    // Log audit
    await supabase
      .from('audit_logs')
      .insert([{
        user_id: userId,
        action: 'user_created_by_admin',
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
        metadata: {
          created_by: req.user.user_id,
          email: email
        }
      }]);

    // Trả về response
    res.json({
      success: true,
      message: 'Tạo tài khoản thành công',
      data: {
        userId: userId,      // Thêm dòng này (không có dấu gạch dưới)
        user_id: userId,     // Giữ lại cho consistency
        email: email,
        full_name: full_name,
        phone: phone,
        created_at: newUser.created_at
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo tài khoản',
      error: error.message
    });
  }
});

// =============================================================================
// UPLOAD ENDPOINTS
// =============================================================================
app.post('/api/upload', uploadLimiter, authenticateUser, upload.single('image'),checkOwnership, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được upload'
      });
    }

    const userId = validateUserId(req.body.userId);
    const position = validatePosition(req.body.position);
    
    if (position !== null) {
      const isAvailable = await checkPositionAvailability(userId, position);
      if (!isAvailable) {
        return res.status(409).json({
          success: false,
          message: `Position ${position} đã được sử dụng`
        });
      }
    }
    
    const fileName = generateFileName(req.file.originalname);
    const filePath = `users/${userId}/images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('user-photos')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600'
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from('user-photos')
      .getPublicUrl(filePath);

    const metadata = {
      user_id: userId,
      file_name: sanitizeInput(req.file.originalname, 255),
      file_path: filePath,
      file_url: urlData.publicUrl,
      file_size: req.file.size,
      file_type: req.file.mimetype,
      position: position
    };

    const { data: dbData, error: dbError } = await supabase
      .from('user_photos')
      .insert([metadata])
      .select()
      .single();

    if (dbError) {
      console.error('Database save failed:', dbError);
      throw new Error('Lưu metadata thất bại');
    }

    await logAudit(userId, 'image_uploaded', req, { imageId: dbData.id, position });

    res.json({
      success: true,
      message: 'Upload thành công',
      data: {
        id: dbData.id,
        userId: userId,
        url: urlData.publicUrl,
        path: filePath,
        size: req.file.size,
        type: req.file.mimetype,
        position: position,
        originalName: req.file.originalname
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
});

app.post('/api/upload/multiple', uploadLimiter, authenticateUser, upload.array('images', 10),checkOwnership, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được upload'
      });
    }

    const userId = validateUserId(req.body.userId);
    
    let positions = [];
    if (req.body.positions) {
      try {
        positions = JSON.parse(req.body.positions);
      } catch {
        positions = req.body.positions.split(',').map(p => {
          const trimmed = validator.trim(p);
          return trimmed ? parseInt(trimmed) : null;
        });
      }
    }

    const validatedPositions = positions.map(pos => validatePosition(pos));
    
    const nonNullPositions = validatedPositions.filter(p => p !== null);
    const uniquePositions = new Set(nonNullPositions);
    if (nonNullPositions.length !== uniquePositions.size) {
      return res.status(400).json({
        success: false,
        message: 'Có position trùng lặp trong request'
      });
    }

    for (const pos of nonNullPositions) {
      const isAvailable = await checkPositionAvailability(userId, pos);
      if (!isAvailable) {
        return res.status(409).json({
          success: false,
          message: `Position ${pos} đã được sử dụng`
        });
      }
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const position = validatedPositions[i] !== undefined ? validatedPositions[i] : null;

      try {
        const fileName = generateFileName(file.originalname);
        const filePath = `users/${userId}/images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('user-photos')
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            cacheControl: '3600'
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('user-photos')
          .getPublicUrl(filePath);

        const metadata = {
          user_id: userId,
          file_name: sanitizeInput(file.originalname, 255),
          file_path: filePath,
          file_url: urlData.publicUrl,
          file_size: file.size,
          file_type: file.mimetype,
          position: position
        };

        const { data: dbData } = await supabase
          .from('user_photos')
          .insert([metadata])
          .select()
          .single();

        results.push({
          success: true,
          fileName: file.originalname,
          url: urlData.publicUrl,
          size: file.size,
          position: position,
          id: dbData?.id
        });

      } catch (error) {
        errors.push({
          fileName: file.originalname,
          position: position,
          error: error.message
        });
      }
    }

    await logAudit(userId, 'multiple_images_uploaded', req, { 
      total: req.files.length, 
      successful: results.length,
      failed: errors.length 
    });

    res.json({
      success: errors.length === 0,
      message: `Upload hoàn tất: ${results.length} thành công, ${errors.length} thất bại`,
      data: {
        userId: userId,
        successful: results,
        failed: errors,
        total: req.files.length
      }
    });

  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
});

app.get('/api/images/:userId', authenticateUser, checkOwnership, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0, sortBy = 'position' } = req.query;

    const validUserId = validateUserId(userId);

    let query = supabase
      .from('user_photos')
      .select('*')
      .eq('user_id', validUserId);

    if (sortBy === 'position') {
      query = query.order('position', { ascending: true, nullsFirst: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      total: data?.length || 0,
      userId: validUserId,
      sortedBy: sortBy
    });

  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách ảnh',
      error: error.message
    });
  }
});

app.get('/api/image/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;

    const { data, error } = await supabase
      .from('user_photos')
      .select('*')
      .eq('id', imageId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Ảnh không tìm thấy'
      });
    }

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy ảnh',
      error: error.message
    });
  }
});

app.delete('/api/images/:imageId', authenticateUser, async (req, res) => {
  try {
    const { imageId } = req.params;

    const { data: image, error: fetchError } = await supabase
      .from('user_photos')
      .select('*')
      .eq('id', imageId)
      .single();

    if (fetchError || !image) {
      return res.status(404).json({
        success: false,
        message: 'Ảnh không tồn tại'
      });
    }

    if (image.user_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa ảnh này'
      });
    }

    const { error: storageError } = await supabase.storage
      .from('user-photos')
      .remove([image.file_path]);

    if (storageError) {
      console.warn('Storage delete warning:', storageError);
    }

    const { error: dbError } = await supabase
      .from('user_photos')
      .delete()
      .eq('id', imageId);

    if (dbError) throw dbError;

    await logAudit(req.user.userId, 'image_deleted', req, { imageId, position: image.position });

    res.json({
      success: true,
      message: 'Đã xóa ảnh thành công',
      deletedImage: {
        id: imageId,
        userId: image.user_id,
        fileName: image.file_name,
        position: image.position
      }
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Xóa ảnh thất bại',
      error: error.message
    });
  }
});

// =============================================================================
// POST ENDPOINTS
// =============================================================================
app.get('/api/posts/:userId', authenticateUser, checkOwnership, async (req, res) => {
  try {
    const { userId } = req.params;
    const validUserId = validateUserId(userId);

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', validUserId)
      .maybeSingle();

    if (error) throw error;

    res.json({
      success: true,
      data: data || null,
      userId: validUserId
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy post',
      error: error.message
    });
  }
});

app.post('/api/posts/:userId', authenticateUser, checkOwnership, async (req, res) => {
  try {
    const { userId } = req.params;
    let { content = '', type = 'text' } = req.body;

    const validUserId = validateUserId(userId);

    content = validator.trim(content);
    
    if (!content || content.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nội dung không được để trống'
      });
    }

    if (content.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Nội dung quá dài (max 5000 ký tự)'
      });
    }

    content = validator.escape(content);

    const { data: existingPost } = await supabase
      .from('posts')
      .select('id')
      .eq('user_id', validUserId)
      .maybeSingle();

    let result;
    let isUpdate = false;

    if (existingPost) {
      const { data: updatedPost, error: updateError } = await supabase
        .from('posts')
        .update({ 
          content: content,
          type: type,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPost.id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      result = updatedPost;
      isUpdate = true;
    } else {
      const { data: newPost, error: createError } = await supabase
        .from('posts')
        .insert([{
          user_id: validUserId,
          content: content,
          type: type,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (createError) throw createError;
      result = newPost;
      isUpdate = false;
    }

    await logAudit(validUserId, isUpdate ? 'post_updated' : 'post_created', req, { postId: result.id });

    res.status(isUpdate ? 200 : 201).json({
      success: true,
      message: isUpdate ? 'Cập nhật post thành công' : 'Tạo post thành công',
      data: result,
      isUpdate
    });

  } catch (error) {
    console.error('Save post error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lưu post',
      error: error.message
    });
  }
});

app.delete('/api/posts/:userId', authenticateUser, checkOwnership, async (req, res) => {
  try {
    const { userId } = req.params;
    const validUserId = validateUserId(userId);

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('user_id', validUserId);

    if (error) throw error;

    await logAudit(validUserId, 'post_deleted', req);

    res.json({
      success: true,
      message: 'Xóa post thành công',
      userId: validUserId
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa post',
      error: error.message
    });
  }
});

// =============================================================================
// UTILITY ENDPOINTS
// =============================================================================
// Lấy thống kê chi tiết của user
// Lấy thống kê chi tiết của user
app.get('/api/stats/:userId', authenticateUser, checkOwnership, async (req, res) => {
  try {
    const { userId } = req.params;
    const validUserId = validateUserId(userId);

    // Lấy thông tin hình ảnh
    const { data: images, error: imageError } = await supabase
      .from('user_photos')
      .select('file_size, position, created_at')
      .eq('user_id', validUserId);

    if (imageError) throw imageError;

    // Lấy thông tin bài viết
    const { data: posts, error: postError } = await supabase
      .from('posts')
      .select('content, created_at')
      .eq('user_id', validUserId);

    if (postError) throw postError;

    // Tính toán thống kê
    const totalImages = images?.length || 0;
    const totalImageSize = images?.reduce((sum, img) => sum + (img.file_size || 0), 0) || 0;
    const imagesWithPosition = images?.filter(img => img.position !== null).length || 0;
    const latestImage = images?.length > 0 
      ? new Date(Math.max(...images.map(img => new Date(img.created_at)))) 
      : null;

    const totalPosts = posts?.length || 0;
    const totalPostSize = posts?.reduce((sum, post) => sum + (post.content?.length || 0), 0) || 0;
    const latestPost = posts?.length > 0 
      ? new Date(Math.max(...posts.map(post => new Date(post.created_at)))) 
      : null;

    // Trả về kết quả
    res.json({
      success: true,
      data: {
        user_id: validUserId,
        images: {
          total: totalImages,
          total_size: totalImageSize,
          total_size_mb: (totalImageSize / (1024 * 1024)).toFixed(2),
          with_position: imagesWithPosition,
          without_position: totalImages - imagesWithPosition,
          latest_upload: latestImage?.toISOString()
        },
        posts: {
          total: totalPosts,
          total_size: totalPostSize,
          latest_post: latestPost?.toISOString()
        },
        summary: {
          total_items: totalImages + totalPosts,
          total_size: totalImageSize + totalPostSize,
          last_activity: latestImage && latestPost
            ? new Date(Math.max(latestImage, latestPost)).toISOString()
            : latestImage?.toISOString() || latestPost?.toISOString() || null
        }
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê',
      error: error.message
    });
  }
});
// =============================================================================
// CHANGE PASSCODE ENDPOINT
// =============================================================================

// Đổi passcode (User)
app.post('/api/auth/change-passcode', authLimiter, authenticateUser, async (req, res) => {
    try {
      const { oldPasscode, newPasscode } = req.body;
  
      // Validate input
      if (!oldPasscode || !newPasscode) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp oldPasscode và newPasscode'
        });
      }
  
      // Lấy userId từ token
      const validUserId = req.user.userId;
  
      // Validate new passcode
      const trimmedNewPasscode = validator.trim(newPasscode);
      if (trimmedNewPasscode.length < 4 || trimmedNewPasscode.length > 6) {
        return res.status(400).json({
          success: false,
          message: 'Passcode mới phải có từ 4 đến 6 ký tự'
        });
      }
  
      // Kiểm tra passcode mới không được giống passcode cũ
      if (oldPasscode === newPasscode) {
        return res.status(400).json({
          success: false,
          message: 'Passcode mới phải khác passcode cũ'
        });
      }
  
      // Lấy thông tin user
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('user_id, passcode_hash, is_active')
        .eq('user_id', validUserId)
        .single();
  
      if (userError || !user) {
        return res.status(404).json({
          success: false,
          message: 'User không tồn tại'
        });
      }
  
      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message: 'Tài khoản đã bị vô hiệu hóa'
        });
      }
  
      // Verify old passcode
      const isOldPasscodeValid = await bcrypt.compare(oldPasscode, user.passcode_hash);
      
      if (!isOldPasscodeValid) {
        await logAudit(validUserId, 'change_passcode_failed', req, { reason: 'wrong_old_passcode' });
        return res.status(401).json({
          success: false,
          message: 'Passcode cũ không đúng'
        });
      }
  
      // Hash new passcode
      const newPasscodeHash = await bcrypt.hash(trimmedNewPasscode, 10);
  
      // Update passcode
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          passcode_hash: newPasscodeHash,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', validUserId);
  
      if (updateError) {
        throw updateError;
      }
  
      // Log audit
      await logAudit(validUserId, 'passcode_changed', req);
  
      res.json({
        success: true,
        message: 'Đổi passcode thành công'
      });
  
    } catch (error) {
      console.error('Change passcode error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi đổi passcode',
        error: error.message
      });
    }
  });
  
  // Admin reset passcode (cho user quên passcode)
  app.post('/api/auth/reset-passcode', authLimiter, authenticateAdmin, async (req, res) => {
    try {
      const { userId, newPasscode } = req.body;
  
      // Validate input
      if (!userId || !newPasscode) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp userId và newPasscode'
        });
      }
  
      // Validate userId
      const validUserId = validateUserId(userId);
  
      // Validate new passcode
      const trimmedNewPasscode = validator.trim(newPasscode);
      if (trimmedNewPasscode.length < 4 || trimmedNewPasscode.length > 6) {
        return res.status(400).json({
          success: false,
          message: 'Passcode mới phải có từ 4 đến 6 ký tự'
        });
      }
  
      // Kiểm tra user có tồn tại không
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', validUserId)
        .single();
  
      if (userError || !user) {
        return res.status(404).json({
          success: false,
          message: 'User không tồn tại'
        });
      }
  
      // Hash new passcode
      const newPasscodeHash = await bcrypt.hash(trimmedNewPasscode, 10);
  
      // Update passcode
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          passcode_hash: newPasscodeHash,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', validUserId);
  
      if (updateError) {
        throw updateError;
      }
  
      // Log audit
      await logAudit(validUserId, 'passcode_reset_by_admin', req, {
        admin_user: req.user.username
      });
  
      res.json({
        success: true,
        message: 'Reset passcode thành công',
        data: {
          userId: validUserId,
          newPasscode: trimmedNewPasscode // Trả về để admin gửi cho user
        }
      });
  
    } catch (error) {
      console.error('Reset passcode error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi reset passcode',
        error: error.message
      });
    }
  });
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    supabase: SUPABASE_URL.replace(/https?:\/\//, ''),
    features: {
      position_support: true,
      independent_tables: true,
      user_id_formats: ['number (123)', 'user_number (user_123)'],
      security: {
        rate_limiting: true,
        jwt_auth: true,
        input_validation: true,
        xss_protection: true,
        ownership_check: true
      }
    },
    endpoints: {
      admin: [
        'POST /api/admin/login/simple - Admin login'
      ],
      auth: [
        'POST /api/auth/register - Đăng ký tài khoản (requires admin token)',
        'POST /api/auth/verify-passcode - Xác thực passcode'
      ],
      images: [
        'POST /api/upload - Upload 1 ảnh (với position)',
        'POST /api/upload/multiple - Upload nhiều ảnh (với positions)',
        'GET /api/images/:userId - Lấy tất cả ảnh',
        'GET /api/image/:imageId - Lấy 1 ảnh',
        'DELETE /api/images/:imageId - Xóa ảnh'
      ],
      posts: [
        'GET /api/posts/:userId - Lấy post',
        'POST /api/posts/:userId - Tạo/update post',
        'DELETE /api/posts/:userId - Xóa post'
      ],
      utils: [
        'GET /api/stats/:userId - Thống kê user',
        'GET /health - Health check'
      ]
    }
  });
});

// Error handling
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File quá lớn (>5MB)'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Quá nhiều file (>10)'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    message: 'Lỗi server',
    error: error.message
  });
});

// Sử dụng indexApp cho các route không phải API
app.use((req, res, next) => {
  if (!req.path.startsWith('/api/')) {
    return indexApp(req, res, next);
  }
  next();
});

// Start server
const startServer = (port) => {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`\n🚀 ===== SERVER STARTED =====`);
    console.log(`📡 Port: ${port}`);
    console.log(`🌐 Access: http://localhost:${port}`);
    console.log(`🗄️  Supabase: ${SUPABASE_URL.replace(/https?:\/\//, '')}`);
    console.log(`\n✨ FEATURES:`);
    console.log(`   ✓ Position support for frame mapping`);
    console.log(`   ✓ Independent tables (no foreign keys)`);
    console.log(`   ✓ User ID formats: 123 or user_123_456`);
    console.log(`   ✓ JWT Authentication with passcode`);
    console.log(`   ✓ Rate limiting protection`);
    console.log(`   ✓ Input validation & sanitization`);
    console.log(`   ✓ XSS protection`);
    console.log(`   ✓ Ownership verification`);
    console.log(`   ✓ Audit logging`);
    
    console.log(`\n🔐 ADMIN APIs:`);
    console.log(`   POST   /api/admin/login/simple  # Admin login`);
    
    console.log(`\n🔑 AUTH APIs:`);
    console.log(`   POST   /api/auth/register       # Đăng ký (requires admin token)`);
    console.log(`   POST   /api/auth/verify-passcode # Xác thực passcode`);
    
    console.log(`\n📋 IMAGE APIs (requires user token):`);
    console.log(`   POST   /api/upload              # Upload 1 ảnh + position`);
    console.log(`   POST   /api/upload/multiple     # Upload nhiều ảnh + positions[]`);
    console.log(`   GET    /api/images/:userId      # Tất cả ảnh (sorted by position)`);
    console.log(`   GET    /api/image/:imageId      # 1 ảnh theo ID`);
    console.log(`   DELETE /api/images/:imageId     # Xóa ảnh`);
    
    console.log(`\n📄 POST APIs (requires user token):`);
    console.log(`   GET    /api/posts/:userId       # Lấy post`);
    console.log(`   POST   /api/posts/:userId       # Tạo/update post`);
    console.log(`   DELETE /api/posts/:userId       # Xóa post`);
    
    console.log(`\n🔧 UTILS:`);
    console.log(`   GET    /api/stats/:userId       # Thống kê (requires user token)`);
    console.log(`   GET    /health                  # Health check`);
    
    console.log(`\n💡 Example Usage:`);
    console.log(`   # 1. Admin login`);
    console.log(`   curl -X POST -H "Content-Type: application/json" \\`);
    console.log(`     -d '{"username":"admin","password":"your_password"}' \\`);
    console.log(`     http://localhost:${port}/api/admin/login/simple`);
    
    console.log(`\n   # 2. Register user (with admin token)`);
    console.log(`   curl -X POST -H "Content-Type: application/json" \\`);
    console.log(`     -H "Authorization: Bearer ADMIN_TOKEN" \\`);
    console.log(`     -d '{"email":"user@example.com","full_name":"User","passcode":"1234"}' \\`);
    console.log(`     http://localhost:${port}/api/auth/register`);
    
    console.log(`\n   # 3. Verify passcode (get user token)`);
    console.log(`   curl -X POST -H "Content-Type: application/json" \\`);
    console.log(`     -d '{"userId":"user_123456789_123","passcode":"1234"}' \\`);
    console.log(`     http://localhost:${port}/api/auth/verify-passcode`);
    
    console.log(`\n   # 4. Upload image (with user token)`);
    console.log(`   curl -X POST -H "Authorization: Bearer USER_TOKEN" \\`);
    console.log(`     -F "image=@photo.jpg" -F "userId=user_123456789_123" -F "position=1" \\`);
    console.log(`     http://localhost:${port}/api/upload`);
    
    console.log(`\n=============================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`❌ Port ${port} đang được sử dụng, thử port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('❌ Server error:', err);
    }
  });
};

startServer(PORT);