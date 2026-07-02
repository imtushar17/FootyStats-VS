import { state } from './state.js';
import { getWcTeamFlagHTML, getStadiumName, formatToIST, getTeamData } from './utils.js';
import { closeExplorer, closeBracket, closeGroups } from './explorer.js';
import { fetchMatchDetails } from './api.js';

let selectLiveMatchCallback = null;

export const registerPopupCallbacks = (selectCallback) => {
    selectLiveMatchCallback = selectCallback;
};

export const closeMatchDetail = () => {
    document.getElementById("match-detail-overlay")?.classList.remove("open");
};

const getScorersHTML = (game) => {
    const parseScorers = (scorersStr) => {
        if (!scorersStr || scorersStr === "null") return [];
        try {
            if (scorersStr.startsWith("{")) {
                return JSON.parse(scorersStr.replace(/“|”/g, '"').replace(/{/g, '[').replace(/}/g, ']'));
            }
            return [scorersStr];
        } catch(e) {
            return [String(scorersStr).replace(/[{}"]/g, "")];
        }
    };

    const homeList = parseScorers(game.home_scorers);
    const awayList = parseScorers(game.away_scorers);

    const liveState = state.liveStates[game.id];
    let scoreHome = game.finished === "TRUE" ? (parseInt(game.home_score) || 0) : 0;
    let scoreAway = game.finished === "TRUE" ? (parseInt(game.away_score) || 0) : 0;

    if (liveState) {
        scoreHome = liveState.scoreHome;
        scoreAway = liveState.scoreAway;
    }

    const finalHomeList = [...homeList];
    while (finalHomeList.length < scoreHome) {
        finalHomeList.push("Goal");
    }

    const finalAwayList = [...awayList];
    while (finalAwayList.length < scoreAway) {
        finalAwayList.push("Goal");
    }

    if (finalHomeList.length === 0 && finalAwayList.length === 0) {
        return `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); font-size: 11px; padding: 10px 0;">No goals scored</div>`;
    }

    return `
        <div class="popup-scorers-col home">
            ${finalHomeList.map(s => `<div>⚽ ${s}</div>`).join("")}
        </div>
        <div class="popup-scorers-divider">|</div>
        <div class="popup-scorers-col away">
            ${finalAwayList.map(s => `<div>⚽ ${s}</div>`).join("")}
        </div>
    `;
};

const parseList = (str) => {
    if (!str || str === "null") return [];
    try {
        if (str.startsWith("{")) {
            return JSON.parse(str.replace(/“|”/g, '"').replace(/{/g, '[').replace(/}/g, ']'));
        }
        return [str];
    } catch(e) {
        return [String(str).replace(/[{}"]/g, "")];
    }
};

const getCoachName = (teamName, apiCoachName) => {
    if (apiCoachName) return apiCoachName;
    const teamData = getTeamData(teamName);
    return teamData?.coach || "Unknown";
};

const renderPopupLineupPitch = (container, teamName, isAway) => {
    if (!container) return;

    const getPositionCategory = (posStr) => {
        if (!posStr) return "MID";
        const clean = posStr.toUpperCase();
        if (clean.includes("GOAL") || clean.includes("KEEPER") || clean === "GK") return "GK";
        if (clean.includes("DEFENCE") || clean.includes("DEFENDER") || clean.includes("BACK") || clean === "DF") return "DEF";
        if (clean.includes("MIDFIELD") || clean.includes("MIDFIELDER") || clean === "MF") return "MID";
        if (clean.includes("OFFENCE") || clean.includes("FORWARD") || clean.includes("STRIKER") || clean.includes("WING") || clean === "FW" || clean === "ST") return "FWD";
        return "MID";
    };

    let starters = [];
    let bench = [];
    let formationText = "N/A";

    const apiLineup = isAway ? state.currentSelectedMatchDetails?.awayTeam?.lineup : state.currentSelectedMatchDetails?.homeTeam?.lineup;
    const apiBench = isAway ? state.currentSelectedMatchDetails?.awayTeam?.bench : state.currentSelectedMatchDetails?.homeTeam?.bench;
    const apiFormation = isAway ? state.currentSelectedMatchDetails?.awayTeam?.formation : state.currentSelectedMatchDetails?.homeTeam?.formation;

    const drawStartersOnPitch = () => {
        const gkList = starters.filter(p => p.pos === "GK");
        const defList = starters.filter(p => p.pos === "DEF");
        const midList = starters.filter(p => p.pos === "MID");
        const fwdList = starters.filter(p => p.pos === "FWD");

        if (formationText === "" || formationText === "N/A") {
            formationText = `${defList.length}-${midList.length}-${fwdList.length}`;
        }

        const teamDataObj = getTeamData(teamName);
        const coachName = getCoachName(teamName, isAway ? state.currentSelectedMatchDetails?.awayTeam?.coach?.name : state.currentSelectedMatchDetails?.homeTeam?.coach?.name);

        container.innerHTML = `
            <div class="active-tactics-meta" style="text-align: center; margin-bottom: 6px;">
                <h4 style="margin: 0; font-size: 11.5px; font-weight: 800; color: var(--text-light);">${teamName} Starting XI</h4>
                <p style="margin: 2px 0 0 0; font-size: 9.5px; color: var(--text-muted);">Formation: <strong>${formationText}</strong> | Coach: ${coachName}</p>
            </div>
            <div class="soccer-pitch" style="margin-top: 6px;">
                <div class="pitch-penalty-area left-area"></div>
                <div class="pitch-penalty-area right-area"></div>
                <div class="pitch-goal-area left-goal-area"></div>
                <div class="pitch-goal-area right-goal-area"></div>
                <div class="pitch-penalty-spot left-spot"></div>
                <div class="pitch-penalty-spot right-spot"></div>
                <div class="pitch-center-line"></div>
                <div class="pitch-center-circle"></div>
                <div class="pitch-goal-net left-net"></div>
                <div class="pitch-goal-net right-net"></div>
                <div class="lineup-jerseys-layer" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
            </div>
        `;

        const jerseysContainer = container.querySelector(".lineup-jerseys-layer");
        if (!jerseysContainer) return;

        const primaryColor = teamDataObj.primaryColor || "#3b82f6";
        const secondaryColor = teamDataObj.secondaryColor || "#ffffff";

        const appendLineupJersey = (player, leftPct, topPct) => {
            const node = document.createElement("div");
            node.className = "player-node";
            node.style.left = `${leftPct}%`;
            node.style.top = `${topPct}%`;
            
            const safePlayerId = player.name.replace(/\s+/g, '-').toLowerCase();

            node.innerHTML = `
                <div class="jersey-wrapper">
                    <svg class="player-jersey-svg" viewBox="0 0 100 100">
                        <filter id="popup-jersey-shadow-${safePlayerId}" x="-15%" y="-15%" width="130%" height="130%">
                            <feDropShadow dx="0" dy="5" stdDeviation="3.5" flood-opacity="0.35"/>
                        </filter>
                        <defs>
                            <linearGradient id="popup-jersey-grad-${safePlayerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="${primaryColor}"/>
                                <stop offset="100%" stop-color="color-mix(in srgb, ${primaryColor} 65%, #000000)"/>
                            </linearGradient>
                        </defs>
                        <g filter="url(#popup-jersey-shadow-${safePlayerId})">
                            <path d="M 12,38 L 28,22 L 40,32 L 28,50 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="2.5"/>
                            <path d="M 88,38 L 72,22 L 60,32 L 72,50 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="2.5"/>
                            <path d="M 28,32 L 72,32 L 72,88 L 28,88 Z" fill="url(#popup-jersey-grad-${safePlayerId})" stroke="${secondaryColor}" stroke-width="3" stroke-linejoin="round"/>
                            <path d="M 40,32 A 10,10 0 0,0 60,32 Z" fill="${secondaryColor}"/>
                        </g>
                        <text class="jersey-number" x="50" y="66" fill="${secondaryColor}" font-size="24" font-family="var(--font-heading)" font-weight="900" text-anchor="middle">${player.shirt}</text>
                    </svg>
                </div>
                <div class="player-node-label-container" style="margin-top: 3px; display: flex; flex-direction: column; align-items: center;">
                    <span class="player-node-label" style="font-size: 8px; padding: 1px 3.5px; white-space: nowrap; text-align: center;">${player.name.split(" ").pop()}</span>
                </div>
            `;
            jerseysContainer.appendChild(node);
        };

        const getTopPercentage = (count, idx) => {
            if (count === 1) return 50;
            const minTop = 16;
            const maxTop = 84;
            return minTop + (idx / (count - 1)) * (maxTop - minTop);
        };

        if (gkList.length > 0) {
            appendLineupJersey(gkList[0], 8, 50);
        }
        defList.forEach((player, idx) => {
            appendLineupJersey(player, 30, getTopPercentage(defList.length, idx));
        });
        midList.forEach((player, idx) => {
            appendLineupJersey(player, 56, getTopPercentage(midList.length, idx));
        });
        fwdList.forEach((player, idx) => {
            appendLineupJersey(player, 82, getTopPercentage(fwdList.length, idx));
        });
    };

    if (apiLineup && apiLineup.length > 0) {
        starters = apiLineup.map(p => ({
            name: p.name || "Player",
            shirt: p.shirtNumber || p.shirt || "-",
            pos: getPositionCategory(p.position || p.pos)
        }));
        bench = apiBench || [];
        formationText = apiFormation || "";
        drawStartersOnPitch();
    } else {
        // Fallback to static starting XI
        import('../lineups.js').then(m => {
            const staticStarters = m.getStartingXI(teamName);
            if (staticStarters && staticStarters.length > 0) {
                starters = staticStarters.map(p => ({
                    name: p.name,
                    shirt: p.shirt,
                    pos: p.pos
                }));
                // Try to infer formation
                const defs = starters.filter(p => p.pos === "DEF").length;
                const mids = starters.filter(p => p.pos === "MID").length;
                const fwds = starters.filter(p => p.pos === "FWD" || p.pos === "ST").length;
                formationText = `${defs}-${mids}-${fwds}`;
            }
            drawStartersOnPitch();
        }).catch(e => {
            console.error("Error loading fallback lineups:", e);
            container.innerHTML = `<div class="popup-lineups-announcement">Lineups for ${teamName} are currently not available.</div>`;
        });
        return;
    }

    // Renders the bench players list underneath the pitch!
    const benchContainer = container.parentElement?.querySelector(".popup-bench-container");
    if (benchContainer) {
        benchContainer.innerHTML = "";
        if (bench.length > 0) {
            benchContainer.innerHTML = `
                <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">Substitutes Bench</div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; overflow-y: auto; max-height: 12vh;">
                    ${bench.map(p => `
                        <div style="font-size: 10px; color: var(--text-main); display: flex; align-items: center; gap: 6px; padding: 4px 8px; background: rgba(255,255,255,0.02); border-radius: 4px;">
                            <span style="color: #10b981; font-weight: 800;">#${p.shirtNumber || "-"}</span>
                            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px;">${p.name}</span>
                        </div>
                    `).join("")}
                </div>
            `;
        }
    }
};

export const openMatchDetailPopup = async (game) => {
    const popup = document.getElementById("match-detail-overlay");
    const body = document.getElementById("match-detail-popup-body");
    if (!popup || !body) return;

    popup.classList.add("open");

    // Show loading spinner
    body.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted); font-size: 12.5px;">
            <div class="loading-spinner" style="margin: 0 auto 12px auto; border: 2.5px solid rgba(255,255,255,0.1); border-top-color: #10b981; border-radius: 50%; width: 22px; height: 22px; animation: spin 0.8s linear infinite;"></div>
            Loading match details...
        </div>
    `;

    // Fetch deep match details asynchronously from proxy API
    await fetchMatchDetails(game.id);

    const liveState = state.liveStates[game.id];
    let scoreHome = game.home_score;
    let scoreAway = game.away_score;
    let isLive = game.finished === "FALSE" && game.time_elapsed !== "notstarted";
    let isFinished = game.finished === "TRUE";

    if (liveState) {
        scoreHome = liveState.scoreHome;
        scoreAway = liveState.scoreAway;
        isLive = !liveState.finished && game.finished === "FALSE" && game.time_elapsed !== "notstarted";
        isFinished = liveState.finished;
    }

    if (game.score?.fullTime?.home !== null && game.score?.fullTime?.home !== undefined) {
        scoreHome = game.score.fullTime.home;
        scoreAway = game.score.fullTime.away;
        isFinished = game.status === "FINISHED";
        isLive = game.status === "IN_PLAY" || game.status === "PAUSED";
    }

    const scoreText = (isLive || isFinished) ? `${scoreHome} - ${scoreAway}` : "vs";
    const statusText = isLive ? `Live - ${liveState ? liveState.minute : game.time_elapsed}'` : isFinished ? "Finished" : "Upcoming";

    let dateStr = "";
    if (game.utcDate) {
        dateStr = new Date(game.utcDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    } else if (game.local_date) {
        const istTime = formatToIST(game.local_date, game.stadium_id, game.id);
        dateStr = istTime.full;
    }

    const hasPenalties = game.home_penalty_score !== undefined && 
                         game.home_penalty_score !== null && 
                         game.home_penalty_score !== "" && 
                         game.home_penalty_score !== "null" &&
                         game.away_penalty_score !== undefined &&
                         game.away_penalty_score !== null &&
                         game.away_penalty_score !== "" &&
                         game.away_penalty_score !== "null";
    let penaltiesHTML = "";
    if (hasPenalties) {
        const homePenaltyScorers = parseList(game.home_penalty_scorers);
        const awayPenaltyScorers = parseList(game.away_penalty_scorers);
        const homePenaltyMisses = parseList(game.home_penalty_misses);
        const awayPenaltyMisses = parseList(game.away_penalty_misses);

        penaltiesHTML = `
            <div class="popup-scorers-box" style="margin-top: 8px;">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #ef4444; margin-bottom: 6px; text-align: center;">Penalty Shootout (${game.home_penalty_score} - ${game.away_penalty_score})</div>
                <div style="font-size: 10.5px; color: var(--text-main); line-height: 1.5; text-align: center;">
                    <strong>${game.home_team_name_en}</strong>: ${homePenaltyScorers.length ? homePenaltyScorers.join(", ") : "None"} ${homePenaltyMisses.length ? `<span style="color: var(--text-muted);">(Missed: ${homePenaltyMisses.join(", ")})</span>` : ""}
                    <br>
                    <strong>${game.away_team_name_en}</strong>: ${awayPenaltyScorers.length ? awayPenaltyScorers.join(", ") : "None"} ${awayPenaltyMisses.length ? `<span style="color: var(--text-muted);">(Missed: ${awayPenaltyMisses.join(", ")})</span>` : ""}
                </div>
            </div>
        `;
    }

    const hName = game.homeTeam?.name || game.home_team_name_en || "TBD";
    const aName = game.awayTeam?.name || game.away_team_name_en || "TBD";
    const referees = state.currentSelectedMatchDetails?.referees || [];
    const refereeName = referees.find(r => r.role === "REFEREE")?.name || referees[0]?.name || "";

    // Generate Layout
    const scoreboardHTML = `
        <div class="popup-scoreboard" style="margin-bottom: 12px;">
            <div class="popup-team">
                ${getWcTeamFlagHTML(hName, "popup-team-flag")}
                <span class="popup-team-name">${hName}</span>
            </div>
            <div class="popup-score-box">
                <span class="popup-score-text">${scoreText}</span>
                <span class="popup-meta-text">${statusText}</span>
            </div>
            <div class="popup-team">
                ${getWcTeamFlagHTML(aName, "popup-team-flag")}
                <span class="popup-team-name">${aName}</span>
            </div>
        </div>
    `;

    const tabsNavHTML = `
        <div class="popup-tabs-nav">
            <button type="button" class="popup-tab-btn active" data-tab="overview">Overview</button>
            <button type="button" class="popup-tab-btn" data-tab="home-lineup">Lineup: ${hName.split(" ").pop()}</button>
            <button type="button" class="popup-tab-btn" data-tab="away-lineup">Lineup: ${aName.split(" ").pop()}</button>
            <button type="button" class="popup-tab-btn" data-tab="stats-events">Events & Stats</button>
        </div>
    `;

    const overviewHTML = `
        <div class="popup-tab-content active" id="popup-tab-overview">
            <div class="popup-scorers-box">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px; text-align: center;">Goalscorers</div>
                <div class="popup-scorers-list">
                    ${getScorersHTML(game)}
                </div>
            </div>
            ${penaltiesHTML}
            <div style="font-size: 10.5px; color: var(--text-muted); text-align: center; margin-top: 12px; line-height: 1.4; border-top: 1px solid var(--border-color); padding-top: 10px;">
                🏟️ <strong>Stadium:</strong> ${state.currentSelectedMatchDetails?.venue || getStadiumName(game.stadium_id || game.stadium)}<br>
                📅 <strong>Scheduled Date:</strong> ${dateStr}<br>
                🚩 <strong>Stage:</strong> Group ${game.group ? game.group.replace("GROUP_", "") : "Knockout"}<br>
                ${refereeName ? `⚖️ <strong>Referee:</strong> ${refereeName}` : ""}
            </div>
        </div>
    `;

    const homeLineupHTML = `
        <div class="popup-tab-content" id="popup-tab-home-lineup">
            <div class="popup-pitch-container" id="popup-home-pitch"></div>
            <div class="popup-bench-container" id="popup-home-bench" style="margin-top: 10px;"></div>
        </div>
    `;

    const awayLineupHTML = `
        <div class="popup-tab-content" id="popup-tab-away-lineup">
            <div class="popup-pitch-container" id="popup-away-pitch"></div>
            <div class="popup-bench-container" id="popup-away-bench" style="margin-top: 10px;"></div>
        </div>
    `;

    const statsEventsHTML = `
        <div class="popup-tab-content" id="popup-tab-stats-events">
            <div class="popup-events-list" id="popup-events-list"></div>
            <div class="popup-stats-wrapper" id="popup-stats-wrapper" style="margin-top: 12px; border-top: 1px solid var(--border-color); padding-top: 10px;"></div>
        </div>
    `;

    const ctaHTML = `
        <button type="button" class="explore-all-btn" id="popup-load-console-btn" style="width: 100%; justify-content: center; margin: 14px 0 0 0; background: #10b981 !important; color: #ffffff !important; font-weight: 800 !important; border: none !important; box-shadow: var(--shadow-sm) !important;">
            ⚽ View Live Arena Hub
        </button>
    `;

    body.innerHTML = scoreboardHTML + tabsNavHTML + overviewHTML + homeLineupHTML + awayLineupHTML + statsEventsHTML + ctaHTML;

    // Attach Tab Switcher listener
    body.querySelectorAll(".popup-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            body.querySelectorAll(".popup-tab-btn").forEach(b => b.classList.remove("active"));
            body.querySelectorAll(".popup-tab-content").forEach(c => c.classList.remove("active"));

            btn.classList.add("active");
            const tabId = `popup-tab-${btn.dataset.tab}`;
            body.querySelector(`#${tabId}`)?.classList.add("active");
        });
    });

    // Render Home and Away lineups
    const homePitchContainer = body.querySelector("#popup-home-pitch");
    const awayPitchContainer = body.querySelector("#popup-away-pitch");
    renderPopupLineupPitch(homePitchContainer, hName, false);
    renderPopupLineupPitch(awayPitchContainer, aName, true);

    // Populate Events & Stats
    const eventsListEl = body.querySelector("#popup-events-list");
    const statsWrapper = body.querySelector("#popup-stats-wrapper");

    // Chronological Events
    const events = state.currentSelectedMatchDetails?.events || [];
    if (eventsListEl) {
        if (events.length > 0) {
            const sortedEvents = [...events].sort((a, b) => (a.minute || 0) - (b.minute || 0));
            sortedEvents.forEach(evt => {
                let icon = "❓";
                const typeText = evt.type || "";
                if (typeText.includes("GOAL")) icon = "⚽";
                else if (typeText.includes("YELLOW")) icon = "🟨";
                else if (typeText.includes("RED")) icon = "🟥";
                else if (typeText.includes("SUBST")) icon = "🔄";

                const teamName = evt.team?.name || "";
                let desc = `<strong>${typeText.replace(/_/g, " ")}</strong> - ${evt.player?.name || "Player"} (${teamName})`;
                if (typeText.includes("SUBST")) {
                    desc = `<strong>Substitution</strong> - In: ${evt.playerIn?.name || "Player"} | Out: ${evt.playerOut?.name || "Player"} (${teamName})`;
                }

                const row = document.createElement("div");
                row.className = "popup-event-row";
                row.innerHTML = `
                    <span class="popup-event-time">${evt.minute || 0}'</span>
                    <span class="popup-event-icon">${icon}</span>
                    <span class="popup-event-desc">${desc}</span>
                `;
                eventsListEl.appendChild(row);
            });
        } else {
            eventsListEl.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 24px; font-size: 11px;">No commentary events recorded in this match.</div>`;
        }
    }

    // Dynamic Stats row
    if (statsWrapper) {
        statsWrapper.innerHTML = "";
        if (liveState && liveState.stats) {
            const buildStatRow = (title, valHome, valAway) => {
                const intHome = parseInt(valHome) || 0;
                const intAway = parseInt(valAway) || 0;
                const total = intHome + intAway;
                const pctHome = total > 0 ? (intHome / total) * 100 : 50;
                const pctAway = total > 0 ? (intAway / total) * 100 : 50;
                return `
                    <div class="split-bar-metric" style="margin-bottom: 6px;">
                        <div class="split-bar-col team1-side">
                            <span class="split-val" style="font-size: 11px;">${valHome}</span>
                            <div class="split-track" style="height: 4px; background: rgba(255,255,255,0.06);">
                                <div class="split-fill" style="width: ${pctHome}%; background: #10b981; margin-left: auto;"></div>
                            </div>
                        </div>
                        <div class="split-bar-label" style="font-size: 9.5px; font-weight: 800; text-transform: uppercase; color: var(--text-muted);">${title}</div>
                        <div class="split-bar-col team2-side">
                            <div class="split-track" style="height: 4px; background: rgba(255,255,255,0.06);">
                                <div class="split-fill" style="width: ${pctAway}%; background: #60a5fa;"></div>
                            </div>
                            <span class="split-val" style="font-size: 11px;">${valAway}</span>
                        </div>
                    </div>
                `;
            };

            const homePoss = liveState.stats?.possession || 50;
            const awayPoss = 100 - homePoss;

            statsWrapper.innerHTML = `
                <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">Match Statistics</div>
                ${buildStatRow("Possession", `${homePoss}%`, `${awayPoss}%`)}
                ${buildStatRow("Shots", liveState.stats?.shotsHome || 0, liveState.stats?.shotsAway || 0)}
                ${buildStatRow("Shots on Target", liveState.stats?.shotsOnTargetHome || 0, liveState.stats?.shotsOnTargetAway || 0)}
                ${buildStatRow("Goalkeeper Saves", liveState.stats?.savesHome || 0, liveState.stats?.savesAway || 0)}
                ${buildStatRow("Corners", liveState.stats?.cornersHome || 0, liveState.stats?.cornersAway || 0)}
            `;
        } else {
            statsWrapper.style.display = "none";
        }
    }

    // View Hub CTA
    document.getElementById("popup-load-console-btn")?.addEventListener("click", () => {
        popup.classList.remove("open");
        closeExplorer();
        closeBracket();
        closeGroups();
        if (selectLiveMatchCallback) {
            selectLiveMatchCallback(game);
        }
    });
};
