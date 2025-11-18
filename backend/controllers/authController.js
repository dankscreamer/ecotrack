const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

const TOKEN_EXPIRY = process.env.JWT_EXPIRY || '1h';

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

const sanitizeUser = ({ id, name, email, createdAt, updatedAt }) => ({
  id,
  name,
  email,
  createdAt,
  updatedAt,
});

const getMissingFields = (body, fields) =>
  fields.filter((field) => !body[field]);

exports.signup = async (req, res, next) => {
  try {
    const requiredFields = ['name', 'email', 'password'];
    const missingFields = getMissingFields(req.body, requiredFields);

    if (missingFields.length) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const token = generateToken({ id: newUser.id, email: newUser.email });

    return res.status(201).json({
      message: 'User created successfully',
      user: sanitizeUser(newUser),
      token,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Email already in use' });
    }
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const requiredFields = ['email', 'password'];
    const missingFields = getMissingFields(req.body, requiredFields);

    if (missingFields.length) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, email: user.email });

    return res.status(200).json({
      message: 'Login successful',
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    return next(error);
  }
};

exports.logout = async (_req, res) => {
  return res.status(200).json({
    message: 'Logout successful.',
  });
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

