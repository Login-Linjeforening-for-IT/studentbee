import express from 'express'
import {
    getScoreboard,
    getCourses,
    getCourse,
    getReviewedCards,
    getUserProfile,
    getIndexHandler,
    postRegister,
    postLogin,
    postApproved,
    postDenied,
    postCard,
    postCourse,
    postText,
    putCourse
} from './controllers'

const router = express.Router()

router.get('/', getIndexHandler)
router.get('/scoreboard', getScoreboard)
router.get('/courses', getCourses)
router.get('/course/:courseId/cards', getReviewedCards)
router.get('/course/:courseId', getCourse)
router.get('/users/:userId', getUserProfile)
router.put('/course', putCourse)
router.post('/register', postRegister)
router.post('/login', postLogin)
router.post('/upload_card', postCard)
router.post('/upload_course', postCourse)
router.post('/upload_text', postText)
router.post('/approve', postApproved)
router.post('/deny', postDenied)

export default router
