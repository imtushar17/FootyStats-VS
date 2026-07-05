const memoryCache = new Map();

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const now = Date.now();
    const cacheKey = 'live-rankings';
    const cachedItem = memoryCache.get(cacheKey);

    // 24 hour TTL (86400 seconds) in memory cache
    const TTL = 86400 * 1000;

    if (cachedItem && now < cachedItem.expiry) {
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
        return res.status(200).json(cachedItem.data);
    }

    const targetUrl = 'https://api.fifa.com/api/v3/fifarankings/rankings/live?gender=1&sportType=0&language=en';

    try {
        const apiResponse = await fetch(targetUrl);
        if (!apiResponse.ok) {
            throw new Error(`FIFA API returned HTTP ${apiResponse.status}`);
        }

        const data = await apiResponse.json();

        // Save to warm cache
        memoryCache.set(cacheKey, {
            data,
            expiry: now + TTL
        });

        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
        return res.status(200).json(data);
    } catch (err) {
        // Fallback to memory cache on network error if warm
        if (cachedItem) {
            res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
            return res.status(200).json(cachedItem.data);
        }
        return res.status(500).json({ error: err.message });
    }
};
