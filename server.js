require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// ✅ CORS tənzimləmələri - GitHub Pages üçün icazə ver
app.use(cors({
  origin: ['https://goberaazerbaijan.github.io', 'http://localhost:3000', 'http://localhost:5500', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));

// Supabase client (server tərəfində, açarlar gizli)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ==================== HEALTH CHECK ====================
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
    res.status(500).json({ error: err.message });
  }
});

// Filtr ilə istifadəçiləri al
app.get('/api/users/filter', async (req, res) => {
  try {
    const { email, role, id, name } = req.query;
    let query = supabase.from('users').select('*');
    if (email) query = query.eq('email', email);
    if (role) query = query.eq('role', role);
    if (id) query = query.eq('id', id);
    if (name) query = query.eq('name', name);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
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
    res.status(500).json({ error: err.message });
  }
});

// ==================== SCORES ====================

// Bütün nəticələri al
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
    res.status(500).json({ error: err.message });
  }
});

// Filtr ilə nəticələri al
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
    res.status(500).json({ error: err.message });
  }
});

// Yeni nəticə yarat
app.post('/api/scores', async (req, res) => {
  try {
    const { data, error } = await supabase.from('scores').insert(req.body).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Nəticəni yenilə
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
    res.status(500).json({ error: err.message });
  }
});

// Nəticəni sil
app.delete('/api/scores/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('scores').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== ANSWERS ====================

// Cavabları al
app.get('/api/answers', async (req, res) => {
  try {
    const { score_id, part_id, question_num } = req.query;
    let query = supabase.from('answers').select('*');
    if (score_id) query = query.eq('score_id', score_id);
    if (part_id) query = query.eq('part_id', part_id);
    if (question_num) query = query.eq('question_num', question_num);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Filtr ilə cavabları al
app.get('/api/answers/filter', async (req, res) => {
  try {
    const { score_id, part_id, question_num } = req.query;
    let query = supabase.from('answers').select('*');
    if (score_id) query = query.eq('score_id', score_id);
    if (part_id) query = query.eq('part_id', part_id);
    if (question_num) query = query.eq('question_num', question_num);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DÜZƏLDİLMİŞ: Cavabları əlavə et (çoxlu) - user_image və needs_marker_review ilə
app.post('/api/answers', async (req, res) => {
  try {
    const body = Array.isArray(req.body) ? req.body : [req.body];
    
    // Sütunları təmizlə - yalnız mövcud sütunları saxla
    const cleanBody = body.map(a => {
      const clean = {
        score_id: a.score_id,
        part_id: a.part_id,
        question_num: a.question_num,
        user_answer: a.user_answer || null,
        correct_answer: a.correct_answer || null,
        is_correct: a.is_correct || false,
        points: a.points || 0,
        max_points: a.max_points || 1
      };
      // user_image varsa əlavə et
      if (a.user_image) clean.user_image = a.user_image;
      // needs_marker_review varsa əlavə et
      if (a.needs_marker_review !== undefined) clean.needs_marker_review = a.needs_marker_review;
      return clean;
    });
    
    console.log('📝 Answers yazılır:', cleanBody.length, 'sual');
    const { data, error } = await supabase.from('answers').insert(cleanBody).select();
    if (error) {
      console.error('❌ Supabase xətası:', error);
      throw error;
    }
    console.log('✅ Answers yazıldı:', data.length);
    res.json(data);
  } catch (err) {
    console.error('❌ POST /api/answers xətası:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Cavabı yenilə
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
    res.status(500).json({ error: err.message });
  }
});

// Cavabı sil
app.delete('/api/answers/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('answers').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== EXAM_POINTS ====================

// Balları al
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
    res.status(500).json({ error: err.message });
  }
});

// Filtr ilə balları al
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
    res.status(500).json({ error: err.message });
  }
});

// Balları əlavə et (çoxlu)
app.post('/api/exam_points', async (req, res) => {
  try {
    const body = Array.isArray(req.body) ? req.body : [req.body];
    const { data, error } = await supabase.from('exam_points').insert(body).select();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Balı yenilə
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
    res.status(500).json({ error: err.message });
  }
});

// Balı sil
app.delete('/api/exam_points/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('exam_points').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== SERVER BAŞLAT ====================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Supabase: ${process.env.SUPABASE_URL}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});