import { FastifyReply, FastifyRequest } from "fastify"
import config from "../../../package.json"

export function versionHandler(_: FastifyRequest, res: FastifyReply): any {
    return res.send(config.version)
}
