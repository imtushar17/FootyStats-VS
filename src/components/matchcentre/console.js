import { state } from './state.js';
import { getWcTeamFlagHTML, getStadiumName, formatToIST, getTeamData, normalizeTeamName } from './utils.js';
import { drawLineupPitch } from './lineups.js';

export const drawPreMatchHub = (game) => {
    const hub = document.getElementById("console-prematch-hub");
    if (!hub) return;

    const t1 = game.homeTeam?.name || game.home_team_name_en || "TBD";
    const t2 = game.awayTeam?.name || game.away_team_name_en || "TBD";
    const teamH = getTeamData(t1);
    const teamA = getTeamData(t2);

    const rH = teamH.rankingPoints || 1400;
    const rA = teamA.rankingPoints || 1400;
    const totalR = rH + rA;
    const drawPct = 26;
    const remainingPct = 100 - drawPct;
    const homeWinPct = Math.round((rH / totalR) * remainingPct);
    const awayWinPct = 100 - drawPct - homeWinPct;

    const getAvgRating = (teamObj) => {
        if (!teamObj.squad || teamObj.squad.length === 0) return 75;
        const sum = teamObj.squad.reduce((acc, p) => acc + p.rating, 0);
        return Math.round(sum / teamObj.squad.length);
    };
    
    const hOvr = getAvgRating(teamH);
    const aOvr = getAvgRating(teamA);
    
    const getPosRating = (teamObj, posType) => {
        if (!teamObj.squad) return 75;
        const players = teamObj.squad.filter(p => p.pos === posType || (posType === "FWD" && p.pos === "ST"));
        if (players.length === 0) return getAvgRating(teamObj);
        return Math.round(players.reduce((acc, p) => acc + p.rating, 0) / players.length);
    };

    const hAtt = getPosRating(teamH, "FWD");
    const aAtt = getPosRating(teamA, "FWD");
    const hMid = getPosRating(teamH, "MID");
    const aMid = getPosRating(teamA, "MID");
    const hDef = getPosRating(teamH, "DEF");
    const aDef = getPosRating(teamA, "DEF");

    const getWorldCupForm = (teamName) => {
        const playedGames = state.worldCupGames.filter(g => {
            const isFinished = g.status === "FINISHED" || g.finished === "TRUE";
            if (!isFinished) return false;
            
            const ghName = g.homeTeam?.name || g.home_team_name_en;
            const gaName = g.awayTeam?.name || g.away_team_name_en;
            const normH = normalizeTeamName(ghName);
            const normA = normalizeTeamName(gaName);
            const normTarget = normalizeTeamName(teamName);
            return normH === normTarget || normA === normTarget;
        }).sort((a, b) => {
            const parseDate = (game) => {
                if (game.utcDate) return new Date(game.utcDate).getTime();
                if (game.local_date) {
                    const [datePart, timePart] = game.local_date.split(" ");
                    const [m, d, y] = datePart.split("/").map(Number);
                    const [h, min] = timePart.split(":").map(Number);
                    return new Date(y, m - 1, d, h, min).getTime();
                }
                return 0;
            };
            return parseDate(a) - parseDate(b);
        });

        const pills = [];
        let wins = 0;
        let draws = 0;
        let losses = 0;
        let points = 0;
        let goalsScored = 0;
        let goalsConceded = 0;

        playedGames.forEach(g => {
            const ghName = g.homeTeam?.name || g.home_team_name_en;
            const normH = normalizeTeamName(ghName);
            const normTarget = normalizeTeamName(teamName);
            const isHome = normH === normTarget;

            let scoreHome = 0;
            let scoreAway = 0;
            if (g.score?.fullTime?.home !== null && g.score?.fullTime?.home !== undefined) {
                scoreHome = g.score.fullTime.home;
                scoreAway = g.score.fullTime.away;
            } else {
                scoreHome = parseInt(g.home_score) || 0;
                scoreAway = parseInt(g.away_score) || 0;
            }

            const goalsFor = isHome ? scoreHome : scoreAway;
            const goalsAgainst = isHome ? scoreAway : scoreHome;

            goalsScored += goalsFor;
            goalsConceded += goalsAgainst;

            const penH = g.home_penalty_score !== undefined && g.home_penalty_score !== null && g.home_penalty_score !== "" && g.home_penalty_score !== "null" ? parseInt(g.home_penalty_score) || 0 : null;
            const penA = g.away_penalty_score !== undefined && g.away_penalty_score !== null && g.away_penalty_score !== "" && g.away_penalty_score !== "null" ? parseInt(g.away_penalty_score) || 0 : null;

            if (goalsFor > goalsAgainst) {
                pills.push("w");
                wins++;
                points += 3;
            } else if (goalsFor < goalsAgainst) {
                pills.push("l");
                losses++;
            } else {
                if (penH !== null && penA !== null) {
                    const homeWonPen = penH > penA;
                    const targetWonPen = isHome ? homeWonPen : !homeWonPen;
                    if (targetWonPen) {
                        pills.push("w");
                        wins++;
                        points += 3;
                    } else {
                        pills.push("l");
                        losses++;
                    }
                } else {
                    pills.push("d");
                    draws++;
                    points += 1;
                }
            }
        });

        const gd = goalsScored - goalsConceded;
        const parts = [];
        if (wins > 0) parts.push(`${wins} Win${wins > 1 ? "s" : ""}`);
        if (draws > 0) parts.push(`${draws} Draw${draws > 1 ? "s" : ""}`);
        if (losses > 0) parts.push(`${losses} Loss${losses > 1 ? "es" : ""}`);

        const statsSummary = parts.length > 0 ? parts.join(", ") : "0 Wins, 0 Draws, 0 Losses";
        const gdStr = `, ${gd > 0 ? '+' : ''}${gd} GD`;
        const text = `${statsSummary} (${points} pts${gdStr})`;

        return { pills, text };
    };

    const formH = getWorldCupForm(t1);
    const formA = getWorldCupForm(t2);

    const starH = teamH.starPlayer || "Key Player";
    const starA = teamA.starPlayer || "Key Player";
    const ratingH = teamH.playerCard?.rating || 85;
    const ratingA = teamA.playerCard?.rating || 85;
    const posH = teamH.playerCard?.pos || "MID";
    const posA = teamA.playerCard?.pos || "MID";

    let dateText = "";
    if (game.utcDate) {
        dateText = new Date(game.utcDate).toLocaleDateString([], { dateStyle: 'medium' });
    } else if (game.local_date) {
        dateText = formatToIST(game.local_date, game.stadium_id, game.id).dateFull;
    }

    let timeText = "";
    if (game.utcDate) {
        timeText = new Date(game.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (game.local_date) {
        timeText = formatToIST(game.local_date, game.stadium_id, game.id).time;
    }

    hub.innerHTML = `
        <div class="prematch-hub">
            <div class="prematch-section">
                <span class="prematch-section-title">🔮 Win Probability Predictor</span>
                <div class="win-predictor-track">
                    <div class="win-fill home" style="width: ${homeWinPct}%;">${homeWinPct}%</div>
                    <div class="win-fill draw" style="width: ${drawPct}%;">${drawPct}%</div>
                    <div class="win-fill away" style="width: ${awayWinPct}%;">${awayWinPct}%</div>
                </div>
                <div class="win-labels-grid">
                    <span class="win-label home">${t1} Win</span>
                    <span class="win-label draw">Draw</span>
                    <span class="win-label away">${t2} Win</span>
                </div>
            </div>

            <div class="prematch-section">
                <span class="prematch-section-title">📊 Team Rating Comparison</span>
                <div class="strength-compare-box">
                    <div class="strength-bar-row">
                        <span class="strength-team-val home">${hAtt}</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill home" style="width: ${hAtt}%; background: #10b981;"></div>
                        </div>
                        <span class="strength-bar-label">ATTACK</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill away" style="width: ${aAtt}%; background: #3b82f6;"></div>
                        </div>
                        <span class="strength-team-val away">${aAtt}</span>
                    </div>
                    <div class="strength-bar-row">
                        <span class="strength-team-val home">${hMid}</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill home" style="width: ${hMid}%; background: #10b981;"></div>
                        </div>
                        <span class="strength-bar-label">MIDFIELD</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill away" style="width: ${aMid}%; background: #3b82f6;"></div>
                        </div>
                        <span class="strength-team-val away">${aMid}</span>
                    </div>
                    <div class="strength-bar-row">
                        <span class="strength-team-val home">${hDef}</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill home" style="width: ${hDef}%; background: #10b981;"></div>
                        </div>
                        <span class="strength-bar-label">DEFENSE</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill away" style="width: ${aDef}%; background: #3b82f6;"></div>
                        </div>
                        <span class="strength-team-val away">${aDef}</span>
                    </div>
                </div>
            </div>

            <div class="prematch-section">
                <span class="prematch-section-title">📈 World Cup Form</span>
                <div class="form-row">
                    <div class="form-team-info">
                        ${getWcTeamFlagHTML(t1, "standings-tbl-flag")}
                        <span>${t1}</span>
                    </div>
                    <div class="form-pills">
                        ${formH.pills.map(p => `<span class="form-pill ${p}">${p.toUpperCase()}</span>`).join('')}
                    </div>
                    <span class="form-stats-text">${formH.text}</span>
                </div>
                <div class="form-row">
                    <div class="form-team-info">
                        ${getWcTeamFlagHTML(t2, "standings-tbl-flag")}
                        <span>${t2}</span>
                    </div>
                    <div class="form-pills">
                        ${formA.pills.map(p => `<span class="form-pill ${p}">${p.toUpperCase()}</span>`).join('')}
                    </div>
                    <span class="form-stats-text">${formA.text}</span>
                </div>
            </div>

            <div class="prematch-section">
                <span class="prematch-section-title">⭐ Key Star Player Matchup</span>
                <div class="matchup-cards-row">
                    <div class="matchup-card">
                        <span class="player-ovr">${ratingH}</span>
                        <span class="player-name">${starH}</span>
                        <span class="player-meta">${posH}</span>
                    </div>
                    <span class="matchup-vs-badge">VS</span>
                    <div class="matchup-card">
                        <span class="player-ovr">${ratingA}</span>
                        <span class="player-name">${starA}</span>
                        <span class="player-meta">${posA}</span>
                    </div>
                </div>
            </div>

            <div class="prematch-section">
                <span class="prematch-section-title">🏟️ Match Information</span>
                <div class="prematch-info-box">
                    <div class="info-item">
                        <span class="info-label">Venue Stadium</span>
                        <span class="info-value">${getStadiumName(game.stadium_id)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Group/Stage</span>
                        <span class="info-value">${game.group ? game.group.replace("GROUP_", "Group ") : "Knockout"}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Scheduled Date</span>
                        <span class="info-value">${dateText}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Scheduled Time</span>
                        <span class="info-value">${timeText}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export const updateConsoleDetails = (game) => {
    if (state.selectedLiveMatchId !== game.id) return;
    const liveState = state.liveStates[game.id];
    if (!liveState) return;

    const isUpcoming = (game.status === "TIMED" || game.status === "SCHEDULED" || (game.finished === "FALSE" && game.time_elapsed === "notstarted"));
    const navTabs = document.getElementById("console-tabs-nav");
    const prematchHub = document.getElementById("console-prematch-hub");

    if (isUpcoming) {
        if (navTabs) navTabs.classList.add("hidden");
        document.querySelectorAll(".console-tab-content").forEach(c => {
            if (c.id === "console-prematch-hub") {
                c.classList.remove("hidden");
                c.classList.add("active");
            } else {
                c.classList.add("hidden");
                c.classList.remove("active");
            }
        });
        drawPreMatchHub(game);
    } else {
        if (navTabs) navTabs.classList.remove("hidden");
        if (prematchHub) {
            prematchHub.classList.add("hidden");
            prematchHub.classList.remove("active");
        }
        
        let activeTabBtn = document.querySelector(".console-tab-btn.active");
        if (!activeTabBtn) {
            const defaultBtn = document.querySelector(".console-tab-btn[data-tab='stats']");
            if (defaultBtn) {
                defaultBtn.classList.add("active");
                activeTabBtn = defaultBtn;
            }
        }
        
        if (activeTabBtn) {
            const tabName = activeTabBtn.dataset.tab;
            document.querySelectorAll(".console-tab-content").forEach(c => {
                if (c.id === `console-tab-${tabName}`) {
                    c.classList.remove("hidden");
                    c.classList.add("active");
                } else {
                    c.classList.add("hidden");
                    c.classList.remove("active");
                }
            });
        }

        const hName = game.homeTeam?.name || game.home_team_name_en || "TBD";
        drawLineupPitch(game, hName);
    }

    const stadiumEl = document.getElementById("console-stadium-name");
    const groupEl = document.getElementById("console-group-name");
    const hFlagEl = document.getElementById("console-home-flag");
    const hNameEl = document.getElementById("console-home-name");
    const aFlagEl = document.getElementById("console-away-flag");
    const aNameEl = document.getElementById("console-away-name");
    const hScoreEl = document.getElementById("console-home-score");
    const aScoreEl = document.getElementById("console-away-score");

    if (stadiumEl) {
        const venueStr = state.currentSelectedMatchDetails?.venue || getStadiumName(game.stadium_id);
        const referees = state.currentSelectedMatchDetails?.referees || [];
        const mainReferee = referees.find(r => r.role === "REFEREE")?.name || referees[0]?.name || "";
        stadiumEl.textContent = mainReferee ? `${venueStr} (Ref: ${mainReferee})` : venueStr;
    }

    if (groupEl) {
        const groupText = game.group ? `Group ${game.group.replace("GROUP_", "")}` : "";
        let dateText = "";
        const targetUtc = state.currentSelectedMatchDetails?.utcDate || game.utcDate;
        if (targetUtc) {
            dateText = ` | Kickoff: ${new Date(targetUtc).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}`;
        }
        groupEl.textContent = `${groupText}${dateText}`;
    }

    const homeTeamDisplayName = game.homeTeam?.name || game.home_team_name_en || "TBD";
    const awayTeamDisplayName = game.awayTeam?.name || game.away_team_name_en || "TBD";

    if (hFlagEl) hFlagEl.innerHTML = getWcTeamFlagHTML(homeTeamDisplayName, "console-flag");
    if (hNameEl) hNameEl.textContent = homeTeamDisplayName;
    if (aFlagEl) aFlagEl.innerHTML = getWcTeamFlagHTML(awayTeamDisplayName, "console-flag");
    if (aNameEl) aNameEl.textContent = awayTeamDisplayName;

    const apiHomeScore = state.currentSelectedMatchDetails?.score?.fullTime?.home;
    const apiAwayScore = state.currentSelectedMatchDetails?.score?.fullTime?.away;
    const displayHomeScore = apiHomeScore !== null && apiHomeScore !== undefined ? apiHomeScore : (liveState ? liveState.scoreHome : "-");
    const displayAwayScore = apiAwayScore !== null && apiAwayScore !== undefined ? apiAwayScore : (liveState ? liveState.scoreAway : "-");

    if (hScoreEl) hScoreEl.textContent = displayHomeScore;
    if (aScoreEl) aScoreEl.textContent = displayAwayScore;

    const timeEl = document.getElementById("console-time");
    if (timeEl) {
        timeEl.className = "console-time-elapsed";
        const status = state.currentSelectedMatchDetails?.status || game.status;
        if (status === "FINISHED") {
            timeEl.textContent = "Finished";
            timeEl.classList.add("status-finished");
        } else if (status === "IN_PLAY" || status === "PAUSED") {
            timeEl.textContent = status === "PAUSED" ? "HT" : "Live";
            timeEl.classList.add("status-live");
        } else {
            timeEl.textContent = "Upcoming";
            timeEl.classList.add("status-upcoming");
        }
    }

    const homeScorersList = document.getElementById("console-home-scorers");
    const awayScorersList = document.getElementById("console-away-scorers");
    if (homeScorersList) homeScorersList.innerHTML = "";
    if (awayScorersList) awayScorersList.innerHTML = "";

    try {
        const events = state.currentSelectedMatchDetails?.events || [];
        const goalEvents = events.filter(e => e.type === "GOAL");
        if (goalEvents.length > 0) {
            goalEvents.forEach(evt => {
                const scorerName = evt.player?.name || "Goal";
                const min = evt.minute || "";
                const isHome = evt.team?.id === state.currentSelectedMatchDetails?.homeTeam?.id;
                const list = isHome ? homeScorersList : awayScorersList;
                if (list) list.innerHTML += `<div>${scorerName} ${min}'</div>`;
            });
        } else {
            if (game.home_scorers && game.home_scorers !== "null") {
                const array = game.home_scorers.startsWith("{") ? JSON.parse(game.home_scorers.replace(/“|”/g, '"').replace(/{/g, '[').replace(/}/g, ']')) : [game.home_scorers];
                array.forEach(s => {
                    if (homeScorersList) homeScorersList.innerHTML += `<div>${s}</div>`;
                });
            }
            if (game.away_scorers && game.away_scorers !== "null") {
                const array = game.away_scorers.startsWith("{") ? JSON.parse(game.away_scorers.replace(/“|”/g, '"').replace(/{/g, '[').replace(/}/g, ']')) : [game.away_scorers];
                array.forEach(s => {
                    if (awayScorersList) awayScorersList.innerHTML += `<div>${s}</div>`;
                });
            }
        }
    } catch (e) {
        console.warn("Error rendering scorers list:", e);
    }

    const statsGrid = document.getElementById("console-stats-grid");
    if (statsGrid) {
        statsGrid.innerHTML = "";

        const buildConsoleStatBar = (title, valHome, valAway) => {
            const intHome = parseInt(valHome) || 0;
            const intAway = parseInt(valAway) || 0;
            const total = intHome + intAway;
            const pctHome = total > 0 ? (intHome / total) * 100 : 50;
            const pctAway = total > 0 ? (intAway / total) * 100 : 50;

            return `
                <div class="split-bar-metric" style="margin-bottom: 8px;">
                    <div class="split-bar-col team1-side">
                        <span class="split-val" style="font-size: 13px;">${valHome}</span>
                        <div class="split-track" style="height: 6px; background: rgba(255,255,255,0.06);">
                            <div class="split-fill" style="width: ${pctHome}%; background: #10b981; margin-left: auto;"></div>
                        </div>
                    </div>
                    <div class="split-bar-label" style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-muted);">${title}</div>
                    <div class="split-bar-col team2-side">
                        <div class="split-track" style="height: 6px; background: rgba(255,255,255,0.06);">
                            <div class="split-fill" style="width: ${pctAway}%; background: #60a5fa;"></div>
                        </div>
                        <span class="split-val" style="font-size: 13px;">${valAway}</span>
                    </div>
                </div>
            `;
        };

        const homePossession = liveState.stats?.possession || 50;
        const awayPossession = 100 - homePossession;

        statsGrid.innerHTML = `
            ${buildConsoleStatBar("Possession", `${homePossession}%`, `${awayPossession}%`)}
            ${buildConsoleStatBar("Shots", liveState.stats?.shotsHome || 0, liveState.stats?.shotsAway || 0)}
            ${buildConsoleStatBar("Shots on Target", liveState.stats?.shotsOnTargetHome || 0, liveState.stats?.shotsOnTargetAway || 0)}
            ${buildConsoleStatBar("Fouls", liveState.stats?.foulsHome || 0, liveState.stats?.foulsAway || 0)}
            ${buildConsoleStatBar("Goalkeeper Saves", liveState.stats?.savesHome || 0, liveState.stats?.savesAway || 0)}
            ${buildConsoleStatBar("Corners", liveState.stats?.cornersHome || 0, liveState.stats?.cornersAway || 0)}
        `;
    }

    const timelineLog = document.getElementById("console-timeline-log");
    if (timelineLog) {
        timelineLog.innerHTML = "";

        const events = state.currentSelectedMatchDetails?.events || [];
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
                const playerName = evt.player?.name || "Player";
                const desc = `<strong>${typeText.replace(/_/g, " ")}</strong> - ${playerName} (${teamName})`;

                const evCard = document.createElement("div");
                evCard.className = "timeline-event-card";
                evCard.innerHTML = `
                    <span class="t-event-time">${evt.minute || 0}'</span>
                    <span class="t-event-icon">${icon}</span>
                    <span class="t-event-desc">${desc}</span>
                `;
                timelineLog.appendChild(evCard);
            });
            timelineLog.scrollTop = timelineLog.scrollHeight;
        } else {
            if (liveState.timeline && liveState.timeline.length > 0) {
                liveState.timeline.forEach(event => {
                    const evCard = document.createElement("div");
                    evCard.className = "timeline-event-card";
                    evCard.innerHTML = `
                        <span class="t-event-time">${event.min}'</span>
                        <span class="t-event-icon">${event.icon}</span>
                        <span class="t-event-desc">${event.desc}</span>
                    `;
                    timelineLog.appendChild(evCard);
                });
                timelineLog.scrollTop = timelineLog.scrollHeight;
            } else {
                timelineLog.innerHTML = `<div class="timeline-empty" style="text-align: center; color: var(--text-muted); padding: 24px; font-size: 12px;">No match commentary available.</div>`;
            }
        }
    }
};
