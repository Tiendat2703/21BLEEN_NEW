// // server.js - API để upload ảnh lên Supabase với User ID support
// const express = require('express');
// const multer = require('multer');
// const { createClient } = require('@supabase/supabase-js');
// const cors = require('cors');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 3001; // Đổi default port

// // Supabase configuration
// const SUPABASE_URL = 'https://rxjwcncdubqkoqgcpqjo.supabase.co';
// const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4andjbmNkdWJxa29xZ2NwcWpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQ1MDgyMSwiZXhwIjoyMDc0MDI2ODIxfQ.xWuKtB69wWRfcmMpoTSFXAd-l7XUugzuooyQkRzzQfY'

// // Initialize Supabase with service role key (có full permission)
// const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Static image serving route (before other routes)
// app.get('/images/:userId/:filename', async (req, res) => {
//   try {
//     const { userId, filename } = req.params;
    
//     // Get image info from database
//     const { data, error } = await supabase
//       .from('user_photos')
//       .select('file_url, file_type, file_size')
//       .eq('user_id', userId)
//       .like('file_path', `%${filename}%`)
//       .single();

//     if (error || !data) {
//       return res.status(404).send('Image not found');
//     }

//     // Fetch and serve image
//     const response = await fetch(data.file_url);
//     if (!response.ok) {
//       return res.status(404).send('Image not accessible');
//     }

//     const imageBuffer = await response.arrayBuffer();
    
//     res.set({
//       'Content-Type': data.file_type || 'image/jpeg',
//       'Content-Length': data.file_size || imageBuffer.byteLength,
//       'Cache-Control': 'public, max-age=86400' // 24h cache
//     });
    
//     res.send(Buffer.from(imageBuffer));

//   } catch (error) {
//     console.error('Static image serving error:', error);
//     res.status(500).send('Internal server error');
//   }
// });

// // Multer configuration cho file upload
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//     files: 10 // max 10 files per request
//   },
//   fileFilter: (req, file, cb) => {
//     // Chỉ accept image files
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Chỉ chấp nhận file ảnh!'), false);
//     }
//   }
// });

// // Helper function to generate unique filename
// function generateFileName(originalName) {
//   const timestamp = Date.now();
//   const random = Math.random().toString(36).substring(2, 15);
//   const ext = path.extname(originalName);
//   return `${timestamp}_${random}${ext}`;
// }

// // Helper function to validate User ID
// function validateUserId(userId) {
//   if (!userId) {
//     throw new Error('userId là bắt buộc');
//   }
  
//   const userIdStr = userId.toString().trim();
  
//   // Accept pure numbers (123, 1001)
//   if (/^\d+$/.test(userIdStr)) {
//     const userIdNum = parseInt(userIdStr);
//     if (userIdNum <= 0) {
//       throw new Error('userId phải là số nguyên dương');
//     }
//     return userIdStr;
//   }
  
//   // Accept prefixed format (user_123, usr123)
//   if (/^(user_|usr)\d+$/i.test(userIdStr)) {
//     return userIdStr.toLowerCase();
//   }
  
//   throw new Error('userId phải là số (vd: 123) hoặc user_số (vd: user_123)');
// }

// // API Routes

// // 1. Upload single image
// app.post('/api/upload', upload.single('image'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: 'Không có file được upload'
//       });
//     }

//     // Validate User ID
//     const userId = validateUserId(req.body.userId);
//     const fileName = generateFileName(req.file.originalname);
//     const filePath = `users/${userId}/images/${fileName}`;

//     console.log(`📤 Uploading for user ID: ${userId}`);

//     // Upload to Supabase Storage
//     const { data: uploadData, error: uploadError } = await supabase.storage
//       .from('user-photos')
//       .upload(filePath, req.file.buffer, {
//         contentType: req.file.mimetype,
//         cacheControl: '3600'
//       });

//     if (uploadError) {
//       throw new Error(`Upload failed: ${uploadError.message}`);
//     }

//     // Get public URL
//     const { data: urlData } = supabase.storage
//       .from('user-photos')
//       .getPublicUrl(filePath);

//     // Save metadata to database
//     const metadata = {
//       user_id: userId, // String format: "123" or "user_123"
//       file_name: req.file.originalname,
//       file_path: filePath,
//       file_url: urlData.publicUrl,
//       file_size: req.file.size,
//       file_type: req.file.mimetype
//     };

