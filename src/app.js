import { initTheme, setupThemeListeners } from './components/theme.js';
import { setupSelectorListeners } from './components/selector.js';
import { setupComparisonForm, fetchLiveRankings, fetchLiveTopScorers } from './components/comparison.js';
import { drawTacticsPitch } from './components/tactics.js';
import { setupTrophyListeners } from './components/trophies.js';
import { setupLiveArenaListeners, activateLiveArena, deactivateLiveArena } from './components/liveArena.js';

// Sliding Tabs Navigation System
const initTabSlider = () => {
    const tabSlider = document.querySelector('.tab-slider');
    const tabsNav = document.querySelector('.tabs-nav');
    const activeTabBtn = tabsNav?.querySelector('.tab-btn.active');
    
    if (!activeTabBtn || !tabSlider || !tabsNav) return;
    
    const btnRect = activeTabBtn.getBoundingClientRect();
    const navRect = tabsNav.getBoundingClientRect();
    tabSlider.style.width = `${btnRect.width}px`;
    tabSlider.style.height = `${btnRect.height}px`;
    tabSlider.style.left = `${btnRect.left - navRect.left}px`;
    tabSlider.style.top = `${btnRect.top - navRect.top}px`;
};

let statsLoaded = false;
const triggerDeferredStatsLoading = () => {
    if (statsLoaded) return;
    statsLoaded = true;
    console.log("Deferred loading of comparison stats (Rankings & Top Scorers) triggered.");
    fetchLiveRankings();
    fetchLiveTopScorers();
};

const setupTabListeners = () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const tabSlider = document.querySelector('.tab-slider');
    const tabsNav = document.querySelector('.tabs-nav');
    const team1Input = document.getElementById('team1');
    const team2Input = document.getElementById('team2');

    window.addEventListener('resize', initTabSlider);

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPanel = document.getElementById(`panel-${btn.dataset.tab}`);
            if (targetPanel) targetPanel.classList.add('active');

            if (btn.dataset.tab === 'tactics') {
                const t1 = team1Input?.value;
                const t2 = team2Input?.value;
                if (t1 && t2) drawTacticsPitch(t1, t2);
            }

            if (btn.dataset.tab === 'compare') {
                triggerDeferredStatsLoading();
            }

            if (tabSlider && tabsNav) {
                const btnRect = btn.getBoundingClientRect();
                const navRect = tabsNav.getBoundingClientRect();
                tabSlider.style.width = `${btnRect.width}px`;
                tabSlider.style.height = `${btnRect.height}px`;
                tabSlider.style.left = `${btnRect.left - navRect.left}px`;
                tabSlider.style.top = `${btnRect.top - navRect.top}px`;
            }
        });
    });
};

const setupGatewayListeners = () => {
    // Gateway switch theme button to Dark Theme on click
    document.getElementById("unlock-live-btn")?.addEventListener("click", () => {
        const themeBtn = document.getElementById("theme-toggle");
        if (themeBtn && !document.body.classList.contains('dark-theme')) {
            themeBtn.click();
        }
    });

    // Gateway open archive button (starts World Cup mode)
    document.getElementById("open-archive-btn")?.addEventListener("click", () => {
        let overlay = document.getElementById('big-stage-transition-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'big-stage-transition-overlay';
            overlay.className = 'big-stage-transition-overlay';
            overlay.innerHTML = `
                <div class="overlay-bg"></div>
                <div class="transition-content">
                    <div class="pulse-gold-badge">
                        <span class="gold-dot"></span>
                        LIVE ARENA
                    </div>
                    <div class="transition-text">Entering the<br>BIG STAGE</div>
                    <div class="transition-subtext">FIFA WORLD CUP 2026</div>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        overlay.style.display = 'flex';
        overlay.offsetHeight; // Force reflow
        overlay.classList.add('visible');

        // Transition modes in the background immediately
        document.body.classList.add('world-cup-active');
        activateLiveArena();

        // Fade out overlay after 3.2 seconds
        setTimeout(() => {
            overlay.classList.remove('visible');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 1500);
        }, 3200);
    });

    // Return button from World Cup mode back to head-to-head dashboard
    document.getElementById("arena-back-btn")?.addEventListener("click", () => {
        document.body.classList.remove('world-cup-active');
        deactivateLiveArena();
    });
};

// Initialize application components on DOM load
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupThemeListeners();
    setupSelectorListeners();
    setupComparisonForm();
    setupTrophyListeners();
    setupLiveArenaListeners();
    
    setupTabListeners();
    setupGatewayListeners();
});

// Calculate tab slider position after custom web fonts are fully loaded
window.addEventListener('load', () => {
    initTabSlider();
});
