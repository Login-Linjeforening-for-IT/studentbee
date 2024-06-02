import { createClient } from 'redis'

// Gets Redis connection details from environment variables
const redisHost = process.env.REDIS_HOST || 'localhost'
const redisPort = process.env.REDIS_PORT || 6379

// Creates and configure Redis client
const redisClient = createClient({
    url: `redis://${redisHost}:${redisPort}`
})

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    try {
        await redisClient.connect()
        console.log('Redis client connected')
    } catch (err) {
        console.error('Could not connect to Redis', err)
    }
})()

// Cache TTL (time to live) in seconds
const CACHE_TTL = 3600

// Wrapper for cache function, first checks cache for data, if not found, fetches data from source
export default async function cache(
    cacheKey: string,
    fetchFunction: () => Promise<any>,
    ttl: number = CACHE_TTL
): Promise<any> {
    try {
        const cachedData = await redisClient.get(cacheKey)

        // Returns cache hit if possible
        if (cachedData) {
            return JSON.parse(cachedData)
        } else {
            // If cache miss, fetches data from the source
            const data = await fetchFunction()
            // Store the fetched data in cache with TTL
            await redisClient.set(cacheKey, JSON.stringify(data), {
                EX: ttl,
            })

            return data
        }
    } catch (error) {
        console.error('Cache error:', error)
        throw error
    }
}

// Properly close the Redis client when the application exits
process.on('exit', () => {
    redisClient.quit()
})