import { state } from './matchcentre/state.js';
import { 
    formatToIST, 
    getStadiumName, 
    getWcTeamFlagHTML, 
    getTeamData, 
    normalizeTeamName 
} from './matchcentre/utils.js';
import { 
    fetchMatchesList, 
    fetchMatchDetails, 
    showDataFeedErrorBanner 
} from './matchcentre/api.js';
import { 
    updateLiveStandings, 
    aggregateGroupStandings, 
    renderGroupsExplorer 
} from './matchcentre/standings.js';
import { 
    drawLineupPitch 
} from './matchcentre/lineups.js';
import { 
    openMatchDetailPopup, 
    closeMatchDetail, 
    registerPopupCallbacks 
} from './matchcentre/popups.js';
import { 
    openExplorer, 
    closeExplorer, 
    openBracket, 
    closeBracket, 
    openGroups, 
    closeGroups, 
    filterExplorerGames, 
    drawCalendarGrid, 
    drawDayMatchesView, 
    createExplorerMatchCard 
} from './matchcentre/explorer.js';
import { 
    renderKnockoutBracket 
} from './matchcentre/bracket.js';
import { 
    updateConsoleDetails 
} from './matchcentre/console.js';

// Central re-exports of public API (facade pattern)
export { 
    formatToIST, 
    getStadiumName, 
    getWcTeamFlagHTML, 
    getTeamData, 
    normalizeTeamName,
    fetchMatchesList, 
    fetchMatchDetails, 
    showDataFeedErrorBanner,
    updateLiveStandings, 
    aggregateGroupStandings, 
    renderGroupsExplorer,
    drawLineupPitch,
    openMatchDetailPopup, 
    closeMatchDetail,
    openExplorer, 
    closeExplorer, 
    openBracket, 
    closeBracket, 
    openGroups, 
    closeGroups, 
    filterExplorerGames, 
    drawCalendarGrid, 
    drawDayMatchesView, 
    createExplorerMatchCard,
    renderKnockoutBracket,
    updateConsoleDetails
};

// Local helpers & selection loop
const getTodayMatches = () => {
    if (!state.worldCupGames || state.worldCupGames.length === 0) return [];

    const now = new Date();
    const todayStartOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const parseDate = (game) => {
        if (game.utcDate) return new Date(game.utcDate);
        if (game.local_date) {
            const [datePart, timePart] = game.local_date.split(' ');
            const [m, d, y] = datePart.split('/').map(Number);
            const [hr, min] = (timePart || '00:00').split(':').map(Number);
            return new Date(y, m - 1, d, hr, min);
        }
        return new Date(0);
    };

    const getDateString = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const todayStr = getDateString(now);
    const matchesToday = state.worldCupGames.filter(game => {
        const gameDate = parseDate(game);
        return getDateString(gameDate) === todayStr;
    });

    if (matchesToday.length > 0) {
        return matchesToday;
    }

    const upcomingGames = state.worldCupGames.filter(game => {
        const gameDate = parseDate(game);
        return gameDate >= todayStartOfDay;
    });

    if (upcomingGames.length > 0) {
        upcomingGames.sort((a, b) => parseDate(a) - parseDate(b));
        const earliestUpcomingDateStr = getDateString(parseDate(upcomingGames[0]));
        return state.worldCupGames.filter(game => getDateString(parseDate(game)) === earliestUpcomingDateStr);
    }

    const sortedGames = [...state.worldCupGames].sort((a, b) => parseDate(a) - parseDate(b));
    const latestDateStr = getDateString(parseDate(sortedGames[sortedGames.length - 1]));
    return state.worldCupGames.filter(game => getDateString(parseDate(game)) === latestDateStr);
};

