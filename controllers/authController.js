const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'your_secret_key',
    { expiresIn: '7d' }
  );
};

const register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ error: 'Username already exists' });

    const user = await User.create({ username, password, role });
    const token = generateToken(user);

    res.status(201).json({ token, user: { username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };
