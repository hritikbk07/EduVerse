import { Router } from 'express';
import { enrollCourse, getMyCourses, getCourseLessons } from '../controllers/enrollment.controller';
import { protect } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

// Apply protect middleware to all routes
router.use(protect);

// Apply student role restriction and map to controllers
router.post('/enroll/:courseId', requireRole('student'), enrollCourse);
router.get('/my-courses', requireRole('student'), getMyCourses);
router.get('/:courseId/lessons', requireRole('student'), getCourseLessons);

export default router;