//     console.log('💾 Saving metadata:', JSON.stringify(metadata, null, 2));

//     // Insert to user_photos table
//     const { data: dbData, error: dbError } = await supabase
//       .from('user_photos')
//       .insert([metadata])
//       .select()
//       .single();

//     if (dbError) {
//       console.error('❌ Database save failed:', JSON.stringify(dbError, null, 2));
//       console.error('❌ Metadata being saved:', JSON.stringify(metadata, null, 2));
//       console.error('❌ Full error details:', dbError);
//       // Vẫn return success vì file đã upload thành công
//     } else {
//       console.log('✅ Database save success for user:', userId);
//       console.log('✅ Saved record ID:', dbData?.id);
//     }

//     res.json({
//       success: true,
//       message: 'Upload thành công',
//       data: {
//         id: dbData?.id,
//         userId: userId,
//         url: urlData.publicUrl,
//         path: filePath,
//         size: req.file.size,
//         type: req.file.mimetype,
//         originalName: req.file.originalname
//       }
//     });

//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message.includes('userId') ? error.message : 'Upload thất bại',
//       error: error.message
//     });
//   }
// });

// // 2. Upload multiple images
// app.post('/api/upload/multiple', upload.array('images', 10), async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Không có file được upload'
//       });
//     }

//     const userId = validateUserId(req.body.userId);
//     const results = [];
//     const errors = [];

//     console.log(`📤 Multiple upload for user ID: ${userId}, ${req.files.length} files`);

//     for (const file of req.files) {
//       try {
//         const fileName = generateFileName(file.originalname);
//         const filePath = `users/${userId}/images/${fileName}`;

//         // Upload to Supabase Storage
//         const { data: uploadData, error: uploadError } = await supabase.storage
//           .from('user-photos')
//           .upload(filePath, file.buffer, {
//             contentType: file.mimetype,
//             cacheControl: '3600'
//           });

//         if (uploadError) throw uploadError;

//         // Get public URL
//         const { data: urlData } = supabase.storage
//           .from('user-photos')
//           .getPublicUrl(filePath);

//         // Save to database
//         const metadata = {
//           user_id: userId,
//           file_name: file.originalname,
//           file_path: filePath,
//           file_url: urlData.publicUrl,
//           file_size: file.size,
//           file_type: file.mimetype
//         };

//         const { data: dbData } = await supabase
//           .from('user_photos')
//           .insert([metadata])
//           .select()
//           .single();

//         results.push({
//           success: true,
//           fileName: file.originalname,
//           url: urlData.publicUrl,
//           size: file.size,
//           id: dbData?.id
//         });

//       } catch (error) {
//         errors.push({
//           fileName: file.originalname,
//           error: error.message
//         });
//       }
//     }

//     res.json({
//       success: errors.length === 0,
//       message: `Upload hoàn tất: ${results.length} thành công, ${errors.length} thất bại`,
//       data: {
//         userId: userId,
//         successful: results,
//         failed: errors,
//         total: req.files.length
//       }
//     });

//   } catch (error) {
//     console.error('Multiple upload error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message.includes('userId') ? error.message : 'Upload thất bại',
//       error: error.message
//     });
//   }
// });

// // 3. Upload from URL
// app.post('/api/upload/from-url', async (req, res) => {
//   try {
//     const { imageUrl, fileName } = req.body;

//     if (!imageUrl) {
//       return res.status(400).json({
//         success: false,
//         message: 'imageUrl là required'
//       });
//     }

//     const userId = validateUserId(req.body.userId);

//     console.log(`📤 URL upload for user ID: ${userId}`);

//     // Fetch image from URL
//     const response = await fetch(imageUrl);
//     if (!response.ok) {
//       throw new Error('Không thể tải ảnh từ URL');
//     }

//     const arrayBuffer = await response.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // Get content type
//     const contentType = response.headers.get('content-type') || 'image/jpeg';
    
//     if (!contentType.startsWith('image/')) {
//       throw new Error('URL không phải là ảnh');
//     }

//     // Generate filename
//     const generatedFileName = fileName || generateFileName('image.jpg');
//     const filePath = `users/${userId}/images/${generatedFileName}`;

