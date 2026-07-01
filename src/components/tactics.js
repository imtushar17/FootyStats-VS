import { teamData } from '../data/teams.js';
import { getFlagHTML } from './selector.js';

export const getRealWorldFormation = (teamKey) => {
    const formations = {
        Argentina: "4-3-3",
        Spain: "4-3-3",
        France: "4-2-3-1",
        England: "4-2-3-1",
        Portugal: "4-2-3-1",
        Brazil: "4-3-3",
        Morocco: "4-3-3",
        Netherlands: "3-4-3",
        Belgium: "4-3-3",
        Germany: "4-2-3-1",
        Croatia: "4-3-3",
        Italy: "3-4-2-1",
        Colombia: "4-2-3-1",
        Mexico: "4-3-3",
        Senegal: "4-3-3",
        Uruguay: "4-3-3",
        USA: "4-2-3-1",
        Japan: "3-4-2-1",
        Switzerland: "3-4-2-1",
        "South Korea": "4-2-3-1"
    };
    return formations[teamKey] || "4-3-3";
};

const formationCoords = {
    "4-3-3": {
        GK: { left: 12, top: 50 },
        DEF: { left: 32, top: 50 },
        MID: { left: 54, top: 50 },
        FWD: { left: 74, top: 22 },
        ST: { left: 86, top: 72 }
    },
    "4-2-3-1": {
        GK: { left: 12, top: 50 },
        DEF: { left: 30, top: 50 },
        MID: { left: 52, top: 32 },
        FWD: { left: 72, top: 68 },
        ST: { left: 86, top: 50 }
    },
    "3-4-2-1": {
        GK: { left: 12, top: 50 },
        DEF: { left: 28, top: 50 },
        MID: { left: 50, top: 50 },
        FWD: { left: 72, top: 28 },
        ST: { left: 86, top: 72 }
    },
    "3-4-3": {
        GK: { left: 12, top: 50 },
        DEF: { left: 28, top: 50 },
        MID: { left: 50, top: 50 },
        FWD: { left: 74, top: 20 },
        ST: { left: 85, top: 80 }
    }
};

