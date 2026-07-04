import { state } from './state.js';
import { getStartingXI } from '../../data/lineups.js';
import { getWcTeamFlagHTML, getTeamData, escapeHTML } from './utils.js';

export const drawLineupPitch = (game, selectedTeamName) => {
    const flagsContainer = document.getElementById("lineups-team-flags");
    if (!flagsContainer) return;

    const t1 = game.homeTeam?.name || game.home_team_name_en || "TBD";
    const t2 = game.awayTeam?.name || game.away_team_name_en || "TBD";
    const isAwaySelected = (selectedTeamName === t2);

    flagsContainer.innerHTML = `
        <button type="button" class="lineup-flag-btn ${selectedTeamName === t1 ? 'active' : ''}" id="lineup-btn-t1" data-team="${t1}">
            ${getWcTeamFlagHTML(t1, "tactics-flag-img")}
            <span class="t-flag-name">${t1}</span>
        </button>
        <div class="lineups-vs-text">VS</div>
        <button type="button" class="lineup-flag-btn ${selectedTeamName === t2 ? 'active' : ''}" id="lineup-btn-t2" data-team="${t2}">
            ${getWcTeamFlagHTML(t2, "tactics-flag-img")}
            <span class="t-flag-name">${t2}</span>
        </button>
    `;

    // Rebind selectors
    document.getElementById("lineup-btn-t1")?.addEventListener("click", () => {
        drawLineupPitch(game, t1);
    });
    document.getElementById("lineup-btn-t2")?.addEventListener("click", () => {
        drawLineupPitch(game, t2);
    });

    const activeTeamObj = getTeamData(selectedTeamName);
    const titleEl = document.getElementById("lineups-active-team-title");
    const subEl = document.getElementById("lineups-active-team-sub");
    const jerseysContainer = document.getElementById("lineups-jerseys-container");
    const benchContainer = document.getElementById("lineups-bench-container");

    const details = state.currentSelectedMatchDetails;
    const activeDetailTeam = isAwaySelected ? details?.AwayTeam : details?.HomeTeam;
    const apiPlayers = activeDetailTeam?.Players || [];

    let startingXI = [];
    let bench = [];
    let isEstimated = false;
    let coachName = activeTeamObj.coach || "Unknown";
    let formationText = "";

    if (apiPlayers.length > 0) {
        startingXI = apiPlayers.filter(p => p.Status === 1).map(p => {
            const posCode = p.Position;
            let cat = "MID";
            if (posCode === 0) cat = "GK";
            else if (posCode === 1) cat = "DEF";
            else if (posCode === 2) cat = "MID";
            else if (posCode === 3) cat = "FWD";

            return {
                name: p.PlayerName?.[0]?.Description || "Player",
                shirt: p.ShirtNumber,
                pos: cat,
                picture: p.PlayerPicture?.PictureUrl || null
            };
        });

        bench = apiPlayers.filter(p => p.Status === 2).map(p => {
            const posCode = p.Position;
            let cat = "MID";
            if (posCode === 0) cat = "GK";
            else if (posCode === 1) cat = "DEF";
            else if (posCode === 2) cat = "MID";
            else if (posCode === 3) cat = "FWD";

            return {
                name: p.PlayerName?.[0]?.Description || "Player",
                shirt: p.ShirtNumber,
                pos: cat,
                picture: p.PlayerPicture?.PictureUrl || null
            };
        });

        const apiCoach = activeDetailTeam?.Coaches?.find(c => c.Role === 0)?.Name?.[0]?.Description || activeDetailTeam?.Coaches?.[0]?.Name?.[0]?.Description || "";
        if (apiCoach) coachName = apiCoach;

        // Try to read formation from API details if available
        const apiForm = isAwaySelected ? details?.awayTeam?.formation : details?.homeTeam?.formation;
        if (apiForm) formationText = apiForm;
    } else {
        // Fallback to local lineups database
        startingXI = getStartingXI(selectedTeamName);
        isEstimated = !!startingXI.isFallbackLineup;
    }

    const gkList = startingXI.filter(p => p.pos === "GK");
    const defList = startingXI.filter(p => p.pos === "DEF");
    const midList = startingXI.filter(p => p.pos === "MID");
    const fwdList = startingXI.filter(p => p.pos === "FWD" || p.pos === "ST");

    if (!formationText) {
        formationText = `${defList.length}-${midList.length}-${fwdList.length}`;
    }

    if (titleEl) titleEl.textContent = `${selectedTeamName} Starting XI`;
    if (subEl) {
        const estimatedBadge = isEstimated
            ? `<span class="estimated-lineup-badge" style="font-size: 9px; padding: 2px 6px; background: rgba(234,179,8,0.15); color: #eab308; border-radius: 4px; font-weight: 700; margin-left: 6px;">ESTIMATED</span>`
            : "";
        subEl.innerHTML = `Formation: <strong>${formationText}</strong> | Coach: <strong>${coachName}</strong>${estimatedBadge}`;
    }

    if (jerseysContainer) {
        jerseysContainer.innerHTML = "";

        const primaryColor = activeTeamObj.primaryColor || "#3b82f6";
        const secondaryColor = activeTeamObj.secondaryColor || "#ffffff";

        const appendLineupJersey = (player, leftPct, topPct) => {
            const node = document.createElement("div");
            node.className = "player-node";
            node.style.left = `${leftPct}%`;
            node.style.top = `${topPct}%`;

            const safePlayerId = player.name.replace(/\s+/g, '-').toLowerCase();
            const escapedName = escapeHTML(player.name);
            const escapedShirt = escapeHTML(String(player.shirt));
            const surname = escapeHTML(player.name.split(" ").pop());

            const escapedPicture = player.picture ? escapeHTML(player.picture) : "";
            const avatarHTML = escapedPicture
                ? `<div class="player-pitch-avatar-wrapper" style="border: 2px solid ${primaryColor};">
                     <img src="${escapedPicture}" class="player-pitch-avatar" alt="${escapedName}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                     <div class="player-pitch-avatar-number-badge" style="background: ${primaryColor}; color: ${secondaryColor};">${escapedShirt}</div>
                   </div>`
                : `<svg class="player-jersey-svg" viewBox="0 0 100 100">
                        <filter id="lineup-jersey-shadow-${escapeHTML(safePlayerId)}" x="-15%" y="-15%" width="130%" height="130%">
                            <feDropShadow dx="0" dy="5" stdDeviation="3.5" flood-opacity="0.35"/>
                        </filter>
                        <defs>
                            <linearGradient id="lineup-jersey-grad-${escapeHTML(safePlayerId)}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="${primaryColor}"/>
                                <stop offset="100%" stop-color="color-mix(in srgb, ${primaryColor} 65%, #000000)"/>
                            </linearGradient>
                        </defs>
                        <g filter="url(#lineup-jersey-shadow-${escapeHTML(safePlayerId)})">
                            <path d="M 12,38 L 28,22 L 40,32 L 28,50 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="2.5"/>
                            <path d="M 88,38 L 72,22 L 60,32 L 72,50 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="2.5"/>
                            <path d="M 28,32 L 72,32 L 72,88 L 28,88 Z" fill="url(#lineup-jersey-grad-${escapeHTML(safePlayerId)})" stroke="${secondaryColor}" stroke-width="3" stroke-linejoin="round"/>
                            <path d="M 40,32 A 10,10 0 0,0 60,32 Z" fill="${secondaryColor}"/>
                        </g>
                        <text class="jersey-number" x="50" y="66" fill="${secondaryColor}" font-size="24" font-family="var(--font-heading)" font-weight="900" text-anchor="middle">${escapedShirt}</text>
                    </svg>`;

            node.innerHTML = `
                <div class="jersey-wrapper">
                    ${avatarHTML}
                </div>
                <div class="player-node-label-container" style="margin-top: 4px; display: flex; flex-direction: column; align-items: center;">
                    <span class="player-node-label" style="font-size: 8.5px; padding: 1.5px 4.5px; white-space: nowrap; text-align: center;">${surname}</span>
                </div>
            `;
            jerseysContainer.appendChild(node);
        };

        const getTopPercentage = (count, idx) => {
            if (count === 1) return 50;
            const minTop = 15;
            const maxTop = 85;
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
    }

    if (benchContainer) {
        benchContainer.innerHTML = "";
        if (bench.length > 0) {
            let benchHTML = `
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 0.5px;">Substitutes Bench</div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; overflow-y: auto; max-height: 140px; padding-right: 4px;">
            `;

            bench.forEach(player => {
                const name = escapeHTML(player.name);
                const shirt = escapeHTML(String(player.shirt));
                const pos = escapeHTML(player.pos);
                benchHTML += `
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; padding: 6px 10px; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-weight: 900; color: #10b981; min-width: 18px;">#${shirt}</span>
                            <span style="color: var(--text-light); text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 11ch;">${name}</span>
                        </div>
                        <span style="font-size: 8.5px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 1.5px 4.5px; border-radius: 3px;">${pos}</span>
                    </div>
                `;
            });

            benchHTML += `</div>`;
            benchContainer.innerHTML = benchHTML;
        } else {
            benchContainer.innerHTML = `<div style="font-size: 10px; color: var(--text-muted); text-align: center; padding: 8px 0;">No substitutes listed</div>`;
        }
    }
};
