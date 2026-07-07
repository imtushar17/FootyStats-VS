import { state } from './state.js';
import { getWcTeamFlagHTML, getStadiumName, formatToIST, escapeHTML, isMatchFinished, isMatchLive, isMatchUpcoming, getGameScore, parseGameDate } from './utils.js';
import { renderKnockoutBracket } from './bracket.js';
import { renderGroupsExplorer } from './standings.js';

export const openExplorer = () => {
    document.getElementById("explorer-overlay")?.classList.add("open");
    const searchInput = document.getElementById("explorer-search");
    if (searchInput) searchInput.value = "";

    const searchWrapper = document.getElementById("explorer-search-wrapper");
    if (searchWrapper) {
        searchWrapper.style.display = "none";
        delete searchWrapper.dataset.randomized;
    }
    
    document.querySelectorAll("#explorer-filter-tabs .filter-btn").forEach(b => {
        if (b.dataset.tab === "calendar") b.classList.add("active");
        else b.classList.remove("active");
    });
    
    filterExplorerGames("calendar", "");
};

export const closeExplorer = () => {
    document.getElementById("explorer-overlay")?.classList.remove("open");
};

export const openBracket = () => {
    document.getElementById("bracket-overlay")?.classList.add("open");
    renderKnockoutBracket(document.getElementById("bracket-games-grid"));
};

export const closeBracket = () => {
    document.getElementById("bracket-overlay")?.classList.remove("open");
};

export const openGroups = () => {
    document.getElementById("groups-overlay")?.classList.add("open");
    renderGroupsExplorer(document.getElementById("groups-explorer-container"));
};

export const closeGroups = () => {
    document.getElementById("groups-overlay")?.classList.remove("open");
};

let selectedDay = null;
let selectedMonth = null;

export const filterExplorerGames = (activeTab, searchVal) => {
    const grid = document.getElementById("explorer-games-grid");
    const searchWrapper = document.getElementById("explorer-search-wrapper");
    if (!grid) return;
    grid.innerHTML = "";

    if (activeTab === "calendar") {
        if (searchWrapper) searchWrapper.style.display = "none";
        grid.style.display = "block";
        grid.style.maxHeight = "55vh";
        if (selectedDay !== null && selectedMonth !== null) {
            drawDayMatchesView(grid, selectedDay, selectedMonth);
        } else {
            drawCalendarGrid(grid);
        }
    } else {
        if (searchWrapper) {
            searchWrapper.style.display = "flex";
            if (!searchWrapper.dataset.randomized) {
                const sampleTeams = ["Argentina", "France", "Brazil", "Germany", "Spain", "England", "USA", "Mexico", "Portugal", "Canada", "Japan", "Italy"];
                const randomTeam = sampleTeams[Math.floor(Math.random() * sampleTeams.length)];
                const searchInput = document.getElementById("explorer-search");
                if (searchInput) {
                    searchInput.placeholder = `e.g. ${randomTeam}`;
                    searchInput.value = "";
                }
                searchWrapper.dataset.randomized = "true";
            }
        }
        grid.style.display = "grid";
        grid.style.maxHeight = "45vh";

        const query = searchVal.toLowerCase().trim();
        const games = state.worldCupGames || [];
        const sorted = [...games].sort((x, y) => parseInt(x.id) - parseInt(y.id));
        let matchedCount = 0;

        sorted.forEach(game => {
            const hName = game.homeTeam?.name || game.home_team_name_en || "TBD";
            const aName = game.awayTeam?.name || game.away_team_name_en || "TBD";

            const matchesSearch = hName.toLowerCase().includes(query) || 
                                  aName.toLowerCase().includes(query) || 
                                  (game.group && game.group.toLowerCase().includes(query));

            if (matchesSearch) {
                const card = createExplorerMatchCard(game);
                grid.appendChild(card);
                matchedCount++;
            }
        });

        if (matchedCount === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px; font-size: 13.5px;">No matches found matching criteria.</div>`;
        }
    }
};

