import { Router } from 'express';
import { ApiResponse, asyncHandler } from '../../utils/index.js';
const router = Router();

router.get('/', asyncHandler(async (req, res) => {
    // Placeholder for reporting
    ApiResponse.ok({ message: 'Reports endpoint' }).send(res);
}));

export default router;
