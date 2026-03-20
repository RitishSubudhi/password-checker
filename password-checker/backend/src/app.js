const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const passwordRoutes = require('./routes/passwordRoutes');

const app = express();

// ── Security headers ─────────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST'],
}));

// ── Body parser ──────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // reject huge payloads

// ── Rate limiting ────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window
  message: { success: false, error: 'Too many requests. Please try again later.' },
});
app.use(limiter);

// ── Routes ───────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🔐 Password Checker API',
    version: '1.0.0',
    endpoints: {
      check: 'POST /api/check',
      health: 'GET /api/health',
    },
  });
});

app.use('/api', passwordRoutes);

// ── 404 handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

module.exports = app;
