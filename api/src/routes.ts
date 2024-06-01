import express from 'express'
import {
    getScoreboard,
    getCourses,
    getCourse,
    getFile,
    getFiles,
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
    putFile,
} from './controllers'

const router = express.Router()

router.get('/', getIndexHandler)
router.get('/scoreboard', getScoreboard)
router.get('/courses', getCourses)
router.get('/course/:courseID', getCourse)
router.get('/files/:courseID', getFiles)
router.get('/file/:fileID', getFile)
router.get('/users/:userID', getUserProfile)
router.get('/comments/:courseID', getComments)
router.put('/course/:courseID', putCourse)
router.put('/time', putTime)
router.put('/text', putText)
router.put('/mark', putMarkCourse)
router.put('/file', putFile)
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
