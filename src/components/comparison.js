import { teamData } from '../data/teams.js';
import { getFlagHTML } from './selector.js';
import { drawTacticsPitch } from './tactics.js';
import { drawTrophyCabinet } from './trophies.js';

export const animateCount = (element, start, end, duration, formatFn = val => val) => {
    if (!element) return;

    if (element.activeAnimId) {
        cancelAnimationFrame(element.activeAnimId);
    }

    let startTime = null;

    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentVal = Math.floor(progress * (end - start) + start);
        element.textContent = formatFn(currentVal);
        if (progress < 1) {
            element.activeAnimId = window.requestAnimationFrame(step);
        } else {
            element.textContent = formatFn(end);
            element.activeAnimId = null;
        }
    };

    element.activeAnimId = window.requestAnimationFrame(step);
};

export const fetchLiveRankings = async () => {
    const FIFA_API_URL = 'https://api.fifa.com/api/v3/fifarankings/rankings/live?gender=1&sportType=0&language=en';
    const PROXY_URL = `https://api.allorigins.win/get?url=${encodeURIComponent(FIFA_API_URL)}`;

    const FIFA_API_NAME_MAP = {
        'South Korea': 'Korea Republic',
        'USA': 'USA',
    };

    const tryFetch = async (url, useProxy) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return useProxy ? JSON.parse(data.contents) : data;
    };

    try {
        let fifaData;
        try {
            console.log('Fetching live FIFA rankings from official FIFA API...');
            fifaData = await tryFetch(FIFA_API_URL, false);
        } catch (directErr) {
            console.warn('Direct FIFA API request failed (likely CORS), trying proxy...', directErr.message);
            fifaData = await tryFetch(PROXY_URL, true);
        }

        if (!fifaData || !Array.isArray(fifaData.Results)) {
            throw new Error('Unexpected FIFA API response format');
        }

        const apiLookup = {};
        for (const entry of fifaData.Results) {
            const name = entry.TeamName?.[0]?.Description?.trim();
            if (name) {
                apiLookup[name.toLowerCase()] = {
                    rank: entry.Rank,
                    points: Math.round(entry.TotalPoints * 100) / 100
                };
            }
        }

        let matchedCount = 0;
        for (const key in teamData) {
            const officialName = (FIFA_API_NAME_MAP[key] || key).toLowerCase();
            const rankData = apiLookup[officialName];

            if (rankData) {
                if (rankData.rank) teamData[key].fifaRanking = rankData.rank;
                if (rankData.points) teamData[key].rankingPoints = rankData.points;
                matchedCount++;
            }
        }

        console.log(`Live FIFA Rankings updated. Matched ${matchedCount}/${Object.keys(teamData).length} teams.`);
        const team1Input = document.getElementById('team1');
        const team2Input = document.getElementById('team2');
        const comparisonResult = document.getElementById('comparison-result');
        const teamForm = document.getElementById('team-form');

        if (team1Input?.value && team2Input?.value && !comparisonResult?.classList.contains('hidden')) {
            teamForm?.dispatchEvent(new Event('submit'));
        }
    } catch (err) {
        console.warn('Could not fetch live FIFA rankings. Using fallback data.', err);
    }
};

