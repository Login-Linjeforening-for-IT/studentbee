import express from 'express';
import {
    getScoreboard,
    getCourses,
    getReviewedFlashcards,
    getAllFlashcards,
    getUserProfile,
    getIndexHandler,
    postRegister,
    postLogin,
    postApproved,
    postDenied,
    postUploadedAsStruct,
    postUploadedAsText
} from './controllers';

const router = express.Router();

router.get('/', getIndexHandler)
router.get('/scoreboard', getScoreboard);
router.get('/courses', getCourses);
router.get('/courses/:courseId/reviewed', getReviewedFlashcards);
router.get('/courses/:courseId/flashcards', getAllFlashcards);
router.get('/users/:userId', getUserProfile);
router.get('register', postRegister);
router.get('/login', postLogin);
router.get('/upload_text', postUploadedAsText)
router.get('/upload_struct', postUploadedAsStruct)
router.get('/approve', postApproved)
router.get('/deny', postDenied)

export default router;
