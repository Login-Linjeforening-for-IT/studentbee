import { FastifyReply, FastifyRequest } from 'fastify'
import config from '../../../package.json'

export function version(_: FastifyRequest, res: FastifyReply): void {
    res.send(config.version)
}
