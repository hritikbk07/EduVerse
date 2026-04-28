import { Router } from 'express';
import { enrollCourse, getMyCourses } from '../controllers/enrollment.controller';
import { protect } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

// Apply protect middleware to all routes
router.use(protect);

// Apply student role restriction and map to controllers
router.post('/enroll/:courseId', requireRole('student'), enrollCourse);
router.get('/my-courses', requireRole('student'), getMyCourses);

export default router;