export const renderLiveMatches = () => {
    const priorityList = document.getElementById("priority-matches-list");
    const generalList = document.getElementById("general-matches-list");

    if (!priorityList || !generalList) return;

    priorityList.innerHTML = "";
    generalList.innerHTML = "";

    const selectedT1 = document.getElementById("team1")?.value || "";
    const selectedT2 = document.getElementById("team2")?.value || "";

    const todayMatches = getTodayMatches();
    let matchDateStr = "";
    if (todayMatches[0]) {
        if (todayMatches[0].utcDate) {
            matchDateStr = new Date(todayMatches[0].utcDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
        } else if (todayMatches[0].local_date) {
            const ist = formatToIST(todayMatches[0].local_date, todayMatches[0].stadium_id, todayMatches[0].id);
            matchDateStr = ist.dateFull;
        }
    }
    
    const priorityTitle = document.querySelector(".prioritized-card .card-section-title");
    const generalTitle = document.querySelector(".general-matches-card .card-section-title");
    if (matchDateStr) {
        if (priorityTitle) priorityTitle.textContent = `⭐ Your Teams' Fixtures (${matchDateStr})`;
        if (generalTitle) generalTitle.textContent = `📅 Other Matchday Fixtures (${matchDateStr})`;
    } else {
        if (priorityTitle) priorityTitle.textContent = `⭐ Your Teams' Fixtures`;
        if (generalTitle) generalTitle.textContent = `📅 Other Matchday Fixtures`;
    }

    let priorityCount = 0;
    let generalCount = 0;

    todayMatches.forEach(game => {
        const hName = game.homeTeam?.name || game.home_team_name_en || "TBD";
        const aName = game.awayTeam?.name || game.away_team_name_en || "TBD";

        const isPriority = (selectedT1 && (hName === selectedT1 || aName === selectedT1)) ||
                           (selectedT2 && (hName === selectedT2 || aName === selectedT2));

        const card = document.createElement("div");
        card.className = "live-match-card";
        if (state.selectedLiveMatchId === game.id) {
            card.classList.add("active-selected");
        }

        if (!state.liveStates[game.id]) {
            const isLive = game.status === "IN_PLAY" || game.status === "PAUSED" || (game.finished === "FALSE" && game.time_elapsed !== "notstarted");
            const isFinished = game.status === "FINISHED" || game.finished === "TRUE";
            let initialMin = 0;
            if (isLive) {
                const parsed = parseInt(game.time_elapsed);
                initialMin = isNaN(parsed) ? 40 : parsed;
            } else if (isFinished) {
                initialMin = 90;
            }
            
            const initialScoreHome = game.score?.fullTime?.home !== null && game.score?.fullTime?.home !== undefined ? game.score.fullTime.home : (parseInt(game.home_score) || 0);
            const initialScoreAway = game.score?.fullTime?.away !== null && game.score?.fullTime?.away !== undefined ? game.score.fullTime.away : (parseInt(game.away_score) || 0);

            const liveState = {
                minute: initialMin,
                scoreHome: initialScoreHome,
                scoreAway: initialScoreAway,
                finished: isFinished,
                loadedAt: Date.now(),
                stats: {
                    possession: 50,
                    shotsHome: 0,
                    shotsAway: 0,
                    shotsOnTargetHome: 0,
                    shotsOnTargetAway: 0,
                    foulsHome: 0,
                    foulsAway: 0,
                    savesHome: 0,
                    savesAway: 0,
                    cornersHome: 0,
                    cornersAway: 0
                },
                timeline: []
            };
            state.liveStates[game.id] = liveState;
        }

        const liveState = state.liveStates[game.id];

        let scoreText = "vs";
        if (game.score?.fullTime?.home !== null && game.score?.fullTime?.home !== undefined) {
            scoreText = `${game.score.fullTime.home} - ${game.score.fullTime.away}`;
        } else if (liveState && liveState.scoreHome !== undefined) {
            scoreText = `${liveState.scoreHome} - ${liveState.scoreAway}`;
        }

        let statusText = "Upcoming";
        let statusClass = "status-upcoming";
        
        const status = game.status;
        if (status === "FINISHED") {
            statusText = "Finished";
            statusClass = "status-finished";
        } else if (status === "IN_PLAY" || status === "PAUSED") {
            statusText = status === "PAUSED" ? "HT" : "Live";
            statusClass = "status-live";
        } else if (liveState && liveState.finished) {
            statusText = "Finished";
            statusClass = "status-finished";
        }

        let matchTime = "";
        if (game.utcDate) {
            matchTime = new Date(game.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (game.local_date) {
            const istTime = formatToIST(game.local_date, game.stadium_id, game.id);
            matchTime = istTime.time;
        }

        const groupLabel = game.group ? game.group.replace("GROUP_", "Group ") : "";

        card.innerHTML = `
            <div class="m-card-teams">
                <div class="m-card-team-row">
                    ${getWcTeamFlagHTML(hName, "m-card-flag")}
                    <span class="m-card-team-name">${hName}</span>
                </div>
                <div class="m-card-team-row">
                    ${getWcTeamFlagHTML(aName, "m-card-flag")}
                    <span class="m-card-team-name">${aName}</span>
                </div>
            </div>
            <div class="m-card-score-box">
                <span class="m-card-score">${scoreText}</span>
                <span class="m-card-meta">${groupLabel} • ${matchTime}</span>
            </div>
            <span class="m-card-status-pill ${statusClass}">
                ${statusText}
            </span>
        `;

        card.addEventListener("click", () => {
            document.querySelectorAll(".live-match-card").forEach(c => c.classList.remove("active-selected"));
            card.classList.add("active-selected");
            selectLiveMatch(game);
        });

        if (isPriority) {
            priorityList.appendChild(card);
            priorityCount++;
        } else {
            generalList.appendChild(card);
            generalCount++;
        }
    });

    if (priorityCount === 0) {
        priorityList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px; font-size: 13px;">No fixtures involving your selected teams today.</div>`;
    }
    if (generalCount === 0) {
        generalList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px; font-size: 13px;">No other matchday fixtures today.</div>`;
    }
};

export const selectLiveMatch = async (game) => {
    state.selectedLiveMatchId = game.id;
    document.getElementById("console-empty-state")?.classList.add("hidden");
    document.getElementById("console-active-state")?.classList.remove("hidden");
    
    document.querySelectorAll(".console-tab-btn").forEach(b => {
        if (b.dataset.tab === "stats") b.classList.add("active");
        else b.classList.remove("active");
    });
    
    await fetchMatchDetails(game.id);
    updateConsoleDetails(game);
    updateLiveStandings();
};

registerPopupCallbacks(selectLiveMatch);

export const activateLiveArena = async () => {
    deactivateLiveArena();

    await fetchMatchesList();
    renderLiveMatches();
    updateLiveStandings();

    const todayMatches = getTodayMatches();
    if (todayMatches.length > 0 && !state.selectedLiveMatchId) {
        const liveGame = todayMatches.find(g => {
            return g.status === "IN_PLAY" || g.status === "PAUSED" || (g.finished === "FALSE" && g.time_elapsed !== "notstarted");
        }) || todayMatches[0];
        selectLiveMatch(liveGame);
    }

    state.matchesListInterval = setInterval(async () => {
        await fetchMatchesList();
        renderLiveMatches();
        updateLiveStandings();
    }, 60000);
};

export const deactivateLiveArena = () => {
    if (state.matchesListInterval) {
        clearInterval(state.matchesListInterval);
        state.matchesListInterval = null;
    }
};

export const setupLiveArenaListeners = () => {
    // Actions stack buttons
    document.getElementById("explore-all-btn")?.addEventListener("click", openExplorer);
    document.getElementById("explore-bracket-btn")?.addEventListener("click", openBracket);
    document.getElementById("explore-standings-btn")?.addEventListener("click", openGroups);

    // Explorer Results Overlay
    document.getElementById("explorer-close")?.addEventListener("click", closeExplorer);
    document.getElementById("explorer-overlay")?.addEventListener("click", (e) => {
        if (e.target === document.getElementById("explorer-overlay")) closeExplorer();
    });

    const searchInput = document.getElementById("explorer-search");
    searchInput?.addEventListener("input", (e) => {
        const activeTab = document.querySelector("#explorer-filter-tabs .filter-btn.active");
        const activeTabName = activeTab ? activeTab.dataset.tab : "calendar";
        filterExplorerGames(activeTabName, e.target.value);
    });

    document.getElementById("explorer-filter-tabs")?.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        document.querySelectorAll("#explorer-filter-tabs .filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const tabName = btn.dataset.tab;
        
        const searchWrapper = document.getElementById("explorer-search-wrapper");
        if (searchWrapper) {
            delete searchWrapper.dataset.randomized;
        }

        const query = document.getElementById("explorer-search")?.value || "";
        filterExplorerGames(tabName, query);
    });

    // Dedicated Bracket Overlay
    document.getElementById("bracket-close")?.addEventListener("click", closeBracket);
    document.getElementById("bracket-overlay")?.addEventListener("click", (e) => {
        if (e.target === document.getElementById("bracket-overlay")) closeBracket();
    });

    document.getElementById("bracket-games-grid")?.addEventListener("click", (e) => {
        const node = e.target.closest(".bracket-match-node");
        if (!node) return;

        const matchId = node.dataset.matchId;
        const isUnresolved = node.dataset.unresolved === "true";
        const game = state.worldCupGames.find(g => String(g.id) === String(matchId));

        if (isUnresolved) {
            node.classList.add("shake-node");
            node.querySelectorAll(".bracket-tooltip").forEach(t => t.remove());

            const tooltip = document.createElement("div");
            tooltip.className = "bracket-tooltip";
            tooltip.textContent = "Match Not Set";
            node.appendChild(tooltip);

            setTimeout(() => {
                node.classList.remove("shake-node");
            }, 350);

            setTimeout(() => {
                tooltip.remove();
            }, 1500);
        } else {
            if (game) {
                openMatchDetailPopup(game);
            }
        }
    });

    // Dedicated Standings Overlay
    document.getElementById("groups-close")?.addEventListener("click", closeGroups);
    document.getElementById("groups-overlay")?.addEventListener("click", (e) => {
        if (e.target === document.getElementById("groups-overlay")) closeGroups();
    });

    // Match Detail Popup Close
    document.getElementById("match-detail-close")?.addEventListener("click", closeMatchDetail);
    document.getElementById("match-detail-overlay")?.addEventListener("click", (e) => {
        if (e.target === document.getElementById("match-detail-overlay")) closeMatchDetail();
    });

    // Live Center Tab Switcher
    document.getElementById("console-tabs-nav")?.addEventListener("click", (e) => {
        const btn = e.target.closest(".console-tab-btn");
        if (!btn) return;
        document.querySelectorAll(".console-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const activeTab = btn.dataset.tab;
        document.querySelectorAll(".console-tab-content").forEach(c => {
            if (c.id === `console-tab-${activeTab}`) {
                c.classList.remove("hidden");
                c.classList.add("active");
            } else {
                c.classList.add("hidden");
                c.classList.remove("active");
            }
        });
    });
};
