import { teamData } from '../data/teams.js';

const TEAM_COLORS = {
    // CONCACAF
    'usa': '#002868',
    'mexico': '#006847',
    'canada': '#D52B1E',
    'costa rica': '#CE1126',
    'panama': '#C8102E',
    'jamaica': '#FEE100',
    'curaçao': '#002B7F',
    'haiti': '#D21034',
    // CONMEBOL
    'argentina': '#43A1D5',
    'brazil': '#FFDC02',
    'uruguay': '#55B5E5',
    'colombia': '#FCD116',
    'ecuador': '#FFD100',
    'peru': '#D91023',
    'chile': '#B0272D',
    'paraguay': '#D52B1E',
    // UEFA
    'france': '#002395',
    'england': '#CE1124',
    'spain': '#C60B1E',
    'germany': '#000000',
    'portugal': '#E42518',
    'netherlands': '#F36C21',
    'italy': '#0064A8',
    'belgium': '#8C0C24',
    'croatia': '#ED1C24',
    'switzerland': '#8B1A1A',
    'denmark': '#C60C30',
    'serbia': '#C6363C',
    'poland': '#DC143C',
    'scotland': '#004B84',
    'austria': '#ED2939',
    'hungary': '#436F4D',
    'turkey': '#E30A17',
    'ukraine': '#FFD700',
    'norway': '#00205B',
    'sweden': '#FECC02',
    'bosnia and herzegovina': '#002F6C',
    'bosnia and herzegovnia': '#002F6C',
    'czechia': '#11457E',
    // CAF
    'morocco': '#C1272D',
    'senegal': '#00853F',
    'egypt': '#A3121A',
    'algeria': '#006233',
    'nigeria': '#008751',
    'cameroon': '#479A50',
    'ghana': '#006B3F',
    'ivory coast': '#F77F00',
    'mali': '#14B53A',
    'cape verde': '#002F6C',
    'dr congo': '#007FFF',
    'south africa': '#007A3D',
    'tunisia': '#E41B13',
    // AFC
    'japan': '#0F3F8C',
    'south korea': '#C21E2B',
    'iran': '#239F40',
    'saudi arabia': '#006C35',
    'australia': '#FFCD00',
    'qatar': '#8A1538',
    'iraq': '#007A3D',
    'jordan': '#C8102E',
    'uzbekistan': '#0099B5',
    // OFC
    'new zealand': '#1A1A1A'
};

