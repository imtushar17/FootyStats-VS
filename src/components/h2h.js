import { historicalMatches } from '../data/historicalH2H.js';
import { getFlagHTML } from './selector.js';
import { state } from './matchcentre/state.js';
import { teamData } from '../data/teams.js';

const getShortName = (name) => {
    const map = {
        "Argentina": "ARG",
        "Netherlands": "NED",
        "Germany": "GER",
        "France": "FRA",
        "England": "ENG",
        "Brazil": "BRA",
        "Italy": "ITA",
        "Spain": "ESP",
        "Uruguay": "URU",
        "Portugal": "POR",
        "Croatia": "CRO",
        "Belgium": "BEL"
    };
    return map[name] || name.substring(0, 3).toUpperCase();
};

const getStageLabel = (stageName) => {
    if (!stageName) return "World Cup Match";
    const name = stageName.toLowerCase();
    if (name.includes("group") || name.includes("first round") || name.includes("second group") || name.includes("final round")) {
        return "Group Stage Match";
    }
    return stageName;
};

export const drawH2HMatchesTab = (t1, t2) => {
    const container = document.getElementById("h2h-mount-container");
    if (!container) return;

    if (!t1 || !t2 || t1 === t2) {
        container.innerHTML = `
            <div class="h2h-empty-card">
                <span class="h2h-empty-icon">⚠️</span>
                <h4>Invalid Matchup</h4>
                <p>Please select two different teams to view their head-to-head records.</p>
            </div>
        `;
        return;
    }

    const t1Color = teamData[t1]?.primaryColor || "#3b82f6";
    const t2Color = teamData[t2]?.primaryColor || "#ef4444";

    // 1. Filter historical matches from dataset copy to allow mutability
    const historical = historicalMatches.filter(m => {
        return (m.home === t1 && m.away === t2) || (m.home === t2 && m.away === t1);
    }).map(m => ({ ...m })); // clone objects so we can safely modify scores

    // 2. Subevent map or override: check if any of these matches are live in the state
    historical.forEach(m => {
        if (m.year === 2026) {
            // Find matching game in state.worldCupGames
            const liveMatch = (state.worldCupGames || []).find(g => {
                const hName = g.homeTeam?.name || g.home_team_name_en || "";
                const aName = g.awayTeam?.name || g.away_team_name_en || "";
                const matchesHomeAway = (hName === m.home && aName === m.away) || (hName === m.away && aName === m.home);
                return matchesHomeAway && g.stage && m.stage && g.stage.replace('_', ' ').toLowerCase() === m.stage.toLowerCase();
            }) || (state.worldCupGames || []).find(g => {
                // Fallback: match by teams only
                const hName = g.homeTeam?.name || g.home_team_name_en || "";
                const aName = g.awayTeam?.name || g.away_team_name_en || "";
                return (hName === m.home && aName === m.away) || (hName === m.away && aName === m.home);
            });

            if (liveMatch) {
                const isFinished = liveMatch.status?.type === 'finished' || liveMatch.finished === 'TRUE' || (liveMatch.homeTeam?.score !== undefined && liveMatch.awayTeam?.score !== undefined);
                const isLive = liveMatch.status?.type === 'inprogress' || liveMatch.status?.type === 'LIVE';
                
                if (isFinished) {
                    m.homeScore = liveMatch.homeTeam?.score !== undefined ? liveMatch.homeTeam.score : (liveMatch.home_score !== null ? liveMatch.home_score : m.homeScore);
                    m.awayScore = liveMatch.awayTeam?.score !== undefined ? liveMatch.awayTeam.score : (liveMatch.away_score !== null ? liveMatch.away_score : m.awayScore);
                    m.isLive = false;
                    m.isFinished = true;
                } else if (isLive) {
                    m.homeScore = liveMatch.homeTeam?.score !== undefined ? liveMatch.homeTeam.score : (liveMatch.home_score !== null ? liveMatch.home_score : 0);
                    m.awayScore = liveMatch.awayTeam?.score !== undefined ? liveMatch.awayTeam.score : (liveMatch.away_score !== null ? liveMatch.away_score : 0);
                    m.isLive = true;
                    m.isFinished = false;
                } else {
                    m.homeScore = null;
                    m.awayScore = null;
                    m.isLive = false;
                    m.isFinished = false;
                }
            }
        }
    });

    // 3. Add any 2026 matches from active state that aren't represented in the historical array yet
    const activeMatches = (state.worldCupGames || []).filter(g => {
        const hName = g.homeTeam?.name || g.home_team_name_en || "";
        const aName = g.awayTeam?.name || g.away_team_name_en || "";
        const matchesTeams = (hName === t1 && aName === t2) || (hName === t2 && aName === t1);
        if (!matchesTeams) return false;

        // Check if already in historical
        const exists = historical.some(m => m.year === 2026 && (
            (m.home === hName && m.away === aName) || (m.home === aName && m.away === hName)
        ));
        return !exists;
    });

    activeMatches.forEach(g => {
        const hName = g.homeTeam?.name || g.home_team_name_en || "TBD";
        const aName = g.awayTeam?.name || g.away_team_name_en || "TBD";
        const isFinished = g.status?.type === 'finished' || g.finished === 'TRUE' || (g.homeTeam?.score !== undefined && g.awayTeam?.score !== undefined);
        const isLive = g.status?.type === 'inprogress';

        historical.push({
            date: g.date || 'Scheduled',
            year: 2026,
            home: hName,
            away: aName,
            homeScore: isFinished || isLive ? (g.homeTeam?.score ?? g.home_score ?? 0) : null,
            awayScore: isFinished || isLive ? (g.awayTeam?.score ?? g.away_score ?? 0) : null,
            city: g.venue || 'TBD',
            country: 'USA',
            shootout: null,
            stage: g.stage ? g.stage.replace('_', ' ') : 'Knockout Match',
            isLive,
            isFinished
        });
    });

    // Sort matchups chronologically (most recent first)
    historical.sort((a, b) => b.year - a.year || new Date(b.date).getTime() - new Date(a.date).getTime());

    if (historical.length === 0) {
        container.innerHTML = `
            <div class="h2h-empty-card">
                <span class="h2h-empty-icon">🤝</span>
                <h4>No World Cup Meetings</h4>
                <p>No past World Cup meetings recorded between ${t1} and ${t2}. A new history begins at the 2026 World Cup.</p>
            </div>
        `;
        return;
    }

    // 4. Aggregate Stats Calculation (only count completed games where scores are not null)
    let t1Wins = 0;
    let t2Wins = 0;
    let draws = 0;
    let t1Goals = 0;
    let t2Goals = 0;
    let completedCount = 0;

    historical.forEach(m => {
        if (m.homeScore === null || m.awayScore === null) return; // Skip upcoming matches
        
        completedCount++;
        const homeGoals = m.homeScore;
        const awayGoals = m.awayScore;

        if (m.home === t1) {
            t1Goals += homeGoals;
            t2Goals += awayGoals;
            if (m.shootout) {
                if (m.shootout.winner === t1) t1Wins++;
                else t2Wins++;
            } else {
                if (homeGoals === awayGoals) {
                    draws++;
                } else if (homeGoals > awayGoals) {
                    t1Wins++;
                } else {
                    t2Wins++;
                }
            }
        } else {
            t2Goals += homeGoals;
            t1Goals += awayGoals;
            if (m.shootout) {
                if (m.shootout.winner === t1) t1Wins++;
                else t2Wins++;
            } else {
                if (homeGoals === awayGoals) {
                    draws++;
                } else if (homeGoals > awayGoals) {
                    t2Wins++;
                } else {
                    t1Wins++;
                }
            }
        }
    });

    // Symmetrical percentages for Goal Dominance Tug of War
    const totalGoals = t1Goals + t2Goals;
    const t1GoalPct = totalGoals ? (t1Goals / totalGoals) * 100 : 50;
    const t2GoalPct = totalGoals ? (t2Goals / totalGoals) * 100 : 50;

    // 5. Calculate symmetrical recent forms (from last 5 completed matches)
    const completedMatches = historical.filter(m => m.homeScore !== null && m.awayScore !== null);
    const lastMatches = completedMatches.slice(0, 5);
    const t1Form = lastMatches.map(m => {
        if (m.shootout) {
            return m.shootout.winner === t1 ? 'W' : 'L';
        }
        if (m.homeScore === m.awayScore) return 'D';
        const isT1Home = m.home === t1;
        if (isT1Home) return m.homeScore > m.awayScore ? 'W' : 'L';
        return m.awayScore > m.homeScore ? 'W' : 'L';
    }).reverse();

    const t2Form = lastMatches.map(m => {
        if (m.shootout) {
            return m.shootout.winner === t2 ? 'W' : 'L';
        }
        if (m.homeScore === m.awayScore) return 'D';
        const isT2Home = m.home === t2;
        if (isT2Home) return m.homeScore > m.awayScore ? 'W' : 'L';
        return m.awayScore > m.homeScore ? 'W' : 'L';
    }).reverse();

    const renderFormDots = (formArray) => {
        if (formArray.length === 0) return '<span style="font-size: 8.5px; color: var(--text-light);">No data</span>';
        return formArray.map(f => `<div class="h2h-form-dot ${f.toLowerCase()}">${f}</div>`).join('');
    };

    // 6. Render aggregate card and timeline feed
    let html = `
        <!-- Summary Dashboard Card -->
        <div class="h2h-summary-card">
            <!-- Symmetrical Team Headers -->
            <div class="h2h-summary-header">
                <div class="h2h-summary-team home">
                    ${getFlagHTML(t1, "h2h-summary-flag")}
                    <span class="h2h-summary-name">${getShortName(t1)}</span>
                </div>
                <div class="h2h-summary-middle">
                    <span class="h2h-played-val">${completedCount}</span>
                    <span class="h2h-played-lbl">Played</span>
                </div>
                <div class="h2h-summary-team away">
                    ${getFlagHTML(t2, "h2h-summary-flag")}
                    <span class="h2h-summary-name">${getShortName(t2)}</span>
                </div>
            </div>

            <!-- Stats Rows (Wins & Goals Grid) -->
            <div class="h2h-stats-rows">
                <div class="h2h-stat-row">
                    <div class="h2h-val t1" style="color: ${t1Color}">${t1Wins}</div>
                    <div class="h2h-label">Wins</div>
                    <div class="h2h-val t2" style="color: ${t2Color}">${t2Wins}</div>
                </div>
                <div class="h2h-stat-row">
                    <div class="h2h-val draw" style="opacity: 0;">0</div>
                    <div class="h2h-label-draws">
                        <span class="h2h-draws-num">${draws}</span> Draws
                    </div>
                    <div class="h2h-val draw" style="opacity: 0;">0</div>
                </div>
                <div class="h2h-stat-row">
                    <div class="h2h-val t1" style="color: ${t1Color}">${t1Goals}</div>
                    <div class="h2h-label">Goals</div>
                    <div class="h2h-val t2" style="color: ${t2Color}">${t2Goals}</div>
                </div>
            </div>

            <!-- Form Row -->
            <div class="h2h-form-row">
                <div class="h2h-form-dots">${renderFormDots(t1Form)}</div>
                <div class="h2h-form-divider">H2H Form</div>
                <div class="h2h-form-dots">${renderFormDots(t2Form)}</div>
            </div>

            <!-- Goal Dominance Tug of War -->
            <div class="h2h-dominance-section">
                <div class="h2h-dominance-meta">
                    <span class="h2h-dominance-val t1" style="color: ${t1Color}">${t1GoalPct.toFixed(0)}%</span>
                    <span class="h2h-dominance-label">Goal Share</span>
                    <span class="h2h-dominance-val t2" style="color: ${t2Color}">${t2GoalPct.toFixed(0)}%</span>
                </div>
                <div class="h2h-tug-track">
                    <div class="h2h-tug-fill t1" style="width: 0%; background: ${t1Color}" data-target="${t1GoalPct}"></div>
                    <div class="h2h-tug-fill t2" style="width: 0%; background: ${t2Color}" data-target="${t2GoalPct}"></div>
                </div>
            </div>
        </div>

        <!-- Matches Timeline Feed -->
        <div class="h2h-timeline-container">
            <div class="h2h-timeline-spine"></div>
            <div class="h2h-feed-wrapper">
    `;

    // 7. Renders chronologically merged matches
    let delay = 0.05;
    historical.forEach(m => {
        const isUpcoming = m.homeScore === null || m.awayScore === null;
        const stageLabel = getStageLabel(m.stage);
        
        let scoreHTML = `<span class="h2h-score-pill">${m.homeScore} - ${m.awayScore}</span>`;
        let badgeHTML = `<span class="h2h-badge-finished">FINISHED</span>`;
        let cardClass = "";

        if (isUpcoming) {
            scoreHTML = `<span class="h2h-vs-pill">VS</span>`;
            badgeHTML = `<span class="h2h-badge-upcoming">UPCOMING</span>`;
            cardClass = "upcoming-card";
        } else if (m.isLive) {
            scoreHTML = `<span class="h2h-score-pill live" style="background: #ef4444;">${m.homeScore} - ${m.awayScore}</span>`;
            badgeHTML = `<span class="h2h-badge-upcoming" style="color:#ef4444; border-color:rgba(239,68,68,0.2);">LIVE</span>`;
            cardClass = "upcoming-card"; 
        } else {
            let shootoutHTML = "";
            if (m.shootout) {
                shootoutHTML = `<span class="h2h-shootout-tag">(${m.shootout.homePen} - ${m.shootout.awayPen} pens)</span>`;
            }
            scoreHTML = `<span class="h2h-score-pill">${m.homeScore} - ${m.awayScore}</span>${shootoutHTML}`;
        }

        html += `
            <div class="h2h-match-card ${cardClass}" style="animation-delay: ${delay}s">
                <div class="h2h-timeline-node"></div>
                <div class="h2h-card-header">
                    <span>${m.year} World Cup • ${stageLabel} • ${m.date}</span>
                    ${badgeHTML}
                </div>
                <div class="h2h-card-teams">
                    <div class="h2h-team-row">
                        ${getFlagHTML(m.home, "h2h-flag-img")}
                        <span class="h2h-team-fullname">${m.home}</span>
                        <span class="h2h-team-shortname">${getShortName(m.home)}</span>
                    </div>
                    <div class="h2h-score-box">
                        ${scoreHTML}
                    </div>
                    <div class="h2h-team-row away">
                        <span class="h2h-team-fullname">${m.away}</span>
                        <span class="h2h-team-shortname">${getShortName(m.away)}</span>
                        ${getFlagHTML(m.away, "h2h-flag-img")}
                    </div>
                </div>
            </div>
        `;
        delay += 0.04;
    });

    html += `
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Smoothly animate the tug-of-war goal share fills after mounting
    setTimeout(() => {
        const fills = container.querySelectorAll('.h2h-tug-fill');
        fills.forEach(fill => {
            fill.style.width = fill.getAttribute('data-target') + '%';
        });
    }, 60);
};
