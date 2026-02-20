import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser, createUser } from '../../controllers/admin/users.controller.js';
const router = Router();
router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/', createUser);
export default router;
