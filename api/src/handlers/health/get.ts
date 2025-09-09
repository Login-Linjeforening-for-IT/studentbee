import { FastifyReply, FastifyRequest } from 'fastify'

/**
 * Health check for the API
 * @param _ Request, not used
 * @param res Response, used to send the response to the user
 */
export async function healthHandler(_: FastifyRequest, res: FastifyReply) {
    res.send(200)
}
