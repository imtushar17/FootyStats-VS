import { state } from './state.js';
import { getWcTeamFlagHTML, formatToIST } from './utils.js';

export const getBracketPlaceholderName = (matchId, isAway) => {
    const mappings = {
        "89": ["W74", "W77"],
        "90": ["W73", "W75"],
        "91": ["W76", "W78"],
        "92": ["W79", "W80"],
        "93": ["W83", "W84"], // Corrected pairings
        "94": ["W81", "W82"], // Corrected pairings
        "95": ["W85", "W86"],
        "96": ["W87", "W88"],
        "97": ["W89", "W90"],
        "98": ["W91", "W92"],
        "99": ["W93", "W94"],
        "100": ["W95", "W96"],
        "101": ["W97", "W98"],
        "102": ["W99", "W100"],
        "104": ["W101", "W102"],
        "103": ["L101", "L102"]
    };
    const pair = mappings[matchId];
    if (pair) return pair[isAway ? 1 : 0];
    return isAway ? "TBD" : "TBD";
};

export const renderKnockoutBracket = (container) => {
    if (!container) return;
    container.innerHTML = "";

    const bracketWrapper = document.createElement("div");
    bracketWrapper.className = "bracket-wrapper";

    const columnRounds = [
        { key: "r32", title: "Round of 32", className: "column-r32", ids: ["74", "77", "73", "75", "76", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88"] },
        { key: "r16", title: "Round of 16", className: "column-r16", ids: ["89", "90", "91", "92", "94", "93", "95", "96"] }, // Swapped 93 and 94 for visual alignment
        { key: "qf", title: "Quarter-finals", className: "column-qf", ids: ["97", "98", "99", "100"] },
        { key: "sf", title: "Semi-finals", className: "column-sf", ids: ["101", "102"] },
        { key: "final", title: "Finals", className: "column-final", ids: ["104"] } // Draw only 104 in standard list for centered connection lines
    ];

    const gamesMap = {};
    const games = state.worldCupGames || [];
    games.forEach(g => {
        gamesMap[g.id] = g;
    });

    const buildNode = (game, index, customClass = "") => {
        const nodeClass = customClass || ((index % 2 === 0) ? "odd-node" : "even-node");
        const hName = game.homeTeam?.name || game.home_team_name_en;
        const aName = game.awayTeam?.name || game.away_team_name_en;

        const hasHome = hName && hName !== "undefined" && hName !== "null";
        const hasAway = aName && aName !== "undefined" && aName !== "null";
        const isUnresolved = !hasHome || !hasAway;

        const homeDisplayName = hasHome ? hName : getBracketPlaceholderName(game.id, false);
        const awayDisplayName = hasAway ? aName : getBracketPlaceholderName(game.id, true);

        let headerDate = "TBD";
        let headerStatus = "Upcoming";
        let statusClass = "";
        let upcomingFooterHTML = "";

        if (game.utcDate) {
            headerDate = new Date(game.utcDate).toLocaleDateString([], { month: 'short', day: 'numeric' });
            headerStatus = new Date(game.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (game.local_date) {
            const istTime = formatToIST(game.local_date, game.stadium_id, game.id);
            headerDate = istTime.date;
            headerStatus = istTime.time;
        }

        const liveState = state.liveStates[game.id];
        let scoreHome = "";
        let scoreAway = "";
        let isPlayed = false;
        let isLive = false;

        if (game.score?.fullTime?.home !== null && game.score?.fullTime?.home !== undefined) {
            scoreHome = game.score.fullTime.home;
            scoreAway = game.score.fullTime.away;
            isPlayed = game.status === "FINISHED";
            isLive = game.status === "IN_PLAY" || game.status === "PAUSED";
        } else if (liveState) {
            scoreHome = liveState.scoreHome;
            scoreAway = liveState.scoreAway;
            isPlayed = liveState.finished;
            isLive = !liveState.finished && game.finished === "FALSE" && game.time_elapsed !== "notstarted";
        } else {
            scoreHome = game.finished === "TRUE" ? (parseInt(game.home_score) || 0) : "";
            scoreAway = game.finished === "TRUE" ? (parseInt(game.away_score) || 0) : "";
            isPlayed = game.finished === "TRUE";
        }

        if (isLive) {
            const min = liveState ? liveState.minute : game.time_elapsed;
            headerStatus = game.status === "PAUSED" ? "HT" : `Live - ${min}'`;
            statusClass = "live-text";
        } else if (isPlayed) {
            headerStatus = "FT";
        } else {
            upcomingFooterHTML = `<div class="bracket-node-footer">Upcoming</div>`;
        }

        const hasPenalties = game.home_penalty_score !== undefined && 
                             game.home_penalty_score !== null && 
                             game.home_penalty_score !== "" && 
                             game.home_penalty_score !== "null" &&
                             game.away_penalty_score !== undefined &&
                             game.away_penalty_score !== null &&
                             game.away_penalty_score !== "" &&
                             game.away_penalty_score !== "null";
        const homeScoreText = isPlayed ? (hasPenalties ? `${scoreHome} (${game.home_penalty_score})` : scoreHome) : "";
        const awayScoreText = isPlayed ? (hasPenalties ? `${scoreAway} (${game.away_penalty_score})` : scoreAway) : "";

        let homeClass = "";
        let awayClass = "";
        if (isPlayed) {
            const intHome = parseInt(scoreHome) || 0;
            const intAway = parseInt(scoreAway) || 0;
            if (intHome > intAway) {
                homeClass = "winner";
                awayClass = "loser";
            } else if (intAway > intHome) {
                awayClass = "winner";
                homeClass = "loser";
            } else if (hasPenalties) {
                const penH = parseInt(game.home_penalty_score) || 0;
                const penA = parseInt(game.away_penalty_score) || 0;
                if (penH > penA) {
                    homeClass = "winner";
                    awayClass = "loser";
                } else {
                    awayClass = "winner";
                    homeClass = "loser";
                }
            }
        }

        const shieldIcon = `<svg class="flag-placeholder-shield" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
        const homeFlagHTML = hasHome ? getWcTeamFlagHTML(hName, "bracket-team-flag") : shieldIcon;
        const awayFlagHTML = hasAway ? getWcTeamFlagHTML(aName, "bracket-team-flag") : shieldIcon;

        const node = document.createElement("div");
        node.className = `bracket-match-node ${nodeClass}`;
        node.dataset.matchId = game.id;
        node.dataset.unresolved = isUnresolved;

        node.innerHTML = `
            <div class="bracket-match-header">
                <span class="bracket-header-date">${headerDate}</span>
                <span class="bracket-header-status ${statusClass}">${headerStatus}</span>
            </div>
            <div class="bracket-match-teams">
                <div class="bracket-team-row ${homeClass}">
                    <div class="bracket-team-info">
                        ${homeFlagHTML}
                        <span>${homeDisplayName}</span>
                    </div>
                    <span class="bracket-team-score">${homeScoreText}</span>
                </div>
                <div class="bracket-team-row ${awayClass}">
                    <div class="bracket-team-info">
                        ${awayFlagHTML}
                        <span>${awayDisplayName}</span>
                    </div>
                    <span class="bracket-team-score">${awayScoreText}</span>
                </div>
            </div>
            ${upcomingFooterHTML}
        `;

        return node;
    };

    columnRounds.forEach(round => {
        const col = document.createElement("div");
        col.className = `bracket-column ${round.className}`;

        const colHeader = document.createElement("div");
        colHeader.className = "bracket-round-title";
        colHeader.textContent = round.title;
        col.appendChild(colHeader);

        round.ids.forEach((matchId, index) => {
            const game = gamesMap[matchId];
            if (!game) return;
            const node = buildNode(game, index);
            col.appendChild(node);
        });

        if (round.key === "final") {
            const game103 = gamesMap["103"];
            if (game103) {
                const divider = document.createElement("div");
                divider.className = "bracket-third-place-title";
                divider.textContent = "Third Place Match";
                col.appendChild(divider);

                const node103 = buildNode(game103, 1, "third-place-node");
                col.appendChild(node103);
            }
        }

        bracketWrapper.appendChild(col);
    });

    container.appendChild(bracketWrapper);
};
