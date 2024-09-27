// Imports express to host the API
import express from 'express'

// Imports all GET handlers from the handlers folder
import { 
    getScoreboard, 
    getCourses, 
    getCourse, 
    getFile, 
    getFiles, 
    getUserProfile, 
    getIndexHandler, 
    getComments,
    getHealthHandler,
    getCallback,
    getLogin
} from './handlers/get'

// Imports all POST handlers from the handlers folder
import { 
    postFile, 
    postRegister, 
    postLogin, 
    postCard, 
    postCourse, 
    postComment, 
    postVote, 
    postCardVote 
} from './handlers/post'

// Imports all PUT handlers from the handlers folder
import { 
    putCourse, 
    putText, 
    putMarkCourse, 
    putFile,
    putTime
} from './handlers/put'

// Imports all DELETE handlers from the handlers folder
import {
    deleteComment,
    deleteFile,
} from './handlers/delete'

// Creates a new express router
const router = express.Router()

// Defines all GET routes that are available on the API
router.get('/', getIndexHandler)
router.get('/health', getHealthHandler)
router.get('/scoreboard', getScoreboard)
router.get('/courses', getCourses)
router.get('/course/:courseID', getCourse)
router.get('/files/:courseID', getFiles)
router.get('/file/:courseID/:fileID', getFile)
router.get('/user/:id', getUserProfile)
router.get('/comments/:courseID', getComments)
router.get('/login', getLogin)
router.get('/callback', getCallback)

// Defines all PUT routes that are available on the API
router.put('/course/:courseID', putCourse)
router.put('/time', putTime)
router.put('/text', putText)
router.put('/mark', putMarkCourse)
router.put('/file', putFile)

// // Defines all POST routes that are available on the API
router.post('/file', postFile)
router.post('/register', postRegister)
router.post('/login', postLogin)
router.post('/upload_card', postCard)
router.post('/upload_course', postCourse)
router.post('/comment', postComment)
router.post('/vote', postVote)
router.post('/vote/card', postCardVote)

// // Defines all DELETE routes that are available on the API
router.delete('/comment', deleteComment)
router.delete('/file/:courseID/:fileID', deleteFile)

// Exports the router
export default router
