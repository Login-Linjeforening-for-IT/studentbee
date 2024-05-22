import express from 'express';
import {
    getScoreboard,
    getCourses,
    getReviewedCards,
    getAllCards,
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
router.get('/courses/:courseId/reviewed', getReviewedCards);
router.get('/courses/:courseId/cards', getAllCards);
router.get('/users/:userId', getUserProfile);
router.post('/register', postRegister);
router.post('/login', postLogin);
router.post('/upload_text', postUploadedAsText)
router.post('/upload_struct', postUploadedAsStruct)
router.post('/approve', postApproved)
router.post('/deny', postDenied)

export default router;
