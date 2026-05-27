import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { signup, login, deleteUser, getProfile, updateProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.patch('/profile', authMiddleware, updateProfile);
router.delete('/:id', authMiddleware, deleteUser);

export default router;
