import { state } from './state.js';
import { getWcTeamFlagHTML, formatToIST, escapeHTML, isMatchFinished, isMatchLive, isMatchUpcoming, getGameScore } from './utils.js';

export const getBracketPlaceholderName = (game, isAway) => {
    if (!game) return "TBD";
    if (isAway && game.PlaceHolderB) return game.PlaceHolderB;
    if (!isAway && game.PlaceHolderA) return game.PlaceHolderA;

    const mappings = {
        "89": ["W74", "W77"],
        "90": ["W73", "W75"],
        "91": ["W76", "W78"],
        "92": ["W79", "W80"],
        "93": ["W83", "W84"],
        "94": ["W81", "W82"],
        "95": ["W86", "W88"],
        "96": ["W85", "W87"],
        "97": ["W89", "W90"],
        "98": ["W93", "W94"],
        "99": ["W91", "W92"],
        "100": ["W95", "W96"],
        "101": ["W97", "W98"],
        "102": ["W99", "W100"],
        "104": ["W101", "W102"],
        "103": ["L101", "L102"]
    };
    const pair = mappings[game.id];
    if (pair) return pair[isAway ? 1 : 0];
    return "TBD";
};

// Tree structure mapping for drawing SVG orthogonal connecting lines
const parentChildMap = {
    "89": ["74", "77"],
    "90": ["73", "75"],
    "93": ["83", "84"],
    "94": ["81", "82"],
    "91": ["76", "78"],
    "92": ["79", "80"],
    "95": ["86", "88"],
    "96": ["85", "87"],
    "97": ["89", "90"],
    "98": ["93", "94"],
    "99": ["91", "92"],
    "100": ["95", "96"],
    "101": ["97", "98"],
    "102": ["99", "100"],
    "104": ["101", "102"]
};

// Compact height arrays corresponding to each round's list length + headers
const colHeights = [1584, 804, 414, 218, 120];

export const drawConnections = () => {
    const svg = document.getElementById("bracket-connections-svg");
    if (!svg) return;
    svg.innerHTML = "";

    const canvas = document.getElementById("bracket-canvas");
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();

    Object.keys(parentChildMap).forEach(childId => {
        const childNode = document.getElementById(`node-${childId}`);
        if (!childNode) return;

        const parentIds = parentChildMap[childId];
        parentIds.forEach(parentId => {
            const parentNode = document.getElementById(`node-${parentId}`);
            if (!parentNode) return;

            const parentRect = parentNode.getBoundingClientRect();
            const childRect = childNode.getBoundingClientRect();

            const x1 = parentRect.right - canvasRect.left;
            const y1 = parentRect.top + parentRect.height / 2 - canvasRect.top;

            const x2 = childRect.left - canvasRect.left;
            const y2 = childRect.top + childRect.height / 2 - canvasRect.top;

            const x_mid = x1 + (x2 - x1) / 2;

            // Orthogonal clean step line path: ─┐ and ─┘ meeting
            const d = `M ${x1} ${y1} H ${x_mid} V ${y2} H ${x2}`;

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", d);
            
            // Highlight path if both matches have active highlighted path
            if (parentNode.classList.contains("active-path") && childNode.classList.contains("active-path")) {
                path.setAttribute("stroke", "var(--accent-dark, #0ea5e9)");
                path.setAttribute("stroke-width", "3");
                path.setAttribute("style", "filter: drop-shadow(0 0 4px rgba(14, 165, 233, 0.4));");
            } else {
                const isDark = document.body.classList.contains("dark-theme");
                path.setAttribute("stroke", isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)");
                path.setAttribute("stroke-width", "2");
            }
            path.setAttribute("fill", "none");
            svg.appendChild(path);
        });
    });
};