const playerHighlights = {
    "Lionel Messi": "World Cup Winner 2022 Captain, Golden Ball Winner (7 Goals, 3 Assists). Copa América Champion 2021 & 2024.",
    "Emiliano Martínez": "World Cup Winner 2022, Golden Glove Winner. Famous penalty shootout hero in the Final against France.",
    "Cristian Romero": "World Cup Winner 2022 defensive pillar. Copa América Winner. Renowned for elite tackling and defensive intensity.",
    "Alexis Mac Allister": "World Cup Winner 2022 starting midfielder. Assisted Di María's iconic goal in the World Cup Final.",
    "Lautaro Martínez": "World Cup Winner 2022. Copa América 2024 Golden Boot winner and final match-winning goalscorer.",

    "Kylian Mbappé": "World Cup Winner 2018. World Cup 2022 Golden Boot (8 Goals) including historic Final Hat-trick against Argentina.",
    "Antoine Griezmann": "World Cup Winner 2018. World Cup 2022 Bronze Ball winner, orchestrating France's midfield run to the Final.",
    "William Saliba": "Euro 2024 Team of the Tournament defender. Mainstay in France's elite backline during recent international runs.",
    "Mike Maignan": "Euro 2024 Golden Glove contender. Assumed France's #1 shirt with outstanding clean sheet ratios.",
    "Ousmane Dembélé": "World Cup 2022 Runner-up. Renowned for blistering wing pace and dribbling impact in international tournaments.",

    "Cristiano Ronaldo": "Euro 2016 Champion. Historic record holder for most international goals (130+) and appearances in football history.",
    "Bruno Fernandes": "World Cup 2022 standout with 3 goals and 3 assists. Creative heart of Portugal's midfield setup.",
    "Rúben Dias": "Premier League & UCL winner. Portugal's defensive anchor, starting every key match in World Cup 2022 & Euro 2024.",
    "Diogo Costa": "First goalkeeper in Euro history to save 3 penalties in a single shootout (vs Slovenia, Euro 2024).",
    "Rafael Leão": "Scored twice in World Cup 2022 off the bench. Blends elite speed and power on Portugal's left flank.",

    "Lamine Yamal": "Euro 2024 Young Player of the Tournament and Champion. Made history as youngest scorer and assist leader.",
    "Rodri": "Euro 2024 Player of the Tournament and Champion. Globally recognized as the premier defensive midfielder.",
    "Dani Carvajal": "Euro 2024 Champion and Champions League winner. Highly experienced right-back with elite trophy pedigree.",
    "Álvaro Morata": "Euro 2024 Captain and Champion. One of Spain's all-time top scorers in European Championship finals.",
    "Unai Simón": "Euro 2024 Champion goalkeeper. Saved critical penalties in Spain's Nations League victory.",

    "Jude Bellingham": "Real Madrid superstar. Scored critical goals for England in World Cup 2022 and Euro 2024 (including overhead kick vs Slovakia).",
    "Harry Kane": "World Cup 2018 Golden Boot (6 Goals). England's all-time leading scorer and captain of back-to-back Euro Finals.",
    "Declan Rice": "Midfield powerhouse. Started every match for England in Euro 2020, World Cup 2022, and Euro 2024 finals runs.",
    "John Stones": "Ball-playing defender. Mainstay in England's defense across three major tournament semi-final/final runs.",
    "Jordan Pickford": "England's penalty shootout specialist. Conceded the fewest goals in Euro 2020 & 2024 group stages.",

    "Vinícius Júnior": "Copa América standout and Real Madrid star. Pivotal attacker in Brazil's offensive frontline.",
    "Alisson Becker": "Copa América 2019 Golden Glove winner. Regarded as one of the world's most composed one-on-one shot-stoppers.",
    "Marquinhos": "Elite center-back with 80+ caps. Represented Brazil at multiple World Cups and Copa América tournaments.",
    "Lucas Paquetá": "Creative playmaker. Scored in World Cup 2022 round of 16 vs South Korea. Integrates Samba flare with work rate.",
    "Rodrygo": "Highly versatile forward. Inherited the iconic Brazil #10 shirt in Neymar's international absence.",

    "Yassine Bounou": "World Cup 2022 Semifinalist hero. Kept historical clean sheets against Spain and Portugal in shootouts.",
    "Achraf Hakimi": "World Cup 2022 Semifinalist. Scored the iconic Panenka penalty against Spain to seal the Quarter-finals spot.",
    "Sofyan Amrabat": "World Cup 2022 breakout star. The tireless midfield engine that powered Morocco's historic semi-final run.",
    "Hakim Ziyech": "World Cup 2022 Semifinalist. Key playmaker on the wing with a lethal left-foot cross and set-piece delivery.",
    "Youssef En-Nesyri": "Scored the historic leap-header against Portugal in World Cup 2022 to send Morocco to the semi-finals.",

    "Virgil van Dijk": "Netherlands Captain. Led the Dutch to the World Cup 2022 Quarter-finals and Euro 2024 Semi-finals.",
    "Frenkie de Jong": "Elite deep-lying playmaker. Conducted the Dutch midfield tempo in World Cup 2022.",
    "Cody Gakpo": "World Cup 2022 breakout (scored in 3 consecutive group matches). Joint Golden Boot winner at Euro 2024.",
    "Memphis Depay": "Netherlands' second all-time top scorer, closing in on Robin van Persie's historic record.",
    "Bart Verbruggen": "Youngest starting goalkeeper at a European Championship in 60 years (Euro 2024, Netherlands #1).",

    "Jamal Musiala": "Euro 2024 joint top scorer (3 Goals). Germany's primary dribbling and creative catalyst.",
    "Florian Wirtz": "Bundesliga Player of the Season. Scored Germany's opening goal of Euro 2024 and equalizer vs Spain.",
    "Marc-André ter Stegen": "Highly decorated Barcelona goalkeeper. Stepped up as Germany's long-term number one.",
    "Antonio Rüdiger": "Champions League winner. Fearless defensive enforcer who led Germany's backline at home Euro 2024.",
    "Kai Havertz": "Scored in Champions League Final. Served as Germany's tactical striker in Euro 2024 scoring multiple penalties.",

    "Luka Modrić": "Ballon d'Or 2018 Winner. Led Croatia to World Cup 2018 Final and World Cup 2022 Bronze Medal as captain.",
    "Joško Gvardiol": "World Cup 2022 bronze medalist. Scored in the 3rd-place play-off and earned a reputation as an elite young CB.",
    "Dominik Livaković": "World Cup 2022 hero. Saved 4 penalties in shootouts (vs Japan & Brazil) to carry Croatia to the semi-finals.",
    "Mateo Kovačić": "Four-time UCL winner. Midfield engine who dominated possession for Croatia at consecutive World Cups.",
    "Andrej Kramarić": "Croatia's reliable tournament striker, scoring crucial goals at World Cups 2018 and 2022.",

    "Gianluigi Donnarumma": "Euro 2020 Player of the Tournament and Champion. Led Italy's defense with historic penalty saves.",
    "Alessandro Bastoni": "Euro 2020 Champion. Established as Italy's primary ball-playing defender in their post-Chiellini era.",
    "Nicolò Barella": "Euro 2020 Champion. Tireless box-to-box midfielder, scored key goals in Italy's international campaigns.",
    "Federico Chiesa": "Euro 2020 Champion and breakout winger. Renowned for blistering direct runs in tournament finals.",
    "Gianluca Scamacca": "Physical center-forward. Led Italy's line during their Euro 2024 campaign after Europa League triumph.",

    "James Rodríguez": "World Cup 2014 Golden Boot winner. Copa América 2024 Player of the Tournament with a record 6 assists.",
    "Luis Díaz": "Lethal Liverpool winger. Led Colombia's attack during their run to the Copa América 2024 Final.",
    "Daniel Muñoz": "Defensively solid and offensive right-back. Scored twice in Copa América 2024 before the final.",
    "Camilo Vargas": "Colombia's reliable goalkeeper, stepping up to seal their impressive undefeated streak under Néstor Lorenzo.",
    "Jhon Durán": "Breakout Premier League forward. Adds physical strength and long-range shooting threats off Colombia's bench.",

    "Federico Valverde": "Uruguay captain. Led La Celeste to Copa América 2024 bronze. Possesses a powerful long-range shot.",
    "Darwin Núñez": "High-pressing striker. Scored in 5 consecutive World Cup qualifiers under Marcelo Bielsa.",
    "Ronald Araujo": "Barcelona defensive powerhouse. Uruguay's starting CB known for recovery pace and strength.",
    "Sergio Rochet": "Uruguay's trusted goalkeeper. Excelled in Copa América penalty shootouts and World Cup 2022.",
    "Facundo Pellistri": "Bielsa's preferred right winger. Combines high work rate with direct dribbling runs.",

    "Christian Pulisic": "USA captain. Led the USMNT to multiple CONCACAF Nations League titles. Core creative catalyst.",
    "Weston McKennie": "Box-to-box midfielder with high energy. USA's aerial threat and key contributor in international matches.",
    "Antonee Robinson": "Renowned for elite sprint speed and overlapping crosses on the USA's left flank.",
    "Matt Turner": "Saved multiple penalties in CONCACAF Gold Cup and served as USA's starting goalkeeper.",
    "Folarin Balogun": "Scored in CONCACAF Nations League Final. Adds clinical runs and high goalscoring ceiling.",

    "Kaoru Mitoma": "Dribbling sensation. Assisted the historic 'inside-the-line' cross vs Spain in World Cup 2022.",
    "Wataru Endo": "Japan Captain. Dominated the midfield battle in World Cup 2022 victories over Germany and Spain.",
    "Takehiro Tomiyasu": "Versatile Arsenal defender. Shut down elite attackers in Japan's major international victories.",
    "Zion Suzuki": "Japan's highly rated young goalkeeper, starting in their recent Asian Cup campaigns.",
    "Ayase Ueda": "Japan's leading center-forward, scoring a hat-trick in World Cup Qualifiers.",

    "Granit Xhaka": "Switzerland Captain. Led the Swiss to historic Euro upsets over France (2020) and Italy (2024).",
    "Yann Sommer": "Elite shot-stopper. Saved Mbappé's penalty in Euro 2020 and holds Switzerland's clean sheet record.",
    "Manuel Akanji": "Champions League winner. Swiss defensive pillar, marshaling their back-three in major tournaments.",
    "Breel Embolo": "Scored crucial goals for Switzerland at World Cup 2022 and Euro 2024.",
    "Ruben Vargas": "Dazzling winger. Scored a magnificent curling goal to knock Italy out of Euro 2024.",

    "Son Heung-min": "South Korea Captain. Asian football legend, scored the dramatic extra-time free kick vs Australia in Asian Cup.",
    "Kim Min-jae": "Serie A Defender of the Year. South Korea's defensive wall, known for speed, interceptions and strength.",
    "Lee Kang-in": "Creative midfielder. Awarded Golden Ball at U20 World Cup, now South Korea's main creative engine.",
    "Hwang Hee-chan": "Scored the historic 91st-minute winner against Portugal to send South Korea to World Cup 2022 Round of 16.",
    "Jo Hyeon-woo": "Hero of the 'Miracle of Kazan' in World Cup 2018. Saved consecutive penalties in Asian Cup shootouts.",

    "Kevin De Bruyne": "Belgium creative legend. Conducted the Red Devils' Golden Generation, registering historic assist numbers in multiple World Cups and European Championships.",
    "Martin Ødegaard": "Norway Captain and creative orchestrator. Renowned for elite vision, line-breaking passes, and leading Arsenal's title charges with world-class playmaking.",
    "Erling Haaland": "World Cup 2022 / Euro 2024 qualifying sensation. Scored a record-breaking 34 goals in just 37 appearances for Norway, cementing him as one of the world's most clinical strikers.",
    "Alexander Isak": "Sweden's star forward. Renowned for fluid dribbling, exceptional pace, and carrying Sweden's attack with clinical finishing in international matches.",
    "Hakan Çalhanoğlu": "Turkey Captain. Renowned for world-class set-piece delivery, long-range shooting, and masterclass deep-lying playmaking.",
    "Mohamed Salah": "Egypt Captain and global superstar. Two-time CAF Player of the Year, leading Egypt to multiple AFCON Finals with legendary goalscoring records.",
    "David Alaba": "Austria Captain and highly decorated defender. Led Austria's modern generation across multiple European Championships with outstanding versatility and leadership."
};