const hexToRgba = (hex, alpha) => {
    if (!hex || hex.indexOf('#') !== 0) return `rgba(0,0,0,${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

let activeSlot = 1;
let currentFilter = "All";
let currentSearch = "";
let placeholderInterval = null;

export const getFlagHTML = (teamOrKey, className = "") => {
    let team = typeof teamOrKey === 'string' ? teamData[teamOrKey] : teamOrKey;
    if (!team || !team.code) {
        return `<span class="flag-placeholder">❓</span>`;
    }
    const name = typeof teamOrKey === 'string' ? teamOrKey : "";
    return `<img src="https://flagcdn.com/${team.code}.svg" class="flag-icon-img ${className}" alt="${name} Flag" />`;
};

export const openModal = (slot) => {
    const modalOverlay = document.getElementById('team-selector-modal');
    const modalSearch = document.getElementById('modal-search');
    const modalFiltersContainer = document.getElementById('modal-filters');

    activeSlot = slot;
    currentFilter = "All";
    currentSearch = "";
    if (modalSearch) modalSearch.value = "";

    if (modalFiltersContainer) {
        const filterButtons = modalFiltersContainer.querySelectorAll('.filter-tab');
        filterButtons.forEach(btn => {
            if (btn.dataset.filter === "All") btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }

    if (modalOverlay) {
        modalOverlay.classList.add('open');
        populateModalGrid();
        if (modalSearch) {
            modalSearch.focus();
            
            // Set up search placeholder dynamic loop
            if (placeholderInterval) clearInterval(placeholderInterval);
            const placeholderTeams = ["Argentina", "France", "Brazil", "Germany", "Spain", "England", "USA", "Mexico", "Portugal", "Canada", "Japan", "Italy"];
            let idx = 0;
            modalSearch.placeholder = `e.g. ${placeholderTeams[0]}`;
            placeholderInterval = setInterval(() => {
                const input = document.getElementById('modal-search');
                if (input) {
                    idx = (idx + 1) % placeholderTeams.length;
                    input.placeholder = `e.g. ${placeholderTeams[idx]}`;
                }
            }, 2500);
        }
    }
};

export const closeModal = () => {
    const modalOverlay = document.getElementById('team-selector-modal');
    if (modalOverlay) modalOverlay.classList.remove('open');
    if (placeholderInterval) {
        clearInterval(placeholderInterval);
        placeholderInterval = null;
    }
};

export const populateModalGrid = () => {
    const modalTeamGrid = document.getElementById('modal-team-grid');
    const modalSearch = document.getElementById('modal-search');
    const team1Input = document.getElementById('team1');
    const team2Input = document.getElementById('team2');

    if (!modalTeamGrid) return;
    modalTeamGrid.innerHTML = "";
    const query = currentSearch.toLowerCase().trim();
    const sortedKeys = Object.keys(teamData).sort();

    sortedKeys.forEach(key => {
        const team = teamData[key];
        const matchesRegion = currentFilter === "All" || team.confederation === currentFilter;
        const matchesSearch = key.toLowerCase().includes(query) || team.confederation.toLowerCase().includes(query);

        if (matchesRegion && matchesSearch) {
            const card = document.createElement('div');
            card.className = "modal-team-card";
            
            const color = TEAM_COLORS[key.toLowerCase()] || '#E0E0E0';
            card.style.borderColor = color;

            const oppositeVal = (activeSlot === 1) ? (team2Input?.value || "") : (team1Input?.value || "");
            const isSelectedElsewhere = oppositeVal === key;

            if (isSelectedElsewhere) {
                card.classList.add('selected-elsewhere');
            }

            const isLongName = key.length > 12;
            const nameStyle = isLongName ? ' style="font-size: 11.5px;"' : '';

            card.innerHTML = `
                <span class="modal-card-flag">${getFlagHTML(key, "modal-flag-img")}</span>
                <div class="modal-card-info">
                    <span class="modal-card-name"${nameStyle}>${key}</span>
                    <span class="modal-card-ranking">#${team.fifaRanking}</span>
                </div>
            `;

            if (!isSelectedElsewhere) {
                card.addEventListener('click', () => selectTeam(key));
            }

            modalTeamGrid.appendChild(card);
        }
    });

    if (modalTeamGrid.children.length === 0) {
        modalTeamGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px; font-size: 14px;">No countries found. Try another search.</div>`;
    }
};

export const selectTeam = (key) => {
    const triggerFlag = document.getElementById(`team${activeSlot}-trigger-flag`);
    const triggerName = document.getElementById(`team${activeSlot}-trigger-name`);
    const hiddenInput = document.getElementById(`team${activeSlot}`);
    const team1Input = document.getElementById('team1');
    const team2Input = document.getElementById('team2');
    const teamForm = document.getElementById('team-form');

    if (hiddenInput) hiddenInput.value = key;
    if (triggerFlag) triggerFlag.innerHTML = getFlagHTML(key, "trigger-flag-img");
    if (triggerName) triggerName.textContent = key;

    const triggerBtn = document.getElementById(`team${activeSlot}-trigger`);
    if (triggerBtn) {
        const color = TEAM_COLORS[key.toLowerCase()] || 'var(--border-color)';
        triggerBtn.style.borderColor = color;
        triggerBtn.style.borderWidth = '1.5px';
        triggerBtn.style.boxShadow = `0 4px 14px ${hexToRgba(color, 0.15)}`;
    }

    closeModal();

    if (team1Input && team2Input && team1Input.value && team2Input.value) {
        teamForm?.dispatchEvent(new Event('submit'));
    }
};

export const setupSelectorListeners = () => {
    const team1Trigger = document.getElementById('team1-trigger');
    const team2Trigger = document.getElementById('team2-trigger');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('team-selector-modal');
    const modalSearch = document.getElementById('modal-search');
    const modalFiltersContainer = document.getElementById('modal-filters');

    team1Trigger?.addEventListener('click', () => openModal(1));
    team2Trigger?.addEventListener('click', () => openModal(2));
    modalClose?.addEventListener('click', closeModal);

    modalOverlay?.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    modalSearch?.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        populateModalGrid();
    });

    modalFiltersContainer?.addEventListener('click', (e) => {
        const tab = e.target.closest('.filter-tab');
        if (!tab) return;

        modalFiltersContainer.querySelectorAll('.filter-tab').forEach(btn => btn.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        populateModalGrid();
    });
};