export const renderKnockoutBracket = (container) => {
    if (!container) return;
    container.innerHTML = "";

    const columnRounds = [
        { key: "r32", title: "Round of 32", className: "column-r32", ids: ["74", "77", "73", "75", "83", "84", "81", "82", "76", "78", "79", "80", "86", "88", "85", "87"] },
        { key: "r16", title: "Round of 16", className: "column-r16", ids: ["89", "90", "93", "94", "91", "92", "95", "96"] },
        { key: "qf", title: "Quarter-finals", className: "column-qf", ids: ["97", "98", "99", "100"] },
        { key: "sf", title: "Semi-finals", className: "column-sf", ids: ["101", "102"] },
        { key: "final", title: "Finals", className: "column-final", ids: ["104"] }
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

        const hasHome = hName && hName !== "undefined" && hName !== "null" && hName.toUpperCase().trim() !== "TBD";
        const hasAway = aName && aName !== "undefined" && aName !== "null" && aName.toUpperCase().trim() !== "TBD";
        const isUnresolved = !hasHome || !hasAway;

        const homeDisplayName = hasHome ? hName : getBracketPlaceholderName(game, false);
        const awayDisplayName = hasAway ? aName : getBracketPlaceholderName(game, true);

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
        const scoreVal = getGameScore(game);
        const isPlayed = isMatchFinished(game) || (liveState && liveState.finished);
        const isLive = isMatchLive(game);
        const scoreHome = scoreVal.home !== null ? scoreVal.home : "";
        const scoreAway = scoreVal.away !== null ? scoreVal.away : "";

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

        const homeFlagHTML = hasHome ? getWcTeamFlagHTML(hName, "bracket-flag") : `<span class="bracket-flag-tbd">🏳️</span>`;
        const awayFlagHTML = hasAway ? getWcTeamFlagHTML(aName, "bracket-flag") : `<span class="bracket-flag-tbd">🏳️</span>`;

        const node = document.createElement("div");
        node.className = `bracket-match-node ${nodeClass} ${isUnresolved ? 'unresolved' : ''}`;
        node.id = `node-${game.id}`;
        node.setAttribute("data-match-id", game.id);
        node.setAttribute("data-unresolved", isUnresolved ? "true" : "false");

        const escapedHomeName = escapeHTML(homeDisplayName);
        const escapedAwayName = escapeHTML(awayDisplayName);
        const escapedHomeScore = escapeHTML(homeScoreText);
        const escapedAwayScore = escapeHTML(awayScoreText);
        const escapedHeaderDate = escapeHTML(headerDate);
        const escapedHeaderStatus = escapeHTML(headerStatus);

        node.innerHTML = `
            <div class="bracket-node-header">
                <span class="b-match-num">Match ${escapeHTML(game.id)}</span>
                <span class="b-match-time ${escapeHTML(statusClass)}">${escapedHeaderDate} • ${escapedHeaderStatus}</span>
            </div>
            <div class="bracket-match-teams">
                <div class="bracket-team-row ${escapeHTML(homeClass)}">
                    <div class="bracket-team-info">
                        ${homeFlagHTML}
                        <span>${escapedHomeName}</span>
                    </div>
                    <span class="bracket-team-score">${escapedHomeScore}</span>
                </div>
                <div class="bracket-team-row ${escapeHTML(awayClass)}">
                    <div class="bracket-team-info">
                        ${awayFlagHTML}
                        <span>${escapedAwayName}</span>
                    </div>
                    <span class="bracket-team-score">${escapedAwayScore}</span>
                </div>
            </div>
            ${upcomingFooterHTML}
        `;

        return node;
    };

    columnRounds.forEach((round, colIdx) => {
        const col = document.createElement("div");
        col.className = `bracket-column ${round.className}`;
        if (colIdx === 0) col.classList.add("active-round");
        col.id = `col-${round.key}`;

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

        container.appendChild(col);
    });

    // Setup interactive scroll & navigation bindings
    setupBracketInteractiveNavigation(container);
};

const setupBracketInteractiveNavigation = (wrapper) => {
    const tabs = document.querySelectorAll(".round-tab-btn");
    const dots = document.querySelectorAll(".dot-indicator");
    const canvas = document.getElementById("bracket-canvas");

    const colWidth = 250;
    const colGap = 48;
    const stepWidth = colWidth + colGap;

    // Scroll listener on horizontal scroll wrapper
    wrapper.addEventListener("scroll", () => {
        const scrollLeft = wrapper.scrollLeft;
        const activeColIndex = Math.round(scrollLeft / stepWidth);

        // Update active round tabs
        tabs.forEach((tab, idx) => {
            if (idx === activeColIndex) {
                tab.classList.add("active");
                tab.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
            } else {
                tab.classList.remove("active");
            }
        });

        // Update dots
        dots.forEach((dot, idx) => {
            if (idx === activeColIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });

        // Update column active class
        document.querySelectorAll(".bracket-column").forEach((col, idx) => {
            if (idx === activeColIndex) {
                col.classList.add("active-round");
            } else {
                col.classList.remove("active-round");
            }
        });

        // Update dynamic canvas height
        if (canvas && colHeights[activeColIndex]) {
            canvas.style.height = `${colHeights[activeColIndex]}px`;
        }

        // Redraw connections
        drawConnections();
    });

    // Click on round tab buttons to center column
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const colIdx = parseInt(tab.dataset.colIndex);
            wrapper.scrollTo({ left: colIdx * stepWidth, behavior: 'smooth' });
        });
    });

    // Click on dot indicators to center column
    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            const colIdx = parseInt(dot.dataset.colIndex);
            wrapper.scrollTo({ left: colIdx * stepWidth, behavior: 'smooth' });
        });
    });

    // Initialize layout height & draw connections
    setTimeout(() => {
        wrapper.scrollLeft = 0;
        if (canvas) canvas.style.height = `${colHeights[0]}px`;
        drawConnections();
    }, 150);
};

if (typeof window !== "undefined") {
    window.addEventListener("resize", drawConnections);
}
