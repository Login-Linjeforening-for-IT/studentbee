import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import authMiddleware from '#utils/authMiddleware.ts'
import getIndex from './handlers/index.ts'
import ping from './handlers/health/get.ts'
import version from './handlers/version/get.ts'
import getUser from './handlers/user/get.ts'
import postUser from './handlers/user/post.ts'
import getScoreboard from './handlers/scoreboard/get.ts'
import { fileHandler, filesHandler } from './handlers/file/get.ts'
import { courseHandler, coursesHandler } from './handlers/course/get.ts'
import { commentsHandler } from './handlers/comment/get.ts'
import { gradeHandler } from './handlers/grades/get.ts'
import { postFile } from './handlers/file/post.ts'
import { postCard } from './handlers/card/post.ts'
import { postCourse } from './handlers/course/post.ts'
import { postComment, postCommentVote } from './handlers/comment/post.ts'
import { postCardVote } from './handlers/card/post.ts'
import { putCourse, putCourseMark, putCourseText } from './handlers/course/put.ts'
import { putFile } from './handlers/file/put.ts'
import { deleteFile } from './handlers/file/delete.ts'
import { deleteComment } from './handlers/comment/delete.ts'
import getUserScore from './handlers/scoreboard/getUserScore.ts'

/**
 * Defines the routes available in the API.
 *
 * @param fastify Fastify Instance
 * @param _ Fastify Plugin Options
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function apiRoutes(fastify: FastifyInstance, _: FastifyPluginOptions) {
    // index
    fastify.get('/', getIndex)

    // health
    fastify.get('/health', ping)
    fastify.get('/ping', ping)
    
    // version
    fastify.get('/version', version)

    // user
    fastify.get('/user', { preHandler: authMiddleware }, getUser)
    fastify.post('/user', { preHandler: authMiddleware }, postUser)

    // score
    fastify.get('/score/:id', { preHandler: authMiddleware }, getUserScore)
    fastify.get('/scoreboard', { preHandler: authMiddleware }, getScoreboard)

    // course
    fastify.get('/courses', { preHandler: authMiddleware }, coursesHandler)
    fastify.get('/course/:courseID', { preHandler: authMiddleware }, courseHandler)
    fastify.put('/course/:courseID', { preHandler: authMiddleware }, putCourse)
    fastify.post('/course', { preHandler: authMiddleware }, postCourse)
    fastify.post('/card', { preHandler: authMiddleware }, postCard)
    fastify.put('/mark', { preHandler: authMiddleware }, putCourseMark)
    
    // files
    fastify.get('/files/:courseID', { preHandler: authMiddleware }, filesHandler)
    fastify.get('/file/:id', { preHandler: authMiddleware }, fileHandler)
    fastify.put('/text', { preHandler: authMiddleware }, putCourseText)
    fastify.put('/file', { preHandler: authMiddleware }, putFile)
    fastify.post('/file', { preHandler: authMiddleware }, postFile)
    fastify.delete('/file/:courseID/:fileID', { preHandler: authMiddleware }, deleteFile)
    
    // comments
    fastify.get('/comments/:courseID', { preHandler: authMiddleware }, commentsHandler)
    fastify.post('/comment', { preHandler: authMiddleware }, postComment)
    fastify.delete('/comment', { preHandler: authMiddleware }, deleteComment)
    
    // grades
    fastify.get('/grades/:course', { preHandler: authMiddleware }, gradeHandler)

    // votes
    fastify.post('/vote/comment', { preHandler: authMiddleware }, postCommentVote)
    fastify.post('/vote/card', { preHandler: authMiddleware }, postCardVote)
}
