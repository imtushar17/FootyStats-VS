import { state } from './state.js';
import { getWcTeamFlagHTML, getStadiumName, formatToIST, getTeamData, normalizeTeamName, escapeHTML, isMatchFinished, isMatchLive, isMatchUpcoming, getGameScore } from './utils.js';
import { closeExplorer, closeBracket, closeGroups } from './explorer.js';
import { fetchMatchDetails, fetchMatchTimeline } from './api.js';

let selectLiveMatchCallback = null;

export const registerPopupCallbacks = (selectCallback) => {
    selectLiveMatchCallback = selectCallback;
};

export const closeMatchDetail = () => {
    document.getElementById("match-detail-overlay")?.classList.remove("open");
};

const getScorersHTML = (game, hName, aName) => {
    const getScorerName = (team, idPlayer) => {
        const p = team?.Players?.find(pl => String(pl.IdPlayer) === String(idPlayer));
        return p?.PlayerName?.[0]?.Description || "Goal";
    };

    const details = state.currentSelectedMatchDetails;
    let homeGoals = [];
    let awayGoals = [];

    if (details?.HomeTeam?.Goals || details?.AwayTeam?.Goals) {
        homeGoals = (details.HomeTeam.Goals || [])
            .filter(g => String(g.Period) !== "11")
            .map(g => {
                const name = escapeHTML(getScorerName(details.HomeTeam, g.IdPlayer));
                return `${name} ${escapeHTML(g.Minute || "")}`;
            });
        awayGoals = (details.AwayTeam.Goals || [])
            .filter(g => String(g.Period) !== "11")
            .map(g => {
                const name = escapeHTML(getScorerName(details.AwayTeam, g.IdPlayer));
                return `${name} ${escapeHTML(g.Minute || "")}`;
            });
    } else {
        // Fallback: legacy static data
        const parseScorers = (scorersStr) => {
            if (!scorersStr || scorersStr === "null") return [];
            try {
                if (scorersStr.startsWith("{")) {
                    return JSON.parse(scorersStr.replace(/\u201c|\u201d/g, '"').replace(/{/g, '[').replace(/}/g, ']'));
                }
                return [scorersStr];
            } catch(e) {
                return [String(scorersStr).replace(/[{}"]/g, "")];
            }
        };
        homeGoals = parseScorers(game.home_scorers).map(escapeHTML);
        awayGoals = parseScorers(game.away_scorers).map(escapeHTML);

        const liveState = state.liveStates[game.id];
        const scoreHome = liveState ? liveState.scoreHome : (parseInt(game.home_score) || 0);
        const scoreAway = liveState ? liveState.scoreAway : (parseInt(game.away_score) || 0);
        while (homeGoals.length < scoreHome) homeGoals.push("Goal");
        while (awayGoals.length < scoreAway) awayGoals.push("Goal");
    }

    if (homeGoals.length === 0 && awayGoals.length === 0) {
        return `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); font-size: 11px; padding: 10px 0;">No goals scored</div>`;
    }

    return `
        <div class="popup-scorers-col home">
            ${homeGoals.map(s => `<div>⚽ ${s}</div>`).join("")}
        </div>
        <div class="popup-scorers-divider">|</div>
        <div class="popup-scorers-col away">
            ${awayGoals.map(s => `<div>⚽ ${s}</div>`).join("")}
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
    let isEstimated = false;

    const activeTeamObj = isAway ? state.currentSelectedMatchDetails?.AwayTeam : state.currentSelectedMatchDetails?.HomeTeam;
    const apiPlayers = activeTeamObj?.Players || [];
    const hasApiLineup = apiPlayers.length > 0;

    let apiLineup = [];
    let apiBench = [];
    let apiFormation = "";

    if (hasApiLineup) {
        apiLineup = apiPlayers.filter(p => p.Status === 1);
        apiBench = apiPlayers.filter(p => p.Status === 2);
        apiFormation = activeTeamObj.Tactics || "";
    } else {
        // Fallback to legacy fields if the old structure is populated
        apiLineup = isAway ? state.currentSelectedMatchDetails?.awayTeam?.lineup : state.currentSelectedMatchDetails?.homeTeam?.lineup;
        apiBench = isAway ? state.currentSelectedMatchDetails?.awayTeam?.bench : state.currentSelectedMatchDetails?.homeTeam?.bench;
        apiFormation = isAway ? state.currentSelectedMatchDetails?.awayTeam?.formation : state.currentSelectedMatchDetails?.homeTeam?.formation;
    }

    const drawStartersOnPitch = () => {
        const gkList = starters.filter(p => p.pos === "GK");
        const defList = starters.filter(p => p.pos === "DEF");
        const midList = starters.filter(p => p.pos === "MID");
        const fwdList = starters.filter(p => p.pos === "FWD");

        if (formationText === "" || formationText === "N/A") {
            formationText = `${defList.length}-${midList.length}-${fwdList.length}`;
        }

        const teamDataObj = getTeamData(teamName);
        const apiCoach = activeTeamObj?.Coaches?.find(c => c.Role === 0)?.Name?.[0]?.Description || activeTeamObj?.Coaches?.[0]?.Name?.[0]?.Description || "";
        const coachName = getCoachName(teamName, apiCoach || (isAway ? state.currentSelectedMatchDetails?.awayTeam?.coach?.name : state.currentSelectedMatchDetails?.homeTeam?.coach?.name));

        const displayTeamName = escapeHTML(teamName);
        const displayFormation = escapeHTML(formationText);
        const displayCoachName = escapeHTML(coachName);

        container.innerHTML = `
            <div class="active-tactics-meta" style="text-align: center; margin-bottom: 6px;">
                <h4 style="margin: 0; font-size: 11.5px; font-weight: 800; color: var(--text-light);">${displayTeamName} Starting XI ${isEstimated ? '<span class="console-badge font-est" style="font-size: 8px; padding: 1px 4px; background: rgba(234,179,8,0.15); color: #eab308; border-radius: 4px; margin-left: 4px;">ESTIMATED</span>' : ''}</h4>
                <p style="margin: 2px 0 0 0; font-size: 9.5px; color: var(--text-muted);">Formation: <strong>${displayFormation}</strong> | Coach: ${displayCoachName}</p>
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
            const escapedName = escapeHTML(player.name);
            const escapedShirt = escapeHTML(player.shirt);
            const surname = escapeHTML(player.name.split(" ").pop());

            const escapedPicture = player.picture ? escapeHTML(player.picture) : "";
            const avatarHTML = escapedPicture
                ? `<div class="player-pitch-avatar-wrapper" style="border: 2px solid ${primaryColor};">
                     <div class="player-pitch-avatar-crop">
                         <img src="${escapedPicture}" class="player-pitch-avatar" alt="${escapedName}" onerror="this.parentElement.style.display='none'; this.parentElement.nextElementSibling.style.display='block';" />
                     </div>
                     <div class="player-fallback-jersey" style="display: none; width: 100%; height: 100%;">
                         <svg class="player-jersey-svg" viewBox="0 0 100 100">
                             <filter id="popup-jersey-shadow-${escapeHTML(safePlayerId)}" x="-15%" y="-15%" width="130%" height="130%">
                                 <feDropShadow dx="0" dy="5" stdDeviation="3.5" flood-opacity="0.35"/>
                             </filter>
                             <defs>
                                 <linearGradient id="popup-jersey-grad-${escapeHTML(safePlayerId)}" x1="0%" y1="0%" x2="100%" y2="100%">
                                     <stop offset="0%" stop-color="${primaryColor}"/>
                                     <stop offset="100%" stop-color="color-mix(in srgb, ${primaryColor} 65%, #000000)"/>
                                 </linearGradient>
                             </defs>
                             <g filter="url(#popup-jersey-shadow-${escapeHTML(safePlayerId)})">
                                 <path d="M 12,38 L 28,22 L 40,32 L 28,50 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="2.5"/>
                                 <path d="M 88,38 L 72,22 L 60,32 L 72,50 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="2.5"/>
                                 <path d="M 28,32 L 72,32 L 72,88 L 28,88 Z" fill="url(#popup-jersey-grad-${escapeHTML(safePlayerId)})" stroke="${secondaryColor}" stroke-width="3" stroke-linejoin="round"/>
                                 <path d="M 40,32 A 10,10 0 0,0 60,32 Z" fill="${secondaryColor}"/>
                             </g>
                             <text class="jersey-number" x="50" y="66" fill="${secondaryColor}" font-size="24" font-family="var(--font-heading)" font-weight="900" text-anchor="middle">${escapedShirt}</text>
                         </svg>
                     </div>
                     <div class="player-pitch-avatar-number-badge" style="background: ${primaryColor}; color: ${secondaryColor};">${escapedShirt}</div>
                   </div>`
                : `<svg class="player-jersey-svg" viewBox="0 0 100 100">
                        <filter id="popup-jersey-shadow-${escapeHTML(safePlayerId)}" x="-15%" y="-15%" width="130%" height="130%">
                            <feDropShadow dx="0" dy="5" stdDeviation="3.5" flood-opacity="0.35"/>
                        </filter>
                        <defs>
                            <linearGradient id="popup-jersey-grad-${escapeHTML(safePlayerId)}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="${primaryColor}"/>
                                <stop offset="100%" stop-color="color-mix(in srgb, ${primaryColor} 65%, #000000)"/>
                            </linearGradient>
                        </defs>
                        <g filter="url(#popup-jersey-shadow-${escapeHTML(safePlayerId)})">
                            <path d="M 12,38 L 28,22 L 40,32 L 28,50 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="2.5"/>
                            <path d="M 88,38 L 72,22 L 60,32 L 72,50 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="2.5"/>
                            <path d="M 28,32 L 72,32 L 72,88 L 28,88 Z" fill="url(#popup-jersey-grad-${escapeHTML(safePlayerId)})" stroke="${secondaryColor}" stroke-width="3" stroke-linejoin="round"/>
                            <path d="M 40,32 A 10,10 0 0,0 60,32 Z" fill="${secondaryColor}"/>
                        </g>
                        <text class="jersey-number" x="50" y="66" fill="${secondaryColor}" font-size="24" font-family="var(--font-heading)" font-weight="900" text-anchor="middle">${escapedShirt}</text>
                    </svg>`;

            node.innerHTML = `
                <div class="jersey-wrapper">
                    ${avatarHTML}
                </div>
                <div class="player-node-label-container" style="margin-top: 3px; display: flex; flex-direction: column; align-items: center;">
                    <span class="player-node-label" style="font-size: 8px; padding: 1px 3.5px; white-space: nowrap; text-align: center;">${surname}</span>
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

    const drawBenchList = () => {
        const benchContainer = container.parentElement?.querySelector(".popup-bench-container");
        if (benchContainer) {
            benchContainer.innerHTML = "";
            if (bench.length > 0) {
                benchContainer.innerHTML = `
                    <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">Substitutes Bench</div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; overflow-y: auto; max-height: 12vh;">
                        ${bench.map(p => `
                            <div style="font-size: 10px; color: var(--text-main); display: flex; align-items: center; gap: 6px; padding: 4px 8px; background: rgba(255,255,255,0.02); border-radius: 4px;">
                                <span style="color: #10b981; font-weight: 800;">#${escapeHTML(p.shirt || "-")}</span>
                                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px;">${escapeHTML(p.name)}</span>
                            </div>
                        `).join("")}
                    </div>
                `;
            }
        }
    };

    if (apiLineup && apiLineup.length > 0) {
        starters = apiLineup.map(p => {
            const nameDesc = p.PlayerName?.[0]?.Description || p.ShortName?.[0]?.Description || p.name || "Player";
            return {
                name: nameDesc,
                shirt: p.ShirtNumber || p.shirtNumber || p.shirt || "-",
                pos: getPositionCategory(p.Position !== undefined ? String(p.Position) : (p.position || p.pos))
            };
        });
        bench = apiBench.map(p => {
            const nameDesc = p.PlayerName?.[0]?.Description || p.ShortName?.[0]?.Description || p.name || "Player";
            return {
                name: nameDesc,
                shirt: p.ShirtNumber || p.shirtNumber || p.shirt || "-"
            };
        });
        formationText = apiFormation || "";
        drawStartersOnPitch();
        drawBenchList();
    } else {
        // Fallback to static starting XI
        isEstimated = true;
        import('../../data/lineups.js').then(m => {
            const staticStarters = m.getStartingXI(teamName);
            if (staticStarters && staticStarters.length > 0) {
                starters = staticStarters.map(p => ({
                    name: p.name,
                    shirt: p.shirt,
                    pos: p.pos
                }));
                const defs = starters.filter(p => p.pos === "DEF").length;
                const mids = starters.filter(p => p.pos === "MID").length;
                const fwds = starters.filter(p => p.pos === "FWD" || p.pos === "ST").length;
                formationText = `${defs}-${mids}-${fwds}`;
            }
            drawStartersOnPitch();
            drawBenchList();
        }).catch(e => {
            console.error("Error loading fallback lineups:", e);
            container.innerHTML = `<div class="popup-lineups-announcement">Lineups for ${escapeHTML(teamName)} are currently not available.</div>`;
        });
    }
};

const renderPopupVerticalLineups = (pitchContainer, hName, aName, timelineEvents) => {
    if (!pitchContainer) return;

    const matchObj = state.currentSelectedMatchDetails || {};
    const isUpcoming = isMatchUpcoming(matchObj);

    const homeTeamObj = matchObj.HomeTeam;
    const awayTeamObj = matchObj.AwayTeam;

    const homeApiPlayers = homeTeamObj?.Players || [];
    const awayApiPlayers = awayTeamObj?.Players || [];

    if (isUpcoming || (homeApiPlayers.length === 0 && awayApiPlayers.length === 0)) {
        pitchContainer.innerHTML = `
            <div class="popup-lineups-announcement" style="text-align: center; padding: 40px 20px; font-family: var(--font-heading); color: var(--text-muted); font-size: 14px; font-weight: 700; border: 1.5px dashed var(--border-color); border-radius: 12px; margin: 20px 0;">
                📢 Lineups will be available on Kick-Off
            </div>
        `;
        return;
    }

    const getPositionCategory = (posStr) => {
        if (!posStr) return "MID";
        const clean = posStr.toUpperCase();
        if (clean.includes("GOAL") || clean.includes("KEEPER") || clean === "GK") return "GK";
        if (clean.includes("DEFENCE") || clean.includes("DEFENDER") || clean.includes("BACK") || clean === "DF") return "DEF";
        if (clean.includes("MIDFIELD") || clean.includes("MIDFIELDER") || clean === "MF") return "MID";
        if (clean.includes("OFFENCE") || clean.includes("FORWARD") || clean.includes("STRIKER") || clean.includes("WING") || clean === "FW" || clean === "ST") return "FWD";
        return "MID";
    };

    const getPlayerPicture = (playerName, teamName) => {
        const teamObj = getTeamData(teamName);
        if (!teamObj || !Array.isArray(teamObj.squad)) return "";
        
        const cleanSearchName = normalizeTeamName(playerName).toLowerCase();
        const searchSurname = cleanSearchName.split(" ").pop();

        let found = teamObj.squad.find(p => normalizeTeamName(p.name).toLowerCase() === cleanSearchName);
        if (!found && searchSurname) {
            found = teamObj.squad.find(p => normalizeTeamName(p.name).toLowerCase().includes(searchSurname));
        }

        if (found && found.sofascoreId) {
            return `./assets/portraits/${found.sofascoreId}.png`;
        }
        return "";
    };

    const getPlayersList = (apiPlayers, teamName, isAwayTeam) => {
        let list = [];
        if (apiPlayers.length > 0) {
            list = apiPlayers.filter(p => p.Status === 1).map(p => {
                const posStr = String(p.Position);
                let pos = "MID";
                if (posStr === "0") pos = "GK";
                else if (posStr === "1") pos = "DEF";
                else if (posStr === "2") pos = "MID";
                else if (posStr === "3") pos = "FWD";
                
                const pName = p.PlayerName?.[0]?.Description || p.ShortName?.[0]?.Description || p.ShortClubName || "Player";
                const apiPic = p.PlayerPicture?.PictureUrl;
                const localPic = getPlayerPicture(pName, teamName);

                return {
                    name: pName,
                    shirt: String(p.ShirtNumber || ""),
                    pos: pos,
                    picture: apiPic || localPic || ""
                };
            });
        } else {
            const legacyLineup = isAwayTeam ? state.currentSelectedMatchDetails?.awayTeam?.lineup : state.currentSelectedMatchDetails?.homeTeam?.lineup;
            if (Array.isArray(legacyLineup)) {
                list = legacyLineup.map(p => ({
                    name: p.name || "Player",
                    shirt: String(p.shirt || ""),
                    pos: getPositionCategory(p.position),
                    picture: p.picture || getPlayerPicture(p.name || "", teamName) || ""
                }));
            }
        }
        return list;
    };

    const getBenchList = (apiPlayers, teamName, isAwayTeam) => {
        let list = [];
        if (apiPlayers.length > 0) {
            list = apiPlayers.filter(p => p.Status === 2).map(p => {
                const posStr = String(p.Position);
                let pos = "MID";
                if (posStr === "0") pos = "GK";
                else if (posStr === "1") pos = "DEF";
                else if (posStr === "2") pos = "MID";
                else if (posStr === "3") pos = "FWD";
                
                const pName = p.PlayerName?.[0]?.Description || p.ShortName?.[0]?.Description || p.ShortClubName || "Player";
                const apiPic = p.PlayerPicture?.PictureUrl;
                const localPic = getPlayerPicture(pName, teamName);

                return {
                    name: pName,
                    shirt: String(p.ShirtNumber || ""),
                    pos: pos,
                    picture: apiPic || localPic || ""
                };
            });
        } else {
            const legacyBench = isAwayTeam ? state.currentSelectedMatchDetails?.awayTeam?.bench : state.currentSelectedMatchDetails?.homeTeam?.bench;
            if (Array.isArray(legacyBench)) {
                list = legacyBench.map(p => ({
                    name: p.name || "Player",
                    shirt: String(p.shirt || ""),
                    pos: getPositionCategory(p.position),
                    picture: p.picture || getPlayerPicture(p.name || "", teamName) || ""
                }));
            }
        }
        return list;
    };

    const homeStarters = getPlayersList(homeApiPlayers, hName, false);
    const awayStarters = getPlayersList(awayApiPlayers, aName, true);
    const homeSubs = getBenchList(homeApiPlayers, hName, false);
    const awaySubs = getBenchList(awayApiPlayers, aName, true);

    const getLeftPercentage = (count, idx) => {
        if (count === 1) return 50;
        const minLeft = 15;
        const maxLeft = 85;
        return minLeft + (idx / (count - 1)) * (maxLeft - minLeft);
    };

    const jerseysContainer = pitchContainer.querySelector("#popup-vertical-pitch-jerseys");
    if (!jerseysContainer) return;
    jerseysContainer.innerHTML = "";

    const appendVerticalPlayerNode = (player, leftPct, topPct, teamColor, teamSecondaryColor, isMidfielder) => {
        const node = document.createElement("div");
        node.className = "player-node";
        node.style.left = `${leftPct}%`;
        node.style.top = `${topPct}%`;
        
        if (isMidfielder) {
            node.style.zIndex = "10";
        }

        const safePlayerId = player.name.replace(/\s+/g, '-').toLowerCase();
        const escapedName = escapeHTML(player.name);
        const escapedShirt = escapeHTML(player.shirt);
        const surname = escapeHTML(player.name.split(" ").pop());
        const escapedPicture = player.picture ? escapeHTML(player.picture) : "";

        let badgesHTML = "";
        const playerEvents = timelineEvents.filter(e => {
            const desc = (e.EventDescription?.[0]?.Description || "").toLowerCase();
            return desc.includes(player.name.toLowerCase()) || desc.includes(surname.toLowerCase());
        });

        let eventBadges = [];
        playerEvents.forEach(evt => {
            const type = evt.Type;
            if (type === 0) {
                eventBadges.push({ type: 'goal', html: `<span class="event-badge goal-badge" title="Goal">⚽</span>`, priority: 2 });
            } else if (type === 2) {
                eventBadges.push({ type: 'yellow', html: `<span class="event-badge yellow-card-badge" title="Yellow Card">🟨</span>`, priority: 3 });
            } else if (type === 3 || type === 9) {
                eventBadges.push({ type: 'red', html: `<span class="event-badge red-card-badge" title="Red Card">🟥</span>`, priority: 1 });
            } else if (type === 5) {
                eventBadges.push({ type: 'sub', html: `<span class="event-badge sub-badge" title="Substituted">🔄</span>`, priority: 4 });
            }
        });

        if (eventBadges.length > 0) {
            eventBadges.sort((a, b) => a.priority - b.priority);
            const seenTypes = new Set();
            const uniqueHTMLs = [];
            eventBadges.forEach(b => {
                if (!seenTypes.has(b.type)) {
                    seenTypes.add(b.type);
                    uniqueHTMLs.push(b.html);
                }
            });
            badgesHTML = `<div class="event-badges-container">${uniqueHTMLs.join("")}</div>`;
        }

        const avatarHTML = escapedPicture
            ? `<div class="player-pitch-avatar-wrapper" style="border: 2px solid ${teamColor};">
                 <div class="player-pitch-avatar-crop">
                     <img src="${escapedPicture}" class="player-pitch-avatar" alt="${escapedName}" onerror="this.parentElement.style.display='none'; this.parentElement.nextElementSibling.style.display='block';" />
                 </div>
                 <div class="player-fallback-jersey" style="display: none; width: 100%; height: 100%;">
                     <svg class="player-jersey-svg" viewBox="0 0 100 100">
                         <filter id="v-jersey-shadow-${escapeHTML(safePlayerId)}" x="-15%" y="-15%" width="130%" height="130%">
                             <feDropShadow dx="0" dy="5" stdDeviation="3.5" flood-opacity="0.35"/>
                         </filter>
                         <defs>
                             <linearGradient id="v-jersey-grad-${escapeHTML(safePlayerId)}" x1="0%" y1="0%" x2="100%" y2="100%">
                                 <stop offset="0%" stop-color="${teamColor}"/>
                                 <stop offset="100%" stop-color="color-mix(in srgb, ${teamColor} 65%, #000000)"/>
                             </linearGradient>
                         </defs>
                         <g filter="url(#v-jersey-shadow-${escapeHTML(safePlayerId)})">
                             <path d="M 12,38 L 28,22 L 40,32 L 28,50 Z" fill="${teamColor}" stroke="${teamSecondaryColor}" stroke-width="2.5"/>
                             <path d="M 88,38 L 72,22 L 60,32 L 72,50 Z" fill="${teamColor}" stroke="${teamSecondaryColor}" stroke-width="2.5"/>
                             <path d="M 28,32 L 72,32 L 72,88 L 28,88 Z" fill="url(#v-jersey-grad-${escapeHTML(safePlayerId)})" stroke="${teamSecondaryColor}" stroke-width="3" stroke-linejoin="round"/>
                             <path d="M 40,32 A 10,10 0 0,0 60,32 Z" fill="${teamSecondaryColor}"/>
                         </g>
                         <text class="jersey-number" x="50" y="66" fill="${teamSecondaryColor}" font-size="24" font-family="var(--font-heading)" font-weight="900" text-anchor="middle">${escapedShirt}</text>
                     </svg>
                 </div>
                 <div class="player-pitch-avatar-number-badge" style="background: #ffffff; color: #000000; border: 1.5px solid ${teamColor};">${escapedShirt}</div>
                 ${badgesHTML}
               </div>`
            : `<div class="player-pitch-avatar-wrapper" style="border: 2px solid ${teamColor};">
                 <svg class="player-jersey-svg" viewBox="0 0 100 100">
                     <filter id="v-jersey-shadow-${escapeHTML(safePlayerId)}" x="-15%" y="-15%" width="130%" height="130%">
                         <feDropShadow dx="0" dy="5" stdDeviation="3.5" flood-opacity="0.35"/>
                     </filter>
                     <defs>
                         <linearGradient id="v-jersey-grad-${escapeHTML(safePlayerId)}" x1="0%" y1="0%" x2="100%" y2="100%">
                             <stop offset="0%" stop-color="${teamColor}"/>
                             <stop offset="100%" stop-color="color-mix(in srgb, ${teamColor} 65%, #000000)"/>
                         </linearGradient>
                     </defs>
                     <g filter="url(#v-jersey-shadow-${escapeHTML(safePlayerId)})">
                         <path d="M 12,38 L 28,22 L 40,32 L 28,50 Z" fill="${teamColor}" stroke="${teamSecondaryColor}" stroke-width="2.5"/>
                         <path d="M 88,38 L 72,22 L 60,32 L 72,50 Z" fill="${teamColor}" stroke="${teamSecondaryColor}" stroke-width="2.5"/>
                         <path d="M 28,32 L 72,32 L 72,88 L 28,88 Z" fill="url(#v-jersey-grad-${escapeHTML(safePlayerId)})" stroke="${teamSecondaryColor}" stroke-width="3" stroke-linejoin="round"/>
                         <path d="M 40,32 A 10,10 0 0,0 60,32 Z" fill="${teamSecondaryColor}"/>
                     </g>
                     <text class="jersey-number" x="50" y="66" fill="${teamSecondaryColor}" font-size="24" font-family="var(--font-heading)" font-weight="900" text-anchor="middle">${escapedShirt}</text>
                 </svg>
                 <div class="player-pitch-avatar-number-badge" style="background: #ffffff; color: #000000; border: 1.5px solid ${teamColor};">${escapedShirt}</div>
                 ${badgesHTML}
               </div>`;

        node.innerHTML = `
            <div class="jersey-wrapper">
                ${avatarHTML}
            </div>
            <div class="player-node-label-container" style="margin-top: 3px; display: flex; flex-direction: column; align-items: center;">
                <span class="player-node-label" style="font-size: 8.5px; padding: 1px 4px; white-space: nowrap; text-align: center; font-weight: 700; color: #ffffff; background: rgba(0,0,0,0.5); border-radius: 4px;">${surname}</span>
            </div>
        `;
        jerseysContainer.appendChild(node);
    };

    const homeData = getTeamData(hName) || {};
    const awayData = getTeamData(aName) || {};
    const homeColor = homeData.primaryColor || "#3b82f6";
    const homeSecondaryColor = homeData.secondaryColor || "#ffffff";
    const awayColor = awayData.primaryColor || "#ef4444";
    const awaySecondaryColor = awayData.secondaryColor || "#ffffff";

    const homeGK = homeStarters.filter(p => p.pos === "GK");
    const homeDEF = homeStarters.filter(p => p.pos === "DEF");
    const homeMID = homeStarters.filter(p => p.pos === "MID");
    const homeFWD = homeStarters.filter(p => p.pos === "FWD");

    homeGK.forEach(p => appendVerticalPlayerNode(p, 50, 8, homeColor, homeSecondaryColor, false));

    homeDEF.forEach((p, idx) => {
        let left = getLeftPercentage(homeDEF.length, idx);
        let top = 20;
        if (homeDEF.length === 4) {
            top = (idx === 0 || idx === 3) ? 22 : 17;
        } else if (homeDEF.length === 3) {
            top = (idx === 1) ? 17 : 22;
        } else if (homeDEF.length === 5) {
            top = (idx === 0 || idx === 4) ? 22 : (idx === 2 ? 17 : 19.5);
        }
        appendVerticalPlayerNode(p, left, top, homeColor, homeSecondaryColor, false);
    });

    homeMID.forEach((p, idx) => {
        let left = getLeftPercentage(homeMID.length, idx);
        let top = 32;
        if (homeMID.length > 3) {
            top = (idx % 2 === 0) ? 33.5 : 30.5;
        }
        appendVerticalPlayerNode(p, left, top, homeColor, homeSecondaryColor, true);
    });

    homeFWD.forEach((p, idx) => {
        let left = getLeftPercentage(homeFWD.length, idx);
        appendVerticalPlayerNode(p, left, 44, homeColor, homeSecondaryColor, false);
    });

    const awayGK = awayStarters.filter(p => p.pos === "GK");
    const awayDEF = awayStarters.filter(p => p.pos === "DEF");
    const awayMID = awayStarters.filter(p => p.pos === "MID");
    const awayFWD = awayStarters.filter(p => p.pos === "FWD");

    awayGK.forEach(p => appendVerticalPlayerNode(p, 50, 92, awayColor, awaySecondaryColor, false));

    awayDEF.forEach((p, idx) => {
        let left = getLeftPercentage(awayDEF.length, idx);
        let top = 80;
        if (awayDEF.length === 4) {
            top = (idx === 0 || idx === 3) ? 78 : 83;
        } else if (awayDEF.length === 3) {
            top = (idx === 1) ? 83 : 78;
        } else if (awayDEF.length === 5) {
            top = (idx === 0 || idx === 4) ? 78 : (idx === 2 ? 83 : 80.5);
        }
        appendVerticalPlayerNode(p, left, top, awayColor, awaySecondaryColor, false);
    });

    awayMID.forEach((p, idx) => {
        let left = getLeftPercentage(awayMID.length, idx);
        let top = 68;
        if (awayMID.length > 3) {
            top = (idx % 2 === 0) ? 66.5 : 69.5;
        }
        appendVerticalPlayerNode(p, left, top, awayColor, awaySecondaryColor, true);
    });

    awayFWD.forEach((p, idx) => {
        let left = getLeftPercentage(awayFWD.length, idx);
        appendVerticalPlayerNode(p, left, 56, awayColor, awaySecondaryColor, false);
    });

    const renderSubsColumn = (listContainer, subs, teamColor, teamSecondaryColor) => {
        if (!listContainer) return;
        listContainer.innerHTML = "";

        subs.forEach(player => {
            const safePlayerId = player.name.replace(/\s+/g, '-').toLowerCase();
            const escapedName = escapeHTML(player.name);
            const escapedShirt = escapeHTML(player.shirt);
            const surname = escapeHTML(player.name.split(" ").pop());
            const escapedPicture = player.picture ? escapeHTML(player.picture) : "";

            let badgesHTML = "";
            const playerEvents = timelineEvents.filter(e => {
                const desc = (e.EventDescription?.[0]?.Description || "").toLowerCase();
                return desc.includes(player.name.toLowerCase()) || desc.includes(surname.toLowerCase());
            });

            let eventBadges = [];
            playerEvents.forEach(evt => {
                const type = evt.Type;
                if (type === 0) {
                    eventBadges.push({ type: 'goal', html: `<span class="event-badge goal-badge" title="Goal">⚽</span>`, priority: 2 });
                } else if (type === 2) {
                    eventBadges.push({ type: 'yellow', html: `<span class="event-badge yellow-card-badge" title="Yellow Card">🟨</span>`, priority: 3 });
                } else if (type === 3 || type === 9) {
                    eventBadges.push({ type: 'red', html: `<span class="event-badge red-card-badge" title="Red Card">🟥</span>`, priority: 1 });
                } else if (type === 5) {
                    eventBadges.push({ type: 'sub', html: `<span class="event-badge sub-badge" title="Substituted">🔄</span>`, priority: 4 });
                }
            });

            if (eventBadges.length > 0) {
                eventBadges.sort((a, b) => a.priority - b.priority);
                const seenTypes = new Set();
                const uniqueHTMLs = [];
                eventBadges.forEach(b => {
                    if (!seenTypes.has(b.type)) {
                        seenTypes.add(b.type);
                        uniqueHTMLs.push(b.html);
                    }
                });
                badgesHTML = `<div class="sub-event-badges">${uniqueHTMLs.join("")}</div>`;
            }

            const subItem = document.createElement("div");
            subItem.className = "sub-item";

            const avatarHTML = escapedPicture
                ? `<div class="sub-avatar-crop" style="border: 1.5px solid ${teamColor};">
                     <img src="${escapedPicture}" class="sub-avatar-img" alt="${escapedName}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                     <div class="sub-avatar-fallback" style="display: none; width: 100%; height: 100%;">
                         <svg class="sub-jersey-svg" viewBox="0 0 100 100">
                             <rect width="100" height="100" fill="${teamColor}" />
                             <text x="50" y="65" fill="${teamSecondaryColor}" font-size="36" font-family="var(--font-heading)" font-weight="900" text-anchor="middle">${escapedShirt}</text>
                         </svg>
                     </div>
                   </div>`
                : `<div class="sub-avatar-crop" style="border: 1.5px solid ${teamColor};">
                     <svg class="sub-jersey-svg" viewBox="0 0 100 100">
                         <rect width="100" height="100" fill="${teamColor}" />
                         <text x="50" y="65" fill="${teamSecondaryColor}" font-size="36" font-family="var(--font-heading)" font-weight="900" text-anchor="middle">${escapedShirt}</text>
                     </svg>
                   </div>`;

            subItem.innerHTML = `
                <div class="sub-player-info">
                    ${avatarHTML}
                    <span class="sub-shirt">${escapedShirt}</span>
                    <span class="sub-name">${surname}</span>
                </div>
                ${badgesHTML}
            `;
            listContainer.appendChild(subItem);
        });
    };

    const homeSubsContainer = pitchContainer.querySelector("#popup-home-subs-list");
    const awaySubsContainer = pitchContainer.querySelector("#popup-away-subs-list");
    renderSubsColumn(homeSubsContainer, homeSubs, homeColor, homeSecondaryColor);
    renderSubsColumn(awaySubsContainer, awaySubs, awayColor, awaySecondaryColor);
};

export const openMatchDetailPopup = async (game) => {
    const popup = document.getElementById("match-detail-overlay");
    const body = document.getElementById("match-detail-popup-body");
    if (!popup || !body) return;

    popup.classList.add("open");

    // Track active request ID to prevent race conditions
    const currentRequestMatchId = game.id;
    state.activePopupMatchId = game.id;

    // Show loading spinner
    body.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted); font-size: 12.5px;">
            <div class="loading-spinner" style="margin: 0 auto 12px auto; border: 2.5px solid rgba(255,255,255,0.1); border-top-color: #10b981; border-radius: 50%; width: 22px; height: 22px; animation: spin 0.8s linear infinite;"></div>
            Loading match details...
        </div>
    `;

    // Fetch deep match details asynchronously from proxy API
    await fetchMatchDetails(game.id);
    const timelineData = await fetchMatchTimeline(game.id);
    const timelineEvents = timelineData?.Event || [];

    // Guard: Check if the user has navigated to another match popup since the fetches started
    if (state.activePopupMatchId !== currentRequestMatchId) {
        console.log(`Discarding stale details fetch for match ${currentRequestMatchId}.`);
        return;
    }

    const liveState = state.liveStates[game.id];
    const scoreVal = getGameScore(game);
    const scoreHome = scoreVal.home;
    const scoreAway = scoreVal.away;
    const isLive = isMatchLive(game);
    const isFinished = isMatchFinished(game);

    const scoreText = (isLive || isFinished) ? `${escapeHTML(scoreHome)} - ${escapeHTML(scoreAway)}` : "vs";
    const statusText = isLive ? (liveState ? `Live - ${escapeHTML(liveState.minute)}'` : "Live") : isFinished ? "Finished" : "Upcoming";

    let dateStr = "";
    if (game.utcDate) {
        dateStr = new Date(game.utcDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    } else if (game.local_date) {
        const istTime = formatToIST(game.local_date, game.stadium_id, game.id);
        dateStr = istTime.full;
    }
    dateStr = escapeHTML(dateStr);

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
        const homePenaltyScorers = parseList(game.home_penalty_scorers).map(escapeHTML);
        const awayPenaltyScorers = parseList(game.away_penalty_scorers).map(escapeHTML);
        const homePenaltyMisses = parseList(game.home_penalty_misses).map(escapeHTML);
        const awayPenaltyMisses = parseList(game.away_penalty_misses).map(escapeHTML);

        penaltiesHTML = `
            <div class="popup-scorers-box" style="margin-top: 8px;">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #ef4444; margin-bottom: 6px; text-align: center;">Penalty Shootout (${escapeHTML(game.home_penalty_score)} - ${escapeHTML(game.away_penalty_score)})</div>
                <div style="font-size: 10.5px; color: var(--text-main); line-height: 1.5; text-align: center;">
                    <strong>${escapeHTML(game.home_team_name_en)}</strong>: ${homePenaltyScorers.length ? homePenaltyScorers.join(", ") : "None"} ${homePenaltyMisses.length ? `<span style="color: var(--text-muted);">(Missed: ${homePenaltyMisses.join(", ")})</span>` : ""}
                    <br>
                    <strong>${escapeHTML(game.away_team_name_en)}</strong>: ${awayPenaltyScorers.length ? awayPenaltyScorers.join(", ") : "None"} ${awayPenaltyMisses.length ? `<span style="color: var(--text-muted);">(Missed: ${awayPenaltyMisses.join(", ")})</span>` : ""}
                </div>
            </div>
        `;
    }

    const hName = game.homeTeam?.name || game.home_team_name_en || "TBD";
    const aName = game.awayTeam?.name || game.away_team_name_en || "TBD";
    
    const apiOfficials = state.currentSelectedMatchDetails?.Officials || [];
    const refereeName = apiOfficials.find(o => o.OfficialType === 1)?.Name?.[0]?.Description || apiOfficials[0]?.Name?.[0]?.Description || "";

    const displayHName = escapeHTML(hName);
    const displayAName = escapeHTML(aName);
    const displayRefereeName = escapeHTML(refereeName);

    // Generate Layout
    const scoreboardHTML = `
        <div class="popup-scoreboard" style="margin-bottom: 12px;">
            <div class="popup-team">
                ${getWcTeamFlagHTML(hName, "popup-team-flag")}
                <span class="popup-team-name">${displayHName}</span>
            </div>
            <div class="popup-score-box">
                <span class="popup-score-text">${scoreText}</span>
                <span class="popup-meta-text">${statusText}</span>
            </div>
            <div class="popup-team">
                ${getWcTeamFlagHTML(aName, "popup-team-flag")}
                <span class="popup-team-name">${displayAName}</span>
            </div>
        </div>
    `;

    const tabsNavHTML = `
        <div class="popup-tabs-nav">
            <button type="button" class="popup-tab-btn active" data-tab="overview">Overview</button>
            <button type="button" class="popup-tab-btn" data-tab="lineups">Lineups</button>
            <button type="button" class="popup-tab-btn" data-tab="stats-events">Events & Stats</button>
        </div>
    `;

    const stageLabel = game.group ? `Group ${game.group.replace("GROUP_", "")}` : (game.stage ? game.stage.replace(/_/g, " ") : "Knockout");
    const displayStageLabel = escapeHTML(stageLabel);
    const venueName = state.currentSelectedMatchDetails?.Stadium?.Name?.[0]?.Description || getStadiumName(game.stadium_id || game.stadium);
    const displayVenueName = escapeHTML(venueName);

    const overviewHTML = `
        <div class="popup-tab-content active" id="popup-tab-overview">
            <div class="popup-scorers-box">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px; text-align: center;">Goalscorers</div>
                <div class="popup-scorers-list">
                    ${getScorersHTML(game, hName, aName)}
                </div>
            </div>
            ${penaltiesHTML}
            <div style="font-size: 10.5px; color: var(--text-muted); text-align: center; margin-top: 12px; line-height: 1.4; border-top: 1px solid var(--border-color); padding-top: 10px;">
                🏟️ <strong>Stadium:</strong> ${displayVenueName}<br>
                📅 <strong>Scheduled Date:</strong> ${dateStr}<br>
                🚩 <strong>Stage:</strong> ${displayStageLabel}<br>
                ${displayRefereeName ? `⚖️ <strong>Referee:</strong> ${displayRefereeName}` : ""}
            </div>
        </div>
    `;

    const lineupsHTML = `
        <div class="popup-tab-content" id="popup-tab-lineups">
            <div class="popup-pitch-container">
                <div class="soccer-pitch-vertical" id="popup-vertical-pitch">
                    <div class="pitch-line-center" style="position: absolute; top: 50%; left: 0; right: 0; height: 1.5px; background: rgba(255, 255, 255, 0.4); transform: translateY(-50%);"></div>
                    <div class="pitch-circle-center" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 22%; aspect-ratio: 1; border: 1.5px solid rgba(255, 255, 255, 0.4); border-radius: 50%;"></div>
                    <div class="pitch-area-penalty-top" style="position: absolute; top: 0; left: 20%; right: 20%; height: 15%; border: 1.5px solid rgba(255, 255, 255, 0.4); border-top: none; border-radius: 0 0 12px 12px;"></div>
                    <div class="pitch-area-penalty-bottom" style="position: absolute; bottom: 0; left: 20%; right: 20%; height: 15%; border: 1.5px solid rgba(255, 255, 255, 0.4); border-bottom: none; border-radius: 12px 12px 0 0;"></div>
                    <div class="pitch-area-goal-top" style="position: absolute; top: 0; left: 35%; right: 35%; height: 5%; border: 1.5px solid rgba(255, 255, 255, 0.4); border-top: none;"></div>
                    <div class="pitch-area-goal-bottom" style="position: absolute; bottom: 0; left: 35%; right: 35%; height: 5%; border: 1.5px solid rgba(255, 255, 255, 0.4); border-bottom: none;"></div>
                    <div class="pitch-spot-penalty-top" style="position: absolute; top: 10%; left: 50%; transform: translate(-50%, -50%); width: 4px; height: 4px; background: rgba(255, 255, 255, 0.6); border-radius: 50%;"></div>
                    <div class="pitch-spot-penalty-bottom" style="position: absolute; bottom: 10%; left: 50%; transform: translate(-50%, -50%); width: 4px; height: 4px; background: rgba(255, 255, 255, 0.6); border-radius: 50%;"></div>
                    <div class="lineup-jerseys-layer" id="popup-vertical-pitch-jerseys" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
                </div>
            </div>
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

    body.innerHTML = scoreboardHTML + tabsNavHTML + overviewHTML + lineupsHTML + statsEventsHTML + ctaHTML;

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

    // Render Starting XI on vertical pitch
    const verticalPitchContainer = body.querySelector("#popup-tab-lineups");
    renderPopupVerticalLineups(verticalPitchContainer, hName, aName, timelineEvents);

    // Populate Events & Stats
    const eventsListEl = body.querySelector("#popup-events-list");
    const statsWrapper = body.querySelector("#popup-stats-wrapper");

    // Chronological Events
    if (eventsListEl) {
        if (timelineEvents.length > 0) {
            timelineEvents.forEach(evt => {
                let icon = "❓";
                const typeCode = evt.Type;
                if (typeCode === 0) icon = "⚽"; // Goal
                else if (typeCode === 2) icon = "🟨"; // Yellow card
                else if (typeCode === 3 || typeCode === 9) icon = "🟥"; // Red card
                else if (typeCode === 5) icon = "🔄"; // Substitution

                let desc = evt.EventDescription?.[0]?.Description || "Match event";

                const row = document.createElement("div");
                row.className = "popup-event-row";
                row.innerHTML = `
                    <span class="popup-event-time">${escapeHTML(evt.MatchMinute || "0'")}</span>
                    <span class="popup-event-icon">${icon}</span>
                    <span class="popup-event-desc">${escapeHTML(desc)}</span>
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
        
        const countEventType = (typeCode, teamId) => {
            return timelineEvents.filter(e => e.Type === typeCode && String(e.IdTeam) === String(teamId)).length;
        };

        const homeTeamId = state.currentSelectedMatchDetails?.HomeTeam?.IdTeam || game.homeTeam?.id;
        const awayTeamId = state.currentSelectedMatchDetails?.AwayTeam?.IdTeam || game.awayTeam?.id;

        if (timelineEvents.length > 0 && homeTeamId && awayTeamId) {
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
                        <div class="split-bar-label" style="font-size: 9.5px; font-weight: 800; text-transform: uppercase; color: var(--text-muted);">${escapeHTML(title)}</div>
                        <div class="split-bar-col team2-side">
                            <div class="split-track" style="height: 4px; background: rgba(255,255,255,0.06);">
                                <div class="split-fill" style="width: ${pctAway}%; background: #60a5fa;"></div>
                            </div>
                            <span class="split-val" style="font-size: 11px;">${valAway}</span>
                        </div>
                    </div>
                `;
            };

            const shotsH = countEventType(12, homeTeamId);
            const shotsA = countEventType(12, awayTeamId);
            const cornersH = countEventType(16, homeTeamId);
            const cornersA = countEventType(16, awayTeamId);
            const foulsH = countEventType(18, homeTeamId);
            const foulsA = countEventType(18, awayTeamId);
            const offsidesH = countEventType(15, homeTeamId);
            const offsidesA = countEventType(15, awayTeamId);

            statsWrapper.innerHTML = `
                <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">Match Statistics</div>
                ${buildStatRow("Shots", shotsH, shotsA)}
                ${buildStatRow("Corners", cornersH, cornersA)}
                ${buildStatRow("Fouls", foulsH, foulsA)}
                ${buildStatRow("Offsides", offsidesH, offsidesA)}
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
