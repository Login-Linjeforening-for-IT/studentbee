// Imports Fastify to host the API
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

// Imports all GET handlers from the handlers folder
import indexHandler from './handlers/index'
import { scoreboardHandler } from './handlers/scoreboard/get'
import { fileHandler, filesHandler } from './handlers/file/get'
import { courseHandler, coursesHandler } from './handlers/course/get'
import { healthHandler } from './handlers/health/get'
import { commentsHandler } from './handlers/comment/get'
import { profileHandler } from './handlers/user/get'
import { versionHandler } from './handlers/version/get'
import { callbackHandler, loginHandler } from './handlers/login/get'

// Imports all POST handlers from the handlers folder
import { postFile } from './handlers/file/post'
import { postLogin } from './handlers/login/post'
import { postCard } from './handlers/card/post'
import { postCourse } from './handlers/course/post'
import { postComment, postCommentVote } from './handlers/comment/post'
import { postCardVote } from './handlers/card/post'

// Imports all PUT handlers from the handlers folder
import { putCourse, putCourseMark, putCourseText } from './handlers/course/put'
import { putFile } from './handlers/file/put'
import { putScore, putTime } from './handlers/user/put'

// Imports all DELETE handlers from the handlers folder
import { deleteFile } from './handlers/file/delete'
import { deleteComment } from './handlers/comment/delete'

/**
 * Defines the routes available in the API.
 * 
 * @param fastify Fastify Instance
 * @param _ Fastify Plugin Options
 */
export default async function apiRoutes(fastify: FastifyInstance, _: FastifyPluginOptions) {
    // Defines all GET routes that are available on the API
    fastify.get('/', indexHandler)
    fastify.get('/health', healthHandler)
    fastify.get('/scoreboard', scoreboardHandler)
    fastify.get('/courses', coursesHandler)
    fastify.get('/course/:courseID', courseHandler)
    fastify.get('/files/:courseID', filesHandler)
    fastify.get('/file/:courseID/:fileID', fileHandler)
    fastify.get('/user/:username', profileHandler)
    fastify.get('/comments/:courseID', commentsHandler)
    fastify.get('/login', loginHandler)
    fastify.get('/callback', callbackHandler)
    fastify.get('/version', versionHandler)

    // Defines all PUT routes that are available on the API
    fastify.put('/course/:courseID', putCourse) 
    fastify.put('/time', putTime)
    fastify.put('/score', putScore)
    fastify.put('/text', putCourseText)
    fastify.put('/mark', putCourseMark)
    fastify.put('/file', putFile)

    // // Defines all POST routes that are available on the API
    fastify.post('/file', postFile)
    fastify.post('/login', postLogin)
    fastify.post('/upload_card', postCard)
    fastify.post('/upload_course', postCourse)
    fastify.post('/comment', postComment)
    fastify.post('/vote/comment', postCommentVote)
    fastify.post('/vote/card', postCardVote)

    // // Defines all DELETE routes that are available on the API
    fastify.delete('/comment', deleteComment)
    fastify.delete('/file/:courseID/:fileID', deleteFile)
}