export const drawTacticsPitch = (team1Key, team2Key) => {
    drawTacticsFlagsSelector(team1Key, team2Key);
    switchTacticsTeam(team1Key, team2Key, team1Key);
};

const drawTacticsFlagsSelector = (t1Key, t2Key) => {
    const container = document.getElementById("tactics-team-flags");
    if (!container) return;

    container.innerHTML = `
        <button type="button" class="tactics-flag-btn active" id="tactics-btn-t1" data-team="${t1Key}" title="Switch to ${t1Key}">
            ${getFlagHTML(t1Key, "tactics-flag-img")}
            <span class="t-flag-name">${t1Key}</span>
        </button>
        <div class="tactics-vs-text">VS</div>
        <button type="button" class="tactics-flag-btn" id="tactics-btn-t2" data-team="${t2Key}" title="Switch to ${t2Key}">
            ${getFlagHTML(t2Key, "tactics-flag-img")}
            <span class="t-flag-name">${t2Key}</span>
        </button>
    `;

    document.getElementById("tactics-btn-t1")?.addEventListener("click", () => {
        switchTacticsTeam(t1Key, t2Key, t1Key);
    });
    document.getElementById("tactics-btn-t2")?.addEventListener("click", () => {
        switchTacticsTeam(t1Key, t2Key, t2Key);
    });
};

