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
        
        // Verify response is JSON, otherwise fallback to local database
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            throw new Error("Response is not JSON");
        }

        const data = await res.json();
        
        if (data && Array.isArray(data.Results)) {
            const mappedGames = data.Results.map(mapFifaMatch).filter(Boolean);
            state.currentLiveMatches = mappedGames;
            state.worldCupGames = mappedGames;
            console.log(`Successfully fetched ${state.worldCupGames.length} matches from proxy.`);

            // Re-render bracket if visible to prevent blank screens due to initial empty loads
            const bracketOverlay = document.getElementById("bracket-overlay");
            if (bracketOverlay && bracketOverlay.classList.contains("open")) {
                import('./bracket.js').then(m => {
                    m.renderKnockoutBracket(document.getElementById("bracket-games-grid"));
                }).catch(err => console.error(err));
            }

            // Trigger redrawing Match Hub tab if active
            const activeTabBtn = document.querySelector('.tab-btn.active');
            if (activeTabBtn && activeTabBtn.dataset.tab === 'wc2026') {
                const t1 = document.getElementById('team1')?.value;
                const t2 = document.getElementById('team2')?.value;
                if (t1 && t2) {
                    import('../worldCupTab.js').then(m => {
                        m.drawWorldCupMatchesTab(t1, t2);
                    }).catch(err => console.error("Failed to reload Match Hub tab:", err));
                }
            }
        } else {
            throw new Error("Invalid response format from matches proxy");
        }
    } catch (err) {
        console.warn("Failed to fetch matches list, loading offline fallback matches database:", err.message);
        
        // Fetch static fallback database from JSON asset
        try {
            const fallbackRes = await fetch("/assets/fallback_matches.json");
            if (!fallbackRes.ok) {
                throw new Error(`HTTP Error ${fallbackRes.status}`);
            }
            const fallbackMatches = await fallbackRes.json();
            
            state.currentLiveMatches = fallbackMatches;
            state.worldCupGames = fallbackMatches;
            console.log(`Successfully loaded ${state.worldCupGames.length} matches from static fallback database.`);
            
            // Re-render bracket if visible
            const bracketOverlay = document.getElementById("bracket-overlay");
            if (bracketOverlay && bracketOverlay.classList.contains("open")) {
                import('./bracket.js').then(m => {
                    m.renderKnockoutBracket(document.getElementById("bracket-games-grid"));
                }).catch(e => console.error(e));
            }

            // Trigger redrawing Match Hub tab if active
            const activeTabBtn = document.querySelector('.tab-btn.active');
            if (activeTabBtn && activeTabBtn.dataset.tab === 'wc2026') {
                const t1 = document.getElementById('team1')?.value;
                const t2 = document.getElementById('team2')?.value;
                if (t1 && t2) {
                    import('../worldCupTab.js').then(m => {
                        m.drawWorldCupMatchesTab(t1, t2);
                    }).catch(e => console.error(e));
                }
            }
        } catch (fallbackErr) {
            console.error("Critical: Failed to load static fallback matches database:", fallbackErr.message);
            state.dataFeedError = "Data Feed Temporarily Unavailable";
            showDataFeedErrorBanner(state.dataFeedError);
        }
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

