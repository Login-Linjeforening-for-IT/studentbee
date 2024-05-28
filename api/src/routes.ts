import express from 'express'
import {
    getScoreboard,
    getCourses,
    getCourse,
    getReviewedCards,
    getUserProfile,
    getIndexHandler,
    getComments,
    postRegister,
    postLogin,
    postApproved,
    postDenied,
    postCard,
    postCourse,
    postText,
    postComment,
    postVote,
    putCourse,
    putTime,
    deleteComment,
} from './controllers'

const router = express.Router()

router.get('/', getIndexHandler)
router.get('/scoreboard', getScoreboard)
router.get('/courses', getCourses)
router.get('/course/:courseID/cards', getReviewedCards)
router.get('/course/:courseID', getCourse)
router.get('/users/:userID', getUserProfile)
router.get('/comments/:courseID', getComments)
router.put('/course/:courseID', putCourse)
router.put('/time', putTime)
router.post('/register', postRegister)
router.post('/login', postLogin)
router.post('/upload_card', postCard)
router.post('/upload_course', postCourse)
router.post('/upload_text', postText)
router.post('/approve', postApproved)
router.post('/deny', postDenied)
router.post('/comment', postComment)
router.post('/vote', postVote)
router.delete('/comment', deleteComment)

export default router