export const switchTacticsTeam = (t1Key, t2Key, selectedKey) => {
    const btn1 = document.getElementById("tactics-btn-t1");
    const btn2 = document.getElementById("tactics-btn-t2");

    if (btn1 && btn2) {
        if (selectedKey === t1Key) {
            btn1.classList.add("active");
            btn2.classList.remove("active");
            btn1.style.setProperty('--team-primary', teamData[t1Key].primaryColor);
            btn2.style.setProperty('--team-primary', teamData[t2Key].primaryColor);
        } else {
            btn1.classList.remove("active");
            btn2.classList.add("active");
            btn1.style.setProperty('--team-primary', teamData[t1Key].primaryColor);
            btn2.style.setProperty('--team-primary', teamData[t2Key].primaryColor);
        }
    }

    const activeTeam = teamData[selectedKey];
    const isDarkTheme = document.body.classList.contains('dark-theme');
    const titleEl = document.getElementById("tactics-active-team-title");
    const subEl = document.getElementById("tactics-active-team-sub");

    if (titleEl) titleEl.textContent = isDarkTheme ? "Lineup Setup" : `${selectedKey} Lineup`;

    const formation = getRealWorldFormation(selectedKey);
    if (subEl) subEl.innerHTML = `Formation: ${formation} | Coach: ${activeTeam.coach} <span class="top-5-badge">The Top 5 Format</span>`;

    renderTacticsPlayerNodes(activeTeam, selectedKey, formation);
};

