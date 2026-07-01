import { teamData } from '../data/teams.js';

let activeSlot = 1;
let currentFilter = "All";
let currentSearch = "";

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
        if (modalSearch) modalSearch.focus();
    }
};

export const closeModal = () => {
    const modalOverlay = document.getElementById('team-selector-modal');
    if (modalOverlay) modalOverlay.classList.remove('open');
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

            const oppositeVal = (activeSlot === 1) ? (team2Input?.value || "") : (team1Input?.value || "");
            const isSelectedElsewhere = oppositeVal === key;

            if (isSelectedElsewhere) {
                card.classList.add('selected-elsewhere');
            }

            card.innerHTML = `
                <span class="modal-card-flag">${getFlagHTML(key, "modal-flag-img")}</span>
                <div class="modal-card-info">
                    <span class="modal-card-name">${key}</span>
                    <span class="modal-card-ranking">Ranking: #${team.fifaRanking}</span>
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