const showWrongDateToast = () => {
    let toast = document.getElementById("calendar-wrong-date-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "calendar-wrong-date-toast";
        toast.className = "calendar-toast-alert";
        toast.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>Wrong date for World Cup</span>
        `;
        document.body.appendChild(toast);
    }
    
    toast.classList.remove("visible");
    toast.offsetHeight;
    toast.classList.add("visible");
    
    setTimeout(() => {
        toast.classList.remove("visible");
    }, 2100);
};

// Calendar state: track which month is currently displayed (6 = June, 7 = July)
let calendarCurrentMonth = 6;

// Helper: get how many days in a given month/year
const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

// Helper: get day-of-week index of the 1st of a month (0=Sun)
const getFirstDayOfWeek = (year, month) => new Date(year, month - 1, 1).getDay();

// Helper: World Cup start date (June 12, 2026 in IST)
const WC_START = { month: 6, day: 12 };
const WC_END = { month: 7, day: 20 };

const isBeforeWC = (month, day) => {
    if (month < WC_START.month) return true;
    if (month === WC_START.month && day < WC_START.day) return true;
    return false;
};

const isAfterWC = (month, day) => {
    if (month > WC_END.month) return true;
    if (month === WC_END.month && day > WC_END.day) return true;
    return false;
};

// Shared helper: count matches on a given date (IST-based for API games)
const getMatchesOnDate = (games, year, month, day) => {
    const monthShortNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const shortMonthStr = monthShortNames[month];
    return games.filter(game => {
        if (game.utcDate) {
            // Convert UTC to IST (+5:30)
            const utcMs = new Date(game.utcDate).getTime();
            const istMs = utcMs + (5.5 * 60 * 60 * 1000);
            const istDate = new Date(istMs);
            return istDate.getFullYear() === year && (istDate.getMonth() + 1) === month && istDate.getDate() === day;
        } else if (game.local_date) {
            const ist = formatToIST(game.local_date, game.stadium_id, game.id);
            const dateStr = ist.date || "";
            return dateStr.startsWith(`${shortMonthStr} ${day}`) || dateStr.startsWith(`${shortMonthStr}  ${day}`);
        }
        return false;
    });
};

const buildCalendarMonthHTML = (year, month, games) => {
    const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);

    let cells = "";
    // leading empty cells
    for (let i = 0; i < firstDay; i++) {
        cells += `<div class="calendar-day-cell empty"></div>`;
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const beforeWC = isBeforeWC(month, day);
        const afterWC = isAfterWC(month, day);
        const outOfTournament = beforeWC || afterWC;
        let classes = "calendar-day-cell";
        let badge = "";

        if (outOfTournament) {
            classes += " inactive-date";
        } else {
            const dayMatches = getMatchesOnDate(games, year, month, day);
            if (dayMatches.length > 0) {
                classes += " active-matchday";
                badge = `<span class="cal-match-count">${dayMatches.length}</span>`;
            }
        }
        if (month === selectedMonth && day === selectedDay) {
            classes += " selected-date";
        }
        cells += `<div class="${classes}" data-day="${day}" data-month="${month}">${day}${badge}</div>`;
    }

    return `
        <div class="calendar-grid-inner" data-month="${month}">
            <div class="calendar-day-header">Sun</div>
            <div class="calendar-day-header">Mon</div>
            <div class="calendar-day-header">Tue</div>
            <div class="calendar-day-header">Wed</div>
            <div class="calendar-day-header">Thu</div>
            <div class="calendar-day-header">Fri</div>
            <div class="calendar-day-header">Sat</div>
            ${cells}
        </div>
    `;
};

export const drawCalendarGrid = (container, targetMonth) => {
    if (targetMonth !== undefined) calendarCurrentMonth = targetMonth;

    const year = 2026;
    const games = state.worldCupGames || [];

    const wrapper = document.createElement("div");
    wrapper.className = "calendar-wrapper";

    const monthNames = ["", "January", "February", "March", "April", "May", "June", "July"];
    const canGoPrev = calendarCurrentMonth > 6;
    const canGoNext = calendarCurrentMonth < 7;

    wrapper.innerHTML = `
        <div class="calendar-month-nav">
            <button type="button" class="cal-nav-btn" id="cal-prev-month" ${!canGoPrev ? "disabled" : ""} aria-label="Previous month">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div class="calendar-month-title-row">
                <span class="calendar-month-title">${monthNames[calendarCurrentMonth]} ${year}</span>
                <span class="calendar-month-subtitle">IST · FIFA World Cup 2026</span>
            </div>
            <button type="button" class="cal-nav-btn" id="cal-next-month" ${!canGoNext ? "disabled" : ""} aria-label="Next month">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
        </div>
        <div class="calendar-grid-viewport">
            ${buildCalendarMonthHTML(year, calendarCurrentMonth, games)}
        </div>
        <div class="calendar-legend">
            <span class="legend-dot active-matchday"></span><span>Match Day</span>
            <span class="legend-dot inactive-date"></span><span>No Matches</span>
        </div>
    `;

    container.appendChild(wrapper);

    // Month navigation buttons
    wrapper.querySelector("#cal-prev-month")?.addEventListener("click", () => {
        if (calendarCurrentMonth > 6) {
            container.innerHTML = "";
            drawCalendarGrid(container, calendarCurrentMonth - 1);
        }
    });
    wrapper.querySelector("#cal-next-month")?.addEventListener("click", () => {
        if (calendarCurrentMonth < 7) {
            container.innerHTML = "";
            drawCalendarGrid(container, calendarCurrentMonth + 1);
        }
    });

    // Touch/swipe support
    let touchStartX = 0;
    const viewport = wrapper.querySelector(".calendar-grid-viewport");
    if (viewport) {
        viewport.addEventListener("touchstart", e => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });
        viewport.addEventListener("touchend", e => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 50) {
                if (dx < 0 && calendarCurrentMonth < 7) {
                    container.innerHTML = "";
                    drawCalendarGrid(container, calendarCurrentMonth + 1);
                } else if (dx > 0 && calendarCurrentMonth > 6) {
                    container.innerHTML = "";
                    drawCalendarGrid(container, calendarCurrentMonth - 1);
                }
            }
        }, { passive: true });
    }

    // Day click listeners
    wrapper.querySelectorAll(".calendar-day-cell:not(.empty)").forEach(cell => {
        cell.addEventListener("click", () => {
            const day = parseInt(cell.dataset.day);
            const month = parseInt(cell.dataset.month);
            if (isBeforeWC(month, day) || isAfterWC(month, day)) {
                showWrongDateToast();
            } else {
                wrapper.querySelectorAll(".calendar-day-cell").forEach(c => c.classList.remove("selected-date"));
                cell.classList.add("selected-date");
                selectedDay = day;
                selectedMonth = month;
                drawDayMatchesView(container, day, month);
            }
        });
    });
};

export const drawDayMatchesView = (container, day, month) => {
    container.innerHTML = "";
    const year = 2026;
    const displayMonth = month || 6;

    const monthFullNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const displayDateStr = `${monthFullNames[displayMonth]} ${day}, ${year}`;

    const dayMatchesWrapper = document.createElement("div");
    dayMatchesWrapper.className = "day-matches-wrapper";

    dayMatchesWrapper.innerHTML = `
        <div class="day-matches-header">
            <button type="button" class="day-back-btn" id="calendar-day-back-btn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                <span>Back to Calendar</span>
            </button>
            <span class="day-matches-title">Matches on ${displayDateStr}</span>
        </div>
        <div class="day-matches-list" style="display: flex; flex-direction: column; gap: 12px; padding-right: 4px;">
        </div>
    `;

    container.appendChild(dayMatchesWrapper);
    const listContainer = dayMatchesWrapper.querySelector(".day-matches-list");

    const games = state.worldCupGames || [];
    const dayMatches = getMatchesOnDate(games, year, displayMonth, day);

    if (dayMatches.length === 0) {
        listContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 30px; font-size: 13.5px;">No matches scheduled on this day.</div>`;
    } else {
        dayMatches.forEach(game => {
            const card = createExplorerMatchCard(game);
            listContainer.appendChild(card);
        });
    }

    document.getElementById("calendar-day-back-btn")?.addEventListener("click", () => {
        selectedDay = null;
        selectedMonth = null;
        container.innerHTML = "";
        drawCalendarGrid(container, displayMonth);
    });
};