//     // Upload to Supabase
//     const { data: uploadData, error: uploadError } = await supabase.storage
//       .from('user-photos')
//       .upload(filePath, buffer, {
//         contentType,
//         cacheControl: '3600'
//       });

//     if (uploadError) throw uploadError;

//     // Get public URL
//     const { data: urlData } = supabase.storage
//       .from('user-photos')
//       .getPublicUrl(filePath);

//     // Save to database
//     const metadata = {
//       user_id: userId,
//       file_name: generatedFileName,
//       file_path: filePath,
//       file_url: urlData.publicUrl,
//       file_size: buffer.length,
//       file_type: contentType
//     };

//     const { data: dbData } = await supabase
//       .from('user_photos')
//       .insert([metadata])
//       .select()
//       .single();

//     res.json({
//       success: true,
//       message: 'Upload từ URL thành công',
//       data: {
//         id: dbData?.id,
//         userId: userId,
//         url: urlData.publicUrl,
//         path: filePath,
//         size: buffer.length,
//         originalUrl: imageUrl
//       }
//     });

//   } catch (error) {
//     console.error('URL upload error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message.includes('userId') ? error.message : 'Upload từ URL thất bại',
//       error: error.message
//     });
//   }
// });

// // 4. Get user images
// app.get('/api/images/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { limit = 50, offset = 0 } = req.query;

//     console.log(`🔍 Getting images for user ID: ${userId}`);

//     const { data, error } = await supabase
//       .from('user_photos')
//       .select('*')
//       .eq('user_id', userId)
//       .order('created_at', { ascending: false })
//       .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

//     if (error) throw error;

//     console.log(`📊 Found ${data?.length || 0} images for user ${userId}`);

//     res.json({
//       success: true,
//       data: data || [],
//       total: data?.length || 0,
//       userId: userId
//     });

//   } catch (error) {
//     console.error('Get images error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Không thể lấy danh sách ảnh',
//       error: error.message
//     });
//   }
// });

// // 4a. Get single image by ID
// app.get('/api/image/:imageId', async (req, res) => {
//   try {
//     const { imageId } = req.params;

//     console.log(`🔍 Getting image ID: ${imageId}`);

//     const { data, error } = await supabase
//       .from('user_photos')
//       .select('*')
//       .eq('id', imageId)
//       .single();

//     if (error || !data) {
//       return res.status(404).json({
//         success: false,
//         message: 'Ảnh không tìm thấy'
//       });
//     }

//     res.json({
//       success: true,
//       data: data
//     });

//   } catch (error) {
//     console.error('Get image error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Không thể lấy ảnh',
//       error: error.message
//     });
//   }
// });

// // 4b. Get latest image of user
// app.get('/api/images/:userId/latest', async (req, res) => {
//   try {
//     const { userId } = req.params;

//     console.log(`🔍 Getting latest image for user: ${userId}`);

//     const { data, error } = await supabase
//       .from('user_photos')
//       .select('*')
//       .eq('user_id', userId)
//       .order('created_at', { ascending: false })
//       .limit(1)
//       .single();

//     if (error || !data) {
//       return res.status(404).json({
//         success: false,
//         message: 'Không tìm thấy ảnh nào'
//       });
//     }

//     res.json({
//       success: true,
//       data: data
//     });

//   } catch (error) {
//     console.error('Get latest image error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Không thể lấy ảnh mới nhất',
//       error: error.message
//     });
//   }
// });

// // 4e. Get image by userId and filename
// app.get('/api/images/:userId/:filename', async (req, res) => {
//   try {
//     const { userId, filename } = req.params;

//     console.log(`🔍 Getting image: ${filename} for user: ${userId}`);

//     // Method 1: Query database
//     const { data, error } = await supabase
//       .from('user_photos')
//       .select('*')
//       .eq('user_id', userId)
//       .like('file_path', `%${filename}%`)
//       .single();

//     if (error || !data) {
//       return res.status(404).json({
//         success: false,
//         message: 'Ảnh không tìm thấy'
//       });
//     }

//     // Method 2: Return image URL or redirect to actual image
//     if (req.query.redirect === 'true') {
//       // Redirect directly to image URL
//       return res.redirect(data.file_url);
//     }

//     // Method 3: Serve image directly (stream from Supabase)
//     if (req.query.direct === 'true') {
//       try {
//         const response = await fetch(data.file_url);
//         if (!response.ok) throw new Error('Failed to fetch image');
        
