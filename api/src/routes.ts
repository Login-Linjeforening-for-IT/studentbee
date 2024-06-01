import express from 'express'
import {
    getScoreboard,
    getCourses,
    getCourse,
    getFileTree,
    getUserProfile,
    getIndexHandler,
    getComments,
    postFile,
    postRegister,
    postLogin,
    postCard,
    postCourse,
    postComment,
    postVote,
    postCardVote,
    putCourse,
    putText,
    putTime,
    putMarkCourse,
    deleteComment,
} from './controllers'

const router = express.Router()

router.get('/', getIndexHandler)
router.get('/scoreboard', getScoreboard)
router.get('/courses', getCourses)
router.get('/course/:courseID', getCourse)
router.get('/filetree', getFileTree)
router.get('/users/:userID', getUserProfile)
router.get('/comments/:courseID', getComments)
router.put('/course/:courseID', putCourse)
router.put('/time', putTime)
router.put('/text', putText)
router.put('/mark', putMarkCourse)
router.post('/file', postFile)
router.post('/register', postRegister)
router.post('/login', postLogin)
router.post('/upload_card', postCard)
router.post('/upload_course', postCourse)
router.post('/comment', postComment)
router.post('/vote', postVote)
router.post('/vote/card', postCardVote)
router.delete('/comment', deleteComment)

export default router
