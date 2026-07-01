import { teamData } from '../data/teams.js';
import { getFlagHTML } from './selector.js';

let trophyLbParticleAnimId = null;
let trophyCountInterval = null;

export const drawTrophyCabinet = (teamKey, cabinetContainerId, shelvesId) => {
    const t = teamData[teamKey];
    if (!t) return;

    const confedCount = t.confederationTitles;

    const shelves = document.getElementById(shelvesId);
    if (!shelves) return;
    shelves.innerHTML = "";

    const container = document.getElementById(cabinetContainerId);
    if (container) {
        container.style.setProperty('--cabinet-color', t.primaryColor);
    }

    const trophyYears = {
        Argentina: {
            worldCup: ["1978", "1986", "2022"],
            confederation: ["1921", "1925", "1927", "1929", "1937", "1941", "1945", "1946", "1947", "1955", "1957", "1959", "1991", "1993", "2021", "2024"]
        },
        Spain: {
            worldCup: ["2010"],
            confederation: ["1964", "2008", "2012", "2024"]
        },
        France: {
            worldCup: ["1998", "2018"],
            confederation: ["1984", "2000"]
        },
        England: {
            worldCup: ["1966"],
            confederation: []
        },
        Portugal: {
            worldCup: [],
            confederation: ["2016"]
        },
        Brazil: {
            worldCup: ["1958", "1962", "1970", "1994", "2002"],
            confederation: ["1919", "1922", "1949", "1989", "1997", "1999", "2004", "2007", "2019"]
        },
        Morocco: {
            worldCup: [],
            confederation: ["1976"]
        },
        Netherlands: {
            worldCup: [],
            confederation: ["1988"]
        },
        Belgium: {
            worldCup: [],
            confederation: []
        },
        Germany: {
            worldCup: ["1954", "1974", "1990", "2014"],
            confederation: ["1972", "1980", "1996"]
        },
        Croatia: {
            worldCup: [],
            confederation: []
        },
        Italy: {
            worldCup: ["1934", "1938", "1982", "2006"],
            confederation: ["1968", "2020"]
        },
        Colombia: {
            worldCup: [],
            confederation: ["2001"]
        },
        Mexico: {
            worldCup: [],
            confederation: ["1965", "1971", "1977", "1993", "1996", "1998", "2003", "2009", "2011", "2015", "2019", "2023"]
        },
        Senegal: {
            worldCup: [],
            confederation: ["2021"]
        },
        Uruguay: {
            worldCup: ["1930", "1950"],
            confederation: ["1916", "1917", "1920", "1923", "1924", "1926", "1935", "1942", "1956", "1959", "1967", "1983", "1987", "1995", "2011"]
        },
        USA: {
            worldCup: [],
            confederation: ["1991", "2002", "2005", "2007", "2013", "2017", "2021"]
        },
        Japan: {
            worldCup: [],
            confederation: ["1992", "2000", "2004", "2011"]
        },
        Switzerland: {
            worldCup: [],
            confederation: []
        },
        "South Korea": {
            worldCup: [],
            confederation: ["1956", "1960"]
        },
        "Canada": {
            worldCup: [],
            confederation: ["1985", "2000"]
        },
        "Australia": {
            worldCup: [],
            confederation: ["1980", "1996", "2000", "2004", "2015"]
        },
        "Iran": {
            worldCup: [],
            confederation: ["1968", "1972", "1976"]
        },
        "Iraq": {
            worldCup: [],
            confederation: ["2007"]
        },
        "Qatar": {
            worldCup: [],
            confederation: ["2019", "2023"]
        },
        "Saudi Arabia": {
            worldCup: [],
            confederation: ["1984", "1988", "1996"]
        },
        "Algeria": {
            worldCup: [],
            confederation: ["1990", "2019"]
        },
        "DR Congo": {
            worldCup: [],
            confederation: ["1968", "1974"]
        },
        "Ivory Coast": {
            worldCup: [],
            confederation: ["1992", "2015", "2024"]
        },
        "Egypt": {
            worldCup: [],
            confederation: ["1957", "1959", "1986", "1998", "2006", "2008", "2010"]
        },
        "Ghana": {
            worldCup: [],
            confederation: ["1963", "1965", "1978", "1982"]
        },
        "South Africa": {
            worldCup: [],
            confederation: ["1996"]
        },
        "Tunisia": {
            worldCup: [],
            confederation: ["2004"]
        },
        "Haiti": {
            worldCup: [],
            confederation: ["1973"]
        },
        "Paraguay": {
            worldCup: [],
            confederation: ["1953", "1979"]
        },
        "New Zealand": {
            worldCup: [],
            confederation: ["1973", "1998", "2002", "2008", "2016", "2024"]
        }
    };

    const teamYears = trophyYears[teamKey] || { worldCup: [], confederation: [] };

    const realWcTrophySvg = `<svg class="trophy-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 21h10v1H7z" fill="#15803d"/> 
        <path d="M6 19h12v2H6z" fill="#f59e0b"/> 
        <path d="M7 17h10v2H7z" fill="#15803d"/> 
        <path d="M8 17c1-3 1-5 2-8h4c1 3 1 5 2 8H8z" fill="#f59e0b"/>
        <path d="M9 13c1 0 1.5-1 1.5-2.5S10 8 10 8h4s-.5 1.5-.5 2.5S14 13 15 13" fill="none" stroke="#d97706" stroke-width="1"/>
        <circle cx="12" cy="5.5" r="3.5" fill="#f59e0b"/>
        <path d="M9 5.5c1 1.5 2 1.5 3 0s2-1.5 3 0" stroke="#d97706" stroke-width="0.8" fill="none"/>
    </svg>`;

    const uefaEuroSvg = `<svg class="trophy-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 20h8v2H8z" fill="#1e293b"/>
        <path d="M9 18h6v2H9z" fill="#cbd5e1"/>
        <path d="M8.5 7h7c1 0 2 1.5 2 4.5S15.5 18 12 18s-5.5-2-5.5-6.5S7.5 7 8.5 7z" fill="#cbd5e1"/>
        <path d="M9.5 5h5v2h-5z" fill="#94a3b8"/>
        <ellipse cx="12" cy="5" rx="2.5" ry="0.8" fill="#e2e8f0"/>
        <path d="M6.5 9c-1 0-1.5 1-1.5 2.5s.5 2.5 1.5 2.5" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M17.5 9c1 0 1.5 1 1.5 2.5s-.5 2.5-1.5 2.5" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`;

    const copaAmericaSvg = `<svg class="trophy-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 17h8v5H8z" fill="#78350f"/>
        <rect x="9.5" y="18" width="1" height="1" fill="#cbd5e1"/>
        <rect x="11.5" y="18" width="1" height="1" fill="#cbd5e1"/>
        <rect x="13.5" y="18" width="1" height="1" fill="#cbd5e1"/>
        <rect x="9.5" y="20" width="1" height="1" fill="#cbd5e1"/>
        <rect x="11.5" y="20" width="1" height="1" fill="#cbd5e1"/>
        <rect x="13.5" y="20" width="1" height="1" fill="#cbd5e1"/>
        <path d="M9 15h6v2H9z" fill="#e2e8f0"/>
        <path d="M7 6.5C7 6.5 7 14 12 15C17 14 17 6.5 17 6.5H7Z" fill="#cbd5e1"/>
        <path d="M6 5.5h12v1H6z" fill="#94a3b8"/>
        <path d="M7 8c-1.2 0-2 .8-2 2s.8 2 2 2" fill="none" stroke="#94a3b8" stroke-width="1.2"/>
        <path d="M17 8c1.2 0 2 .8 2 2s-.8 2-2 2" fill="none" stroke="#94a3b8" stroke-width="1.2"/>
    </svg>`;

    const goldCupSvg = `<svg class="trophy-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 19h6v3H9z" fill="#1e293b"/>
        <path d="M8 17h8v2H8z" fill="#fbbf24"/>
        <path d="M6 7.5C6 7.5 6 16 12 17C18 16 18 7.5 18 7.5H6Z" fill="#fbbf24"/>
        <path d="M5 6h14v1.5H5z" fill="#f59e0b"/>
        <path d="M6 8.5H4v4c0 1.5 1 2.5 2 2.5" fill="none" stroke="#f59e0b" stroke-width="1.8"/>
        <path d="M18 8.5h2v4c0 1.5-1 2.5-2 2.5" fill="none" stroke="#f59e0b" stroke-width="1.8"/>
    </svg>`;

    const afconSvg = `<svg class="trophy-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 19h6v3H9z" fill="#78350f"/>
        <path d="M8 17h8v2H8z" fill="#fbbf24"/>
        <path d="M9.5 9h5c.5 3 .5 6-2.5 8-3-2-3-5-2.5-8z" fill="#fbbf24"/>
        <circle cx="12" cy="7" r="2.5" fill="#f59e0b"/>
        <path d="M9.5 8.5C9.5 8.5 10 6 12 6C14 6 14.5 8.5 14.5 8.5H9.5Z" fill="#d97706"/>
    </svg>`;

    const asianCupSvg = `<svg class="trophy-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 20h6v2H9z" fill="#334155"/>
        <path d="M8 18h8v2H8z" fill="#cbd5e1"/>
        <path d="M11.5 13h1v5h-1z" fill="#cbd5e1"/>
        <path d="M5.5 6.5C5.5 6.5 5 13 12 13.5C19 13 18.5 6.5 18.5 6.5H5.5Z" fill="#e2e8f0"/>
        <path d="M12 7.5L10 11h4l-2-3.5Z" fill="#cbd5e1"/>
        <path d="M5 5.5h14v1H5z" fill="#94a3b8"/>
    </svg>`;

    const shieldSvg = `<svg class="trophy-svg" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#60a5fa"/>
    </svg>`;

    // Shelf 1: World Cup
    const shelf1 = document.createElement("div");
    shelf1.className = "cabinet-shelf";

    const wcCount = t.worldCups;
    if (wcCount > 0) {
        const item = document.createElement("div");
        item.className = "trophy-item";
        item.style.setProperty('--trophy-glow', '#f59e0b');
        item.setAttribute("data-tooltip", `Won in: ${teamYears.worldCup.join(", ")}`);
        item.innerHTML = `
            <div class="trophy-visual-wrapper">
                <span class="trophy-multiplier">x${wcCount}</span>
                ${realWcTrophySvg}
            </div>
            <span class="trophy-name">FIFA World Cup</span>
        `;
        shelf1.appendChild(item);
    } else {
        const item = document.createElement("div");
        item.className = "trophy-item empty-trophy";
        item.setAttribute("data-tooltip", "No World Cup wins yet");
        item.innerHTML = `
            <div class="trophy-visual-wrapper">
                ${realWcTrophySvg}
            </div>
            <span class="trophy-name">No Title</span>
        `;
        shelf1.appendChild(item);
    }
    shelves.appendChild(shelf1);

    // Shelf 2: Confederation Cup & FIFA Rank
    const shelf2 = document.createElement("div");
    shelf2.className = "cabinet-shelf";

    const titleText = t.confederation === "UEFA" ? "Euros Cup" :
        t.confederation === "CONMEBOL" ? "Copa América" :
            t.confederation === "CONCACAF" ? "Gold Cup" :
                t.confederation === "CAF" ? "AFCON Cup" : "Asian Cup";

    const confederationSvg = t.confederation === "UEFA" ? uefaEuroSvg :
        t.confederation === "CONMEBOL" ? copaAmericaSvg :
            t.confederation === "CONCACAF" ? goldCupSvg :
                t.confederation === "CAF" ? afconSvg : asianCupSvg;

    if (confedCount > 0) {
        const item = document.createElement("div");
        item.className = "trophy-item";
        item.style.setProperty('--trophy-glow', t.confederation === "UEFA" || t.confederation === "CONMEBOL" ? '#cbd5e1' : '#f59e0b');

        let yearsText = teamYears.confederation.length > 0
            ? `Won in: ${teamYears.confederation.join(", ")}`
            : `${confedCount} titles won`;

        item.setAttribute("data-tooltip", yearsText);
        item.innerHTML = `
            <div class="trophy-visual-wrapper">
                <span class="trophy-multiplier">x${confedCount}</span>
                ${confederationSvg}
            </div>
            <span class="trophy-name">${titleText}</span>
        `;
        shelf2.appendChild(item);
    } else {
        const item = document.createElement("div");
        item.className = "trophy-item empty-trophy";
        item.setAttribute("data-tooltip", `No ${titleText} wins yet`);
        item.innerHTML = `
            <div class="trophy-visual-wrapper">
                ${confederationSvg}
            </div>
            <span class="trophy-name">No Title</span>
        `;
        shelf2.appendChild(item);
    }

    // Rank badge
    const rankItem = document.createElement("div");
    rankItem.className = "trophy-item";
    rankItem.style.setProperty('--trophy-glow', '#3b82f6');
    rankItem.setAttribute("data-tooltip", `Current FIFA World Ranking: #${t.fifaRanking}`);
    rankItem.innerHTML = `
        <div class="trophy-visual-wrapper">
            <span class="trophy-multiplier" style="color: #60a5fa;">#${t.fifaRanking}</span>
            ${shieldSvg}
        </div>
        <span class="trophy-name">FIFA Rank Badge</span>
    `;
    shelf2.appendChild(rankItem);
    shelves.appendChild(shelf2);

    // Wire up lightboxes
    const wcItem = shelf1.querySelector('.trophy-item');
    if (wcItem && wcCount > 0) {
        wcItem.addEventListener('click', () => openTrophyLightbox({
            teamKey,
            trophySvg: realWcTrophySvg,
            title: 'FIFA World Cup',
            count: wcCount,
            years: teamYears.worldCup,
            glowColor: '#f59e0b',
            primaryColor: t.primaryColor,
            secondaryColor: t.secondaryColor,
        }));
    }

    const confedItem = shelf2.querySelector('.trophy-item');
    if (confedItem && confedCount > 0) {
        confedItem.addEventListener('click', () => openTrophyLightbox({
            teamKey,
            trophySvg: confederationSvg,
            title: titleText,
            count: confedCount,
            years: teamYears.confederation,
            glowColor: t.confederation === "UEFA" || t.confederation === "CONMEBOL" ? '#cbd5e1' : '#f59e0b',
            primaryColor: t.primaryColor,
            secondaryColor: t.secondaryColor,
        }));
    }
};

