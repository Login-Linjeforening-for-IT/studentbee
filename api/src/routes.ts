import express from 'express';
import {
    getScoreboard,
    getCourses,
    getReviewedFlashcards,
    getAllFlashcards,
    getUserProfile,
    getIndexHandler
} from './controllers';

const router = express.Router();

router.get('/', getIndexHandler)
router.get('/scoreboard', getScoreboard);
router.get('/courses', getCourses);
router.get('/courses/:courseId/reviewed-flashcards', getReviewedFlashcards);
router.get('/courses/:courseId/flashcards', getAllFlashcards);
router.get('/users/:userId', getUserProfile);

export default router;
