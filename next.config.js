/** @type {import('next').NextConfig} */
module.exports = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'komplett.no',
                port: '',
                pathname: '/img/p/200/**',
            },
        ],
    },
}