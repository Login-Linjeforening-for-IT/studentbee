import type { FastifyReply, FastifyRequest } from 'fastify'
import config from '#constants'

const { DBH_API } = config

export default async function gradeHandler(req: FastifyRequest, res: FastifyReply): Promise<object | string> {
    const { course } = req.params as { course: string }
    const courseId = `${course.toUpperCase()}-1`
    const queryBody = {
        'tabell_id': 308,
        'api_versjon': 1,
        'statuslinje': 'J',
        'begrensning': '100',
        'kodetekst': 'J',
        'desimal_separator': '.',
        'groupBy': ['Institusjonskode', 'Årstall', 'Emnekode', 'Karakter'],
        'sortBy': ['Årstall', 'Karakter'],
        'filter': [
            {
                'variabel': 'Emnekode',
                'selection': {
                    'filter': 'item',
                    'values': [
                        courseId
                    ]
                }
            },
            {
                'variabel': 'Institusjonskode',
                'selection': {
                    'filter': 'item',
                    'values': [
                        '1150'
                    ]
                }
            }
        ]
    }

    try {
        const response = await fetch(DBH_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(queryBody)
        })

        if (!response.ok) {
            const data = await response.json()

            throw Error(data.error)
        }

        const grades = await response.json()
        return res.send(grades)
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
