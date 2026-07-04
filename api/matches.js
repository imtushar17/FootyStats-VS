const memoryCache = new Map();

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { matchId, timeline, ...restQuery } = req.query;
    const isDetailRequest = !!matchId;
    const isTimelineRequest = isDetailRequest && (timeline === 'true' || timeline === true);

    // Build Cache Key
    let cacheKey = 'calendar';
    if (isTimelineRequest) {
        cacheKey = `timeline:${matchId}`;
    } else if (isDetailRequest) {
        cacheKey = `match:${matchId}`;
    }

    // Check in-memory cache first
    const now = Date.now();
    const cachedItem = memoryCache.get(cacheKey);
    if (cachedItem && now < cachedItem.expiry) {
        res.setHeader('Cache-Control', cachedItem.cacheControl);
        return res.status(200).json(cachedItem.data);
    }

    // Build Target API URL
    let targetUrl = "https://api.fifa.com/api/v3/calendar/matches?idCompetition=17&idSeason=285023&language=en&count=200";
    if (isTimelineRequest) {
        targetUrl = `https://api.fifa.com/api/v3/timelines/${matchId}?language=en`;
    } else if (isDetailRequest) {
        targetUrl = `https://api.fifa.com/api/v3/live/football/${matchId}?language=en`;
    }

    try {
        const apiResponse = await fetch(targetUrl);
        if (!apiResponse.ok) {
            throw new Error(`FIFA API returned HTTP ${apiResponse.status}`);
        }

        const data = await apiResponse.json();

        // Determine caching duration based on status
        let cacheDurationSeconds = 15; // default 15s for live/active updates
        
        if (isDetailRequest && data) {
            const period = data.Period; // 10 = Finished
            if (period === 10) {
                cacheDurationSeconds = 86400; // Cache finished match details for 24 hours
            }
        } else if (isTimelineRequest && data) {
            // If the timeline shows match end event, we can cache it longer
            const events = data.Event || [];
            const isFinished = events.some(e => e.Type === 26 || e.Type === 8);
            if (isFinished) {
                cacheDurationSeconds = 86400;
            }
        } else {
            // For the general calendar/all matches feed, cache for 1 hour, or 24 hours if all matches are finished
            const matches = data?.Results || [];
            const allFinished = matches.length > 0 && matches.every(m => m.Period === 10);
            if (allFinished) {
                cacheDurationSeconds = 86400;
            } else {
                cacheDurationSeconds = 3600;
            }
        }

        const cacheControlHeader = cacheDurationSeconds === 86400
            ? 'public, max-age=0, s-maxage=86400, stale-while-revalidate=600'
            : cacheDurationSeconds === 3600
                ? 'public, max-age=0, s-maxage=3600, stale-while-revalidate=300'
                : 'public, max-age=0, s-maxage=15, stale-while-revalidate=5';

        // Save to in-memory cache
        memoryCache.set(cacheKey, {
            data,
            expiry: now + (cacheDurationSeconds * 1000),
            cacheControl: cacheControlHeader
        });

        res.setHeader('Cache-Control', cacheControlHeader);
        return res.status(200).json(data);

    } catch (err) {
        // If we have stale data in cache, serve it as fallback
        if (cachedItem) {
            res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=10');
            return res.status(200).json(cachedItem.data);
        }
        return res.status(500).json({ error: err.message });
    }
};

