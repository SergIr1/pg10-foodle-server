import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getAllUsersController,
  getCurrentUserController,
  getUserByIdController,
} from '../controllers/users.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

// router.get('/api/users', authMiddleware, ctrlWrapper(getAllUsersController));
router.get('/', ctrlWrapper(getAllUsersController));

router.get('/current', ctrlWrapper(getCurrentUserController));

router.get('/:userId', isValidId, ctrlWrapper(getUserByIdController));

export default router;
