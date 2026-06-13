import express from 'express';
import rateLimit from 'express-rate-limit';
import authMiddleware from '../middleware/authMiddleware.js';
import { isEditor, requireRole, checkRole } from '../middleware/permissionMiddleware.js';
import { verifyFileAccess } from '../middleware/filePermission.js';
import {
  createFile,
  getFileContent,
  updateFile,
  renameFile,
  deleteFile
} from '../controllers/fileController.js';
import {
  saveVersion,
  getHistory,
  restoreVersion
} from '../controllers/versionController.js';

const router = express.Router();
const restoreVersionRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' }
});

router.use(authMiddleware);

// Create file OR folder (type='file'|'folder' in body)
// Both owners and editors can create files/folders
router.post('/', requireRole('editor'), createFile);

// Open file content (anyone in workspace can read)
router.get('/open/:id', verifyFileAccess, getFileContent);

// Update file content (Editor+)
router.put('/:id', verifyFileAccess, checkRole('editor'), updateFile);

// Rename file/folder (Editor+)
router.patch('/rename/:id', verifyFileAccess, checkRole('editor'), renameFile);

// Delete file/folder - also recursively deletes folder children (Editor+)
router.delete('/:id', verifyFileAccess, checkRole('editor'), deleteFile);

// Version history
router.post('/:fileId/version', verifyFileAccess, checkRole('editor'), saveVersion);
router.get('/:fileId/history', verifyFileAccess, getHistory);
router.post('/restore/:fileId/:versionId', restoreVersionRateLimit, verifyFileAccess, checkRole('editor'), restoreVersion);

export default router;