//         const imageBuffer = await response.arrayBuffer();
        
//         res.set({
//           'Content-Type': data.file_type || 'image/jpeg',
//           'Content-Length': data.file_size || imageBuffer.byteLength,
//           'Cache-Control': 'public, max-age=31536000' // 1 year cache
//         });
        
//         return res.send(Buffer.from(imageBuffer));
//       } catch (fetchError) {
//         console.error('Error serving image directly:', fetchError);
//         return res.status(500).json({
//           success: false,
//           message: 'Không thể tải ảnh'
//         });
//       }
//     }

//     // Default: Return image metadata
//     res.json({
//       success: true,
//       data: data
//     });

//   } catch (error) {
//     console.error('Get image by filename error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Không thể lấy ảnh',
//       error: error.message
//     });
//   }
// });
// app.get('/api/images/:userId/search', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { filename, type } = req.query;

//     console.log(`🔍 Searching images for user: ${userId}, filename: ${filename}, type: ${type}`);

//     let query = supabase
//       .from('user_photos')
//       .select('*')
//       .eq('user_id', userId);

//     if (filename) {
//       query = query.ilike('file_name', `%${filename}%`);
//     }

//     if (type) {
//       query = query.eq('file_type', type);
//     }

//     const { data, error } = await supabase
//       .from('user_photos')
//       .select('*')
//       .eq('user_id', userId)
//       .order('created_at', { ascending: false });

//     if (error) throw error;

//     res.json({
//       success: true,
//       data: data || [],
//       total: data?.length || 0,
//       filters: { filename, type }
//     });

//   } catch (error) {
//     console.error('Search images error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Không thể tìm kiếm ảnh',
//       error: error.message
//     });
//   }
// });

// // 5. Delete image
// app.delete('/api/images/:imageId', async (req, res) => {
//   try {
//     const { imageId } = req.params;
//     const { userId } = req.body;

//     // Get image info
//     const { data: image, error: fetchError } = await supabase
//       .from('user_photos')
//       .select('*')
//       .eq('id', imageId)
//       .single();

//     if (fetchError || !image) {
//       return res.status(404).json({
//         success: false,
//         message: 'Ảnh không tồn tại'
//       });
//     }

//     // Check ownership if userId provided
//     if (userId && image.user_id !== userId) {
//       return res.status(403).json({
//         success: false,
//         message: 'Không có quyền xóa ảnh này'
//       });
//     }

//     console.log(`🗑️ Deleting image ${imageId} for user ${image.user_id}`);

//     // Delete from storage
//     const { error: storageError } = await supabase.storage
//       .from('user-photos')
//       .remove([image.file_path]);

//     if (storageError) throw storageError;

//     // Delete from database
//     const { error: dbError } = await supabase
//       .from('user_photos')
//       .delete()
//       .eq('id', imageId);

//     if (dbError) throw dbError;

//     res.json({
//       success: true,
//       message: 'Đã xóa ảnh thành công',
//       deletedImage: {
//         id: imageId,
//         userId: image.user_id,
//         fileName: image.file_name
//       }
//     });

//   } catch (error) {
//     console.error('Delete error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Xóa ảnh thất bại',
//       error: error.message
//     });
//   }
// });

// // 6. Get user stats
// app.get('/api/stats/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;

//     console.log(`📊 Getting stats for user ID: ${userId}`);

//     // Get total images and total size
//     const { data, error } = await supabase
//       .from('user_photos')
//       .select('file_size')
//       .eq('user_id', userId);

//     if (error) throw error;

//     const totalImages = data?.length || 0;
//     const totalSize = data?.reduce((sum, img) => sum + (img.file_size || 0), 0) || 0;
    
//     // Convert bytes to MB
//     const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

//     res.json({
//       success: true,
//       data: {
//         userId: userId,
//         totalImages: totalImages,
//         totalSize: totalSize,
//         totalSizeMB: totalSizeMB,
//         averageSizeMB: totalImages > 0 ? (totalSize / totalImages / (1024 * 1024)).toFixed(2) : 0
//       }
//     });

//   } catch (error) {
//     console.error('Stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Không thể lấy thống kê',
//       error: error.message
//     });
//   }
// });

