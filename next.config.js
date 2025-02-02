// @ts-check
 
/** @type {import('next').NextConfig} */
const nextConfig = {
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
   
module.exports = nextConfig