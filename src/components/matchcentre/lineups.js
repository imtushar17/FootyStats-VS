import { state } from './state.js';
import { getStartingXI } from '../../data/lineups.js';
import { getWcTeamFlagHTML, getTeamData } from './utils.js';

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

    // Finished matches with API lineup data: generate text-based list view
    const matchStatus = state.currentSelectedMatchDetails?.status || game.status;
    const hLineup = state.currentSelectedMatchDetails?.homeTeam?.lineup;
    const aLineup = state.currentSelectedMatchDetails?.awayTeam?.lineup;
    const hForm = state.currentSelectedMatchDetails?.homeTeam?.formation;
    const aForm = state.currentSelectedMatchDetails?.awayTeam?.formation;

    if (matchStatus === "FINISHED" && hLineup && aLineup) {
        const selectedLineup = isAwaySelected ? aLineup : hLineup;
        const selectedFormation = isAwaySelected ? aForm : hForm;
        
        if (titleEl) titleEl.textContent = `${selectedTeamName} Starting XI`;
        if (subEl) subEl.innerHTML = `Formation: <strong>${selectedFormation || "N/A"}</strong> | Finished Match Feed`;
        
        if (jerseysContainer) {
            let listHTML = `<div class="finished-lineup-list" style="padding: 16px; color: var(--text-light); width: 100%; box-sizing: border-box; overflow-y: auto; height: 100%;">`;
            listHTML += `<ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">`;
            
            selectedLineup.forEach(player => {
                const shirt = player.shirtNumber || player.shirt || "-";
                const name = player.name || "Player";
                const pos = player.position || player.pos || "-";
                listHTML += `
                    <li style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; padding: 8px 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 10px;">
                          <span style="font-weight: 900; color: #10b981; min-width: 24px;">#${shirt}</span>
                          <span>${name}</span>
                        </div>
                        <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">${pos}</span>
                    </li>
                `;
            });
            listHTML += `</ul></div>`;
            jerseysContainer.innerHTML = listHTML;
        }
        return;
    }

    // Default visual lineups pitch fallback
    const startingXI = getStartingXI(selectedTeamName);
    const isEstimated = !!startingXI.isFallbackLineup;

    const gkList = startingXI.filter(p => p.pos === "GK");
    const defList = startingXI.filter(p => p.pos === "DEF");
    const midList = startingXI.filter(p => p.pos === "MID");
    const fwdList = startingXI.filter(p => p.pos === "FWD" || p.pos === "ST");

    const formationText = `${defList.length}-${midList.length}-${fwdList.length}`;
    
    if (titleEl) titleEl.textContent = `${selectedTeamName} Lineup`;
    if (subEl) {
        const estimatedBadge = isEstimated
            ? `<span class="estimated-lineup-badge">Estimated</span>`
            : "";
        subEl.innerHTML = `Formation: ${formationText} | Coach: ${activeTeamObj.coach}${estimatedBadge ? ' ' + estimatedBadge : ''}`;
    }

    if (!jerseysContainer) return;
    jerseysContainer.innerHTML = "";

    const primaryColor = activeTeamObj.primaryColor || "#3b82f6";
    const secondaryColor = activeTeamObj.secondaryColor || "#ffffff";

    const appendLineupJersey = (player, leftPct, topPct) => {
        const node = document.createElement("div");
        node.className = "player-node";
        node.style.left = `${leftPct}%`;
        node.style.top = `${topPct}%`;
        
        const safePlayerId = player.name.replace(/\s+/g, '-').toLowerCase();

        node.innerHTML = `
            <div class="jersey-wrapper">
                <svg class="player-jersey-svg" viewBox="0 0 100 100">
                    <filter id="lineup-jersey-shadow-${safePlayerId}" x="-15%" y="-15%" width="130%" height="130%">
                        <feDropShadow dx="0" dy="5" stdDeviation="3.5" flood-opacity="0.35"/>
                    </filter>
                    <defs>
                        <linearGradient id="lineup-jersey-grad-${safePlayerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="${primaryColor}"/>
                            <stop offset="100%" stop-color="color-mix(in srgb, ${primaryColor} 65%, #000000)"/>
                        </linearGradient>
                    </defs>
                    <g filter="url(#lineup-jersey-shadow-${safePlayerId})">
                        <path d="M 12,38 L 28,22 L 40,32 L 28,50 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="2.5"/>
                        <path d="M 88,38 L 72,22 L 60,32 L 72,50 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="2.5"/>
                        <path d="M 28,32 L 72,32 L 72,88 L 28,88 Z" fill="url(#lineup-jersey-grad-${safePlayerId})" stroke="${secondaryColor}" stroke-width="3" stroke-linejoin="round"/>
                        <path d="M 40,32 A 10,10 0 0,0 60,32 Z" fill="${secondaryColor}"/>
                    </g>
                    <text class="jersey-number" x="50" y="66" fill="${secondaryColor}" font-size="24" font-family="var(--font-heading)" font-weight="900" text-anchor="middle">${player.shirt}</text>
                </svg>
            </div>
            <div class="player-node-label-container" style="margin-top: 4px;">
                <span class="player-node-pos-pill" style="font-size: 8px; padding: 1px 3px;">${player.pos}</span>
                <span class="player-node-label" style="font-size: 9px; padding: 1px 4px; white-space: nowrap;">${player.name.split(" ").pop()}</span>
            </div>
        `;
        jerseysContainer.appendChild(node);
    };

    if (gkList.length > 0) {
        appendLineupJersey(gkList[0], 8, 50);
    }

    const defCount = defList.length;
    defList.forEach((player, idx) => {
        const topPct = defCount === 1 ? 50 : (15 + (idx / (defCount - 1)) * 70);
        appendLineupJersey(player, 28, topPct);
    });

    const midCount = midList.length;
    midList.forEach((player, idx) => {
        const topPct = midCount === 1 ? 50 : (18 + (idx / (midCount - 1)) * 64);
        appendLineupJersey(player, 55, topPct);
    });

    const fwdCount = fwdList.length;
    fwdList.forEach((player, idx) => {
        const topPct = fwdCount === 1 ? 50 : (20 + (idx / (fwdCount - 1)) * 60);
        appendLineupJersey(player, 82, topPct);
    });
};