// // 7. Health check
// app.get('/health', (req, res) => {
//   res.json({
//     status: 'OK',
//     timestamp: new Date().toISOString(),
//     supabase: SUPABASE_URL.replace(/https?:\/\//, ''),
//     user_id_support: true,
//     uuid_support: false,
//     supported_formats: ['number (123)', 'user_number (user_123)'],
//     endpoints: [
//       'POST /api/upload - Upload single image (requires userId)',
//       'POST /api/upload/multiple - Upload multiple images', 
//       'POST /api/upload/from-url - Upload from URL',
//       'GET /api/images/:userId - Get user images',
//       'GET /api/stats/:userId - Get user statistics',
//       'DELETE /api/images/:imageId - Delete image'
//     ]
//   });
// });
// //8. Get image with image id
// app.get('/api/image/:imageId', async (req, res) => {
//     try {
//       const { imageId } = req.params;
      
//       const { data, error } = await supabase
//         .from('user_photos')
//         .select('*')
//         .eq('id', imageId)
//         .single();
  
//       if (error || !data) {
//         return res.status(404).json({
//           success: false,
//           message: 'Ảnh không tìm thấy'
//         });
//       }
  
//       res.json({
//         success: true,
//         data: data
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//   });
// // Error handling middleware
// app.use((error, req, res, next) => {
//   if (error instanceof multer.MulterError) {
//     if (error.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({
//         success: false,
//         message: 'File quá lớn (>5MB)'
//       });
//     }
//     if (error.code === 'LIMIT_FILE_COUNT') {
//       return res.status(400).json({
//         success: false,
//         message: 'Quá nhiều file (>10)'
//       });
//     }
//   }
  
//   res.status(500).json({
//     success: false,
//     message: 'Lỗi server',
//     error: error.message
//   });
// });

// // Start server with port detection
// // 8. Status Management Endpoints

// app.get('', async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!validateUserId(userId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'ID người dùng không hợp lệ'
//       });
//     }

//     // Lấy post của user (chỉ có 1)
//     const { data, error } = await supabase
//       .from('posts')
//       .select('id, content, created_at, updated_at')
//       .eq('user_id', userId)
//       .maybeSingle();

//     if (error) throw error;

//     res.json({
//       success: true,
//       data: {
//         userId,
//         postId: data?.id || null,
//         content: data?.content || null,
//         createdAt: data?.created_at || null,
//         updatedAt: data?.updated_at || null
//       }
//     });

//   } catch (error) {
//     console.error('Get post error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Không thể lấy thông tin post',
//       error: error.message
//     });
//   }
// });

// // POST: Tạo mới hoặc cập nhật post (UPSERT)
// app.post('/api/v2/status/:userId', express.json(), async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { content = '' } = req.body;

//     // Validate user ID
//     if (!validateUserId(userId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'ID người dùng không hợp lệ'
//       });
//     }

//     // Validate content
//     if (!content || content.trim().length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Nội dung post không được để trống'
//       });
//     }

//     if (content.length > 5000) {
//       return res.status(400).json({
//         success: false,
//         message: 'Nội dung post quá dài (tối đa 5000 ký tự)'
//       });
//     }

//     // Kiểm tra xem user đã có post chưa
//     const { data: existingPost, error: checkError } = await supabase
//       .from('posts')
//       .select('id')
//       .eq('user_id', userId)
//       .maybeSingle();

//     if (checkError) throw checkError;

//     let result;
//     let isUpdate = false;

//     if (existingPost) {
//       // Update post hiện có
//       const { data: updatedPost, error: updateError } = await supabase
//         .from('posts')
//         .update({ 
//           content: content.trim(),
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', existingPost.id)
//         .select()
//         .single();
      
//       if (updateError) throw updateError;
//       result = updatedPost;
//       isUpdate = true;
//     } else {
//       // Tạo post mới
//       const { data: newPost, error: createError } = await supabase
//         .from('posts')
//         .insert([
//           { 
//             user_id: userId,
//             content: content.trim(),
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString()
//           }
//         ])
//         .select()
//         .single();
      
//       if (createError) throw createError;
//       result = newPost;
//       isUpdate = false;
//     }

//     res.status(isUpdate ? 200 : 201).json({
//       success: true,
//       message: isUpdate ? 'Cập nhật post thành công' : 'Tạo post thành công',
//       data: {
//         postId: result.id,
//         userId: result.user_id,
//         content: result.content,
//         createdAt: result.created_at,
//         updatedAt: result.updated_at,
//         isUpdate
//       }
//     });