export const openTrophyLightbox = ({ teamKey, trophySvg, title, count, years, glowColor, primaryColor, secondaryColor }) => {
    const overlay       = document.getElementById('trophy-lightbox');
    const card          = document.getElementById('trophy-lightbox-card');
    const flagEl        = document.getElementById('trophy-lb-flag');
    const svgWrap       = document.getElementById('trophy-lb-svg-wrap');
    const titleEl       = document.getElementById('trophy-lb-title');
    const countEl       = document.getElementById('trophy-lb-count-num');
    const labelEl       = document.getElementById('trophy-lb-count-label');
    const yearsGrid     = document.getElementById('trophy-lb-years-grid');
    const emptyEl       = document.getElementById('trophy-lb-empty');
    const timelineEl    = document.getElementById('trophy-lb-timeline-section');

    if (!overlay || !card) return;

    if (trophyCountInterval) {
        clearInterval(trophyCountInterval);
    }

    card.style.setProperty('--lb-primary', primaryColor);
    card.style.setProperty('--lb-secondary', secondaryColor || '#ffffff');

    const t = teamData[teamKey];
    if (flagEl && t) {
        flagEl.innerHTML = `<img
            src="https://flagcdn.com/w160/${t.code}.png"
            srcset="https://flagcdn.com/w320/${t.code}.png 2x"
            alt="${teamKey} flag"
            class="trophy-lb-flag-img"
        />`;
    }

    if (titleEl) titleEl.textContent = title;

    if (svgWrap) {
        svgWrap.innerHTML = trophySvg;
        const svgEl = svgWrap.querySelector('svg');
        if (svgEl) svgEl.classList.add('trophy-svg');
    }

    if (countEl) {
        countEl.textContent = '0';
        countEl.style.color = '';
        countEl.style.textShadow = '';
        let current = 0;
        const speed = Math.max(55, 320 / Math.max(count, 1));
        trophyCountInterval = setInterval(() => {
            current++;
            countEl.textContent = current;
            countEl.style.animation = 'none';
            void countEl.offsetWidth;
            countEl.style.animation = 'trophy-lb-count-tick 0.25s ease';
            if (current >= count) {
                clearInterval(trophyCountInterval);
                trophyCountInterval = null;
            }
        }, speed);
    }

    if (labelEl) labelEl.textContent = count === 1 ? 'Title' : 'Titles';

    if (yearsGrid && emptyEl && timelineEl) {
        yearsGrid.innerHTML = '';
        emptyEl.classList.remove('visible');

        if (years && years.length > 0) {
            timelineEl.style.display = '';
            years.forEach((year, i) => {
                const chip = document.createElement('span');
                chip.className = 'trophy-lb-year-chip';
                chip.textContent = year;
                chip.style.animationDelay = `${i * 50}ms`;
                yearsGrid.appendChild(chip);
            });
        } else {
            timelineEl.style.display = 'none';
            emptyEl.classList.add('visible');
        }
    }

    startTrophyLbParticles(primaryColor, glowColor);

    card.classList.remove('closing');
    overlay.classList.remove('closing');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};

