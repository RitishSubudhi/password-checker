const zxcvbn = require('zxcvbn');

// Common weak passwords list
const COMMON_PASSWORDS = [
  'password', 'password123', '123456', '12345678', 'qwerty',
  'abc123', 'monkey', 'master', 'letmein', 'dragon',
  'iloveyou', 'admin', 'welcome', 'login', 'pass',
  '1234', '12345', '123456789', 'test', 'guest',
];

/**
 * Analyse a password and return detailed strength report
 */
const analysePassword = (password) => {
  const result = zxcvbn(password);

  // Custom rule checks
  const checks = {
    minLength:      password.length >= 8,
    goodLength:     password.length >= 12,
    hasUppercase:   /[A-Z]/.test(password),
    hasLowercase:   /[a-z]/.test(password),
    hasNumbers:     /[0-9]/.test(password),
    hasSymbols:     /[^A-Za-z0-9]/.test(password),
    noSpaces:       !/\s/.test(password),
    notCommon:      !COMMON_PASSWORDS.includes(password.toLowerCase()),
    noRepeating:    !/(.)\1{2,}/.test(password),   // no "aaa" or "111"
    noSequential:   !/(?:012|123|234|345|456|567|678|789|abc|bcd|cde)/i.test(password),
  };

  // Score: 0-4 from zxcvbn
  const score = result.score;

  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColors = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#10b981'];

  // Build suggestions list
  const suggestions = [];
  if (!checks.minLength)    suggestions.push('Use at least 8 characters');
  if (!checks.goodLength)   suggestions.push('Use 12+ characters for better security');
  if (!checks.hasUppercase) suggestions.push('Add uppercase letters (A-Z)');
  if (!checks.hasLowercase) suggestions.push('Add lowercase letters (a-z)');
  if (!checks.hasNumbers)   suggestions.push('Add numbers (0-9)');
  if (!checks.hasSymbols)   suggestions.push('Add symbols (!@#$%^&*)');
  if (!checks.notCommon)    suggestions.push('This is a very common password — change it!');
  if (!checks.noRepeating)  suggestions.push('Avoid repeating characters (aaa, 111)');
  if (!checks.noSequential) suggestions.push('Avoid sequential patterns (123, abc)');
  if (result.feedback.suggestions.length > 0) {
    suggestions.push(...result.feedback.suggestions);
  }

  // Estimated crack time (human readable)
  const crackTime = result.crack_times_display.offline_slow_hashing_1e4_per_second;

  // Entropy estimate
  const entropy = Math.round(result.guesses_log10 * 3.32);

  return {
    score,
    strength: strengthLabels[score],
    color: strengthColors[score],
    crackTime,
    entropy,
    length: password.length,
    checks,
    suggestions: suggestions.slice(0, 5), // max 5 suggestions
    passphraseTip: score < 3
      ? 'Try a passphrase like: "Coffee!Rain#Mountain7" — easier to remember and much stronger'
      : null,
  };
};

// @desc    Check password strength
// @route   POST /api/check
// @access  Public
exports.checkPassword = (req, res) => {
  const { password } = req.body;

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Please provide a password string',
    });
  }

  if (password.length > 128) {
    return res.status(400).json({
      success: false,
      error: 'Password too long (max 128 characters)',
    });
  }

  const analysis = analysePassword(password);

  res.json({ success: true, data: analysis });
};

// @desc    Health check
// @route   GET /api/health
// @access  Public
exports.healthCheck = (req, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
};
