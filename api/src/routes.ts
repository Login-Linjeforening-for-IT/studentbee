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
    putCourse,
    putTime
} from './controllers'

const router = express.Router()

router.get('/', getIndexHandler)
router.get('/scoreboard', getScoreboard)
router.get('/courses', getCourses)
router.get('/course/:courseID/cards', getReviewedCards)
router.get('/course/:courseID', getCourse)
router.get('/users/:userID', getUserProfile)
router.put('/course/:courseID', putCourse)
router.put('/time', putTime)
router.post('/register', postRegister)
router.post('/login', postLogin)
router.post('/upload_card', postCard)
router.post('/upload_course', postCourse)
router.post('/upload_text', postText)
router.post('/approve', postApproved)
router.post('/deny', postDenied)

export default router
