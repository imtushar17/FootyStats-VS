import { state } from './matchcentre/state.js';
import { getWcTeamFlagHTML, getTeamData, normalizeTeamName, escapeHTML, isMatchFinished, isMatchLive, getGameScore } from './matchcentre/utils.js';

export const drawWorldCupMatchesTab = (t1Name, t2Name) => {
    const name1 = document.getElementById("wc-m-t1-name");
    const name2 = document.getElementById("wc-m-t2-name");
    const flag1 = document.getElementById("wc-m-t1-flag");
    const flag2 = document.getElementById("wc-m-t2-flag");
    const list1 = document.getElementById("wc-m-t1-list");
    const list2 = document.getElementById("wc-m-t2-list");

    if (name1) name1.textContent = t1Name;
    if (name2) name2.textContent = t2Name;
    if (flag1) flag1.innerHTML = getWcTeamFlagHTML(t1Name, "wc-col-flag-img");
    if (flag2) flag2.innerHTML = getWcTeamFlagHTML(t2Name, "wc-col-flag-img");

    const norm1 = normalizeTeamName(t1Name).toLowerCase();
    const norm2 = normalizeTeamName(t2Name).toLowerCase();

    const games = state.worldCupGames || [];

    const filterMatches = (normName) => {
        return games.filter(g => {
            const h = normalizeTeamName(g.homeTeam?.name || g.home_team_name_en || "").toLowerCase();
            const a = normalizeTeamName(g.awayTeam?.name || g.away_team_name_en || "").toLowerCase();
            return h === normName || a === normName;
        });
    };

    const matches1 = filterMatches(norm1);
    const matches2 = filterMatches(norm2);

    const parseDate = (g) => g.utcDate ? new Date(g.utcDate) : new Date(0);
    matches1.sort((a, b) => parseDate(a) - parseDate(b));
    matches2.sort((a, b) => parseDate(a) - parseDate(b));

    const renderList = (container, matchList, teamName) => {
        if (!container) return;
        container.innerHTML = "";

        if (matchList.length === 0) {
            container.innerHTML = `<div class="wc-matches-empty">Did not participate in World Cup 2026</div>`;
            return;
        }

        matchList.forEach(game => {
            const card = document.createElement("div");
            card.className = "wc-match-card";

            const isFinished = isMatchFinished(game);
            const isLive = isMatchLive(game);
            const scoreVal = getGameScore(game);

            let scoreText = "vs";
            let badgeClass = "upcoming";
            let badgeText = "Upcoming";

            if (isFinished) {
                scoreText = `${scoreVal.home} - ${scoreVal.away}`;
                badgeClass = "finished";
                badgeText = "Finished";
            } else if (isLive) {
                scoreText = `${scoreVal.home} - ${scoreVal.away}`;
                badgeClass = "live";
                badgeText = game.status === "PAUSED" ? "HT" : "Live";
            }

            const hName = game.homeTeam?.name || game.home_team_name_en || "TBD";
            const aName = game.awayTeam?.name || game.away_team_name_en || "TBD";
            const groupLabel = game.group ? game.group.replace("GROUP_", "Group ") : "";
            const stageLabel = game.stage ? game.stage.replace(/_/g, " ") : "";
            const metaText = groupLabel ? `${groupLabel} • ${stageLabel}` : stageLabel;

            const safePlayerId = hName.replace(/\s+/g, '-').toLowerCase() + "-" + aName.replace(/\s+/g, '-').toLowerCase();

            card.innerHTML = `
                <div class="wc-card-meta-row">
                    <span class="wc-card-meta-text">${escapeHTML(metaText)}</span>
                    <span class="wc-card-status-badge ${badgeClass}">${badgeText}</span>
                </div>
                <div class="wc-card-teams-row">
                    <div class="wc-card-team-info">
                        ${getWcTeamFlagHTML(hName, "wc-card-flag")}
                        <span class="wc-card-team-name ${normalizeTeamName(hName).toLowerCase() === normalizeTeamName(teamName).toLowerCase() ? 'highlight' : ''}">${escapeHTML(hName)}</span>
                    </div>
                    <div class="wc-card-score-box">${scoreText}</div>
                    <div class="wc-card-team-info right-aligned">
                        <span class="wc-card-team-name ${normalizeTeamName(aName).toLowerCase() === normalizeTeamName(teamName).toLowerCase() ? 'highlight' : ''}">${escapeHTML(aName)}</span>
                        ${getWcTeamFlagHTML(aName, "wc-card-flag")}
                    </div>
                </div>
            `;

            card.addEventListener("click", () => {
                import("./matchcentre/popups.js").then(m => m.openMatchDetailPopup(game));
            });

            container.appendChild(card);
        });
    };

    renderList(list1, matches1, t1Name);
    renderList(list2, matches2, t2Name);
};
