const memoryCache = new Map();

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const apiKey = process.env.FOOTBALL_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Missing FOOTBALL_API_KEY environment variable" });
    }

    const { matchId, ...restQuery } = req.query;
    const isDetailRequest = !!matchId;

    // Build Cache Key
    const cacheKey = isDetailRequest ? `match:${matchId}` : `general:${JSON.stringify(restQuery)}`;
    
    // Check in-memory cache first
    const now = Date.now();
    const cachedItem = memoryCache.get(cacheKey);
    if (cachedItem && now < cachedItem.expiry) {
        console.log(`[Cache Hit] Serving ${cacheKey} from memory`);
        // Set CDN cache headers for the client/CDN
        res.setHeader('Cache-Control', cachedItem.cacheControl);
        return res.status(200).json(cachedItem.data);
    }

    // Build Target API URL
    let targetUrl = "https://api.football-data.org/v4/matches";
    if (isDetailRequest) {
        targetUrl = `https://api.football-data.org/v4/matches/${matchId}`;
    } else {
        // Forward any extra query parameters (e.g. dateFrom, dateTo, status, etc.)
        const searchParams = new URLSearchParams(restQuery);
        const searchStr = searchParams.toString();
        if (searchStr) {
            targetUrl += `?${searchStr}`;
        }
    }

    try {
        console.log(`[API Request] Fetching from: ${targetUrl}`);
        const apiResponse = await fetch(targetUrl, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });

        if (!apiResponse.ok) {
            const errText = await apiResponse.text();
            throw new Error(`External API returned HTTP ${apiResponse.status}: ${errText}`);
        }

        const data = await apiResponse.json();

        // Determine caching duration based on status
        let cacheDurationSeconds = 60; // Default 60 seconds for live/upcoming matches
        
        if (isDetailRequest) {
            const matchStatus = data.status; // e.g. FINISHED, IN_PLAY, TIMED
            if (matchStatus === 'FINISHED') {
                cacheDurationSeconds = 86400; // Cache finished match details for 24 hours
            }
        } else {
            // General feed caching: if all matches are finished, we could cache longer, but default to 60s
            // to keep it simple and safe for today's matches
            cacheDurationSeconds = 60;
        }

        const cacheControlHeader = cacheDurationSeconds === 86400
            ? 'public, max-age=0, s-maxage=86400, stale-while-revalidate=300'
            : 'public, max-age=0, s-maxage=60, stale-while-revalidate=30';

        // Save to in-memory cache
        memoryCache.set(cacheKey, {
            data,
            expiry: now + (cacheDurationSeconds * 1000),
            cacheControl: cacheControlHeader
        });

        res.setHeader('Cache-Control', cacheControlHeader);
        return res.status(200).json(data);

    } catch (err) {
        console.error(`[API Error] ${err.message}`);
        // If we have stale data in cache, we can serve it as fallback in case of API failure
        if (cachedItem) {
            console.log(`[Cache Fallback] Serving stale memory cache for ${cacheKey}`);
            res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=10');
            return res.status(200).json(cachedItem.data);
        }
        return res.status(500).json({ error: err.message });
    }
};