export const fetchLiveTopScorers = async () => {
    const activeTeams = Object.entries(teamData).filter(([, t]) => t.topScorerActive && t.topScorerWiki);

    const parseGoals = (extract) => {
        const patterns = [
            /(\d+)\s+(?:international\s+)?goals?\s+(?:in|for|and)\s+\d+/i,
            /scored\s+(\d+)\s+(?:international\s+)?goals?/i,
            /(\d+)\s+goals?\s+in\s+\d+\s+(?:international\s+)?appearances?/i,
            /has\s+(?:scored\s+)?(\d+)\s+goals?\s+(?:and|in|for)/i,
            /(?:international\s+)?goals?[:\s]+(\d+)/i,
        ];
        for (const pat of patterns) {
            const m = extract.match(pat);
            if (m) {
                const n = parseInt(m[1], 10);
                if (n > 20 && n < 300) return n;
            }
        }
        return null;
    };

    let updatedCount = 0;

    await Promise.allSettled(
        activeTeams.map(async ([teamKey, teamInfo]) => {
            try {
                const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(teamInfo.topScorerWiki)}`;
                const res = await fetch(wikiUrl, { headers: { 'Accept': 'application/json' } });
                if (!res.ok) return;
                const data = await res.json();
                const extract = data.extract || '';
                const goals = parseGoals(extract);
                if (goals !== null && goals > teamInfo.topScorerGoals) {
                    const scorerName = teamInfo.topScorer.split(' (')[0];
                    teamData[teamKey].topScorerGoals = goals;
                    teamData[teamKey].topScorer = `${scorerName} (${goals} goals)`;
                    updatedCount++;
                }
            } catch (e) {
                // Ignore
            }
        })
    );

    if (updatedCount > 0) {
        console.log(`Live Top Scorers updated via Wikipedia. ${updatedCount} scorer(s) refreshed.`);
        const team1Input = document.getElementById('team1');
        const team2Input = document.getElementById('team2');
        const comparisonResult = document.getElementById('comparison-result');
        const teamForm = document.getElementById('team-form');

        if (team1Input?.value && team2Input?.value && !comparisonResult?.classList.contains('hidden')) {
            teamForm?.dispatchEvent(new Event('submit'));
        }
    }
};

export const setupComparisonForm = () => {
    const teamForm = document.getElementById('team-form');
    if (!teamForm) return;

    teamForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const team1Input = document.getElementById('team1');
        const team2Input = document.getElementById('team2');
        const team1Card = document.getElementById('team1-card');
        const team2Card = document.getElementById('team2-card');
        const team1Name = document.getElementById('team1-name');
        const team2Name = document.getElementById('team2-name');
        const team1Flag = document.getElementById('team1-flag');
        const team2Flag = document.getElementById('team2-flag');
        const team1Confed = document.getElementById('team1-confed');
        const team2Confed = document.getElementById('team2-confed');
        const team1Stats = document.getElementById('team1-stats');
        const team2Stats = document.getElementById('team2-stats');
        const visualBars = document.getElementById('visual-bars');
        const comparisonResult = document.getElementById('comparison-result');

        const team1Key = team1Input?.value;
        const team2Key = team2Input?.value;

        if (!team1Key || !team2Key) {
            alert('Please select both teams to compare');
            return;
        }

        if (team1Key === team2Key) {
            alert('Please select two different teams');
            return;
        }

        const t1 = teamData[team1Key];
        const t2 = teamData[team2Key];

        // Apply glowing colored theme boundaries on comparison container
        const container = document.querySelector('.container');
        if (container) {
            container.style.setProperty('--team1-theme', t1.primaryColor);
            container.style.setProperty('--team2-theme', t2.primaryColor);
        }

        const t1RankWin = t1.fifaRanking < t2.fifaRanking;
        const t2RankWin = t2.fifaRanking < t1.fifaRanking;
        const t1WcWin = t1.worldCups > t2.worldCups;
        const t2WcWin = t2.worldCups > t1.worldCups;
        const t1ConfedWin = t1.confederationTitles > t2.confederationTitles;
        const t2ConfedWin = t2.confederationTitles > t1.confederationTitles;
        const t1PointsWin = t1.rankingPoints > t2.rankingPoints;
        const t2PointsWin = t2.rankingPoints > t1.rankingPoints;

        let t1Score = 0;
        let t2Score = 0;
        if (t1RankWin) t1Score++; else if (t2RankWin) t2Score++;
        if (t1WcWin) t1Score++; else if (t2WcWin) t2Score++;
        if (t1ConfedWin) t1Score++; else if (t2ConfedWin) t2Score++;
        if (t1PointsWin) t1Score++; else if (t2PointsWin) t2Score++;

        if (team1Card) team1Card.classList.remove('better-team');
        if (team2Card) team2Card.classList.remove('better-team');

        if (t1Score > t2Score) {
            if (team1Card) team1Card.classList.add('better-team');
        } else if (t2Score > t1Score) {
            if (team2Card) team2Card.classList.add('better-team');
        }

        // Populate team stats overview cards
        if (team1Name) team1Name.textContent = team1Key;
        if (team1Flag) team1Flag.innerHTML = getFlagHTML(team1Key, "dashboard-flag-img");
        if (team1Confed) team1Confed.textContent = t1.confederation;
        if (team1Stats) {
            team1Stats.innerHTML = `
                <div class="stat-item ${t1RankWin ? 'highlight-win' : ''}">
                    <span class="stat-label">🌐 FIFA Ranking</span>
                    <span class="stat-value" id="t1-val-rank">#${t1.fifaRanking}</span>
                </div>
                <div class="stat-item ${t1WcWin ? 'highlight-win' : ''}">
                    <span class="stat-label">🏆 World Cups Won</span>
                    <span class="stat-value" id="t1-val-wc">${t1.worldCups}</span>
                </div>
                <div class="stat-item ${t1ConfedWin ? 'highlight-win' : ''}">
                    <span class="stat-label">🥇 Confederation Titles</span>
                    <span class="stat-value" id="t1-val-confed">${t1.confederationTitles}</span>
                </div>
                <div class="stat-item ${t1PointsWin ? 'highlight-win' : ''}">
                    <span class="stat-label">📊 FIFA Points</span>
                    <span class="stat-value" id="t1-val-points">${t1.rankingPoints.toLocaleString()}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">⭐ Star Player</span>
                    <span class="stat-value">${t1.starPlayer}</span>
                </div>
                <div class="stat-item scorer-stat-item">
                    <span class="stat-label">⚽ Top Scorer</span>
                    <span class="stat-value scorer-stat-value">${t1.topScorer}${t1.topScorerActive ? ' <span class="live-badge"><span class="live-dot"></span>Active</span>' : ''}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">🧑‍💼 Current Coach</span>
                    <span class="stat-value">${t1.coach}</span>
                </div>
            `;
        }

        if (team2Name) team2Name.textContent = team2Key;
        if (team2Flag) team2Flag.innerHTML = getFlagHTML(team2Key, "dashboard-flag-img");
        if (team2Confed) team2Confed.textContent = t2.confederation;
        if (team2Stats) {
            team2Stats.innerHTML = `
                <div class="stat-item ${t2RankWin ? 'highlight-win' : ''}">
                    <span class="stat-label">🌐 FIFA Ranking</span>
                    <span class="stat-value" id="t2-val-rank">#${t2.fifaRanking}</span>
                </div>
                <div class="stat-item ${t2WcWin ? 'highlight-win' : ''}">
                    <span class="stat-label">🏆 World Cups Won</span>
                    <span class="stat-value" id="t2-val-wc">${t2.worldCups}</span>
                </div>
                <div class="stat-item ${t2ConfedWin ? 'highlight-win' : ''}">
                    <span class="stat-label">🥇 Confederation Titles</span>
                    <span class="stat-value" id="t2-val-confed">${t2.confederationTitles}</span>
                </div>
                <div class="stat-item ${t2PointsWin ? 'highlight-win' : ''}">
                    <span class="stat-label">📊 FIFA Points</span>
                    <span class="stat-value" id="t2-val-points">${t2.rankingPoints.toLocaleString()}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">⭐ Star Player</span>
                    <span class="stat-value">${t2.starPlayer}</span>
                </div>
                <div class="stat-item scorer-stat-item">
                    <span class="stat-label">⚽ Top Scorer</span>
                    <span class="stat-value scorer-stat-value">${t2.topScorer}${t2.topScorerActive ? ' <span class="live-badge"><span class="live-dot"></span>Active</span>' : ''}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">🧑‍💼 Current Coach</span>
                    <span class="stat-value">${t2.coach}</span>
                </div>
            `;
        }

        // Count animations
        animateCount(document.getElementById('t1-val-wc'), 0, t1.worldCups, 800);
        animateCount(document.getElementById('t2-val-wc'), 0, t2.worldCups, 800);
        animateCount(document.getElementById('t1-val-confed'), 0, t1.confederationTitles, 800);
        animateCount(document.getElementById('t2-val-confed'), 0, t2.confederationTitles, 800);
        animateCount(document.getElementById('t1-val-points'), 1000, t1.rankingPoints, 1000, val => val.toLocaleString());
        animateCount(document.getElementById('t2-val-points'), 1000, t2.rankingPoints, 1000, val => val.toLocaleString());

        // Progress gauge split bars rendering
        const buildRatioBar = (title, t1Val, t2Val, higherIsBetter = true) => {
            let pct1 = 50;
            let pct2 = 50;

            if (higherIsBetter) {
                const sum = t1Val + t2Val;
                if (sum > 0) {
                    pct1 = (t1Val / sum) * 100;
                    pct2 = (t2Val / sum) * 100;
                }
            } else {
                if (t1Val === t2Val) {
                    pct1 = 50;
                    pct2 = 50;
                } else {
                    const sum = t1Val + t2Val;
                    pct1 = ((sum - t1Val) / sum) * 100;
                    pct2 = ((sum - t2Val) / sum) * 100;
                }
            }

            const displayVal1 = typeof t1Val === 'number' && t1Val % 1 !== 0 ? t1Val.toFixed(2) : t1Val;
            const displayVal2 = typeof t2Val === 'number' && t2Val % 1 !== 0 ? t2Val.toFixed(2) : t2Val;

            return `
                <div class="split-bar-metric">
                    <div class="split-bar-col team1-side">
                        <span class="split-val">${displayVal1}</span>
                        <div class="split-track">
                            <div class="split-fill team1-fill" style="width: 0%; max-width: ${pct1}%"></div>
                        </div>
                    </div>
                    <div class="split-bar-label">${title}</div>
                    <div class="split-bar-col team2-side">
                        <div class="split-track">
                            <div class="split-fill team2-fill" style="width: 0%; max-width: ${pct2}%"></div>
                        </div>
                        <span class="split-val">${displayVal2}</span>
                    </div>
                </div>
            `;
        };

        if (visualBars) {
            visualBars.innerHTML = `
                ${buildRatioBar("FIFA Ranking", t1.fifaRanking, t2.fifaRanking, false)}
                ${buildRatioBar("World Cups", t1.worldCups, t2.worldCups)}
                ${buildRatioBar("Confederation Titles", t1.confederationTitles, t2.confederationTitles)}
                ${buildRatioBar("FIFA Points", t1.rankingPoints, t2.rankingPoints)}
            `;

            setTimeout(() => {
                const fills1 = visualBars.querySelectorAll('.split-fill.team1-fill');
                const fills2 = visualBars.querySelectorAll('.split-fill.team2-fill');
                fills1.forEach(f => f.style.width = f.style.maxWidth);
                fills2.forEach(f => f.style.width = f.style.maxWidth);
            }, 100);
        }

        // Draw Tactics Field nodes
        drawTacticsPitch(team1Key, team2Key);

        // Draw Trophy Cabinets
        const t1FlagEl = document.getElementById("cabinet-t1-flag");
        const t1NameEl = document.getElementById("cabinet-t1-name");
        const t2FlagEl = document.getElementById("cabinet-t2-flag");
        const t2NameEl = document.getElementById("cabinet-t2-name");

        if (t1FlagEl) t1FlagEl.innerHTML = getFlagHTML(team1Key, "trophy-flag-img");
        if (t1NameEl) t1NameEl.textContent = team1Key;
        if (t2FlagEl) t2FlagEl.innerHTML = getFlagHTML(team2Key, "trophy-flag-img");
        if (t2NameEl) t2NameEl.textContent = team2Key;

        drawTrophyCabinet(team1Key, "cabinet-team1", "cabinet-t1-shelves");
        drawTrophyCabinet(team2Key, "cabinet-team2", "cabinet-t2-shelves");

        // Unhide comparison dashboard results
        if (comparisonResult) {
            comparisonResult.classList.remove('hidden');
            comparisonResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Force active tab to Overview
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(btn => {
            if (btn.dataset.tab === 'overview') btn.classList.add('active');
            else btn.classList.remove('active');
        });
        tabPanels.forEach(panel => {
            if (panel.id === 'panel-overview') panel.classList.add('active');
            else panel.classList.remove('active');
        });

        // Trigger layout updates
        const activeTabBtn = document.querySelector('.tab-btn.active');
        const tabSlider = document.querySelector('.tab-slider');
        const tabsNav = document.querySelector('.tabs-nav');
        if (activeTabBtn && tabSlider && tabsNav) {
            const btnRect = activeTabBtn.getBoundingClientRect();
            const navRect = tabsNav.getBoundingClientRect();
            tabSlider.style.width = `${btnRect.width}px`;
            tabSlider.style.height = `${btnRect.height}px`;
            tabSlider.style.left = `${btnRect.left - navRect.left}px`;
            tabSlider.style.top = `${btnRect.top - navRect.top}px`;
        }
    });
};
