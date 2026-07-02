import { state } from './state.js';

export const showDataFeedErrorBanner = (message) => {
    const errorBanner = document.getElementById("data-feed-error-banner");
    if (errorBanner) {
        errorBanner.textContent = message;
        errorBanner.style.display = "block";
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
        
        setTimeout(() => {
            banner.remove();
        }, 3000);
    }
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
        
        if (data && Array.isArray(data.matches)) {
            state.currentLiveMatches = data.matches;
            state.worldCupGames = data.matches;
            console.log(`Successfully fetched ${state.currentLiveMatches.length} matches from proxy.`);
        } else if (data && Array.isArray(data.games)) {
            state.currentLiveMatches = data.games;
            state.worldCupGames = data.games;
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
        console.log(`Fetching match details for ID ${matchId} from Vercel proxy...`);
        const res = await fetch(`/api/matches?matchId=${matchId}`);
        if (!res.ok) {
            throw new Error(`HTTP Error ${res.status}`);
        }
        const data = await res.json();
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
