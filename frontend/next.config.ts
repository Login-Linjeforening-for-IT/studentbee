import type { NextConfig } from 'next'
import { envLoad } from 'utilbee'

envLoad({ path: '../.env' })

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: '',
                    },
                ],
            },
        ]
    }
}

export default nextConfig
