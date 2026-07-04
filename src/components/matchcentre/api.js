import { state } from './state.js';
import { mapFifaMatch } from './utils.js';

let activeBanner = null;

export const showDataFeedErrorBanner = (message) => {
    // If the banner exists and is attached to the body, just update message
    if (activeBanner && document.body.contains(activeBanner)) {
        activeBanner.textContent = message;
        activeBanner.style.display = "block";
    } else {
        const banner = document.createElement("div");
        banner.id = "data-feed-error-banner";
        banner.className = "calendar-toast-alert data-feed-error";
        banner.style.background = "#ef4444";
        banner.style.color = "#ffffff";
        banner.style.position = "fixed";
        banner.style.bottom = "20px";
        banner.style.right = "20px";
        banner.style.padding = "12px 20px";
        banner.style.borderRadius = "8px";
        banner.style.fontSize = "12px";
        banner.style.fontWeight = "bold";
        banner.style.zIndex = "30000";
        banner.textContent = message;
        document.body.appendChild(banner);
        activeBanner = banner;
        
        setTimeout(() => {
            if (document.body.contains(banner)) {
                banner.remove();
            }
            if (activeBanner === banner) {
                activeBanner = null;
            }
        }, 3000);
    }
};

export const getFifaMatchId = (id) => {
    const game = state.worldCupGames.find(g => String(g.id) === String(id));
    return game?.fifaMatchId || id;
};

export const fetchMatchesList = async () => {
    try {
        state.dataFeedError = null;
        console.log("Fetching matches list from Vercel proxy...");
        const res = await fetch("/api/matches");
        if (!res.ok) {
            throw new Error(`HTTP Error ${res.status}`);
        }
        const data = await res.json();
        
        if (data && Array.isArray(data.Results)) {
            const mappedGames = data.Results.map(mapFifaMatch).filter(Boolean);
            state.currentLiveMatches = mappedGames;
            state.worldCupGames = mappedGames;
            console.log(`Successfully fetched ${state.worldCupGames.length} matches from proxy.`);
        } else {
            throw new Error("Invalid response format from matches proxy");
        }
    } catch (err) {
        console.error("Failed to fetch matches list:", err.message);
        state.dataFeedError = "Data Feed Temporarily Unavailable";
        showDataFeedErrorBanner(state.dataFeedError);
    }
};

export const fetchMatchDetails = async (matchId) => {
    try {
        state.dataFeedError = null;
        const fifaId = getFifaMatchId(matchId);
        console.log(`Fetching match details for ID ${matchId} (FIFA ID: ${fifaId}) from Vercel proxy...`);
        const res = await fetch(`/api/matches?matchId=${fifaId}`);
        if (!res.ok) {
            throw new Error(`HTTP Error ${res.status}`);
        }
        const data = await res.json();
        
        // Parallel or sequential timeline fetch
        try {
            const tlRes = await fetch(`/api/matches?matchId=${fifaId}&timeline=true`);
            if (tlRes.ok) {
                const tlData = await tlRes.json();
                data.timelineEvents = tlData?.Event || [];
            }
        } catch (e) {
            console.warn("Failed to fetch timeline for details:", e.message);
            data.timelineEvents = [];
        }

        state.currentSelectedMatchDetails = data;
        console.log(`Successfully fetched details for match ID ${matchId}.`);
        return data;
    } catch (err) {
        console.error(`Failed to fetch details for match ID ${matchId}:`, err.message);
        state.dataFeedError = "Data Feed Temporarily Unavailable";
        showDataFeedErrorBanner(state.dataFeedError);
        return null;
    }
};

export const fetchMatchTimeline = async (matchId) => {
    try {
        state.dataFeedError = null;
        const fifaId = getFifaMatchId(matchId);
        console.log(`Fetching timeline for ID ${matchId} (FIFA ID: ${fifaId}) from Vercel proxy...`);
        const res = await fetch(`/api/matches?matchId=${fifaId}&timeline=true`);
        if (!res.ok) {
            throw new Error(`HTTP Error ${res.status}`);
        }
        const data = await res.json();
        console.log(`Successfully fetched timeline for match ID ${matchId}.`);
        return data;
    } catch (err) {
        console.error(`Failed to fetch timeline for match ID ${matchId}:`, err.message);
        state.dataFeedError = "Data Feed Temporarily Unavailable";
        showDataFeedErrorBanner(state.dataFeedError);
        return null;
    }
};