const renderTacticsPlayerNodes = (team, teamKey, formation) => {
    const pitchNodesContainer = document.getElementById("pitch-player-nodes");
    if (!pitchNodesContainer) return;
    pitchNodesContainer.innerHTML = "";

    pitchNodesContainer.style.setProperty('--node-color', team.primaryColor);
    pitchNodesContainer.style.setProperty('--node-secondary', team.secondaryColor || '#ffffff');

    const pitch = document.getElementById("tactics-pitch-canvas");
    if (pitch) {
        pitch.style.boxShadow = `inset 0 0 50px rgba(0, 0, 0, 0.3), 0 0 30px ${team.primaryColor}33, var(--shadow-lg)`;
    }

    const coords = formationCoords[formation] || formationCoords["4-3-3"];

    team.squad.forEach((player) => {
        const posCoord = coords[player.pos] || { left: 50, top: 50 };

        const node = document.createElement("div");
        node.className = "player-node";
        node.style.left = `${posCoord.left}%`;
        node.style.top = `${posCoord.top}%`;
        node.style.setProperty('--node-color', team.primaryColor);
        node.style.setProperty('--node-secondary', team.secondaryColor || '#ffffff');

        // Safe unique class/ID naming for SVG filters and gradients to prevent overlap issues
        const safePlayerId = player.name.replace(/\s+/g, '-').toLowerCase();

        node.innerHTML = `
            <div class="jersey-wrapper">
                <svg class="player-jersey-svg" viewBox="0 0 100 100">
                    <filter id="jersey-shadow-${safePlayerId}" x="-15%" y="-15%" width="130%" height="130%">
                        <feDropShadow dx="0" dy="5" stdDeviation="3.5" flood-opacity="0.35"/>
                    </filter>
                    
                    <defs>
                        <linearGradient id="jersey-grad-${safePlayerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="${team.primaryColor}"/>
                            <stop offset="100%" stop-color="color-mix(in srgb, ${team.primaryColor} 65%, #000000)"/>
                        </linearGradient>
                    </defs>
                    
                    <g filter="url(#jersey-shadow-${safePlayerId})">
                        <!-- Sleeves -->
                        <path d="M 12,38 L 28,22 L 40,32 L 28,50 Z" fill="${team.primaryColor}" stroke="${team.secondaryColor || '#ffffff'}" stroke-width="2.5"/>
                        <path d="M 88,38 L 72,22 L 60,32 L 72,50 Z" fill="${team.primaryColor}" stroke="${team.secondaryColor || '#ffffff'}" stroke-width="2.5"/>
                        <!-- Main Body -->
                        <path d="M 28,32 L 72,32 L 72,88 L 28,88 Z" fill="url(#jersey-grad-${safePlayerId})" stroke="${team.secondaryColor || '#ffffff'}" stroke-width="3" stroke-linejoin="round"/>
                        <!-- Collar Trim -->
                        <path d="M 40,32 A 10,10 0 0,0 60,32 Z" fill="${team.secondaryColor || '#ffffff'}"/>
                    </g>
                    <!-- Rating number overlay -->
                    <text class="jersey-number" x="50" y="66" fill="${team.secondaryColor || '#ffffff'}" font-size="24" font-family="var(--font-heading)" font-weight="900" text-anchor="middle">${player.rating}</text>
                </svg>
            </div>
            <div class="player-node-label-container">
                <span class="player-node-pos-pill">${player.pos}</span>
            </div>
        `;

        const triggerInteraction = () => {
            document.querySelectorAll('.player-node').forEach(n => n.classList.remove('active'));
            node.classList.add('active');

            const target = document.getElementById("tactics-player-card-target");
            const labelInst = document.querySelector(".details-instructions-text");
            if (labelInst) labelInst.classList.add("hidden");

            renderDetailedFUTCard(target, team, teamKey, player);
        };

        node.addEventListener('mouseenter', triggerInteraction);
        node.addEventListener('click', triggerInteraction);
        pitchNodesContainer.appendChild(node);
    });

    setTimeout(() => {
        const nodes = pitchNodesContainer.querySelectorAll('.player-node');
        if (nodes.length > 0) {
            const stNode = Array.from(nodes).find(n => n.querySelector('.player-node-pos-pill').textContent === 'ST') || nodes[0];
            stNode.dispatchEvent(new Event('click'));
        }
    }, 100);
};

