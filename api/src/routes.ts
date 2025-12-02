import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import preHandler from '#utils/authMiddleware.ts'
import getIndex from './handlers/index.ts'
import ping from './handlers/health/get.ts'
import version from './handlers/version/get.ts'
import getUser from './handlers/user/get.ts'
import postUser from './handlers/user/post.ts'
import deleteUser from './handlers/user/delete.ts'
import getScoreboard from './handlers/scoreboard/get.ts'
import { fileHandler } from './handlers/file/get.ts'
import { courseHandler } from './handlers/course/get.ts'
import commentsHandler from './handlers/comment/get.ts'
import gradeHandler from './handlers/grades/get.ts'
import postFile from './handlers/file/post.ts'
import postCard from './handlers/card/post.ts'
import postCourse from './handlers/course/post.ts'
import postComment from './handlers/comment/post.ts'
import putFile from './handlers/file/put.ts'
import deleteFile from './handlers/file/delete.ts'
import deleteComment from './handlers/comment/delete.ts'
import getUserScore from './handlers/scoreboard/getUserScore.ts'
import filesHandler from './handlers/file/getFiles.ts'
import putCourse from './handlers/course/put/course.ts'
import postCommentVote from './handlers/comment/vote/post.ts'
import putCourseNotes from './handlers/course/put/notes.ts'
import putCourseLearningBased from './handlers/course/put/learningBased.ts'
import postCardVote from './handlers/card/vote/post.ts'
import { coursesHandler } from './handlers/course/get/courses.ts'

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
    fastify.get('/user', { preHandler }, getUser)
    fastify.post('/user', { preHandler }, postUser)
    fastify.delete('/user', { preHandler }, deleteUser)

    // score
    fastify.get('/score/:id', { preHandler }, getUserScore)
    fastify.get('/scoreboard', { preHandler }, getScoreboard)

    // course
    fastify.get('/courses', { preHandler }, coursesHandler)
    fastify.get('/course/:id', { preHandler }, courseHandler)
    fastify.post('/course', { preHandler }, postCourse)
    fastify.post('/card', { preHandler }, postCard)
    fastify.put('/course/:id', { preHandler }, putCourse)
    fastify.put('/course/:id/notes', { preHandler }, putCourseNotes)
    fastify.put('/learningBased', { preHandler }, putCourseLearningBased)

    // files
    fastify.get('/files/:id', { preHandler }, filesHandler)
    fastify.get('/file/:id', { preHandler }, fileHandler)
    fastify.put('/file', { preHandler }, putFile)
    fastify.post('/file', { preHandler }, postFile)
    fastify.delete('/file/:id', { preHandler }, deleteFile)

    // comments
    fastify.get('/comments/:cardId', { preHandler }, commentsHandler)
    fastify.post('/comment', { preHandler }, postComment)
    fastify.delete('/comment', { preHandler }, deleteComment)

    // grades
    fastify.get('/grades/:course', { preHandler }, gradeHandler)

    // votes
    fastify.post('/vote/comment', { preHandler }, postCommentVote)
    fastify.post('/vote/card', { preHandler }, postCardVote)
}
