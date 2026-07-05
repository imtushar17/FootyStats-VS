import { state } from './state.js';
import { getWcTeamFlagHTML, isMatchFinished, getGameScore } from './utils.js';


export const aggregateGroupStandings = (groupName) => {
    const teamsMap = {};
    const games = state.worldCupGames || [];
    
    games.forEach(game => {
        if (game.group !== groupName && game.group !== `GROUP_${groupName}`) return;
        // Support both API type or legacy 'group' type
        const isGroupStage = game.stage === "GROUP_STAGE" || game.type === "group";
        if (!isGroupStage) return;

        const h = game.homeTeam?.name || game.home_team_name_en;
        const a = game.awayTeam?.name || game.away_team_name_en;
        if (!h || !a) return;

        if (!teamsMap[h]) teamsMap[h] = { name: h, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
        if (!teamsMap[a]) teamsMap[a] = { name: a, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };

        const liveState = state.liveStates[game.id];
        let scoreH = 0;
        let scoreA = 0;
        let isPlayed = false;

        // Dynamic checking for API proxy score or legacy score
        const scoreVal = getGameScore(game);
        scoreH = scoreVal.home !== null ? scoreVal.home : 0;
        scoreA = scoreVal.away !== null ? scoreVal.away : 0;
        isPlayed = isMatchFinished(game) || (liveState && liveState.finished);

        if (isPlayed) {
            teamsMap[h].p++;
            teamsMap[a].p++;

            teamsMap[h].gf += scoreH;
            teamsMap[h].ga += scoreA;
            teamsMap[a].gf += scoreA;
            teamsMap[a].ga += scoreH;

            if (scoreH > scoreA) {
                teamsMap[h].w++;
                teamsMap[h].pts += 3;
                teamsMap[a].l++;
            } else if (scoreA > scoreH) {
                teamsMap[a].w++;
                teamsMap[a].pts += 3;
                teamsMap[h].l++;
            } else {
                teamsMap[h].d++;
                teamsMap[h].pts += 1;
                teamsMap[a].d++;
                teamsMap[a].pts += 1;
            }
        }
    });

    const result = Object.values(teamsMap);
    result.forEach(t => t.gd = t.gf - t.ga);

    return result.sort((x, y) => {
        if (y.pts !== x.pts) return y.pts - x.pts;
        if (y.gd !== x.gd) return y.gd - x.gd;
        if (y.gf !== x.gf) return y.gf - x.gf;
        return x.name.localeCompare(y.name);
    });
};

export const renderGroupsExplorer = (container) => {
    if (!container) return;
    container.innerHTML = "";

    const groupsList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

    groupsList.forEach(groupName => {
        const groupTeams = aggregateGroupStandings(groupName);
        if (groupTeams.length === 0) return;

        const cardBox = document.createElement("div");
        cardBox.className = "group-card-box";

        const title = document.createElement("div");
        title.className = "group-card-title";
        title.textContent = `Group ${groupName}`;
        cardBox.appendChild(title);

        const table = document.createElement("table");
        table.className = "live-standings-tbl";
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Pos</th>
                    <th>Team</th>
                    <th style="text-align: center;">P</th>
                    <th style="text-align: center;">GD</th>
                    <th style="text-align: center;">Pts</th>
                </tr>
            </thead>
            <tbody>
                ${groupTeams.map((team, idx) => `
                    <tr class="${idx < 2 ? 'advancing-pos' : idx === 2 ? 'possible-advancing-pos' : ''}" style="${idx === 2 ? 'border-left: 3px solid #eab308; background: rgba(234,179,8,0.02);' : ''}">
                        <td class="standings-num">${idx + 1}</td>
                        <td class="standings-team-name">
                            ${getWcTeamFlagHTML(team.name, "standings-tbl-flag")}
                            <span>${team.name}</span>
                        </td>
                        <td style="text-align: center;">${team.p}</td>
                        <td style="text-align: center; color: ${team.gd > 0 ? '#10b981' : team.gd < 0 ? '#ef4444' : 'var(--text-muted)'};">${team.gd > 0 ? '+' + team.gd : team.gd}</td>
                        <td style="text-align: center; font-weight: 800;">${team.pts}</td>
                    </tr>
                `).join("")}
            </tbody>
        `;
        cardBox.appendChild(table);
        
        const note = document.createElement("div");
        note.className = "group-advancing-note";
        note.style.fontSize = "8px";
        note.style.color = "var(--text-muted)";
        note.style.marginTop = "6px";
        note.style.textAlign = "center";
        note.style.opacity = "0.75";
        note.innerHTML = "🟢 Top 2 advance | 🟡 Best 8 third-place qualify";
        cardBox.appendChild(note);

        container.appendChild(cardBox);
    });
};
