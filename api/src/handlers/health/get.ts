import type { FastifyReply, FastifyRequest } from 'fastify'

/**
 * Health check for the API
 * @param _ Request, not used
 * @param res Response, used to send the response to the user
 */
export default async function ping(_: FastifyRequest, res: FastifyReply) {
    return res.code(200).send({ message: 'pong' })
}
