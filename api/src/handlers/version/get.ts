import type { FastifyReply, FastifyRequest } from 'fastify'
import config from '../../../package.json' with { 'type': 'json' }

export default function version(_: FastifyRequest, res: FastifyReply) {
    return res.send(config.version)
}
