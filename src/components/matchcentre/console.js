import { state } from './state.js';
import { getWcTeamFlagHTML, getStadiumName, formatToIST, getTeamData, normalizeTeamName, escapeHTML, isMatchFinished, isMatchLive, isMatchUpcoming, getGameScore, parseGameDate } from './utils.js';
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
    
    // Dynamic draw percentage based on team ranking gap (draw probability decreases for unbalanced match)
    const diff = Math.abs(rH - rA);
    const drawPct = Math.max(18, Math.min(32, Math.round(30 - (diff / 100))));
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
            const isFinished = isMatchFinished(g);
            if (!isFinished) return false;
            
            const ghName = g.homeTeam?.name || g.home_team_name_en;
            const gaName = g.awayTeam?.name || g.away_team_name_en;
            const normH = normalizeTeamName(ghName);
            const normA = normalizeTeamName(gaName);
            const normTarget = normalizeTeamName(teamName);
            return normH === normTarget || normA === normTarget;
        }).sort((a, b) => {
            return parseGameDate(a).getTime() - parseGameDate(b).getTime();
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

            const scoreVal = getGameScore(g);
            const scoreHome = scoreVal.home !== null ? scoreVal.home : 0;
            const scoreAway = scoreVal.away !== null ? scoreVal.away : 0;

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
                    // If group stage, shootout wins are points-wise draws
                    if (g.stage === "GROUP_STAGE") {
                        pills.push("d");
                        draws++;
                        points += 1;
                    } else {
                        if (targetWonPen) {
                            pills.push("w");
                            wins++;
                        } else {
                            pills.push("l");
                            losses++;
                        }
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

    const displayT1 = escapeHTML(t1);
    const displayT2 = escapeHTML(t2);
    const displayStarH = escapeHTML(starH);
    const displayStarA = escapeHTML(starA);
    const displayPosH = escapeHTML(posH);
    const displayPosA = escapeHTML(posA);
    const displayDateText = escapeHTML(dateText);
    const displayTimeText = escapeHTML(timeText);
    const displayVenue = escapeHTML(getStadiumName(game.stadium_id));
    const displayGroup = game.group ? escapeHTML(game.group.replace("GROUP_", "Group ")) : "Knockout";

    const homeColor = teamH.primaryColor || '#2563eb';
    const awayColor = teamA.primaryColor || '#dc2626';

    hub.innerHTML = `
        <div class="prematch-hub">
            <div class="prematch-section">
                <span class="prematch-section-title" style="display: flex; align-items: center; gap: 6px;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-blue);"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
                    <span>Win Probability Predictor</span>
                </span>
                <div class="win-predictor-track">
                    <div class="win-fill home" style="width: ${homeWinPct}%; background: ${homeColor} !important;">${homeWinPct}%</div>
                    <div class="win-fill draw" style="width: ${drawPct}%; background: #64748b !important;">${drawPct}%</div>
                    <div class="win-fill away" style="width: ${awayWinPct}%; background: ${awayColor} !important;">${awayWinPct}%</div>
                </div>
                <div class="win-labels-grid">
                    <span class="win-label home">${displayT1} Win</span>
                    <span class="win-label draw">Draw</span>
                    <span class="win-label away">${displayT2} Win</span>
                </div>
            </div>

            <div class="prematch-section">
                <span class="prematch-section-title" style="display: flex; align-items: center; gap: 6px;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-blue);"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    <span>Team Rating Comparison</span>
                </span>
                <div class="strength-compare-box">
                    <div class="strength-bar-row">
                        <span class="strength-team-val home">${hAtt}</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill home" style="width: ${hAtt}%; background: ${homeColor} !important;"></div>
                        </div>
                        <span class="strength-bar-label">ATTACK</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill away" style="width: ${aAtt}%; background: ${awayColor} !important;"></div>
                        </div>
                        <span class="strength-team-val away">${aAtt}</span>
                    </div>
                    <div class="strength-bar-row">
                        <span class="strength-team-val home">${hMid}</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill home" style="width: ${hMid}%; background: ${homeColor} !important;"></div>
                        </div>
                        <span class="strength-bar-label">MIDFIELD</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill away" style="width: ${aMid}%; background: ${awayColor} !important;"></div>
                        </div>
                        <span class="strength-team-val away">${aMid}</span>
                    </div>
                    <div class="strength-bar-row">
                        <span class="strength-team-val home">${hDef}</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill home" style="width: ${hDef}%; background: ${homeColor} !important;"></div>
                        </div>
                        <span class="strength-bar-label">DEFENSE</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill away" style="width: ${aDef}%; background: ${awayColor} !important;"></div>
                        </div>
                        <span class="strength-team-val away">${aDef}</span>
                    </div>
                </div>
            </div>

            <div class="prematch-section">
                <span class="prematch-section-title" style="display: flex; align-items: center; gap: 6px;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-blue);"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                    <span>World Cup Form</span>
                </span>
                <div class="form-row">
                    <div class="form-team-info">
                        ${getWcTeamFlagHTML(t1, "standings-tbl-flag")}
                        <span>${displayT1}</span>
                    </div>
                    <div class="form-pills">
                        ${formH.pills.map(p => `<span class="form-pill ${p}">${escapeHTML(p.toUpperCase())}</span>`).join('')}
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-team-info">
                        ${getWcTeamFlagHTML(t2, "standings-tbl-flag")}
                        <span>${displayT2}</span>
                    </div>
                    <div class="form-pills">
                        ${formA.pills.map(p => `<span class="form-pill ${p}">${escapeHTML(p.toUpperCase())}</span>`).join('')}
                    </div>
                </div>
            </div>

            <div class="prematch-section">
                <span class="prematch-section-title" style="display: flex; align-items: center; gap: 6px;">
                    <svg class="section-icon star-icon" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" style="color: var(--accent-gold);"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <span>Key Star Player Matchup</span>
                </span>
                <div class="matchup-cards-row">
                    <div class="matchup-card">
                        <span class="player-ovr">${ratingH}</span>
                        <span class="player-name">${displayStarH}</span>
                        <span class="player-meta">${displayPosH}</span>
                    </div>
                    <span class="matchup-vs-badge">VS</span>
                    <div class="matchup-card">
                        <span class="player-ovr">${ratingA}</span>
                        <span class="player-name">${displayStarA}</span>
                        <span class="player-meta">${displayPosA}</span>
                    </div>
                </div>
            </div>

            <div class="prematch-section">
                <span class="prematch-section-title" style="display: flex; align-items: center; gap: 6px;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-blue);"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <span>Match Information</span>
                </span>
                <div class="prematch-info-box">
                    <div class="info-item">
                        <span class="info-label">Venue Stadium</span>
                        <span class="info-value">${displayVenue}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Group/Stage</span>
                        <span class="info-value">${displayGroup}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Scheduled Date</span>
                        <span class="info-value">${displayDateText}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Scheduled Time</span>
                        <span class="info-value">${displayTimeText}</span>
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

    const isUpcoming = isMatchUpcoming(game);
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

    const details = state.currentSelectedMatchDetails;

    if (stadiumEl) {
        const venueStr = details?.Stadium?.Name?.[0]?.Description || details?.venue || getStadiumName(game.stadium_id);
        const apiOfficials = details?.Officials || [];
        const mainReferee = apiOfficials.find(o => o.OfficialType === 1)?.Name?.[0]?.Description || apiOfficials[0]?.Name?.[0]?.Description || "";
        stadiumEl.textContent = mainReferee ? `${venueStr} (Ref: ${mainReferee})` : venueStr;
    }

    if (groupEl) {
        const groupText = game.group ? `Group ${game.group.replace("GROUP_", "")}` : (game.stage ? game.stage.replace(/_/g, " ") : "");
        let dateText = "";
        const targetUtc = details?.utcDate || game.utcDate;
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

    const apiHomeScore = details?.score?.fullTime?.home !== undefined ? details.score.fullTime.home : details?.HomeTeam?.Score;
    const apiAwayScore = details?.score?.fullTime?.away !== undefined ? details.score.fullTime.away : details?.AwayTeam?.Score;
    const displayHomeScore = apiHomeScore !== null && apiHomeScore !== undefined ? apiHomeScore : (liveState ? liveState.scoreHome : "-");
    const displayAwayScore = apiAwayScore !== null && apiAwayScore !== undefined ? apiAwayScore : (liveState ? liveState.scoreAway : "-");

    if (hScoreEl) hScoreEl.textContent = displayHomeScore;
    if (aScoreEl) aScoreEl.textContent = displayAwayScore;

    const timeEl = document.getElementById("console-time");
    if (timeEl) {
        timeEl.className = "console-time-elapsed";
        const isFinished = isMatchFinished(game);
        const isLive = isMatchLive(game);
        if (isFinished) {
            timeEl.textContent = "Finished";
            timeEl.classList.add("status-finished");
        } else if (isLive) {
            timeEl.textContent = game.status === "PAUSED" ? "HT" : "Live";
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
        const getScorerName = (team, idPlayer) => {
            const p = team?.Players?.find(pl => String(pl.IdPlayer) === String(idPlayer));
            return p?.PlayerName?.[0]?.Description || "Goal";
        };

        if (details?.HomeTeam?.Goals || details?.AwayTeam?.Goals) {
            (details.HomeTeam.Goals || []).forEach(g => {
                if (String(g.Period) === "11") return; // Skip penalty shootout goals
                const name = escapeHTML(getScorerName(details.HomeTeam, g.IdPlayer));
                 if (homeScorersList) homeScorersList.innerHTML += `<div><svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 6px; vertical-align: middle; color: var(--text-muted); opacity: 0.6;"><circle cx="12" cy="12" r="12"></circle></svg>${name} ${escapeHTML(g.Minute || "")}</div>`;
            });
            (details.AwayTeam.Goals || []).forEach(g => {
                if (String(g.Period) === "11") return; // Skip penalty shootout goals
                const name = escapeHTML(getScorerName(details.AwayTeam, g.IdPlayer));
                if (awayScorersList) awayScorersList.innerHTML += `<div><svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 6px; vertical-align: middle; color: var(--text-muted); opacity: 0.6;"><circle cx="12" cy="12" r="12"></circle></svg>${name} ${escapeHTML(g.Minute || "")}</div>`;
            });
        } else {
            if (game.home_scorers && game.home_scorers !== "null") {
                const array = game.home_scorers.startsWith("{") ? JSON.parse(game.home_scorers.replace(/“|”/g, '"').replace(/{/g, '[').replace(/}/g, ']')) : [game.home_scorers];
                array.forEach(s => {
                    if (homeScorersList) homeScorersList.innerHTML += `<div>${escapeHTML(s)}</div>`;
                });
            }
            if (game.away_scorers && game.away_scorers !== "null") {
                const array = game.away_scorers.startsWith("{") ? JSON.parse(game.away_scorers.replace(/“|”/g, '"').replace(/{/g, '[').replace(/}/g, ']')) : [game.away_scorers];
                array.forEach(s => {
                    if (awayScorersList) awayScorersList.innerHTML += `<div>${escapeHTML(s)}</div>`;
                });
            }
        }
    } catch (e) {
        console.error("Failed to parse goals:", e.message);
    }

    const scorersBox = document.querySelector(".console-scorers-box");
    if (scorersBox) {
        const hasHomeScorers = homeScorersList && homeScorersList.innerHTML.trim() !== "";
        const hasAwayScorers = awayScorersList && awayScorersList.innerHTML.trim() !== "";
        if (hasHomeScorers || hasAwayScorers) {
            scorersBox.classList.remove("hidden");
        } else {
            scorersBox.classList.add("hidden");
        }
    }

    const statsGrid = document.getElementById("console-stats-grid");
    const timelineEvents = details?.timelineEvents || [];

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

        const homeTeamId = details?.HomeTeam?.IdTeam || game.homeTeam?.id;
        const awayTeamId = details?.AwayTeam?.IdTeam || game.awayTeam?.id;

        if (timelineEvents.length > 0 && homeTeamId && awayTeamId) {
            const countEventType = (typeCode, teamId) => {
                return timelineEvents.filter(e => e.Type === typeCode && String(e.IdTeam) === String(teamId)).length;
            };

            const shotsH = countEventType(12, homeTeamId);
            const shotsA = countEventType(12, awayTeamId);
            const cornersH = countEventType(16, homeTeamId);
            const cornersA = countEventType(16, awayTeamId);
            const foulsH = countEventType(18, homeTeamId);
            const foulsA = countEventType(18, awayTeamId);
            const savesH = countEventType(57, homeTeamId);
            const savesA = countEventType(57, awayTeamId);

            statsGrid.innerHTML = `
                ${buildConsoleStatBar("Shots", shotsH, shotsA)}
                ${buildConsoleStatBar("Corners", cornersH, cornersA)}
                ${buildConsoleStatBar("Fouls", foulsH, foulsA)}
                ${buildConsoleStatBar("Saves", savesH, savesA)}
            `;
        } else if (liveState && liveState.stats) {
            const homePossession = liveState.stats.possession || 50;
            const awayPossession = 100 - homePossession;
            statsGrid.innerHTML = `
                ${buildConsoleStatBar("Possession", `${homePossession}%`, `${awayPossession}%`)}
                ${buildConsoleStatBar("Shots", liveState.stats.shotsHome || 0, liveState.stats.shotsAway || 0)}
                ${buildConsoleStatBar("Shots on Target", liveState.stats.shotsOnTargetHome || 0, liveState.stats.shotsOnTargetAway || 0)}
                ${buildConsoleStatBar("Fouls", liveState.stats.foulsHome || 0, liveState.stats.foulsAway || 0)}
                ${buildConsoleStatBar("Goalkeeper Saves", liveState.stats.savesHome || 0, liveState.stats.savesAway || 0)}
                ${buildConsoleStatBar("Corners", liveState.stats.cornersHome || 0, liveState.stats.cornersAway || 0)}
            `;
        }
    }

    const timelineLog = document.getElementById("console-timeline-log");
    if (timelineLog) {
        timelineLog.innerHTML = "";

        if (timelineEvents.length > 0) {
            timelineEvents.forEach(evt => {
                let icon = '<span class="material-symbols-outlined" style="font-size: 16px; color: var(--accent-blue); vertical-align: middle;">headset_mic</span>';
                const typeCode = evt.Type;
                if (typeCode === 0) icon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><path d="M12 2C12 2 15 7 15 12C15 17 12 22 12 22C12 22 9 17 9 12C9 7 12 2 12 2Z"></path><path d="M2 12H22"></path></svg>';
                else if (typeCode === 2) icon = '<span class="event-badge card-yellow" style="display: inline-block; width: 9px; height: 13px; background: #eab308; border-radius: 1.5px; vertical-align: middle; box-shadow: 0 1px 2px rgba(0,0,0,0.15);"></span>';
                else if (typeCode === 3 || typeCode === 9) icon = '<span class="event-badge card-red" style="display: inline-block; width: 9px; height: 13px; background: #ef4444; border-radius: 1.5px; vertical-align: middle; box-shadow: 0 1px 2px rgba(0,0,0,0.15);"></span>';
                else if (typeCode === 5) icon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>';
                
                const desc = evt.EventDescription?.[0]?.Description || "Match event";

                const evCard = document.createElement("div");
                evCard.className = "timeline-event-card";
                evCard.innerHTML = `
                    <span class="t-event-time">${escapeHTML(evt.MatchMinute || "0'")}</span>
                    <span class="t-event-icon">${icon}</span>
                    <span class="t-event-desc">${escapeHTML(desc)}</span>
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
                        <span class="t-event-time">${escapeHTML(event.min)}'</span>
                        <span class="t-event-icon">${event.icon}</span>
                        <span class="t-event-desc">${escapeHTML(event.desc)}</span>
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
