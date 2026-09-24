import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { storage } from '../services/storage.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'lifeos_super_secret_jwt_key_2026_demo';

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    const existingUser = await storage.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await storage.createUser({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id || user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id || user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Failed to register user.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await storage.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user._id || user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user._id || user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Failed to log in.' });
  }
}

export async function getMe(req, res) {
  try {
    const user = await storage.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user profile.' });
  }
}

export async function demoLogin(req, res) {
  try {
    const token = 'demo-token-123';
    res.json({
      success: true,
      token,
      user: { id: 'demo-user-123', name: 'Mohammed', email: 'demo@lifeos.ai' }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to initiate Demo Mode.' });
  }
}
