import { Router } from 'express';
import { ApiResponse, asyncHandler } from '../../utils/index.js';
const router = Router();

router.get('/', asyncHandler(async (req, res) => {
    // Placeholder for host payout management
    ApiResponse.ok([]).send(res);
}));

export default router;