export const createExplorerMatchCard = (game) => {
    const card = document.createElement("div");
    card.className = "live-match-card";
    card.style.cursor = "pointer";

    const liveState = state.liveStates[game.id];
    const scoreVal = getGameScore(game);
    const scoreHome = scoreVal.home;
    const scoreAway = scoreVal.away;
    const isLive = isMatchLive(game);
    const isFinished = isMatchFinished(game);
    
    const scoreText = (isLive || isFinished) ? `${escapeHTML(scoreHome)} - ${escapeHTML(scoreAway)}` : "vs";
    
    let timeDisplay = "";
    if (game.utcDate) {
        timeDisplay = new Date(game.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (game.local_date) {
        const istTime = formatToIST(game.local_date, game.stadium_id || game.stadium, game.id);
        timeDisplay = istTime.time;
    }
    timeDisplay = escapeHTML(timeDisplay);

    let badgeHTML = "";
    if (isLive) {
        const minVal = liveState ? liveState.minute : game.time_elapsed;
        badgeHTML = `<span class="match-status-badge live">Live - ${escapeHTML(minVal)}'</span>`;
    } else if (isFinished) {
        badgeHTML = `<span class="match-status-badge finished">Finished</span>`;
    } else {
        badgeHTML = `<span class="match-status-badge upcoming">Upcoming - ${timeDisplay}</span>`;
    }

    const hName = game.homeTeam?.name || game.home_team_name_en || "TBD";
    const aName = game.awayTeam?.name || game.away_team_name_en || "TBD";
    const displayHName = escapeHTML(hName);
    const displayAName = escapeHTML(aName);
    const displayGroup = game.group ? escapeHTML(game.group.replace("GROUP_", "")) : "Knockout";
    const displayStadium = escapeHTML(getStadiumName(game.stadium_id || game.stadium));

    card.innerHTML = `
        <div class="m-card-teams">
            <div class="m-card-team-row">
                ${getWcTeamFlagHTML(hName, "m-card-flag")}
                <span class="m-card-team-name">${displayHName}</span>
            </div>
            <div class="m-card-team-row">
                ${getWcTeamFlagHTML(aName, "m-card-flag")}
                <span class="m-card-team-name">${displayAName}</span>
            </div>
        </div>
        <div class="m-card-score-box" style="width: 50%; align-items: flex-end; justify-content: center; gap: 4px;">
            <span class="m-card-score" style="font-size: 15px;">${scoreText}</span>
            <span class="m-card-meta" style="margin-top: 2px; text-align: right; line-height: 1.3;">
                Group ${displayGroup} • ${timeDisplay}<br>
                <small style="color: var(--text-muted); font-size: 8.5px;">🏟️ ${displayStadium}</small>
            </span>
            ${badgeHTML}
        </div>
    `;

    card.addEventListener("click", () => {
        import('./popups.js').then(m => m.openMatchDetailPopup(game));
    });

    return card;
};
