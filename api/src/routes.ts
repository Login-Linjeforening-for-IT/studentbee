import { FastifyInstance, FastifyPluginOptions } from 'fastify'

import { ping } from './handlers/health/get'
import { version } from './handlers/version/get'

// Imports all GET handlers from the handlers folder
import indexHandler from './handlers/index'
import { scoreboardHandler } from './handlers/scoreboard/get'
import { fileHandler, filesHandler } from './handlers/file/get'
import { courseHandler, coursesHandler } from './handlers/course/get'
import { commentsHandler } from './handlers/comment/get'
import { profileHandler, scoreHandler } from './handlers/user/get'
import { gradeHandler } from './handlers/grades/get'

// Imports all POST handlers from the handlers folder
import { postFile } from './handlers/file/post'
import { postCard } from './handlers/card/post'
import { postCourse } from './handlers/course/post'
import { postComment, postCommentVote } from './handlers/comment/post'
import { postCardVote } from './handlers/card/post'

// Imports all PUT handlers from the handlers folder
import { putCourse, putCourseMark, putCourseText } from './handlers/course/put'
import { putFile } from './handlers/file/put'

// Imports all DELETE handlers from the handlers folder
import { deleteFile } from './handlers/file/delete'
import { deleteComment } from './handlers/comment/delete'
import authMiddleware from '#utils/authMiddleware.ts'

/**
 * Defines the routes available in the API.
 *
 * @param fastify Fastify Instance
 * @param _ Fastify Plugin Options
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function apiRoutes(fastify: FastifyInstance, _: FastifyPluginOptions) {
    fastify.get('/', indexHandler)

    fastify.get('/health', ping)
    fastify.get('/ping', ping)
    fastify.get('/version', version)

    // Defines all GET routes that are available on the API
    fastify.get('/scoreboard', scoreboardHandler)
    fastify.get('/courses', coursesHandler)
    fastify.get('/course/:courseID', courseHandler)
    fastify.get('/files/:courseID', filesHandler)
    fastify.get('/file/:courseID/:fileID', fileHandler)
    fastify.get('/user/:username', profileHandler)
    fastify.get('/comments/:courseID', commentsHandler)
    fastify.get('/score/:username', scoreHandler)
    fastify.get('/grades/:course', gradeHandler)

    // Defines all PUT routes that are available on the API
    fastify.put('/course/:courseID', { preHandler: authMiddleware }, putCourse)
    fastify.put('/text', { preHandler: authMiddleware }, putCourseText)
    fastify.put('/mark', { preHandler: authMiddleware }, putCourseMark)
    fastify.put('/file', { preHandler: authMiddleware }, putFile)

    // // Defines all POST routes that are available on the API
    fastify.post('/file', { preHandler: authMiddleware }, postFile)
    fastify.post('/upload_card', { preHandler: authMiddleware }, postCard)
    fastify.post('/upload_course', { preHandler: authMiddleware }, postCourse)
    fastify.post('/comment', { preHandler: authMiddleware }, postComment)
    fastify.post('/vote/comment', { preHandler: authMiddleware }, postCommentVote)
    fastify.post('/vote/card', { preHandler: authMiddleware }, postCardVote)

    // // Defines all DELETE routes that are available on the API
    fastify.delete('/comment', { preHandler: authMiddleware }, deleteComment)
    fastify.delete('/file/:courseID/:fileID', { preHandler: authMiddleware }, deleteFile)
}
