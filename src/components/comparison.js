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
    try {
        console.log('Fetching live FIFA rankings from local rankings proxy...');
        const response = await fetch('/api/rankings');
        if (!response.ok) {
            throw new Error(`Proxy returned HTTP ${response.status}`);
        }
        const fifaData = await response.json();

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
        
        // Expanded to match your application's normalized team list
        const FIFA_API_NAME_MAP = {
            'South Korea': 'Korea Republic',
            'USA': 'USA',
            'Turkey': 'Türkiye',
            'Iran': 'IR Iran',
            'Cape Verde': 'Cabo Verde',
            'DR Congo': 'Congo DR',
            'Ivory Coast': "Côte d'Ivoire"
        };

        for (const key in teamData) {
            const officialName = (FIFA_API_NAME_MAP[key] || key).toLowerCase();
            const rankData = apiLookup[officialName];

            if (rankData) {
                // Defensive checking: ensures 0 values aren't dropped by falsy checks
                if (rankData.rank !== undefined && rankData.rank !== null) {
                    teamData[key].fifaRanking = rankData.rank;
                }
                if (rankData.points !== undefined && rankData.points !== null) {
                    teamData[key].rankingPoints = rankData.points;
                }
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

        // Populate team stats overview hero cards
        const oT1Flag = document.getElementById('overview-t1-flag');
        const oT1Name = document.getElementById('overview-t1-name');
        const oT1Confed = document.getElementById('overview-t1-confed');
        const oT2Flag = document.getElementById('overview-t2-flag');
        const oT2Name = document.getElementById('overview-t2-name');
        const oT2Confed = document.getElementById('overview-t2-confed');

        if (oT1Flag) oT1Flag.innerHTML = getFlagHTML(team1Key, "overview-hero-flag-img");
        if (oT1Name) oT1Name.textContent = team1Key;
        if (oT1Confed) oT1Confed.textContent = t1.confederation;
        if (oT2Flag) oT2Flag.innerHTML = getFlagHTML(team2Key, "overview-hero-flag-img");
        if (oT2Name) oT2Name.textContent = team2Key;
        if (oT2Confed) oT2Confed.textContent = t2.confederation;

        // Populate side-by-side metrics grid
        const metricsList = document.getElementById('overview-metrics-list');
        if (metricsList) {
            metricsList.innerHTML = `
                <div class="metric-row">
                    <div class="metric-val team1-side ${t1RankWin ? 'better' : ''}" id="t1-val-rank">#${t1.fifaRanking}</div>
                    <div class="metric-label">FIFA Ranking</div>
                    <div class="metric-val team2-side ${t2RankWin ? 'better' : ''}" id="t2-val-rank">#${t2.fifaRanking}</div>
                </div>
                <div class="metric-row">
                    <div class="metric-val team1-side ${t1WcWin ? 'better' : ''}" id="t1-val-wc">${t1.worldCups}</div>
                    <div class="metric-label">World Cups Won</div>
                    <div class="metric-val team2-side ${t2WcWin ? 'better' : ''}" id="t2-val-wc">${t2.worldCups}</div>
                </div>
                <div class="metric-row">
                    <div class="metric-val team1-side ${t1ConfedWin ? 'better' : ''}" id="t1-val-confed">${t1.confederationTitles}</div>
                    <div class="metric-label">Confederation Titles</div>
                    <div class="metric-val team2-side ${t2ConfedWin ? 'better' : ''}" id="t2-val-confed">${t2.confederationTitles}</div>
                </div>
                <div class="metric-row">
                    <div class="metric-val team1-side ${t1PointsWin ? 'better' : ''}" id="t1-val-points">${t1.rankingPoints.toLocaleString()}</div>
                    <div class="metric-label">FIFA Points</div>
                    <div class="metric-val team2-side ${t2PointsWin ? 'better' : ''}" id="t2-val-points">${t2.rankingPoints.toLocaleString()}</div>
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

        // Populate squad profiles (Key Personnel) vertical scrolling lists
        const squadList = document.getElementById('overview-squad-profiles-list');
        if (squadList) {
            squadList.innerHTML = `
                <div class="squad-profile-section">
                    <div class="squad-profile-header">
                        <span class="squad-profile-flag">${getFlagHTML(team1Key, "squad-profile-flag-img")}</span>
                        <span class="squad-profile-team-name">${team1Key}</span>
                    </div>
                    <div class="squad-profile-items">
                        <div class="squad-profile-item">
                            <span class="squad-profile-label">Star Player</span>
                            <span class="squad-profile-value">${t1.starPlayer}</span>
                        </div>
                        <div class="squad-profile-item">
                            <span class="squad-profile-label">Top Scorer</span>
                            <span class="squad-profile-value">${t1.topScorer}${t1.topScorerActive ? ' <span class="live-badge"><span class="live-dot"></span>Active</span>' : ''}</span>
                        </div>
                        <div class="squad-profile-item">
                            <span class="squad-profile-label">Current Coach</span>
                            <span class="squad-profile-value">${t1.coach}</span>
                        </div>
                    </div>
                </div>
                
                <div class="squad-profile-section">
                    <div class="squad-profile-header">
                        <span class="squad-profile-flag">${getFlagHTML(team2Key, "squad-profile-flag-img")}</span>
                        <span class="squad-profile-team-name">${team2Key}</span>
                    </div>
                    <div class="squad-profile-items">
                        <div class="squad-profile-item">
                            <span class="squad-profile-label">Star Player</span>
                            <span class="squad-profile-value">${t2.starPlayer}</span>
                        </div>
                        <div class="squad-profile-item">
                            <span class="squad-profile-label">Top Scorer</span>
                            <span class="squad-profile-value">${t2.topScorer}${t2.topScorerActive ? ' <span class="live-badge"><span class="live-dot"></span>Active</span>' : ''}</span>
                        </div>
                        <div class="squad-profile-item">
                            <span class="squad-profile-label">Current Coach</span>
                            <span class="squad-profile-value">${t2.coach}</span>
                        </div>
                    </div>
                </div>
            `;
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