//   } catch (error) {
//     console.error('Create/Update post error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Lỗi khi xử lý post',
//       error: error.message
//     });
//   }
// });

// // DELETE: Xóa post (nếu cần)
// app.delete('/api/v2/status/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!validateUserId(userId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'ID người dùng không hợp lệ'
//       });
//     }

//     const { error } = await supabase
//       .from('posts')
//       .delete()
//       .eq('user_id', userId);

//     if (error) throw error;

//     res.json({
//       success: true,
//       message: 'Xóa post thành công'
//     });

//   } catch (error) {
//     console.error('Delete post error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Lỗi khi xóa post',
//       error: error.message
//     });
//   }
// });

// // Start server with port detection
// const startServer = (port) => {
//     const server = app.listen(port, () => {
//       console.log(`🚀 API Server running on port ${port}`);
//       console.log(`📡 Supabase URL: ${SUPABASE_URL.replace(/https?:\/\//, '')}`);
//       console.log(`🔑 User ID support enabled (No UUID)`);
//       console.log(`📋 Supported User ID formats: số (123) hoặc user_số (user_123)`);
//       console.log(`\n📋 FULL API Endpoints:`);
//       console.log(`\n📤 Upload Endpoints:`);
//       console.log(`  POST  /api/upload           # Upload 1 ảnh`);
//       console.log(`  POST  /api/upload/multiple  # Upload nhiều ảnh (max 10)`);
//       console.log(`  POST  /api/upload/from-url  # Upload từ URL`);
      
//       console.log(`\n🔍 Get Images Endpoints:`);
//       console.log(`  GET   /api/images/:userId           # Tất cả ảnh user`);
//       console.log(`  GET   /api/images/:userId/latest     # Ảnh mới nhất`);
//       console.log(`  GET   /api/images/:userId/random     # Ảnh ngẫu nhiên`);
//       console.log(`  GET   /api/images/:userId/:filename  # Tìm theo tên file`);
//       console.log(`  GET   /api/images/:userId/search    # Tìm kiếm nâng cao`);
//       console.log(`  GET   /api/image/:imageId           # 1 ảnh theo ID`);
      
//       console.log(`\n📊 Stats & Utils:`);
//       console.log(`  GET   /api/stats/:userId  # Thống kê user`);
//       console.log(`  GET   /images/:userId/:filename  # Serve ảnh trực tiếp`);
//       console.log(`  DELETE /api/images/:imageId  # Xóa ảnh`);
//       console.log(`  GET   /health         # Health check`);
      
//       console.log(`\n💡 Example URLs:`);
//       console.log(`  POST  http://localhost:${port}/api/upload?userId=123`);
//       console.log(`  GET   http://localhost:${port}/api/images/123`);
//       console.log(`  GET   http://localhost:${port}/images/123/photo.jpg`);
//     });
  
//     server.on('error', (err) => {
//       if (err.code === 'EADDRINUSE') {
//         console.log(`❌ Port ${port} is in use, trying port ${port + 1}...`);
//         startServer(port + 1);
//       } else {
//         console.error('❌ Server error:', err);
//       }
//     });
//   };
  
//   startServer(PORT);
//----------------------------------------------------------------------------
// server.js - API mới với Position support cho frontend frames
const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase configuration
const SUPABASE_URL = 'https://rxjwcncdubqkoqgcpqjo.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4andjbmNkdWJxa29xZ2NwcWpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQ1MDgyMSwiZXhwIjoyMDc0MDI2ODIxfQ.xWuKtB69wWRfcmMpoTSFXAd-l7XUugzuooyQkRzzQfY';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
  }
});

// Helper functions
function generateFileName(originalName) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(originalName);
  return `${timestamp}_${random}${ext}`;
}

function validateUserId(userId) {
  if (!userId) {
    throw new Error('userId là bắt buộc');
  }
  
  const userIdStr = userId.toString().trim();
  
  if (/^\d+$/.test(userIdStr)) {
    const userIdNum = parseInt(userIdStr);
    if (userIdNum <= 0) {
      throw new Error('userId phải là số nguyên dương');
    }
    return userIdStr;
  }
  
  if (/^(user_|usr)\d+$/i.test(userIdStr)) {
    return userIdStr.toLowerCase();
  }
  
  throw new Error('userId phải là số (vd: 123) hoặc user_số (vd: user_123)');
}

// =============================================================================
// IMAGE ENDPOINTS (với Position support)
// =============================================================================

// 1. Upload single image với position
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được upload'
      });
    }

    const userId = validateUserId(req.body.userId);
    const position = req.body.position ? parseInt(req.body.position) : null;
    
    const fileName = generateFileName(req.file.originalname);
    const filePath = `users/${userId}/images/${fileName}`;

    console.log(`📤 Uploading for user: ${userId}, position: ${position}`);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-photos')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600'
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('user-photos')
      .getPublicUrl(filePath);

    // Save metadata to database (với position)
    const metadata = {
      user_id: userId,
      file_name: req.file.originalname,
      file_path: filePath,
      file_url: urlData.publicUrl,
      file_size: req.file.size,
      file_type: req.file.mimetype,
      position: position // Thêm position để mapping với frame
    };

    const { data: dbData, error: dbError } = await supabase
      .from('user_photos')
      .insert([metadata])
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database save failed:', dbError);
    } else {
      console.log('✅ Image saved with position:', position);
    }

    res.json({
      success: true,
      message: 'Upload thành công',
      data: {
        id: dbData?.id,
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
      message: error.message.includes('userId') ? error.message : 'Upload thất bại',
      error: error.message
    });
  }
});

// 2. Upload multiple images với position cho từng ảnh
app.post('/api/upload/multiple', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được upload'
      });
    }

    const userId = validateUserId(req.body.userId);
    
    // Parse positions array từ request
    // Format: positions=[1,2,3] hoặc positions=1,2,3
    let positions = [];
    if (req.body.positions) {
      try {
        positions = JSON.parse(req.body.positions);
      } catch {
        positions = req.body.positions.split(',').map(p => parseInt(p.trim()));
      }
    }

    const results = [];
    const errors = [];

    console.log(`📤 Multiple upload: ${req.files.length} files, positions:`, positions);

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const position = positions[i] !== undefined ? positions[i] : null;

      try {
        const fileName = generateFileName(file.originalname);
        const filePath = `users/${userId}/images/${fileName}`;

        // Upload to Storage
        const { error: uploadError } = await supabase.storage
          .from('user-photos')
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            cacheControl: '3600'
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('user-photos')
          .getPublicUrl(filePath);

        // Save to database
        const metadata = {
          user_id: userId,
          file_name: file.originalname,
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
      message: error.message.includes('userId') ? error.message : 'Upload thất bại',
      error: error.message
    });
  }
});