export const closeTrophyLightbox = () => {
    const overlay = document.getElementById('trophy-lightbox');
    const card    = document.getElementById('trophy-lightbox-card');

    if (!overlay || !card) return;

    if (trophyCountInterval) {
        clearInterval(trophyCountInterval);
        trophyCountInterval = null;
    }

    card.classList.add('closing');
    overlay.classList.add('closing');
    overlay.classList.remove('active');

    setTimeout(() => {
        overlay.classList.remove('closing');
        card.classList.remove('closing');
        document.body.style.overflow = '';
        if (trophyLbParticleAnimId) {
            cancelAnimationFrame(trophyLbParticleAnimId);
            trophyLbParticleAnimId = null;
        }
    }, 280);
};

const startTrophyLbParticles = (primary, secondary) => {
    if (trophyLbParticleAnimId) cancelAnimationFrame(trophyLbParticleAnimId);

    const canvas = document.getElementById('trophy-lb-particles');
    if (!canvas) return;
    const ctx2   = canvas.getContext('2d');
    const card = document.getElementById('trophy-lightbox-card');
    if (!card) return;

    canvas.width  = card.offsetWidth;
    canvas.height = card.offsetHeight;

    const NUM = 38;
    const particles2 = Array.from({ length: NUM }, () => ({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        r:  Math.random() * 2.5 + 0.8,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        opacity: Math.random() * 0.5 + 0.15,
        color: Math.random() > 0.5 ? primary : (secondary || '#ffffff'),
    }));

    const tick = () => {
        ctx2.clearRect(0, 0, canvas.width, canvas.height);
        particles2.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width)  p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx2.beginPath();
            ctx2.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx2.fillStyle = p.color;
            ctx2.globalAlpha = p.opacity;
            ctx2.fill();
        });
        ctx2.globalAlpha = 1;
        trophyLbParticleAnimId = requestAnimationFrame(tick);
    };
    tick();
};

export const setupTrophyListeners = () => {
    document.getElementById('trophy-lb-close')?.addEventListener('click', closeTrophyLightbox);
    document.getElementById('trophy-lightbox')?.addEventListener('click', (e) => {
        if (e.target === document.getElementById('trophy-lightbox')) closeTrophyLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('trophy-lightbox')?.classList.contains('active')) {
            closeTrophyLightbox();
        }
    });
};
