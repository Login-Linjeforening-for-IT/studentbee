import express from 'express'
import {
    getScoreboard,
    getCourses,
    getCourse,
    getUserProfile,
    getIndexHandler,
    getComments,
    postRegister,
    postLogin,
    postCard,
    postCourse,
    postText,
    postComment,
    postVote,
    postCardVote,
    putCourse,
    putTime,
    deleteComment,
} from './controllers'

const router = express.Router()

router.get('/', getIndexHandler)
router.get('/scoreboard', getScoreboard)
router.get('/courses', getCourses)
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
router.post('/comment', postComment)
router.post('/vote', postVote)
router.post('/vote/card', postCardVote)
router.delete('/comment', deleteComment)

export default router
