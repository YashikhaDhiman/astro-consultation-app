const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Create JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user);

    res.status(201).json({ user: { id: user._id, name, email, role }, token });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.status(200).json({ user: { id: user._id, name: user.name, email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

module.exports = { signup, login };
