require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// ✅ DÜZƏLDİLMİŞ: CORS konfiqurasiyası - bütün origin-lərə icazə ver
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// OPTIONS preflight sorğularına cavab ver
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

app.use(express.json({ limit: '10mb' }));

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ==================== SAĞLAMLİQ YOXLAMA ====================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'cfce-backend işləyir!' });
});

// ==================== USERS ====================

// Bütün istifadəçiləri al
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('GET /api/users xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ YENİ: Filter ilə istifadəçiləri al (email, role, id ilə)
app.get('/api/users/filter', async (req, res) => {
  try {
    const { email, role, id } = req.query;
    let query = supabase.from('users').select('*');
    
    if (email) query = query.eq('email', email);
    if (role) query = query.eq('role', role);
    if (id) query = query.eq('id', id);
    
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('GET /api/users/filter xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

// Yeni istifadəçi yarat
app.post('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').insert(req.body).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    console.error('POST /api/users xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

// İstifadəçini yenilə
app.put('/api/users/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(req.body)
      .eq('id', req.params.id)
      .select();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('PUT /api/users/:id xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

// İstifadəçini sil
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('users').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/users/:id xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== SCORES ====================

app.get('/api/scores', async (req, res) => {
  try {
    const { user_id, exam_id } = req.query;
    let query = supabase.from('scores').select('*');
    if (user_id) query = query.eq('user_id', user_id);
    if (exam_id) query = query.eq('exam_id', exam_id);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('GET /api/scores xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/scores/filter', async (req, res) => {
  try {
    const { user_id, exam_id } = req.query;
    let query = supabase.from('scores').select('*');
    if (user_id) query = query.eq('user_id', user_id);
    if (exam_id) query = query.eq('exam_id', exam_id);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('GET /api/scores/filter xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scores', async (req, res) => {
  try {
    const { data, error } = await supabase.from('scores').insert(req.body).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    console.error('POST /api/scores xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/scores/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('scores')
      .update(req.body)
      .eq('id', req.params.id)
      .select();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('PUT /api/scores/:id xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/scores/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('scores').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/scores/:id xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== ANSWERS ====================

app.get('/api/answers', async (req, res) => {
  try {
    const { score_id } = req.query;
    let query = supabase.from('answers').select('*');
    if (score_id) query = query.eq('score_id', score_id);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('GET /api/answers xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/answers/filter', async (req, res) => {
  try {
    const { score_id } = req.query;
    let query = supabase.from('answers').select('*');
    if (score_id) query = query.eq('score_id', score_id);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('GET /api/answers/filter xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/answers', async (req, res) => {
  try {
    const body = Array.isArray(req.body) ? req.body : [req.body];
    const { data, error } = await supabase.from('answers').insert(body).select();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('POST /api/answers xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/answers/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('answers')
      .update(req.body)
      .eq('id', req.params.id)
      .select();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('PUT /api/answers/:id xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/answers/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('answers').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/answers/:id xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== EXAM_POINTS ====================

app.get('/api/exam_points', async (req, res) => {
  try {
    const { exam_id, part_id, question_num } = req.query;
    let query = supabase.from('exam_points').select('*');
    if (exam_id) query = query.eq('exam_id', exam_id);
    if (part_id) query = query.eq('part_id', part_id);
    if (question_num) query = query.eq('question_num', question_num);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('GET /api/exam_points xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/exam_points/filter', async (req, res) => {
  try {
    const { exam_id, part_id, question_num } = req.query;
    let query = supabase.from('exam_points').select('*');
    if (exam_id) query = query.eq('exam_id', exam_id);
    if (part_id) query = query.eq('part_id', part_id);
    if (question_num) query = query.eq('question_num', question_num);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('GET /api/exam_points/filter xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/exam_points', async (req, res) => {
  try {
    const body = Array.isArray(req.body) ? req.body : [req.body];
    const { data, error } = await supabase.from('exam_points').insert(body).select();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('POST /api/exam_points xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/exam_points/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('exam_points')
      .update(req.body)
      .eq('id', req.params.id)
      .select();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('PUT /api/exam_points/:id xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/exam_points/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('exam_points').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/exam_points/:id xətası:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== SERVER BAŞLAT ====================
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`🌐 Supabase: ${process.env.SUPABASE_URL}`);
});