const renderDetailedFUTCard = (container, team, teamKey, player) => {
    if (!container) return;
    const isGK = player.pos === "GK";

    const l1 = isGK ? "DIV" : "PAC";
    const l2 = isGK ? "HAN" : "SHO";
    const l3 = isGK ? "KIC" : "PAS";
    const l4 = isGK ? "REF" : "DRI";
    const l5 = isGK ? "SPD" : "DEF";
    const l6 = isGK ? "POS" : "PHY";

    const ratingClass = player.rating >= 85 ? 'gold-tier' : 'standard-tier';
    const highlightText = playerHighlights[player.name];

    // PlayStyles for 90+ rated players
    const playstylesMap = {
        "Lionel Messi": "Tiki Taka+",
        "Kylian Mbappé": "Rapid+",
        "Erling Haaland": "Acrobatic+",
        "Rodri": "Intercept+",
        "Jude Bellingham": "Relentless+",
        "Harry Kane": "Long Ball Pass+",
        "Kevin De Bruyne": "Incisive Pass+",
        "Cristiano Ronaldo": "Power Shot+",
        "Luka Modrić": "Trivela+"
    };
    const styleName = playstylesMap[player.name];

    container.innerHTML = `
        <div class="fut-card ${ratingClass}" style="margin: 0 auto; animation: slideUpFade 0.4s ease forwards;">
            <div class="fut-card-glow"></div>
            
            <!-- Top Row: Rating/Pos on Left, Flag on Right -->
            <div class="fut-card-top-row">
                <div class="fut-top-left">
                    <span class="fut-rating-large">${player.rating}</span>
                    <span class="fut-position-pill">${player.pos}</span>
                </div>
                
                <div class="fut-top-right">
                    <span class="fut-flag-large">${getFlagHTML(teamKey, "fut-flag-img")}</span>
                </div>
            </div>
            
            <!-- Portrait Center Area -->
            <div class="fut-portrait-center-area">
                ${(player.rating >= 80 && player.sofascoreId) ? `
                    <img class="fut-portrait-img-large" 
                         src="./assets/portraits/${player.sofascoreId}.png" 
                         alt="${player.name}" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                    <div class="fut-portrait-silhouette-large" style="display:none;">
                        <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/></svg>
                    </div>
                ` : `
                    <div class="fut-portrait-silhouette-large">
                        <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/></svg>
                    </div>
                `}
            </div>
            
            <!-- Centered Player Name -->
            <div class="fut-name-centered-box">
                <span class="fut-name-bold">${player.name}</span>
                ${(player.rating >= 90 && styleName) ? `<span class="fut-playstyle-badge-small">⚡ ${styleName}</span>` : ''}
            </div>
            
            <!-- Stats Display Structure (Sophisticated & Clean Grid) -->
            <div class="fut-stats-grid-clean">
                <div class="fut-stats-col">
                    <div class="fut-stat-row">
                        <span class="fut-stat-lbl-left">${l1}</span>
                        <span class="fut-stat-val-right">${player.stats.pac}</span>
                    </div>
                    <div class="fut-stat-row">
                        <span class="fut-stat-lbl-left">${l2}</span>
                        <span class="fut-stat-val-right">${player.stats.sho}</span>
                    </div>
                    <div class="fut-stat-row">
                        <span class="fut-stat-lbl-left">${l3}</span>
                        <span class="fut-stat-val-right">${player.stats.pas}</span>
                    </div>
                </div>
                
                <div class="fut-stats-col-divider"></div>
                
                <div class="fut-stats-col">
                    <div class="fut-stat-row">
                        <span class="fut-stat-lbl-left">${l4}</span>
                        <span class="fut-stat-val-right">${player.stats.dri}</span>
                    </div>
                    <div class="fut-stat-row">
                        <span class="fut-stat-lbl-left">${l5}</span>
                        <span class="fut-stat-val-right">${player.stats.def}</span>
                    </div>
                    <div class="fut-stat-row">
                        <span class="fut-stat-lbl-left">${l6}</span>
                        <span class="fut-stat-val-right">${player.stats.phy}</span>
                    </div>
                </div>
            </div>
            
            <!-- Bottom Bio Box -->
            ${(player.rating >= 85 && highlightText) ? `
                <div class="fut-bio-box-clean">
                    <div class="fut-bio-header-clean">
                        <span class="fut-bio-title-clean">INTERNATIONAL CLASS:</span>
                        <span class="fut-bio-flag-clean">${getFlagHTML(teamKey, "fut-flag-bio-inline")}</span>
                    </div>
                    <p class="fut-bio-text-clean">${highlightText}</p>
                </div>
            ` : ''}
        </div>
    `;

    const card = container.querySelector('.fut-card');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / (rect.height / 2)) * 15;
        const rotateY = (x / (rect.width / 2)) * 15;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
        card.style.boxShadow = `0 25px 50px rgba(0,0,0,0.35), 0 0 25px ${team.primaryColor}55`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
        card.style.boxShadow = `0 20px 40px rgba(0, 0, 0, 0.25)`;
    });
};