// 3. Get all images của user (có position, sorted by position)
app.get('/api/images/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0, sortBy = 'position' } = req.query;

    console.log(`🔍 Getting images for user: ${userId}`);

    let query = supabase
      .from('user_photos')
      .select('*')
      .eq('user_id', userId);

    // Sorting: position (ascending) hoặc created_at (descending)
    if (sortBy === 'position') {
      query = query.order('position', { ascending: true, nullsFirst: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data, error } = await query;

    if (error) throw error;

    console.log(`📊 Found ${data?.length || 0} images`);

    res.json({
      success: true,
      data: data || [],
      total: data?.length || 0,
      userId: userId,
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

// 4. Get single image by ID
app.get('/api/image/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;

    console.log(`🔍 Getting image ID: ${imageId}`);

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

// 5. Delete image
app.delete('/api/images/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    const { userId } = req.body;

    // Get image info
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

    // Check ownership if userId provided
    if (userId && image.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa ảnh này'
      });
    }

    console.log(`🗑️ Deleting image ${imageId}, position: ${image.position}`);

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('user-photos')
      .remove([image.file_path]);

    if (storageError) {
      console.warn('⚠️ Storage delete warning:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('user_photos')
      .delete()
      .eq('id', imageId);

    if (dbError) throw dbError;

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
// POST ENDPOINTS (không liên kết với images)
// =============================================================================

// 6. Get post của user
app.get('/api/posts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const validUserId = validateUserId(userId);

    console.log(`📄 Getting post for user: ${validUserId}`);

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

// 7. Create/Update post (UPSERT)
app.post('/api/posts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { content = '', type = 'text' } = req.body;

    const validUserId = validateUserId(userId);

    if (!content || content.trim().length === 0) {
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

    console.log(`📝 Saving post for user: ${validUserId}`);

    // Check if post exists
    const { data: existingPost } = await supabase
      .from('posts')
      .select('id')
      .eq('user_id', validUserId)
      .maybeSingle();

    let result;
    let isUpdate = false;

    if (existingPost) {
      // Update existing post
      const { data: updatedPost, error: updateError } = await supabase
        .from('posts')
        .update({ 
          content: content.trim(),
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
      // Create new post
      const { data: newPost, error: createError } = await supabase
        .from('posts')
        .insert([{
          user_id: validUserId,
          content: content.trim(),
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

// 8. Delete post
app.delete('/api/posts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const validUserId = validateUserId(userId);

    console.log(`🗑️ Deleting post for user: ${validUserId}`);

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('user_id', validUserId);

    if (error) throw error;

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

// 9. Get user statistics
app.get('/api/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const validUserId = validateUserId(userId);

    console.log(`📊 Getting stats for user: ${validUserId}`);

    // Get image stats
    const { data: images } = await supabase
      .from('user_photos')
      .select('file_size, position')
      .eq('user_id', validUserId);

    // Get post stats
    const { data: posts } = await supabase
      .from('posts')
      .select('id, content')
      .eq('user_id', validUserId);

    const totalImages = images?.length || 0;
    const totalSize = images?.reduce((sum, img) => sum + (img.file_size || 0), 0) || 0;
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    const hasPost = posts && posts.length > 0;
    const positionsMapped = images?.filter(img => img.position !== null).length || 0;

    res.json({
      success: true,
      data: {
        userId: validUserId,
        images: {
          total: totalImages,
          totalSize: totalSize,
          totalSizeMB: totalSizeMB,
          withPosition: positionsMapped,
          withoutPosition: totalImages - positionsMapped
        },
        posts: {
          hasPost: hasPost,
          postCount: posts?.length || 0
        }
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thống kê',
      error: error.message
    });
  }
});

// 10. Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    supabase: SUPABASE_URL.replace(/https?:\/\//, ''),
    features: {
      position_support: true,
      independent_tables: true,
      user_id_formats: ['number (123)', 'user_number (user_123)']
    },
    endpoints: {
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

// Start server
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`\n🚀 ===== SERVER STARTED =====`);
    console.log(`📡 Port: ${port}`);
    console.log(`🗄️  Supabase: ${SUPABASE_URL.replace(/https?:\/\//, '')}`);
    console.log(`\n✨ NEW FEATURES:`);
    console.log(`   ✓ Position support for frame mapping`);
    console.log(`   ✓ Independent tables (no foreign keys)`);
    console.log(`   ✓ User ID formats: 123 or user_123`);
    
    console.log(`\n📋 IMAGE APIs (với Position):`);
    console.log(`   POST   /api/upload              # Upload 1 ảnh + position`);
    console.log(`   POST   /api/upload/multiple     # Upload nhiều ảnh + positions[]`);
    console.log(`   GET    /api/images/:userId      # Tất cả ảnh (sorted by position)`);
    console.log(`   GET    /api/image/:imageId      # 1 ảnh theo ID`);
    console.log(`   DELETE /api/images/:imageId     # Xóa ảnh`);
    
    console.log(`\n📄 POST APIs (độc lập):`);
    console.log(`   GET    /api/posts/:userId       # Lấy post`);
    console.log(`   POST   /api/posts/:userId       # Tạo/update post`);
    console.log(`   DELETE /api/posts/:userId       # Xóa post`);
    
    console.log(`\n🔧 UTILS:`);
    console.log(`   GET    /api/stats/:userId       # Thống kê`);
    console.log(`   GET    /health                  # Health check`);
    
    console.log(`\n💡 Example Usage:`);
    console.log(`   # Upload with position`);
    console.log(`   curl -F "image=@photo.jpg" -F "userId=123" -F "position=1" http://localhost:${port}/api/upload`);
    console.log(`\n   # Upload multiple with positions`);
    console.log(`   curl -F "images=@p1.jpg" -F "images=@p2.jpg" -F "userId=123" -F "positions=[1,2]" http://localhost:${port}/api/upload/multiple`);
    console.log(`\n   # Get images sorted by position`);
    console.log(`   curl http://localhost:${port}/api/images/123?sortBy=position`);
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