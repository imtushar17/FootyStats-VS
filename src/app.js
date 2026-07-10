import { initTheme, setupThemeListeners } from './components/theme.js';
import { setupSelectorListeners } from './components/selector.js';
import { setupComparisonForm, fetchLiveRankings, fetchLiveTopScorers } from './components/comparison.js';
import { drawTacticsPitch } from './components/tactics.js';
import { drawWorldCupMatchesTab } from './components/worldCupTab.js';
import { setupTrophyListeners } from './components/trophies.js';
import { setupLiveArenaListeners, activateLiveArena, deactivateLiveArena } from './components/liveArena.js';
import { fetchMatchesList } from './components/matchcentre/api.js';
import { registerSwipeTabs } from './components/matchcentre/utils.js';
import { state } from './components/matchcentre/state.js';

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

            if (btn.dataset.tab === 'wc2026') {
                const t1 = team1Input?.value;
                const t2 = team2Input?.value;
                if (t1 && t2) drawWorldCupMatchesTab(t1, t2);
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

    // Register swipe tabs for main comparison tab content
    const tabContent = document.querySelector('.tab-content');
    if (tabContent) {
        registerSwipeTabs(tabContent, () => document.querySelectorAll('.tab-btn'));
    }

    // Register swipe tabs for match detail popup body statically (once at startup!)
    const popupBody = document.getElementById('match-detail-popup-body');
    if (popupBody) {
        registerSwipeTabs(popupBody, () => popupBody.querySelectorAll('.popup-tab-btn'));
    }
};

const isAnyModalActive = () => {
    const modalIds = ['match-detail-overlay', 'groups-overlay', 'bracket-overlay', 'explorer-overlay', 'team-selector-modal'];
    return modalIds.some(id => {
        const el = document.getElementById(id);
        return el && el.classList.contains('open');
    });
};

const showPwaNotificationPill = () => {
    let pill = document.getElementById('pwa-install-pill');
    if (!pill) {
        pill = document.createElement('div');
        pill.id = 'pwa-install-pill';
        pill.className = 'pwa-notification-pill';
        
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        let actionText = "⚽ Drop the browser. Add to Home Screen for the full-screen experience.";
        if (isIOS) {
            actionText = "⚽ Tap Share 📤 and select 'Add to Home Screen' for the full-screen experience.";
        }
        
        pill.innerHTML = `
            <div class="pwa-pill-content" id="pwa-pill-action">${actionText}</div>
            <button type="button" class="pwa-pill-close-btn" id="pwa-pill-close" aria-label="Dismiss">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        `;
        
        const viewport = document.getElementById('phone-viewport');
        if (viewport) {
            viewport.appendChild(pill);
        }
        
        // Close button listener (7-day cooldown trigger!)
        pill.querySelector('#pwa-pill-close').addEventListener('click', (e) => {
            e.stopPropagation();
            localStorage.setItem('pwa_prompt_dismissed_time', String(Date.now()));
            pill.classList.remove('active');
        });
        
        // Touch gesture swipe-to-dismiss listeners for the pill itself (up/left/right)
        let pStartX = 0;
        let pStartY = 0;
        let pStartTime = 0;
        let isPillSwipe = false;

        pill.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) return;
            pStartX = e.touches[0].clientX;
            pStartY = e.touches[0].clientY;
            pStartTime = Date.now();
            isPillSwipe = false;
        }, { passive: true });

        pill.addEventListener('touchmove', (e) => {
            if (e.touches.length !== 1) return;
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = currentX - pStartX;
            const deltaY = currentY - pStartY;

            // Mark as active swipe gesture if swiped up or side-to-side significantly
            if (deltaY < -15 || Math.abs(deltaX) > 20) {
                isPillSwipe = true;
            }
        }, { passive: true });

        pill.addEventListener('touchend', (e) => {
            if (!isPillSwipe) return;
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = endX - pStartX;
            const deltaY = endY - pStartY;
            const duration = Date.now() - pStartTime;

            // Trigger dismiss if swiped up or left/right swiftly
            if ((deltaY < -30 || Math.abs(deltaX) > 40) && duration < 400) {
                console.log('PWA notification pill swiped away.');
                localStorage.setItem('pwa_prompt_dismissed_time', String(Date.now()));
                pill.classList.remove('active');
            }
            isPillSwipe = false;
        }, { passive: true });
        
        // Action trigger listener - executed synchronously for Chrome/Android compatibility
        pill.querySelector('#pwa-pill-action').addEventListener('click', () => {
            if (isIOS) return; // iOS Safari manual flow
            
            const actionEl = document.getElementById('pwa-pill-action');
            if (actionEl) {
                actionEl.textContent = "Landing to your device... 🚀";
            }
            
            // Native PWA prompt must be fired synchronously in response to a click event
            if (state.deferredInstallPrompt) {
                state.deferredInstallPrompt.prompt();
                state.deferredInstallPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('PWA installation accepted.');
                        pill.classList.remove('active');
                    } else {
                        console.log('PWA installation dismissed.');
                        if (actionEl) {
                            actionEl.textContent = "⚽ Drop the browser. Add to Home Screen for the full-screen experience.";
                        }
                    }
                    state.deferredInstallPrompt = null;
                });
            } else {
                console.warn('deferredInstallPrompt is null or unavailable at click time.');
                pill.classList.remove('active');
            }
        });
    }
    
    // Force layout reflow before activation to trigger spring animation
    pill.offsetHeight;
    pill.classList.add('active');
    state.isPromptQueued = false;
};

const setupPwaPromptListeners = () => {
    // Intercept standard beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        state.deferredInstallPrompt = e;
    });

    // Hide active banners once installation completes
    window.addEventListener('appinstalled', () => {
        console.log('App was successfully installed.');
        const pill = document.getElementById('pwa-install-pill');
        if (pill) {
            pill.classList.remove('active');
        }
        state.deferredInstallPrompt = null;
    });

    // Start 27-second timer
    setTimeout(() => {
        const isInstalled = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
        const dismissedTime = localStorage.getItem('pwa_prompt_dismissed_time');
        const isCooldown = dismissedTime && (Date.now() - Number(dismissedTime) < 604800000); // 7 days (604,800,000 ms)

        if (isInstalled || isCooldown) return;

        if (isAnyModalActive()) {
            state.isPromptQueued = true;
            console.log("PWA install prompt queued: a modal is currently open.");
        } else {
            showPwaNotificationPill();
        }
    }, 27000);

    // Setup MutationObserver to watch modals close and trigger queued prompts
    const modalIds = ['match-detail-overlay', 'groups-overlay', 'bracket-overlay', 'explorer-overlay', 'team-selector-modal'];
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (!target.classList.contains('open')) {
                    if (state.isPromptQueued && !isAnyModalActive()) {
                        setTimeout(showPwaNotificationPill, 300);
                    }
                }
            }
        });
    });

    modalIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            observer.observe(el, { attributes: true, attributeFilter: ['class'] });
        }
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
    setupPwaPromptListeners();

    // Fetch live FIFA rankings immediately on application load
    fetchLiveRankings();

    // Fetch World Cup matches list immediately on application load
    fetchMatchesList();
});

// Calculate tab slider position after custom web fonts are fully loaded
window.addEventListener('load', () => {
    initTabSlider();
});
