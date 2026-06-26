// Premium National Football Team Comparison & Analytics Dashboard Engine
// Contains interactive database, Web Audio synthesizer, SVG radar chart drawer,
// visual tactics pitch lineup nodes, trophy shelf renderer, H2H matching, and tactical simulator.

const teamData = {
    Argentina: {
        flag: "🇦🇷",
        code: "ar",
        fifaRanking: 1,
        worldCups: 3,
        confederationTitles: 16,
        topScorer: "Lionel Messi (122 goals)", topScorerGoals: 122, topScorerActive: true, topScorerWiki: "Lionel_Messi",
        starPlayer: "Lionel Messi",
        coach: "Lionel Scaloni",
        confederation: "CONMEBOL",
        rankingPoints: 1901.93,
        primaryColor: "#0284c7",
        secondaryColor: "#ffffff",
        playerCard: { rating: 91, pos: "RW", pac: 80, sho: 87, pas: 90, dri: 92, def: 33, phy: 64 },
        squad: [
            { pos: "GK", name: "Emiliano Martínez", rating: 87, stats: { pac: 87, sho: 84, pas: 82, dri: 88, def: 55, phy: 86 } },
            { pos: "DEF", name: "Cristian Romero", rating: 85, stats: { pac: 80, sho: 46, pas: 61, dri: 65, def: 86, phy: 85 } },
            { pos: "MID", name: "Alexis Mac Allister", rating: 84, stats: { pac: 70, sho: 79, pas: 84, dri: 83, def: 77, phy: 78 } },
            { pos: "FWD", name: "Lionel Messi", rating: 91, stats: { pac: 80, sho: 87, pas: 90, dri: 92, def: 33, phy: 64 } },
            { pos: "ST", name: "Lautaro Martínez", rating: 87, stats: { pac: 81, sho: 88, pas: 73, dri: 84, def: 48, phy: 84 } }
        ]
    },
    Spain: {
        flag: "🇪🇸",
        code: "es",
        fifaRanking: 3,
        worldCups: 1,
        confederationTitles: 4,
        topScorer: "David Villa (59 goals)", topScorerGoals: 59, topScorerActive: false,
        starPlayer: "Lamine Yamal",
        coach: "Luis de la Fuente",
        confederation: "UEFA",
        rankingPoints: 1864.32,
        primaryColor: "#dc2626",
        secondaryColor: "#eab308",
        playerCard: { rating: 86, pos: "RW", pac: 89, sho: 80, pas: 82, dri: 88, def: 41, phy: 62 },
        squad: [
            { pos: "GK", name: "Unai Simón", rating: 85, stats: { pac: 84, sho: 82, pas: 85, dri: 87, def: 50, phy: 83 } },
            { pos: "DEF", name: "Dani Carvajal", rating: 86, stats: { pac: 81, sho: 54, pas: 78, dri: 80, def: 85, phy: 82 } },
            { pos: "MID", name: "Rodri", rating: 90, stats: { pac: 66, sho: 73, pas: 86, dri: 84, def: 89, phy: 85 } },
            { pos: "FWD", name: "Lamine Yamal", rating: 86, stats: { pac: 89, sho: 80, pas: 82, dri: 88, def: 41, phy: 62 } },
            { pos: "ST", name: "Álvaro Morata", rating: 83, stats: { pac: 82, sho: 82, pas: 72, dri: 79, def: 45, phy: 78 } }
        ]
    },
    France: {
        flag: "🇫🇷",
        code: "fr",
        fifaRanking: 2,
        worldCups: 2,
        confederationTitles: 2,
        topScorer: "Olivier Giroud (57 goals)", topScorerGoals: 57, topScorerActive: false,
        starPlayer: "Kylian Mbappé",
        coach: "Didier Deschamps",
        confederation: "UEFA",
        rankingPoints: 1894.40,
        primaryColor: "#1e3a8a",
        secondaryColor: "#dc2626",
        playerCard: { rating: 91, pos: "ST", pac: 97, sho: 90, pas: 80, dri: 92, def: 36, phy: 78 },
        squad: [
            { pos: "GK", name: "Mike Maignan", rating: 87, stats: { pac: 86, sho: 85, pas: 88, dri: 89, def: 53, phy: 86 } },
            { pos: "DEF", name: "William Saliba", rating: 87, stats: { pac: 83, sho: 39, pas: 71, dri: 72, def: 88, phy: 84 } },
            { pos: "MID", name: "Antoine Griezmann", rating: 88, stats: { pac: 78, sho: 84, pas: 87, dri: 87, def: 55, phy: 72 } },
            { pos: "FWD", name: "Ousmane Dembélé", rating: 86, stats: { pac: 93, sho: 78, pas: 81, dri: 89, def: 36, phy: 58 } },
            { pos: "ST", name: "Kylian Mbappé", rating: 91, stats: { pac: 97, sho: 90, pas: 80, dri: 92, def: 36, phy: 78 } }
        ]
    },
    England: {
        flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        code: "gb-eng",
        fifaRanking: 4,
        worldCups: 1,
        confederationTitles: 0,
        topScorer: "Harry Kane (81 goals)", topScorerGoals: 81, topScorerActive: true, topScorerWiki: "Harry_Kane",
        starPlayer: "Jude Bellingham",
        coach: "Thomas Tuchel",
        confederation: "UEFA",
        rankingPoints: 1829.82,
        primaryColor: "#0f172a",
        secondaryColor: "#e2e8f0",
        playerCard: { rating: 90, pos: "CAM", pac: 79, sho: 86, pas: 83, dri: 88, def: 78, phy: 82 },
        squad: [
            { pos: "GK", name: "Jordan Pickford", rating: 83, stats: { pac: 83, sho: 80, pas: 87, dri: 84, def: 46, phy: 80 } },
            { pos: "DEF", name: "John Stones", rating: 85, stats: { pac: 72, sho: 51, pas: 79, dri: 79, def: 85, phy: 79 } },
            { pos: "MID", name: "Declan Rice", rating: 87, stats: { pac: 76, sho: 69, pas: 79, dri: 80, def: 86, phy: 83 } },
            { pos: "FWD", name: "Jude Bellingham", rating: 90, stats: { pac: 79, sho: 86, pas: 83, dri: 88, def: 78, phy: 82 } },
            { pos: "ST", name: "Harry Kane", rating: 90, stats: { pac: 69, sho: 93, pas: 84, dri: 83, def: 49, phy: 82 } }
        ]
    },
    Portugal: {
        flag: "🇵🇹",
        code: "pt",
        fifaRanking: 7,
        worldCups: 0,
        confederationTitles: 1,
        topScorer: "Cristiano Ronaldo (145 goals)", topScorerGoals: 145, topScorerActive: true, topScorerWiki: "Cristiano_Ronaldo",
        starPlayer: "Bruno Fernandes",
        coach: "Roberto Martínez",
        confederation: "UEFA",
        rankingPoints: 1766.74,
        primaryColor: "#dc2626",
        secondaryColor: "#15803d",
        playerCard: { rating: 88, pos: "CAM", pac: 72, sho: 86, pas: 90, dri: 83, def: 68, phy: 77 },
        squad: [
            { pos: "GK", name: "Diogo Costa", rating: 84, stats: { pac: 83, sho: 81, pas: 84, dri: 85, def: 45, phy: 83 } },
            { pos: "DEF", name: "Rúben Dias", rating: 89, stats: { pac: 67, sho: 39, pas: 70, dri: 69, def: 89, phy: 87 } },
            { pos: "MID", name: "Bruno Fernandes", rating: 88, stats: { pac: 72, sho: 86, pas: 90, dri: 83, def: 68, phy: 77 } },
            { pos: "FWD", name: "Rafael Leão", rating: 86, stats: { pac: 93, sho: 79, pas: 76, dri: 87, def: 36, phy: 75 } },
            { pos: "ST", name: "Cristiano Ronaldo", rating: 86, stats: { pac: 77, sho: 88, pas: 78, dri: 80, def: 34, phy: 74 } }
        ]
    },
    Brazil: {
        flag: "🇧🇷",
        code: "br",
        fifaRanking: 5,
        worldCups: 5,
        confederationTitles: 9,
        topScorer: "Neymar Jr (79 goals)", topScorerGoals: 79, topScorerActive: true, topScorerWiki: "Neymar",
        starPlayer: "Vinícius Júnior",
        coach: "Dorival Júnior",
        confederation: "CONMEBOL",
        rankingPoints: 1772.01,
        primaryColor: "#15803d",
        secondaryColor: "#eab308",
        playerCard: { rating: 90, pos: "LW", pac: 95, sho: 84, pas: 81, dri: 91, def: 38, phy: 69 },
        squad: [
            { pos: "GK", name: "Alisson Becker", rating: 89, stats: { pac: 89, sho: 86, pas: 85, dri: 89, def: 52, phy: 90 } },
            { pos: "DEF", name: "Marquinhos", rating: 87, stats: { pac: 79, sho: 53, pas: 70, dri: 73, def: 89, phy: 80 } },
            { pos: "MID", name: "Lucas Paquetá", rating: 84, stats: { pac: 73, sho: 79, pas: 82, dri: 83, def: 72, phy: 79 } },
            { pos: "FWD", name: "Vinícius Júnior", rating: 90, stats: { pac: 95, sho: 84, pas: 81, dri: 91, def: 38, phy: 69 } },
            { pos: "ST", name: "Rodrygo", rating: 86, stats: { pac: 88, sho: 82, pas: 80, dri: 86, def: 43, phy: 60 } }
        ]
    },
    Morocco: {
        flag: "🇲🇦",
        code: "ma",
        fifaRanking: 6,
        worldCups: 0,
        confederationTitles: 1,
        topScorer: "Ahmed Faras (36 goals)", topScorerGoals: 36, topScorerActive: false,
        starPlayer: "Achraf Hakimi",
        coach: "Walid Regragui",
        confederation: "CAF",
        rankingPoints: 1769.98,
        primaryColor: "#047857",
        secondaryColor: "#b91c1c",
        playerCard: { rating: 84, pos: "RB", pac: 92, sho: 75, pas: 80, dri: 83, def: 78, phy: 78 },
        squad: [
            { pos: "GK", name: "Yassine Bounou", rating: 84, stats: { pac: 83, sho: 80, pas: 81, dri: 85, def: 42, phy: 84 } },
            { pos: "DEF", name: "Achraf Hakimi", rating: 84, stats: { pac: 92, sho: 75, pas: 80, dri: 83, def: 78, phy: 78 } },
            { pos: "MID", name: "Sofyan Amrabat", rating: 80, stats: { pac: 66, sho: 63, pas: 75, dri: 76, def: 79, phy: 82 } },
            { pos: "FWD", name: "Hakim Ziyech", rating: 81, stats: { pac: 76, sho: 78, pas: 83, dri: 82, def: 50, phy: 66 } },
            { pos: "ST", name: "Youssef En-Nesyri", rating: 81, stats: { pac: 79, sho: 81, pas: 63, dri: 72, def: 44, phy: 81 } }
        ]
    },
    Netherlands: {
        flag: "🇳🇱",
        code: "nl",
        fifaRanking: 8,
        worldCups: 0,
        confederationTitles: 1,
        topScorer: "Robin van Persie (50 goals)", topScorerGoals: 50, topScorerActive: false,
        starPlayer: "Virgil van Dijk",
        coach: "Ronald Koeman",
        confederation: "UEFA",
        rankingPoints: 1764.40,
        primaryColor: "#ea580c",
        secondaryColor: "#1e3a8a",
        playerCard: { rating: 89, pos: "CB", pac: 78, sho: 60, pas: 71, dri: 72, def: 89, phy: 86 },
        squad: [
            { pos: "GK", name: "Bart Verbruggen", rating: 80, stats: { pac: 80, sho: 79, pas: 81, dri: 81, def: 42, phy: 80 } },
            { pos: "DEF", name: "Virgil van Dijk", rating: 89, stats: { pac: 78, sho: 60, pas: 71, dri: 72, def: 89, phy: 86 } },
            { pos: "MID", name: "Frenkie de Jong", rating: 86, stats: { pac: 82, sho: 69, pas: 85, dri: 87, def: 77, phy: 78 } },
            { pos: "FWD", name: "Cody Gakpo", rating: 84, stats: { pac: 86, sho: 81, pas: 79, dri: 84, def: 42, phy: 73 } },
            { pos: "ST", name: "Memphis Depay", rating: 82, stats: { pac: 80, sho: 82, pas: 79, dri: 84, def: 35, phy: 78 } }
        ]
    },
    Belgium: {
        flag: "🇧🇪",
        code: "be",
        fifaRanking: 10,
        worldCups: 0,
        confederationTitles: 0,
        topScorer: "Romelu Lukaku (90 goals)", topScorerGoals: 90, topScorerActive: true, topScorerWiki: "Romelu_Lukaku",
        starPlayer: "Kevin De Bruyne",
        coach: "Domenico Tedesco",
        confederation: "UEFA",
        rankingPoints: 1727.88,
        primaryColor: "#b91c1c",
        secondaryColor: "#eab308",
        playerCard: { rating: 90, pos: "CM", pac: 67, sho: 87, pas: 93, dri: 87, def: 65, phy: 78 },
        squad: [
            { pos: "GK", name: "Koen Casteels", rating: 81, stats: { pac: 81, sho: 79, pas: 80, dri: 82, def: 48, phy: 81 } },
            { pos: "DEF", name: "Timothy Castagne", rating: 79, stats: { pac: 79, sho: 58, pas: 72, dri: 75, def: 77, phy: 73 } },
            { pos: "MID", name: "Kevin De Bruyne", rating: 90, stats: { pac: 67, sho: 87, pas: 93, dri: 87, def: 65, phy: 78 } },
            { pos: "FWD", name: "Jérémy Doku", rating: 84, stats: { pac: 91, sho: 72, pas: 78, dri: 88, def: 34, phy: 66 } },
            { pos: "ST", name: "Romelu Lukaku", rating: 84, stats: { pac: 80, sho: 84, pas: 68, dri: 77, def: 38, phy: 83 } }
        ]
    },
    Germany: {
        flag: "🇩🇪",
        code: "de",
        fifaRanking: 9,
        worldCups: 4,
        confederationTitles: 3,
        topScorer: "Miroslav Klose (71 goals)", topScorerGoals: 71, topScorerActive: false,
        starPlayer: "Florian Wirtz",
        coach: "Julian Nagelsmann",
        confederation: "UEFA",
        rankingPoints: 1760.46,
        primaryColor: "#171717",
        secondaryColor: "#dc2626",
        playerCard: { rating: 89, pos: "CAM", pac: 82, sho: 80, pas: 88, dri: 90, def: 52, phy: 66 },
        squad: [
            { pos: "GK", name: "Marc-André ter Stegen", rating: 89, stats: { pac: 88, sho: 85, pas: 89, dri: 90, def: 48, phy: 88 } },
            { pos: "DEF", name: "Antonio Rüdiger", rating: 87, stats: { pac: 82, sho: 53, pas: 71, dri: 70, def: 86, phy: 84 } },
            { pos: "MID", name: "Jamal Musiala", rating: 88, stats: { pac: 84, sho: 81, pas: 82, dri: 90, def: 62, phy: 70 } },
            { pos: "FWD", name: "Florian Wirtz", rating: 89, stats: { pac: 82, sho: 80, pas: 88, dri: 90, def: 52, phy: 66 } },
            { pos: "ST", name: "Kai Havertz", rating: 84, stats: { pac: 81, sho: 81, pas: 79, dri: 83, def: 48, phy: 77 } }
        ]
    },
    Croatia: {
        flag: "🇭🇷",
        code: "hr",
        fifaRanking: 13,
        worldCups: 0,
        confederationTitles: 0,
        topScorer: "Davor Šuker (45 goals)", topScorerGoals: 45, topScorerActive: false,
        starPlayer: "Luka Modrić",
        coach: "Zlatko Dalić",
        confederation: "UEFA",
        rankingPoints: 1711.48,
        primaryColor: "#dc2626",
        secondaryColor: "#ffffff",
        playerCard: { rating: 87, pos: "CM", pac: 60, sho: 76, pas: 89, dri: 86, def: 72, phy: 66 },
        squad: [
            { pos: "GK", name: "Dominik Livaković", rating: 82, stats: { pac: 82, sho: 78, pas: 75, dri: 83, def: 40, phy: 81 } },
            { pos: "DEF", name: "Joško Gvardiol", rating: 84, stats: { pac: 80, sho: 58, pas: 74, dri: 80, def: 83, phy: 82 } },
            { pos: "MID", name: "Luka Modrić", rating: 87, stats: { pac: 60, sho: 76, pas: 89, dri: 86, def: 72, phy: 66 } },
            { pos: "FWD", name: "Mateo Kovačić", rating: 83, stats: { pac: 72, sho: 69, pas: 82, dri: 85, def: 75, phy: 78 } },
            { pos: "ST", name: "Andrej Kramarić", rating: 80, stats: { pac: 71, sho: 81, pas: 76, dri: 81, def: 38, phy: 68 } }
        ]
    },
    Italy: {
        flag: "🇮🇹",
        code: "it",
        fifaRanking: 15,
        worldCups: 4,
        confederationTitles: 2,
        topScorer: "Luigi Riva (35 goals)", topScorerGoals: 35, topScorerActive: false,
        starPlayer: "Nicolò Barella",
        coach: "Luciano Spalletti",
        confederation: "UEFA",
        rankingPoints: 1704.73,
        primaryColor: "#1d4ed8",
        secondaryColor: "#15803d",
        playerCard: { rating: 87, pos: "CM", pac: 78, sho: 78, pas: 83, dri: 84, def: 77, phy: 80 },
        squad: [
            { pos: "GK", name: "Gianluigi Donnarumma", rating: 87, stats: { pac: 88, sho: 83, pas: 79, dri: 89, def: 49, phy: 86 } },
            { pos: "DEF", name: "Alessandro Bastoni", rating: 85, stats: { pac: 73, sho: 40, pas: 73, dri: 72, def: 86, phy: 83 } },
            { pos: "MID", name: "Nicolò Barella", rating: 87, stats: { pac: 78, sho: 78, pas: 83, dri: 84, def: 77, phy: 80 } },
            { pos: "FWD", name: "Federico Chiesa", rating: 84, stats: { pac: 87, sho: 81, pas: 75, dri: 85, def: 46, phy: 70 } },
            { pos: "ST", name: "Gianluca Scamacca", rating: 81, stats: { pac: 73, sho: 81, pas: 68, dri: 75, def: 36, phy: 80 } }
        ]
    },
    Colombia: {
        flag: "🇨🇴",
        code: "co",
        fifaRanking: 11,
        worldCups: 0,
        confederationTitles: 1,
        topScorer: "Radamel Falcao (36 goals)", topScorerGoals: 36, topScorerActive: false,
        starPlayer: "Luis Díaz",
        coach: "Néstor Lorenzo",
        confederation: "CONMEBOL",
        rankingPoints: 1727.42,
        primaryColor: "#eab308",
        secondaryColor: "#1d4ed8",
        playerCard: { rating: 85, pos: "LW", pac: 91, sho: 80, pas: 75, dri: 87, def: 34, phy: 73 },
        squad: [
            { pos: "GK", name: "Camilo Vargas", rating: 79, stats: { pac: 78, sho: 77, pas: 75, dri: 80, def: 45, phy: 78 } },
            { pos: "DEF", name: "Daniel Muñoz", rating: 80, stats: { pac: 81, sho: 63, pas: 72, dri: 74, def: 78, phy: 80 } },
            { pos: "MID", name: "James Rodríguez", rating: 83, stats: { pac: 58, sho: 81, pas: 85, dri: 83, def: 48, phy: 66 } },
            { pos: "FWD", name: "Luis Díaz", rating: 85, stats: { pac: 91, sho: 80, pas: 75, dri: 87, def: 34, phy: 73 } },
            { pos: "ST", name: "Jhon Durán", rating: 80, stats: { pac: 83, sho: 79, pas: 65, dri: 76, def: 35, phy: 81 } }
        ]
    },
    Mexico: {
        flag: "🇲🇽",
        code: "mx",
        fifaRanking: 12,
        worldCups: 0,
        confederationTitles: 9,
        topScorer: "Javier Hernández (52 goals)", topScorerGoals: 52, topScorerActive: false,
        starPlayer: "Santiago Giménez",
        coach: "Javier Aguirre",
        confederation: "CONCACAF",
        rankingPoints: 1721.78,
        primaryColor: "#15803d",
        secondaryColor: "#ffffff",
        playerCard: { rating: 80, pos: "ST", pac: 79, sho: 80, pas: 65, dri: 77, def: 35, phy: 78 },
        squad: [
            { pos: "GK", name: "Luis Malagón", rating: 78, stats: { pac: 78, sho: 76, pas: 72, dri: 79, def: 43, phy: 78 } },
            { pos: "DEF", name: "Johan Vásquez", rating: 77, stats: { pac: 71, sho: 40, pas: 62, dri: 63, def: 78, phy: 79 } },
            { pos: "MID", name: "Edson Álvarez", rating: 81, stats: { pac: 68, sho: 65, pas: 73, dri: 72, def: 81, phy: 83 } },
            { pos: "FWD", name: "Hirving Lozano", rating: 80, stats: { pac: 86, sho: 76, pas: 71, dri: 80, def: 41, phy: 66 } },
            { pos: "ST", name: "Santiago Giménez", rating: 80, stats: { pac: 79, sho: 80, pas: 65, dri: 77, def: 35, phy: 78 } }
        ]
    },
    Senegal: {
        flag: "🇸🇳",
        code: "sn",
        fifaRanking: 19,
        worldCups: 0,
        confederationTitles: 1,
        topScorer: "Sadio Mané (43 goals)", topScorerGoals: 43, topScorerActive: false,
        starPlayer: "Nicolas Jackson",
        coach: "Pape Thiaw",
        confederation: "CAF",
        rankingPoints: 1638.36,
        primaryColor: "#15803d",
        secondaryColor: "#dc2626",
        playerCard: { rating: 82, pos: "ST", pac: 86, sho: 80, pas: 74, dri: 82, def: 42, phy: 78 },
        squad: [
            { pos: "GK", name: "Édouard Mendy", rating: 80, stats: { pac: 80, sho: 78, pas: 74, dri: 81, def: 44, phy: 80 } },
            { pos: "DEF", name: "Kalidou Koulibaly", rating: 83, stats: { pac: 72, sho: 48, pas: 60, dri: 66, def: 83, phy: 84 } },
            { pos: "MID", name: "Pape Matar Sarr", rating: 81, stats: { pac: 77, sho: 72, pas: 78, dri: 78, def: 74, phy: 76 } },
            { pos: "FWD", name: "Sadio Mané", rating: 83, stats: { pac: 84, sho: 81, pas: 78, dri: 84, def: 44, phy: 71 } },
            { pos: "ST", name: "Nicolas Jackson", rating: 82, stats: { pac: 86, sho: 80, pas: 74, dri: 82, def: 42, phy: 78 } }
        ]
    },
    Uruguay: {
        flag: "🇺🇾",
        code: "uy",
        fifaRanking: 18,
        worldCups: 2,
        confederationTitles: 15,
        topScorer: "Luis Suárez (68 goals)", topScorerGoals: 68, topScorerActive: false,
        starPlayer: "Federico Valverde",
        coach: "Marcelo Bielsa",
        confederation: "CONMEBOL",
        rankingPoints: 1649.96,
        primaryColor: "#0284c7",
        secondaryColor: "#000000",
        playerCard: { rating: 88, pos: "CM", pac: 87, sho: 80, pas: 84, dri: 84, def: 80, phy: 82 },
        squad: [
            { pos: "GK", name: "Sergio Rochet", rating: 79, stats: { pac: 79, sho: 77, pas: 73, dri: 81, def: 42, phy: 80 } },
            { pos: "DEF", name: "Ronald Araujo", rating: 85, stats: { pac: 82, sho: 51, pas: 65, dri: 67, def: 85, phy: 84 } },
            { pos: "MID", name: "Federico Valverde", rating: 88, stats: { pac: 87, sho: 80, pas: 84, dri: 84, def: 80, phy: 82 } },
            { pos: "FWD", name: "Facundo Pellistri", rating: 78, stats: { pac: 85, sho: 69, pas: 72, dri: 79, def: 40, phy: 60 } },
            { pos: "ST", name: "Darwin Núñez", rating: 82, stats: { pac: 89, sho: 81, pas: 69, dri: 76, def: 42, phy: 82 } }
        ]
    },
    USA: {
        flag: "🇺🇸",
        code: "us",
        fifaRanking: 14,
        worldCups: 0,
        confederationTitles: 7,
        topScorer: "Clint Dempsey (57 goals)", topScorerGoals: 57, topScorerActive: false,
        starPlayer: "Christian Pulisic",
        coach: "Mauricio Pochettino",
        confederation: "CONACAF",
        rankingPoints: 1709.59,
        primaryColor: "#0f172a",
        secondaryColor: "#b91c1c",
        playerCard: { rating: 83, pos: "LW", pac: 87, sho: 78, pas: 75, dri: 84, def: 37, phy: 64 },
        squad: [
            { pos: "GK", name: "Matt Turner", rating: 77, stats: { pac: 78, sho: 75, pas: 72, dri: 79, def: 40, phy: 76 } },
            { pos: "DEF", name: "Antonee Robinson", rating: 79, stats: { pac: 85, sho: 53, pas: 70, dri: 75, def: 76, phy: 75 } },
            { pos: "MID", name: "Weston McKennie", rating: 80, stats: { pac: 72, sho: 74, pas: 75, dri: 77, def: 75, phy: 80 } },
            { pos: "FWD", name: "Christian Pulisic", rating: 83, stats: { pac: 87, sho: 78, pas: 75, dri: 84, def: 37, phy: 64 } },
            { pos: "ST", name: "Folarin Balogun", rating: 79, stats: { pac: 82, sho: 78, pas: 64, dri: 78, def: 31, phy: 70 } }
        ]
    },
    Japan: {
        flag: "🇯🇵",
        code: "jp",
        fifaRanking: 16,
        worldCups: 0,
        confederationTitles: 4,
        topScorer: "Kunishige Kamamoto (75 goals)", topScorerGoals: 75, topScorerActive: false,
        starPlayer: "Kaoru Mitoma",
        coach: "Hajime Moriyasu",
        confederation: "AFC",
        rankingPoints: 1681.26,
        primaryColor: "#1e3a8a",
        secondaryColor: "#ffffff",
        playerCard: { rating: 83, pos: "LM", pac: 87, sho: 72, pas: 77, dri: 87, def: 46, phy: 62 },
        squad: [
            { pos: "GK", name: "Zion Suzuki", rating: 74, stats: { pac: 75, sho: 72, pas: 71, dri: 76, def: 38, phy: 75 } },
            { pos: "DEF", name: "Takehiro Tomiyasu", rating: 81, stats: { pac: 75, sho: 48, pas: 68, dri: 69, def: 82, phy: 78 } },
            { pos: "MID", name: "Wataru Endo", rating: 80, stats: { pac: 65, sho: 63, pas: 74, dri: 73, def: 80, phy: 81 } },
            { pos: "FWD", name: "Kaoru Mitoma", rating: 83, stats: { pac: 87, sho: 72, pas: 77, dri: 87, def: 46, phy: 62 } },
            { pos: "ST", name: "Ayase Ueda", rating: 77, stats: { pac: 77, sho: 76, pas: 62, dri: 72, def: 35, phy: 75 } }
        ]
    },
    Switzerland: {
        flag: "🇨🇭",
        code: "ch",
        fifaRanking: 17,
        worldCups: 0,
        confederationTitles: 0,
        topScorer: "Alexander Frei (42 goals)", topScorerGoals: 42, topScorerActive: false,
        starPlayer: "Manuel Akanji",
        coach: "Murat Yakin",
        confederation: "UEFA",
        rankingPoints: 1654.94,
        primaryColor: "#dc2626",
        secondaryColor: "#ffffff",
        playerCard: { rating: 84, pos: "CB", pac: 75, sho: 45, pas: 70, dri: 74, def: 85, phy: 80 },
        squad: [
            { pos: "GK", name: "Yann Sommer", rating: 84, stats: { pac: 84, sho: 81, pas: 80, dri: 85, def: 46, phy: 82 } },
            { pos: "DEF", name: "Manuel Akanji", rating: 84, stats: { pac: 75, sho: 45, pas: 70, dri: 74, def: 85, phy: 80 } },
            { pos: "MID", name: "Granit Xhaka", rating: 84, stats: { pac: 58, sho: 74, pas: 85, dri: 80, def: 81, phy: 83 } },
            { pos: "FWD", name: "Ruben Vargas", rating: 78, stats: { pac: 83, sho: 72, pas: 71, dri: 80, def: 41, phy: 64 } },
            { pos: "ST", name: "Breel Embolo", rating: 78, stats: { pac: 81, sho: 75, pas: 65, dri: 76, def: 38, phy: 80 } }
        ]
    },
    "South Korea": {
        flag: "🇰🇷",
        code: "kr",
        fifaRanking: 24,
        worldCups: 0,
        confederationTitles: 2,
        topScorer: "Cha Bum-kun (58 goals)", topScorerGoals: 58, topScorerActive: false,
        starPlayer: "Son Heung-min",
        coach: "Hong Myung-bo",
        confederation: "AFC",
        rankingPoints: 1591.75,
        primaryColor: "#dc2626",
        secondaryColor: "#0f172a",
        playerCard: { rating: 87, pos: "LW", pac: 87, sho: 88, pas: 80, dri: 84, def: 42, phy: 70 },
        squad: [
            { pos: "GK", name: "Jo Hyeon-woo", rating: 75, stats: { pac: 75, sho: 73, pas: 70, dri: 77, def: 38, phy: 74 } },
            { pos: "DEF", name: "Kim Min-jae", rating: 84, stats: { pac: 80, sho: 33, pas: 67, dri: 69, def: 85, phy: 84 } },
            { pos: "MID", name: "Lee Kang-in", rating: 82, stats: { pac: 78, sho: 76, pas: 82, dri: 85, def: 44, phy: 63 } },
            { pos: "FWD", name: "Son Heung-min", rating: 87, stats: { pac: 87, sho: 88, pas: 80, dri: 84, def: 42, phy: 70 } },
            { pos: "ST", name: "Hwang Hee-chan", rating: 80, stats: { pac: 83, sho: 80, pas: 72, dri: 81, def: 38, phy: 72 } }
        ]
    }
};

// DOM elements
const teamForm = document.getElementById('team-form');
const comparisonResult = document.getElementById('comparison-result');

const team1Card = document.getElementById('team1-card');
const team1Name = document.getElementById('team1-name');
const team1Flag = document.getElementById('team1-flag');
const team1Confed = document.getElementById('team1-confed');
const team1Stats = document.getElementById('team1-stats');

const team2Card = document.getElementById('team2-card');
const team2Name = document.getElementById('team2-name');
const team2Flag = document.getElementById('team2-flag');
const team2Confed = document.getElementById('team2-confed');
const team2Stats = document.getElementById('team2-stats');

const visualBars = document.getElementById('visual-bars');

// Custom Select / Modal elements
const team1Trigger = document.getElementById('team1-trigger');
const team2Trigger = document.getElementById('team2-trigger');
const team1Input = document.getElementById('team1');
const team2Input = document.getElementById('team2');
const modalOverlay = document.getElementById('team-selector-modal');
const modalClose = document.getElementById('modal-close');
const modalSearch = document.getElementById('modal-search');
const modalFiltersContainer = document.getElementById('modal-filters');
const modalTeamGrid = document.getElementById('modal-team-grid');

// Tab elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const tabSlider = document.querySelector('.tab-slider');
const tabsNav = document.querySelector('.tabs-nav');

// Simulator elements
const runSimBtn = document.getElementById('run-sim-btn');
const simTimelineLog = document.getElementById('sim-timeline-log');
const simScore1 = document.getElementById('sim-score-team1');
const simScore2 = document.getElementById('sim-score-team2');
const simStatusText = document.getElementById('sim-status-text');

// State Variables
let activeSlot = 1; // 1 or 2
let currentFilter = "All";
let currentSearch = "";

// Configuration constants for simulator (upgraded to run 25-35 seconds)
const CONFIG = {
    SIMULATION_DELAY: 2200, // 2.2 seconds per event
    GAME_EVENT_MINUTES: [7, 15, 23, 31, 39, 45, 52, 60, 68, 76, 83, 89], // 12 key minutes
};

// Tactical settings multipliers
const TACTICS_MODIFIERS = {
    balanced: { goalChance: 0.35, cardChance: 0.20, defendMod: 1.0, attackMod: 1.0 },
    attacking: { goalChance: 0.48, cardChance: 0.30, defendMod: 0.85, attackMod: 1.25 },
    defensive: { goalChance: 0.22, cardChance: 0.15, defendMod: 1.25, attackMod: 0.75 }
};

// Possession fields representation indexes
const POSSESSION_ZONES = ["sim-zone-t1-box", "sim-zone-t1-third", "sim-zone-midfield", "sim-zone-t2-third", "sim-zone-t2-box"];

// ----------------------------------------------------
// 1. Web Audio API Sound Synthesizer (Stadium Atmosphere)
// ----------------------------------------------------
const SoundEffects = {
    ctx: null,
    muted: false,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    toggleMute() {
        this.muted = !this.muted;
        const soundOnIcon = document.querySelector('.sound-on-icon');
        const soundOffIcon = document.querySelector('.sound-off-icon');
        if (this.muted) {
            soundOnIcon.classList.add('hidden');
            soundOffIcon.classList.remove('hidden');
            this.stopStadiumAmbient();
        } else {
            soundOnIcon.classList.remove('hidden');
            soundOffIcon.classList.add('hidden');
            if (this.ambientActive) this.startStadiumAmbient();
        }
        return this.muted;
    },

    playWhistle() {
        if (this.muted) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        // Referee whistle uses two high-frequency oscillators beating together
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(2000, now);
        osc1.frequency.linearRampToValueAtTime(2050, now + 0.1);
        osc1.frequency.linearRampToValueAtTime(1950, now + 0.3);
        osc1.frequency.linearRampToValueAtTime(2000, now + 0.5);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(2025, now);
        osc2.frequency.linearRampToValueAtTime(2075, now + 0.1);
        osc2.frequency.linearRampToValueAtTime(1975, now + 0.3);
        osc2.frequency.linearRampToValueAtTime(2025, now + 0.5);

        // Fast vibrato using LFO
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 35;
        lfoGain.gain.value = 25;

        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        lfo.start(now);
        osc1.start(now);
        osc2.start(now);

        lfo.stop(now + 0.6);
        osc1.stop(now + 0.6);
        osc2.stop(now + 0.6);
    },

    playCrowd(isGoal = false) {
        if (this.muted) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const duration = isGoal ? 2.5 : 1.5;

        // Generate noise buffer
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02; // Brown noise approximation
            lastOut = data[i];
            data[i] *= 3.5;
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';

        if (isGoal) {
            filter.frequency.setValueAtTime(250, now);
            filter.frequency.exponentialRampToValueAtTime(900, now + 0.3);
            filter.frequency.linearRampToValueAtTime(600, now + 1.2);
            filter.frequency.exponentialRampToValueAtTime(150, now + duration);
        } else {
            filter.frequency.setValueAtTime(200, now);
            filter.frequency.exponentialRampToValueAtTime(500, now + 0.5);
            filter.frequency.exponentialRampToValueAtTime(150, now + duration);
        }

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0, now);
        if (isGoal) {
            gainNode.gain.linearRampToValueAtTime(0.8, now + 0.2);
            gainNode.gain.linearRampToValueAtTime(0.5, now + 1.0);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        } else {
            gainNode.gain.linearRampToValueAtTime(0.4, now + 0.4);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        }

        noiseNode.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noiseNode.start(now);
        noiseNode.stop(now + duration);
    },

    playChant() {
        if (this.muted) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        // Rhythmic pattern: 5 beats (clap-clap, clap-clap-clap)
        const beats = [0, 0.25, 0.5, 0.85, 1.1];

        beats.forEach((delay, idx) => {
            const time = now + delay;

            // 1. Kick/Drum (Rhythmic body) - High Audibility punch
            const drumOscL = ctx.createOscillator();
            const drumOscH = ctx.createOscillator();
            const drumGain = ctx.createGain();

            drumOscL.type = 'triangle';
            drumOscL.frequency.setValueAtTime(180, time);
            drumOscL.frequency.exponentialRampToValueAtTime(85, time + 0.15);

            drumOscH.type = 'sine';
            drumOscH.frequency.setValueAtTime(320, time);
            drumOscH.frequency.exponentialRampToValueAtTime(140, time + 0.12);

            drumGain.gain.setValueAtTime(0, time);
            drumGain.gain.linearRampToValueAtTime(0.5, time + 0.01);
            drumGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

            drumOscL.connect(drumGain);
            drumOscH.connect(drumGain);
            drumGain.connect(ctx.destination);

            drumOscL.start(time);
            drumOscH.start(time);
            drumOscL.stop(time + 0.2);
            drumOscH.stop(time + 0.2);

            // 2. Crisp Handclap (crisp high-mid noise)
            const bufferSize = ctx.sampleRate * 0.12;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const hpFilter = ctx.createBiquadFilter();
            hpFilter.type = 'highpass';
            hpFilter.frequency.setValueAtTime(800, time);

            const bpFilter = ctx.createBiquadFilter();
            bpFilter.type = 'bandpass';
            bpFilter.frequency.setValueAtTime(1400, time);
            bpFilter.Q.setValueAtTime(2.5, time);

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0, time);
            noiseGain.gain.linearRampToValueAtTime(0.35, time + 0.008);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);

            noise.connect(hpFilter);
            hpFilter.connect(bpFilter);
            bpFilter.connect(noiseGain);
            noiseGain.connect(ctx.destination);

            noise.start(time);
            noise.stop(time + 0.13);

            // 3. Vocal Shout "Hey!" layered on the final beats for realistic chant energy
            if (idx >= 3) {
                const vocalOsc1 = ctx.createOscillator();
                const vocalOsc2 = ctx.createOscillator();
                const vocalGain = ctx.createGain();
                const formantFilter = ctx.createBiquadFilter();

                vocalOsc1.type = 'sawtooth';
                vocalOsc1.frequency.setValueAtTime(160, time);
                vocalOsc1.frequency.linearRampToValueAtTime(140, time + 0.2);

                vocalOsc2.type = 'sawtooth';
                vocalOsc2.frequency.setValueAtTime(240, time);
                vocalOsc2.frequency.linearRampToValueAtTime(200, time + 0.2);

                formantFilter.type = 'bandpass';
                formantFilter.frequency.setValueAtTime(850, time);
                formantFilter.Q.setValueAtTime(3.0, time);

                vocalGain.gain.setValueAtTime(0, time);
                vocalGain.gain.linearRampToValueAtTime(0.2, time + 0.02);
                vocalGain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

                vocalOsc1.connect(formantFilter);
                vocalOsc2.connect(formantFilter);
                formantFilter.connect(vocalGain);
                vocalGain.connect(ctx.destination);

                vocalOsc1.start(time);
                vocalOsc2.start(time);
                vocalOsc1.stop(time + 0.23);
                vocalOsc2.stop(time + 0.23);
            }
        });
        this.swellAmbient(2.0, 1.8);
    },

    playBoo() {
        if (this.muted) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const duration = 1.6;

        // 1. Crowd Booing Vocal Tone (dissonant detuned sawtooth stack)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(260, now);
        osc1.frequency.linearRampToValueAtTime(170, now + duration);

        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(264, now);
        osc2.frequency.linearRampToValueAtTime(173, now + duration);

        osc3.type = 'sawtooth';
        osc3.frequency.setValueAtTime(320, now);
        osc3.frequency.linearRampToValueAtTime(210, now + duration);

        // Formant and lowpass filters for clear vocal character
        const formantFilter = ctx.createBiquadFilter();
        formantFilter.type = 'bandpass';
        formantFilter.frequency.setValueAtTime(550, now);
        formantFilter.Q.setValueAtTime(2.2, now);

        const lpFilter = ctx.createBiquadFilter();
        lpFilter.type = 'lowpass';
        lpFilter.frequency.setValueAtTime(1000, now);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.55, now + 0.25);
        gainNode.gain.linearRampToValueAtTime(0.40, now + 1.0);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc1.connect(formantFilter);
        osc2.connect(formantFilter);
        osc3.connect(formantFilter);
        formantFilter.connect(lpFilter);
        lpFilter.connect(gainNode);
        gainNode.connect(ctx.destination);

        // 2. Crowd Roar component (lifted bandpass to maintain audibility on laptop speakers)
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 1.8;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(600, now);
        noiseFilter.Q.setValueAtTime(1.2, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0, now);
        noiseGain.gain.linearRampToValueAtTime(0.38, now + 0.3);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc3.start(now);
        noise.start(now);

        osc1.stop(now + duration);
        osc2.stop(now + duration);
        osc3.stop(now + duration);
        noise.stop(now + duration);

        this.swellAmbient(1.8, 1.5);
    },

    playHorn() {
        if (this.muted) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const duration = 1.4;

        // 1. Air Horn Tone (Dissonant, high-energy dual sawtooth stack)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Frequencies for a classic high-power dual-tone air horn (F4 & A4 & C#5 chord)
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(349.23, now);

        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(440.00, now);

        osc3.type = 'sawtooth';
        osc3.frequency.setValueAtTime(554.37, now);

        // LFO for acoustic flutter/valve vibration
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 14;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 18;
        lfo.connect(lfoGain);
        lfoGain.connect(osc1.detune);
        lfoGain.connect(osc2.detune);
        lfoGain.connect(osc3.detune);

        // Bandpass to shape the plastic horn shell acoustics
        const hornBodyFilter = ctx.createBiquadFilter();
        hornBodyFilter.type = 'bandpass';
        hornBodyFilter.frequency.setValueAtTime(700, now);
        hornBodyFilter.Q.setValueAtTime(1.8, now);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.45, now + 0.015);
        gainNode.gain.linearRampToValueAtTime(0.38, now + 0.8);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc1.connect(hornBodyFilter);
        osc2.connect(hornBodyFilter);
        osc3.connect(hornBodyFilter);
        hornBodyFilter.connect(gainNode);
        gainNode.connect(ctx.destination);

        // 2. Escaping Gas/Air Pressure Blast (White noise burst)
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const airNoise = ctx.createBufferSource();
        airNoise.buffer = buffer;

        const airFilter = ctx.createBiquadFilter();
        airFilter.type = 'bandpass';
        airFilter.frequency.setValueAtTime(1600, now);
        airFilter.Q.setValueAtTime(2.0, now);

        const airGain = ctx.createGain();
        airGain.gain.setValueAtTime(0, now);
        airGain.gain.linearRampToValueAtTime(0.25, now + 0.01);
        airGain.gain.exponentialRampToValueAtTime(0.04, now + 0.15);
        airGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        airNoise.connect(airFilter);
        airFilter.connect(airGain);
        airGain.connect(ctx.destination);

        lfo.start(now);
        osc1.start(now);
        osc2.start(now);
        osc3.start(now);
        airNoise.start(now);

        lfo.stop(now + duration);
        osc1.stop(now + duration);
        osc2.stop(now + duration);
        osc3.stop(now + duration);
        airNoise.stop(now + duration);

        this.swellAmbient(2.2, 1.4);
    },

    ambientSource: null,
    ambientGain: null,
    ambientActive: false,

    toggleAmbientMode() {
        this.ambientActive = !this.ambientActive;
        const btn = document.getElementById('ambient-toggle');
        const body = document.body;
        const beams = document.querySelector('.ambient-beams-container');

        if (this.ambientActive) {
            btn.classList.add('active');
            body.classList.add('ambient-mode-active');
            if (beams) beams.classList.add('active');
            this.startStadiumAmbient();
        } else {
            btn.classList.remove('active');
            body.classList.remove('ambient-mode-active');
            if (beams) beams.classList.remove('active');
            this.stopStadiumAmbient();
        }
        return this.ambientActive;
    },

    startStadiumAmbient() {
        if (this.muted || !this.ambientActive) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        if (this.ambientSource) {
            try { this.ambientSource.stop(); } catch (e) { }
        }

        const bufferSize = ctx.sampleRate * 4; // 4 seconds loop
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.015 * white)) / 1.015;
            lastOut = data[i];
            data[i] *= 4.0;
        }

        this.ambientSource = ctx.createBufferSource();
        this.ambientSource.buffer = buffer;
        this.ambientSource.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, now);

        this.ambientGain = ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0, now);
        this.ambientGain.gain.linearRampToValueAtTime(0.12, now + 1.5);

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.15;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.03;

        lfo.connect(lfoGain);
        lfoGain.connect(this.ambientGain.gain);

        this.ambientSource.connect(filter);
        filter.connect(this.ambientGain);
        this.ambientGain.connect(ctx.destination);

        lfo.start(now);
        this.ambientSource.start(now);
    },

    stopStadiumAmbient() {
        if (this.ambientGain) {
            const ctx = this.ctx;
            const now = ctx.currentTime;
            this.ambientGain.gain.cancelScheduledValues(now);
            this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
            this.ambientGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
            const sourceToStop = this.ambientSource;
            setTimeout(() => {
                try { sourceToStop.stop(); } catch (e) { }
            }, 1100);
            this.ambientSource = null;
            this.ambientGain = null;
        }
    },

    swellAmbient(factor, duration) {
        if (!this.ambientActive || !this.ambientGain) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;

        this.ambientGain.gain.cancelScheduledValues(now);
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
        this.ambientGain.gain.linearRampToValueAtTime(0.12 * factor, now + 0.3);
        this.ambientGain.gain.linearRampToValueAtTime(0.12, now + duration);
    }
};

// Mute button listener
document.getElementById('sound-toggle').addEventListener('click', () => {
    SoundEffects.toggleMute();
});

// ----------------------------------------------------
// 2. Light/Dark Theme Switcher (Staging persistence)
// ----------------------------------------------------
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
        document.body.classList.add('dark-theme');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        document.body.classList.remove('dark-theme');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
    toggleThemeLayouts(isDark);
};

document.getElementById('theme-toggle').addEventListener('click', () => {
    const body = document.body;
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    if (isDark) {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
    toggleThemeLayouts(isDark);
});

// Helper to generate Flag image HTML
const getFlagHTML = (teamOrKey, className = "") => {
    let team = typeof teamOrKey === 'string' ? teamData[teamOrKey] : teamOrKey;
    if (!team || !team.code) {
        return `<span class="flag-placeholder">❓</span>`;
    }
    const name = typeof teamOrKey === 'string' ? teamOrKey : "";
    return `<img src="https://flagcdn.com/${team.code}.svg" class="flag-icon-img ${className}" alt="${name} Flag" />`;
};

// ----------------------------------------------------
// 3. Interactive Modal Selection Logic
// ----------------------------------------------------
const openModal = (slot) => {
    activeSlot = slot;
    currentFilter = "All";
    currentSearch = "";
    modalSearch.value = "";

    const filterButtons = modalFiltersContainer.querySelectorAll('.filter-tab');
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === "All") btn.classList.add('active');
        else btn.classList.remove('active');
    });

    modalOverlay.classList.add('open');
    populateModalGrid();
    modalSearch.focus();
};

const closeModal = () => {
    modalOverlay.classList.remove('open');
};

const populateModalGrid = () => {
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

            const oppositeVal = (activeSlot === 1) ? team2Input.value : team1Input.value;
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

const selectTeam = (key) => {
    const triggerFlag = document.getElementById(`team${activeSlot}-trigger-flag`);
    const triggerName = document.getElementById(`team${activeSlot}-trigger-name`);
    const hiddenInput = document.getElementById(`team${activeSlot}`);

    hiddenInput.value = key;
    triggerFlag.innerHTML = getFlagHTML(key, "trigger-flag-img");
    triggerName.textContent = key;

    closeModal();

    if (team1Input.value && team2Input.value) {
        teamForm.dispatchEvent(new Event('submit'));
    }
};

team1Trigger.addEventListener('click', () => openModal(1));
team2Trigger.addEventListener('click', () => openModal(2));
modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

modalSearch.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    populateModalGrid();
});

modalFiltersContainer.addEventListener('click', (e) => {
    const tab = e.target.closest('.filter-tab');
    if (!tab) return;

    modalFiltersContainer.querySelectorAll('.filter-tab').forEach(btn => btn.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    populateModalGrid();
});

// ----------------------------------------------------
// 4. Sliding Tabs System
// ----------------------------------------------------
const initTabSlider = () => {
    const activeTabBtn = tabsNav.querySelector('.tab-btn.active');
    if (!activeTabBtn || !tabSlider) return;
    const btnRect = activeTabBtn.getBoundingClientRect();
    const navRect = tabsNav.getBoundingClientRect();
    tabSlider.style.width = `${btnRect.width}px`;
    tabSlider.style.height = `${btnRect.height}px`;
    tabSlider.style.left = `${btnRect.left - navRect.left}px`;
    tabSlider.style.top = `${btnRect.top - navRect.top}px`;
};

window.addEventListener('resize', initTabSlider);

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(`panel-${btn.dataset.tab}`);
        if (targetPanel) targetPanel.classList.add('active');

        // Refresh dynamic components coordinates on tab activation
        if (btn.dataset.tab === 'tactics') {
            const t1 = team1Input.value;
            const t2 = team2Input.value;
            if (t1 && t2) drawTacticsPitch(t1, t2);
        }

        const btnRect = btn.getBoundingClientRect();
        const navRect = tabsNav.getBoundingClientRect();
        tabSlider.style.width = `${btnRect.width}px`;
        tabSlider.style.height = `${btnRect.height}px`;
        tabSlider.style.left = `${btnRect.left - navRect.left}px`;
        tabSlider.style.top = `${btnRect.top - navRect.top}px`;
    });
});

// ----------------------------------------------------
// 5. Stats Count-Up Animation
// ----------------------------------------------------
const animateCount = (element, start, end, duration, formatFn = val => val) => {
    if (!element) return;
    let startTime = null;

    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentVal = Math.floor(progress * (end - start) + start);
        element.textContent = formatFn(currentVal);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = formatFn(end);
        }
    };

    window.requestAnimationFrame(step);
};

// Radar Chart removed

// ----------------------------------------------------
// 7. Interactive Tactics Football Pitch Visualizer
// ----------------------------------------------------
const getRealWorldFormation = (teamKey) => {
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

    "Kevin De Bruyne": "One of football's greatest playmakers. Led Belgium's Golden Generation to 3rd place in World Cup 2018.",
    "Romelu Lukaku": "Belgium's all-time top scorer (85+ goals) and Euro/World Cup qualifying record goalscorer.",
    "Jérémy Doku": "Blistering dribbling specialist. Terrorized defenses at Euro 2020 and Euro 2024 with elite take-on stats.",
    "Timothy Castagne": "Versatile fullback who started every game for Belgium in World Cup 2022 and Euro 2024.",
    "Koen Casteels": "Stepped up as Belgium's starting goalkeeper at Euro 2024 with multiple crucial clean sheets.",

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
    "Jo Hyeon-woo": "Hero of the 'Miracle of Kazan' in World Cup 2018. Saved consecutive penalties in Asian Cup shootouts."
};

let activeTacticsTeamKey = null;

const drawTacticsPitch = (team1Key, team2Key) => {
    activeTacticsTeamKey = team1Key;
    drawTacticsFlagsSelector(team1Key, team2Key);
    switchTacticsTeam(team1Key, team2Key, team1Key);
};

const drawTacticsFlagsSelector = (t1Key, t2Key) => {
    const t1 = teamData[t1Key];
    const t2 = teamData[t2Key];
    const container = document.getElementById("tactics-team-flags");
    if (!container || !t1 || !t2) return;

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

    // Bind click events
    document.getElementById("tactics-btn-t1").addEventListener("click", () => {
        switchTacticsTeam(t1Key, t2Key, t1Key);
    });
    document.getElementById("tactics-btn-t2").addEventListener("click", () => {
        switchTacticsTeam(t1Key, t2Key, t2Key);
    });
};

const switchTacticsTeam = (t1Key, t2Key, selectedKey) => {
    activeTacticsTeamKey = selectedKey;

    // Update active class on buttons
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
    document.getElementById("tactics-active-team-title").textContent = isDarkTheme ? "Lineup Setup" : `${selectedKey} Lineup`;

    const formation = getRealWorldFormation(selectedKey);
    document.getElementById("tactics-active-team-sub").textContent = `Formation: ${formation} | Coach: ${activeTeam.coach}`;

    renderTacticsPlayerNodes(activeTeam, formation);
};

const renderTacticsPlayerNodes = (team, formation) => {
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

        node.innerHTML = `
            <div class="jersey-wrapper">
                <svg class="player-jersey-svg" viewBox="0 0 24 24">
                    <path class="jersey-body" d="M6 2h12l3 4-2.5 2.5L16 7v15H8V7l-2.5 1.5L3 6z" fill="${team.primaryColor}" stroke="${team.secondaryColor || '#ffffff'}" stroke-width="1.8"/>
                    <path class="jersey-trim" d="M9 2a3 3 0 0 0 6 0" fill="none" stroke="${team.secondaryColor || '#ffffff'}" stroke-width="1.2"/>
                    <text class="jersey-number" x="12" y="15" fill="${team.secondaryColor || '#ffffff'}" font-size="7" font-weight="900" text-anchor="middle">${player.rating}</text>
                </svg>
            </div>
            <div class="player-node-label-container">
                <span class="player-node-pos-pill">${player.pos}</span>
                <span class="player-node-label">${player.name}</span>
            </div>
        `;

        const triggerInteraction = () => {
            document.querySelectorAll('.player-node').forEach(n => n.classList.remove('active'));
            node.classList.add('active');

            const target = document.getElementById("tactics-player-card-target");
            const labelInst = document.querySelector(".details-instructions-text");
            if (labelInst) labelInst.classList.add("hidden");

            renderDetailedFUTCard(target, team, player);
        };

        node.addEventListener('mouseenter', triggerInteraction);
        node.addEventListener('click', triggerInteraction);
        pitchNodesContainer.appendChild(node);
    });

    // Auto click striker node to populate details initially
    setTimeout(() => {
        const nodes = pitchNodesContainer.querySelectorAll('.player-node');
        if (nodes.length > 0) {
            const stNode = Array.from(nodes).find(n => n.querySelector('.player-node-pos-pill').textContent === 'ST') || nodes[0];
            stNode.dispatchEvent(new Event('click'));
        }
    }, 100);
};

const renderDetailedFUTCard = (container, team, player) => {
    const isGK = player.pos === "GK";

    const l1 = isGK ? "DIV" : "PAC";
    const l2 = isGK ? "HAN" : "SHO";
    const l3 = isGK ? "KIC" : "PAS";
    const l4 = isGK ? "REF" : "DRI";
    const l5 = isGK ? "SPD" : "DEF";
    const l6 = isGK ? "POS" : "PHY";

    const ratingClass = player.rating >= 85 ? 'gold-tier' : '';
    const highlightText = playerHighlights[player.name] || `${player.name} is a key international performer for ${team.flag} ${player.pos === "GK" ? "safeguarding the goal" : "orchestrating the plays"}.`;

    container.innerHTML = `
        <div class="fut-card ${ratingClass}" style="margin: 0 auto; animation: slideUpFade 0.4s ease forwards;">
            <div class="fut-card-glow"></div>
            <div class="fut-header">
                <div class="fut-rating-box">
                    <span class="fut-rating">${player.rating}</span>
                    <span class="fut-position">${player.pos}</span>
                </div>
                <div class="fut-meta">
                    <span class="fut-flag">${getFlagHTML(team.name || (team.flag ? team : playerHighlights[player.name] ? team.name : team), "fut-flag-img")}</span>
                    <span class="fut-confed">${team.confederation || "FIFA"}</span>
                </div>
            </div>
            <div class="fut-name-box">
                <span class="fut-name">${player.name}</span>
                <span class="fut-star-label">International Class</span>
            </div>
            <div class="fut-stats-grid">
                <div class="fut-stat">
                    <span class="fut-stat-lbl">${l1}</span>
                    <span class="fut-stat-val">${player.stats.pac}</span>
                </div>
                <div class="fut-stat">
                    <span class="fut-stat-lbl">${l4}</span>
                    <span class="fut-stat-val">${player.stats.dri}</span>
                </div>
                <div class="fut-stat">
                    <span class="fut-stat-lbl">${l2}</span>
                    <span class="fut-stat-val">${player.stats.sho}</span>
                </div>
                <div class="fut-stat">
                    <span class="fut-stat-lbl">${l5}</span>
                    <span class="fut-stat-val">${player.stats.def}</span>
                </div>
                <div class="fut-stat">
                    <span class="fut-stat-lbl">${l3}</span>
                    <span class="fut-stat-val">${player.stats.pas}</span>
                </div>
                <div class="fut-stat">
                    <span class="fut-stat-lbl">${l6}</span>
                    <span class="fut-stat-val">${player.stats.phy}</span>
                </div>
            </div>
            <div class="fut-perf-highlight">
                <span class="fut-perf-title">World Cup / Int'l Record</span>
                ${highlightText}
            </div>
        </div>
    `;

    const card = container.querySelector('.fut-card');

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

// ----------------------------------------------------
// 8. Trophy Showcase Renderer
// ----------------------------------------------------
const drawTrophyCabinet = (teamKey, cabinetContainerId, shelvesId) => {
    const t = teamData[teamKey];
    if (!t) return;

    const shelves = document.getElementById(shelvesId);
    shelves.innerHTML = "";

    const container = document.getElementById(cabinetContainerId);
    container.style.setProperty('--cabinet-color', t.primaryColor);

    // Dynamic Lookups for Championship Years
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
        }
    };

    const teamYears = trophyYears[teamKey] || { worldCup: [], confederation: [] };

    // SVGs for Real Trophies
    const realWcTrophySvg = `<svg class="trophy-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 21h10v1H7z" fill="#15803d"/> 
        <path d="M6 19h12v2H6z" fill="#f59e0b"/> 
        <path d="M7 17h10v2H7z" fill="#15803d"/> 
        <path d="M8 17c1-3 1-5 2-8h4c1 3 1 5 2 8H8z" fill="#f59e0b"/>
        <path d="M9 13c1 0 1.5-1 1.5-2.5S10 8 10 8h4s-.5 1.5-.5 2.5S14 13 15 13" fill="none" stroke="#d97706" stroke-width="1"/>
        <circle cx="12" cy="5.5" r="3.5" fill="#f59e0b"/>
        <path d="M9 5.5c1 1.5 2 1.5 3 0s2-1.5 3 0" stroke="#d97706" stroke-width="0.8" fill="none"/>
    </svg>`;

    // Henri Delaunay Cup (UEFA Euros)
    const uefaEuroSvg = `<svg class="trophy-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 20h8v2H8z" fill="#1e293b"/>
        <path d="M9 18h6v2H9z" fill="#cbd5e1"/>
        <path d="M8.5 7h7c1 0 2 1.5 2 4.5S15.5 18 12 18s-5.5-2-5.5-6.5S7.5 7 8.5 7z" fill="#cbd5e1"/>
        <path d="M9.5 5h5v2h-5z" fill="#94a3b8"/>
        <ellipse cx="12" cy="5" rx="2.5" ry="0.8" fill="#e2e8f0"/>
        <path d="M6.5 9c-1 0-1.5 1-1.5 2.5s.5 2.5 1.5 2.5" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M17.5 9c1 0 1.5 1 1.5 2.5s-.5 2.5-1.5 2.5" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`;

    // Copa América Trophy (CONMEBOL)
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

    // CONCACAF Gold Cup Trophy
    const goldCupSvg = `<svg class="trophy-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 19h6v3H9z" fill="#1e293b"/>
        <path d="M8 17h8v2H8z" fill="#fbbf24"/>
        <path d="M6 7.5C6 7.5 6 16 12 17C18 16 18 7.5 18 7.5H6Z" fill="#fbbf24"/>
        <path d="M5 6h14v1.5H5z" fill="#f59e0b"/>
        <path d="M6 8.5H4v4c0 1.5 1 2.5 2 2.5" fill="none" stroke="#f59e0b" stroke-width="1.8"/>
        <path d="M18 8.5h2v4c0 1.5-1 2.5-2 2.5" fill="none" stroke="#f59e0b" stroke-width="1.8"/>
    </svg>`;

    // Africa Cup of Nations Trophy (AFCON)
    const afconSvg = `<svg class="trophy-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 19h6v3H9z" fill="#78350f"/>
        <path d="M8 17h8v2H8z" fill="#fbbf24"/>
        <path d="M9.5 9h5c.5 3 .5 6-2.5 8-3-2-3-5-2.5-8z" fill="#fbbf24"/>
        <circle cx="12" cy="7" r="2.5" fill="#f59e0b"/>
        <path d="M9.5 8.5C9.5 8.5 10 6 12 6C14 6 14.5 8.5 14.5 8.5H9.5Z" fill="#d97706"/>
    </svg>`;

    // Asian Cup Trophy
    const asianCupSvg = `<svg class="trophy-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 20h6v2H9z" fill="#334155"/>
        <path d="M8 18h8v2H8z" fill="#cbd5e1"/>
        <path d="M11.5 13h1v5h-1z" fill="#cbd5e1"/>
        <path d="M5.5 6.5C5.5 6.5 5 13 12 13.5C19 13 18.5 6.5 18.5 6.5H5.5Z" fill="#e2e8f0"/>
        <path d="M12 7.5L10 11h4l-2-3.5Z" fill="#cbd5e1"/>
        <path d="M5 5.5h14v1H5z" fill="#94a3b8"/>
    </svg>`;

    // FIFA Rank Badge Shield
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

    const confedCount = t.confederationTitles;
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

    // --- Wire up click → lightbox ---
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
        }));
    }
};

// =====================================================
// Trophy Lightbox System
// =====================================================

let trophyLbParticleAnimId = null;

const openTrophyLightbox = ({ teamKey, trophySvg, title, count, years, glowColor, primaryColor }) => {
    const overlay       = document.getElementById('trophy-lightbox');
    const card          = document.getElementById('trophy-lightbox-card');
    const flagEl        = document.getElementById('trophy-lb-flag');
    const heroEl        = document.getElementById('trophy-lb-hero');
    const heroGlowEl    = document.getElementById('trophy-lb-hero-glow');
    const svgWrap       = document.getElementById('trophy-lb-svg-wrap');
    const titleEl       = document.getElementById('trophy-lb-title');
    const countEl       = document.getElementById('trophy-lb-count-num');
    const labelEl       = document.getElementById('trophy-lb-count-label');
    const yearsGrid     = document.getElementById('trophy-lb-years-grid');
    const emptyEl       = document.getElementById('trophy-lb-empty');
    const timelineEl    = document.getElementById('trophy-lb-timeline-section');

    // Theme the whole card with team colour
    card.style.setProperty('--lb-primary', primaryColor);

    // Real flag image — no country text (flag emojis don't render on Windows)
    const t = teamData[teamKey];
    flagEl.innerHTML = `<img
        src="https://flagcdn.com/w160/${t.code}.png"
        srcset="https://flagcdn.com/w320/${t.code}.png 2x"
        alt="${teamKey} flag"
        class="trophy-lb-flag-img"
    />`;

    // Competition name badge
    titleEl.textContent = title;

    // Trophy SVG
    svgWrap.innerHTML = trophySvg;
    const svgEl = svgWrap.querySelector('svg');
    if (svgEl) svgEl.classList.add('trophy-svg');

    // Count-up animation
    countEl.textContent = '0';
    countEl.style.color = '';      // let CSS handle via --lb-primary
    countEl.style.textShadow = '';
    let current = 0;
    const speed = Math.max(55, 320 / Math.max(count, 1));
    const interval = setInterval(() => {
        current++;
        countEl.textContent = current;
        countEl.style.animation = 'none';
        void countEl.offsetWidth;
        countEl.style.animation = 'trophy-lb-count-tick 0.25s ease';
        if (current >= count) clearInterval(interval);
    }, speed);

    labelEl.textContent = count === 1 ? 'Title' : 'Titles';

    // Year chips
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

    // Particle shimmer
    startTrophyLbParticles(primaryColor, glowColor);

    // Open
    card.classList.remove('closing');
    overlay.classList.remove('closing');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const closeTrophyLightbox = () => {
    const overlay = document.getElementById('trophy-lightbox');
    const card    = document.getElementById('trophy-lightbox-card');

    card.classList.add('closing');
    overlay.classList.add('closing');
    overlay.classList.remove('active');

    // Stop particles after animation
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
    const ctx2   = canvas.getContext('2d');

    const resize = () => {
        const card = document.getElementById('trophy-lightbox-card');
        canvas.width  = card.offsetWidth;
        canvas.height = card.offsetHeight;
    };
    resize();

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

// Lightbox close bindings (close button + overlay backdrop click + Escape key)
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('trophy-lb-close')?.addEventListener('click', closeTrophyLightbox);
    document.getElementById('trophy-lightbox')?.addEventListener('click', (e) => {
        if (e.target === document.getElementById('trophy-lightbox')) closeTrophyLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('trophy-lightbox')?.classList.contains('active')) {
            closeTrophyLightbox();
        }
    });
});

// H2H History removed


// ----------------------------------------------------
// 10. Canvas Confetti System
// ----------------------------------------------------
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let confettiAnimationId = null;

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiParticle {
    constructor(colors) {
        this.x = canvas.width / 2;
        this.y = canvas.height * 0.45;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.radius = Math.random() * 5 + 4;

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 8 + 6;

        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity - 3;
        this.gravity = 0.25;
        this.opacity = 1;
        this.fade = Math.random() * 0.015 + 0.01;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.opacity -= this.fade;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(this.opacity, 0);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

const animateConfetti = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, idx) => {
        p.update();
        p.draw();
        if (p.opacity <= 0 || p.y > canvas.height) {
            particles.splice(idx, 1);
        }
    });

    if (particles.length > 0) {
        confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
        cancelAnimationFrame(confettiAnimationId);
    }
};

const triggerConfetti = (primaryColor1, secondaryColor1, primaryColor2, secondaryColor2) => {
    const colors = [
        primaryColor1, secondaryColor1,
        primaryColor2, secondaryColor2,
        "#ffffff", "#facc15"
    ].filter(Boolean);

    particles = [];
    cancelAnimationFrame(confettiAnimationId);

    for (let i = 0; i < 150; i++) {
        particles.push(new ConfettiParticle(colors));
    }

    animateConfetti();
};

// ----------------------------------------------------
// 11. Tactical Match Simulator Logic & Visual Tracker
// ----------------------------------------------------
let simInterval = null;

const runMatchSimulation = (team1Key, team2Key) => {
    clearInterval(simInterval);
    const t1 = teamData[team1Key];
    const t2 = teamData[team2Key];

    // Audio trigger: ref start whistle
    SoundEffects.playWhistle();

    // Get selected tactics
    const tactic1 = document.getElementById("sim-tactic-team1").value;
    const tactic2 = document.getElementById("sim-tactic-team2").value;

    const mod1 = TACTICS_MODIFIERS[tactic1];
    const mod2 = TACTICS_MODIFIERS[tactic2];

    // Reset simulator scoreboard UI
    simScore1.textContent = "0";
    simScore2.textContent = "0";
    simTimelineLog.innerHTML = "";
    simStatusText.textContent = "Match in progress...";
    runSimBtn.disabled = true;

    // Reset simulator visual tracking fields
    const ballNode = document.getElementById("sim-ball-node");
    const possessionT1 = document.getElementById("possession-t1-pct");
    const possessionT2 = document.getElementById("possession-t2-pct");

    ballNode.style.left = "50%"; // Center circle
    ballNode.style.top = "50%";

    document.querySelectorAll(".sim-pitch-zone").forEach(z => z.classList.remove("active-zone"));
    document.getElementById("sim-zone-midfield").classList.add("active-zone");

    // Power chance multipliers factoring in ranking stats and tactics
    const power1 = (t1.rankingPoints + (50 - t1.fifaRanking) * 8) * mod1.attackMod;
    const power2 = (t2.rankingPoints + (50 - t2.fifaRanking) * 8) * mod2.attackMod;
    const totalPower = (power1 * mod2.defendMod) + (power2 * mod1.defendMod);

    const t1AttackOdds = (power1 * mod2.defendMod) / totalPower;

    // Average goals calculation
    const goalProb = (mod1.goalChance + mod2.goalChance) / 2;

    let score1 = 0;
    let score2 = 0;
    let possessionShare1 = 50 + (tactic1 === 'attacking' ? 5 : tactic1 === 'defensive' ? -8 : 0) + (tactic2 === 'attacking' ? -5 : tactic2 === 'defensive' ? 8 : 0);
    possessionShare1 = Math.max(30, Math.min(70, possessionShare1));

    possessionT1.style.width = `${possessionShare1}%`;
    possessionT1.textContent = `${possessionShare1}%`;
    possessionT2.style.width = `${100 - possessionShare1}%`;
    possessionT2.textContent = `${100 - possessionShare1}%`;

    const eventsList = [{
        min: 0,
        icon: "⚽",
        zoneIdx: 2, // Midfield
        desc: `Match kicks off between <strong>${team1Key}</strong> (${tactic1.toUpperCase()}) and <strong>${team2Key}</strong> (${tactic2.toUpperCase()})!`
    }];

    // Event minutes logs
    const gameMinutes = CONFIG.GAME_EVENT_MINUTES;
    gameMinutes.forEach(min => {
        const rand = Math.random();

        if (rand < goalProb * 0.45) {
            // Scoring opportunity
            const scorerRand = Math.random();
            if (scorerRand < t1AttackOdds) {
                // Team 1 scores or threatens
                const isGoal = Math.random() > 0.40;
                if (isGoal) {
                    score1++;
                    eventsList.push({
                        min: min,
                        icon: "⚽",
                        zoneIdx: 4, // T2 Penalty Area
                        desc: `<strong>GOAL!</strong> ${t1.starPlayer} scores a magnificent strike for <strong>${team1Key}</strong>!`,
                        currentScore: [score1, score2]
                    });
                } else {
                    eventsList.push({
                        min: min,
                        icon: "🧤",
                        zoneIdx: 3, // T2 Def third
                        desc: `Close! ${t1.starPlayer} fires a volley, but the goalkeeper of <strong>${team2Key}</strong> makes a brilliant parry.`
                    });
                }
            } else {
                // Team 2 scores or threatens
                const isGoal = Math.random() > 0.40;
                if (isGoal) {
                    score2++;
                    eventsList.push({
                        min: min,
                        icon: "⚽",
                        zoneIdx: 0, // T1 Penalty Area
                        desc: `<strong>GOAL!</strong> ${t2.starPlayer} slots it home for <strong>${team2Key}</strong>!`,
                        currentScore: [score1, score2]
                    });
                } else {
                    eventsList.push({
                        min: min,
                        icon: "🧤",
                        zoneIdx: 1, // T1 Def third
                        desc: `Missed Chance! ${t2.starPlayer} breaks clear, but pushes his shot wide of the post.`
                    });
                }
            }
        } else if (rand < (goalProb * 0.45 + 0.20)) {
            // General fouls, yellows, offsides
            const teamName = Math.random() < t1AttackOdds ? team1Key : team2Key;
            const isYellow = Math.random() < 0.4;
            eventsList.push({
                min: min,
                icon: isYellow ? "🟨" : "🚩",
                zoneIdx: 2, // Midfield
                desc: isYellow
                    ? `Yellow Card shown to defensive midfielder of <strong>${teamName}</strong> for a tactical foul.`
                    : `Offside flag raised against the forward line of <strong>${teamName}</strong>.`
            });
        } else {
            // Possession build-up (No goals/fouls, just ball movement and play)
            const teamName = Math.random() < t1AttackOdds ? team1Key : team2Key;
            const activeTeam = teamData[teamName];
            const zone = Math.random() < 0.5 ? 2 : (teamName === team1Key ? 3 : 1);
            const actions = [
                `<strong>${teamName}</strong> controls possession, orchestrating play through ${activeTeam.starPlayer}.`,
                `Slick passing sequence from <strong>${teamName}</strong> progresses the ball up the field.`,
                `Intense midfield press as <strong>${teamName}</strong> recovers the ball and starts an attack.`,
                `Defenders of <strong>${teamName}</strong> recycle possession, looking for gaps in the opposition shape.`,
                `${activeTeam.starPlayer} attempts a tricky link-up pass in the final third for <strong>${teamName}</strong>.`
            ];
            eventsList.push({
                min: min,
                icon: "🏃‍♂️",
                zoneIdx: zone,
                desc: actions[Math.floor(Math.random() * actions.length)]
            });
        }
    });

    eventsList.push({
        min: 90,
        icon: "🏁",
        zoneIdx: 2,
        desc: `Full time! The referee blows the final whistle.`
    });

    // Playback events
    let eventIdx = 0;

    simInterval = setInterval(() => {
        if (eventIdx < eventsList.length) {
            const ev = eventsList[eventIdx];

            // Add timeline text
            const evDiv = document.createElement('div');
            evDiv.className = "timeline-event";
            evDiv.innerHTML = `
                <span class="event-time">${ev.min}'</span>
                <span class="event-icon">${ev.icon}</span>
                <span class="event-details">${ev.desc}</span>
            `;
            simTimelineLog.appendChild(evDiv);
            simTimelineLog.scrollTop = simTimelineLog.scrollHeight;

            // Update score
            if (ev.currentScore) {
                simScore1.textContent = ev.currentScore[0];
                simScore2.textContent = ev.currentScore[1];
                // Sound goal triggers
                SoundEffects.playWhistle();
                SoundEffects.playCrowd(true);
            } else if (ev.icon === "🧤" || ev.icon === "🟨" || ev.icon === "🚩") {
                // Slower swell on close calls
                SoundEffects.playCrowd(false);
            } else if (ev.icon === "🏃‍♂️") {
                // Randomly trigger fan horn or chant
                if (Math.random() < 0.35) {
                    SoundEffects.playChant();
                } else if (Math.random() < 0.20) {
                    SoundEffects.playHorn();
                }
            }

            // Animate possession ball position coordinates (using percentages)
            const coordinates = ["10%", "30%", "50%", "70%", "90%"];
            const targetLeft = coordinates[ev.zoneIdx];
            ballNode.style.left = targetLeft;
            // Add vertical bounce
            ballNode.style.top = `${40 + Math.random() * 20}%`;

            // Active zone highlight class switcher
            document.querySelectorAll(".sim-pitch-zone").forEach(z => z.classList.remove("active-zone"));
            const activeZoneId = POSSESSION_ZONES[ev.zoneIdx];
            const activeZoneNode = document.getElementById(activeZoneId);
            if (activeZoneNode) activeZoneNode.classList.add("active-zone");

            eventIdx++;
        } else {
            clearInterval(simInterval);
            runSimBtn.disabled = false;
            simStatusText.textContent = "Full Time";
            SoundEffects.playWhistle();

            const finalScore1 = parseInt(simScore1.textContent);
            const finalScore2 = parseInt(simScore2.textContent);

            if (finalScore1 > finalScore2) {
                triggerConfetti(t1.primaryColor, t1.secondaryColor, "#ffffff", "#000000");
                simStatusText.textContent = `${team1Key} Wins!`;
            } else if (finalScore2 > finalScore1) {
                triggerConfetti(t2.primaryColor, t2.secondaryColor, "#ffffff", "#000000");
                simStatusText.textContent = `${team2Key} Wins!`;
            } else {
                triggerConfetti(t1.primaryColor, t2.primaryColor, "#ffffff", "#facc15");
                simStatusText.textContent = "Draw Match!";
            }
        }
    }, CONFIG.SIMULATION_DELAY);
};

// ----------------------------------------------------
// 12. Core Compare Form Submission Handler
// ----------------------------------------------------
teamForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const team1Key = team1Input.value;
    const team2Key = team2Input.value;

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

    // Initialize labels for tactics simulator
    document.getElementById("label-tactic-team1").textContent = `${team1Key} Tactic`;
    document.getElementById("label-tactic-team2").textContent = `${team2Key} Tactic`;

    // Reset Simulator score displays
    document.getElementById('sim-team1-flag').innerHTML = getFlagHTML(team1Key, "simulator-flag-img");
    document.getElementById('sim-team1-name').textContent = team1Key;
    document.getElementById('sim-team2-flag').innerHTML = getFlagHTML(team2Key, "simulator-flag-img");
    document.getElementById('sim-team2-name').textContent = team2Key;
    simScore1.textContent = "0";
    simScore2.textContent = "0";
    simStatusText.textContent = "Ready for simulation";
    simTimelineLog.innerHTML = `<div class="timeline-placeholder">Click 'Kick Off Simulation' to start the match!</div>`;
    clearInterval(simInterval);

    // Apply glowing colored theme boundaries on comparison container
    const container = document.querySelector('.container');
    container.style.setProperty('--team1-theme', t1.primaryColor);
    container.style.setProperty('--team2-theme', t2.primaryColor);

    // 1. Overview Tab Populating
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

    team1Card.classList.remove('better-team');
    team2Card.classList.remove('better-team');

    if (t1Score > t2Score) {
        team1Card.classList.add('better-team');
    } else if (t2Score > t1Score) {
        team2Card.classList.add('better-team');
    }

    // Populate team stats overview cards
    team1Name.textContent = team1Key;
    team1Flag.innerHTML = getFlagHTML(team1Key, "dashboard-flag-img");
    team1Confed.textContent = t1.confederation;
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

    team2Name.textContent = team2Key;
    team2Flag.innerHTML = getFlagHTML(team2Key, "dashboard-flag-img");
    team2Confed.textContent = t2.confederation;
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

    // Counts anim
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

    // 3. Draw Tactics Field nodes
    drawTacticsPitch(team1Key, team2Key);

    // 4. Draw Trophy Cabinets
    document.getElementById("cabinet-t1-flag").innerHTML = getFlagHTML(team1Key, "trophy-flag-img");
    document.getElementById("cabinet-t1-name").textContent = team1Key;
    document.getElementById("cabinet-t2-flag").innerHTML = getFlagHTML(team2Key, "trophy-flag-img");
    document.getElementById("cabinet-t2-name").textContent = team2Key;
    drawTrophyCabinet(team1Key, "cabinet-team1", "cabinet-t1-shelves");
    drawTrophyCabinet(team2Key, "cabinet-team2", "cabinet-t2-shelves");

    // Unhide comparison dashboard results
    comparisonResult.classList.remove('hidden');

    // Force active tab to Overview
    tabButtons.forEach(btn => {
        if (btn.dataset.tab === 'overview') btn.classList.add('active');
        else btn.classList.remove('active');
    });
    tabPanels.forEach(panel => {
        if (panel.id === 'panel-overview') panel.classList.add('active');
        else panel.classList.remove('active');
    });

    initTabSlider();

    // Scroll smoothly to dashboard metrics
    comparisonResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// ----------------------------------------------------
// 13. Dynamic Live FIFA Men's Rankings via Official FIFA API
// ----------------------------------------------------

// Name aliases: maps our teamData keys -> official FIFA API team names
const FIFA_API_NAME_MAP = {
    'South Korea': 'Korea Republic',
    'USA': 'USA',
};

const fetchLiveRankings = async () => {
    const FIFA_API_URL = 'https://api.fifa.com/api/v3/fifarankings/rankings/live?gender=1&sportType=0&language=en';
    // CORS proxy fallback in case the FIFA API blocks browser requests
    const PROXY_URL = `https://api.allorigins.win/get?url=${encodeURIComponent(FIFA_API_URL)}`;

    const tryFetch = async (url, useProxy) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        // allorigins wraps the response in { contents: "..." }
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

        // Build a lookup map: lowercase official name -> { rank, points }
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
            // Check alias first, then direct key match
            const officialName = (FIFA_API_NAME_MAP[key] || key).toLowerCase();
            const rankData = apiLookup[officialName];

            if (rankData) {
                teamData[key].fifaRanking = rankData.rank;
                teamData[key].rankingPoints = rankData.points;
                matchedCount++;
            }
        }

        console.log(`✅ Live FIFA Rankings updated from official API. Matched ${matchedCount}/${Object.keys(teamData).length} teams.`);

        // Refresh comparison panel if it's currently visible
        const team1Key = team1Input.value;
        const team2Key = team2Input.value;
        if (team1Key && team2Key && !comparisonResult.classList.contains('hidden')) {
            teamForm.dispatchEvent(new Event('submit'));
        }
    } catch (err) {
        console.warn('⚠️ Could not fetch live FIFA rankings. Using built-in data as fallback.', err);
    }
};

// ----------------------------------------------------
// 13b. Live Top Scorers via Wikipedia REST API
// Fetches the latest international goal tally for active scorers
// (Messi, Ronaldo, Lukaku, Kane, Neymar) on page load.
// ----------------------------------------------------
const fetchLiveTopScorers = async () => {
    const activeTeams = Object.entries(teamData).filter(([, t]) => t.topScorerActive && t.topScorerWiki);

    // Multiple regex patterns to parse international goals from Wikipedia extract text
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
                if (n > 20 && n < 300) return n; // sanity check: must be plausible
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
                    // Extract player name (everything before the opening parenthesis)
                    const scorerName = teamInfo.topScorer.split(' (')[0];
                    teamData[teamKey].topScorerGoals = goals;
                    teamData[teamKey].topScorer = `${scorerName} (${goals} goals)`;
                    updatedCount++;
                    console.log(`📈 ${teamKey}: ${scorerName} updated to ${goals} goals (was ${teamInfo.topScorerGoals})`);
                }
            } catch (e) {
                // Silently fail — static data is the fallback
            }
        })
    );

    if (updatedCount > 0) {
        console.log(`✅ Live Top Scorers updated via Wikipedia. ${updatedCount} scorer(s) refreshed.`);
        // Refresh comparison panel if currently visible
        const t1Key = team1Input.value;
        const t2Key = team2Input.value;
        if (t1Key && t2Key && !comparisonResult.classList.contains('hidden')) {
            teamForm.dispatchEvent(new Event('submit'));
        }
    } else {
        console.log('ℹ️ Live Top Scorers: Static data is already current or Wikipedia parse found no new goals.');
    }
};

// Accelerometer Shake detection
let lastX = null, lastY = null, lastZ = null;
let shakeThreshold = 15;

const handleDeviceMotion = (event) => {
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    const x = acceleration.x;
    const y = acceleration.y;
    const z = acceleration.z;

    if (lastX !== null) {
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);

        if ((deltaX > shakeThreshold && deltaY > shakeThreshold) ||
            (deltaX > shakeThreshold && deltaZ > shakeThreshold) ||
            (deltaY > shakeThreshold && deltaZ > shakeThreshold)) {

            const team1Key = team1Input.value;
            const team2Key = team2Input.value;
            const runBtn = document.getElementById('run-sim-btn');

            if (team1Key && team2Key && !runBtn.disabled && document.getElementById('panel-simulator').classList.contains('active')) {
                if (navigator.vibrate) {
                    navigator.vibrate([100, 50, 100]);
                }
                runMatchSimulation(team1Key, team2Key);
            }
        }
    }

    lastX = x;
    lastY = y;
    lastZ = z;
};

const initShakeDetection = () => {
    const hint = document.getElementById('shake-hint');
    if (!hint) return;

    if (window.DeviceMotionEvent) {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            hint.innerHTML = `<span>📱 Tap here to enable Shake-to-Sim!</span>`;
            hint.style.cursor = 'pointer';
            hint.style.pointerEvents = 'auto';
            hint.addEventListener('click', async () => {
                try {
                    const permissionState = await DeviceMotionEvent.requestPermission();
                    if (permissionState === 'granted') {
                        window.addEventListener('devicemotion', handleDeviceMotion, true);
                        hint.innerHTML = `<span>✅ Shake detection active!</span>`;
                        hint.style.cursor = 'default';
                    }
                } catch (error) {
                    console.warn("DeviceMotion permissions rejected", error);
                    hint.innerHTML = `<span>⚠️ Shake disabled (permission denied)</span>`;
                }
            });
        } else {
            window.addEventListener('devicemotion', handleDeviceMotion, true);
        }
    } else {
        hint.innerHTML = `<span>📣 Tap here for match cheer!</span>`;
        hint.style.cursor = 'pointer';
        hint.style.pointerEvents = 'auto';
        hint.addEventListener('click', () => {
            SoundEffects.playChant();
        });
    }
};

const initSoundboardListeners = () => {
    const btnChant = document.getElementById('sb-btn-chant');
    const btnBoo = document.getElementById('sb-btn-boo');
    const btnHorn = document.getElementById('sb-btn-horn');

    if (btnChant) btnChant.addEventListener('click', () => SoundEffects.playChant());
    if (btnBoo) btnBoo.addEventListener('click', () => SoundEffects.playBoo());
    if (btnHorn) btnHorn.addEventListener('click', () => SoundEffects.playHorn());
};

// ----------------------------------------------------
// 14. DOMContentLoaded Initialization Action
// ----------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    fetchLiveRankings();     // Live FIFA rankings from official FIFA API (api.fifa.com)
    fetchLiveTopScorers();   // Live top scorer goals via Wikipedia REST API
    initTabSlider();
    initShakeDetection();
    initSoundboardListeners();

    const ambientBtn = document.getElementById('ambient-toggle');
    if (ambientBtn) {
        ambientBtn.addEventListener('click', () => {
            SoundEffects.toggleAmbientMode();
        });
    }
});

// Simulator kick off button listener
runSimBtn.addEventListener('click', () => {
    const team1Key = team1Input.value;
    const team2Key = team2Input.value;
    if (team1Key && team2Key) {
        runMatchSimulation(team1Key, team2Key);
    }
});

// ==========================================================================
// FIFA World Cup 2026 Live Match Center Engine
// ==========================================================================

let worldCupGames = [];
let selectedLiveMatchId = null;
let liveMatchInterval = null;
let apiPollInterval = null;
let liveStates = {}; // Stores live commentary and stats for each game to preserve state

// Hardcoded flags code dictionary for teams not in local teamData
const ADDITIONAL_FLAGS = {
    "Norway": "no",
    "Iraq": "iq",
    "Cape Verde": "cv",
    "Saudi Arabia": "sa",
    "Egypt": "eg",
    "Iran": "ir",
    "New Zealand": "nz",
    "Turkey": "tr",
    "Scotland": "gb-sct",
    "Canada": "ca",
    "Qatar": "qa",
    "Ivory Coast": "ci",
    "Sweden": "se",
    "Haiti": "ht",
    "Algeria": "dz",
    "Ghana": "gh",
    "Jordan": "jo",
    "Austria": "at",
    "Uzbekistan": "uz",
    "Panama": "pa",
    "Czech Republic": "cz",
    "South Africa": "za",
    "Bosnia and Herzegovina": "ba",
    "Democratic Republic of the Congo": "cd",
    "Australia": "au"
};

const getWcTeamFlagHTML = (teamName, className = "") => {
    // Check if in teamData first
    const localTeam = teamData[teamName];
    if (localTeam && localTeam.code) {
        return `<img src="https://flagcdn.com/${localTeam.code}.svg" class="flag-icon-img ${className}" alt="${teamName} Flag" />`;
    }
    // Check additional flags
    const code = ADDITIONAL_FLAGS[teamName];
    if (code) {
        return `<img src="https://flagcdn.com/${code}.svg" class="flag-icon-img ${className}" alt="${teamName} Flag" />`;
    }
    return `<span class="flag-placeholder">🏳️</span>`;
};

const FALLBACK_WORLD_CUP_GAMES = [
    {
        id: "61",
        home_team_name_en: "Senegal",
        away_team_name_en: "Iraq",
        home_score: "0",
        away_score: "0",
        home_scorers: "null",
        away_scorers: "null",
        group: "I",
        matchday: "3",
        local_date: "06/26/2026 15:00",
        stadium_id: "12",
        finished: "FALSE",
        time_elapsed: "45",
        type: "group"
    },
    {
        id: "62",
        home_team_name_en: "Norway",
        away_team_name_en: "France",
        home_score: "1",
        away_score: "2",
        home_scorers: "{\"Erling Haaland 22'\"}",
        away_scorers: "{\"Kylian Mbappé 12'\",\"Ousmane Dembélé 55'\"}",
        group: "I",
        matchday: "3",
        local_date: "06/26/2026 15:00",
        stadium_id: "9",
        finished: "FALSE",
        time_elapsed: "78",
        type: "group"
    },
    {
        id: "66",
        home_team_name_en: "Uruguay",
        away_team_name_en: "Spain",
        home_score: "0",
        away_score: "0",
        home_scorers: "null",
        away_scorers: "null",
        group: "H",
        matchday: "3",
        local_date: "06/26/2026 18:00",
        stadium_id: "2",
        finished: "FALSE",
        time_elapsed: "notstarted",
        type: "group"
    },
    {
        id: "65",
        home_team_name_en: "Cape Verde",
        away_team_name_en: "Saudi Arabia",
        home_score: "0",
        away_score: "0",
        home_scorers: "null",
        away_scorers: "null",
        group: "H",
        matchday: "3",
        local_date: "06/26/2026 19:00",
        stadium_id: "5",
        finished: "FALSE",
        time_elapsed: "notstarted",
        type: "group"
    },
    {
        id: "63",
        home_team_name_en: "Egypt",
        away_team_name_en: "Iran",
        home_score: "0",
        away_score: "0",
        home_scorers: "null",
        away_scorers: "null",
        group: "G",
        matchday: "3",
        local_date: "06/26/2026 20:00",
        stadium_id: "14",
        finished: "FALSE",
        time_elapsed: "notstarted",
        type: "group"
    },
    {
        id: "64",
        home_team_name_en: "New Zealand",
        away_team_name_en: "Belgium",
        home_score: "0",
        away_score: "0",
        home_scorers: "null",
        away_scorers: "null",
        group: "G",
        matchday: "3",
        local_date: "06/26/2026 20:00",
        stadium_id: "13",
        finished: "FALSE",
        time_elapsed: "notstarted",
        type: "group"
    }
];

// Fetch World Cup games with CORS proxy fallback
const fetchWorldCupGames = async () => {
    const API_URL = "https://worldcup26.ir/get/games";
    const PROXY_URL = `https://api.allorigins.win/get?url=${encodeURIComponent(API_URL)}`;

    try {
        console.log("Fetching World Cup matches from API...");
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data && Array.isArray(data.games)) {
            worldCupGames = data.games;
            console.log(`✅ Fetched ${worldCupGames.length} games from API.`);
            return;
        }
        throw new Error("Invalid API response format");
    } catch (err) {
        console.warn("Direct API fetch failed, trying proxy...", err.message);
        try {
            const res = await fetch(PROXY_URL);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const wrapper = await res.json();
            const data = JSON.parse(wrapper.contents);
            if (data && Array.isArray(data.games)) {
                worldCupGames = data.games;
                console.log(`✅ Fetched ${worldCupGames.length} games via proxy.`);
                return;
            }
        } catch (proxyErr) {
            console.error("CORS proxy fetch failed. Using offline fallback matches.", proxyErr.message);
            worldCupGames = FALLBACK_WORLD_CUP_GAMES;
        }
    }
};

const toggleThemeLayouts = (isDark) => {
    const ticket = document.getElementById('live-gateway-ticket');
    const unlockBtn = document.getElementById('unlock-live-btn');
    const openArchiveBtn = document.getElementById('open-archive-btn');

    if (isDark) {
        if (ticket) ticket.classList.remove('hidden');
        if (unlockBtn) unlockBtn.classList.add('hidden');
        if (openArchiveBtn) openArchiveBtn.classList.remove('hidden');
    } else {
        if (ticket) ticket.classList.add('hidden');
        if (unlockBtn) unlockBtn.classList.remove('hidden');
        if (openArchiveBtn) openArchiveBtn.classList.add('hidden');
        document.body.classList.remove('world-cup-active');
        deactivateLiveArena();
    }
};

const activateLiveArena = async () => {
    deactivateLiveArena(); // Reset first to avoid multiple intervals

    await fetchWorldCupGames();
    renderLiveMatches();
    updateLiveStandings();

    // Auto-select the first live match if none is selected
    const todayMatches = getTodayMatches();
    if (todayMatches.length > 0 && !selectedLiveMatchId) {
        const liveGame = todayMatches.find(g => g.finished === "FALSE" && g.time_elapsed !== "notstarted") || todayMatches[0];
        selectLiveMatch(liveGame);
    }

    // Start 30-second API polling sync loop
    apiPollInterval = setInterval(async () => {
        const oldSelectedId = selectedLiveMatchId;
        await fetchWorldCupGames();
        renderLiveMatches();
        updateLiveStandings();
        
        // Keep selected game active
        if (oldSelectedId) {
            const updatedGame = worldCupGames.find(g => g.id === oldSelectedId);
            if (updatedGame && selectedLiveMatchId === oldSelectedId) {
                // Sync scores/minutes from API to current selected details
                const state = liveStates[oldSelectedId];
                if (state) {
                    state.scoreHome = parseInt(updatedGame.home_score) || 0;
                    state.scoreAway = parseInt(updatedGame.away_score) || 0;
                    state.finished = updatedGame.finished === "TRUE";
                    if (updatedGame.time_elapsed !== "finished" && updatedGame.time_elapsed !== "notstarted") {
                        const parsedMin = parseInt(updatedGame.time_elapsed);
                        if (!isNaN(parsedMin)) state.minute = parsedMin;
                    }
                }
                updateConsoleDetails(updatedGame);
            }
        }
    }, 30000);

    // Start 3-second live simulation tick loop for commentary & minor stats updates
    liveMatchInterval = setInterval(() => {
        tickLiveMatchesSimulation();
    }, 3000);
};

const deactivateLiveArena = () => {
    if (apiPollInterval) {
        clearInterval(apiPollInterval);
        apiPollInterval = null;
    }
    if (liveMatchInterval) {
        clearInterval(liveMatchInterval);
        liveMatchInterval = null;
    }
};

// Filter matches for June 26, 2026 (our primary target matches)
const getTodayMatches = () => {
    return worldCupGames.filter(game => {
        return game.local_date && game.local_date.startsWith("06/26/2026");
    });
};

const renderLiveMatches = () => {
    const priorityList = document.getElementById("priority-matches-list");
    const generalList = document.getElementById("general-matches-list");

    if (!priorityList || !generalList) return;

    priorityList.innerHTML = "";
    generalList.innerHTML = "";

    const selectedT1 = document.getElementById("team1").value;
    const selectedT2 = document.getElementById("team2").value;

    const todayMatches = getTodayMatches();

    let priorityCount = 0;
    let generalCount = 0;

    todayMatches.forEach(game => {
        const hName = game.home_team_name_en;
        const aName = game.away_team_name_en;

        const isPriority = (selectedT1 && (hName === selectedT1 || aName === selectedT1)) ||
                           (selectedT2 && (hName === selectedT2 || aName === selectedT2));

        const card = document.createElement("div");
        card.className = "live-match-card";
        if (selectedLiveMatchId === game.id) {
            card.classList.add("active-selected");
        }

        // Setup Match State initial variables if not exists
        if (!liveStates[game.id]) {
            const isLive = game.finished === "FALSE" && game.time_elapsed !== "notstarted";
            liveStates[game.id] = {
                minute: isLive ? (parseInt(game.time_elapsed) || 45) : 0,
                scoreHome: parseInt(game.home_score) || 0,
                scoreAway: parseInt(game.away_score) || 0,
                finished: game.finished === "TRUE",
                stats: {
                    possession: 50,
                    shotsHome: 0,
                    shotsAway: 0,
                    shotsOnTargetHome: 0,
                    shotsOnTargetAway: 0,
                    foulsHome: 0,
                    foulsAway: 0,
                    savesHome: 0,
                    savesAway: 0,
                    cornersHome: 0,
                    cornersAway: 0
                },
                timeline: []
            };
        }

        const state = liveStates[game.id];

        let statusText = "Upcoming";
        let statusClass = "status-upcoming";
        if (state.finished) {
            statusText = "Finished";
            statusClass = "status-finished";
        } else if (game.finished === "FALSE" && game.time_elapsed !== "notstarted") {
            statusText = `Live - ${state.minute}'`;
            statusClass = "status-live";
        }

        // Parsed local date time for display
        const matchTime = game.local_date ? game.local_date.split(" ")[1] : "00:00";

        card.innerHTML = `
            <div class="m-card-teams">
                <div class="m-card-team-row">
                    ${getWcTeamFlagHTML(hName, "m-card-flag")}
                    <span class="m-card-team-name">${hName}</span>
                </div>
                <div class="m-card-team-row">
                    ${getWcTeamFlagHTML(aName, "m-card-flag")}
                    <span class="m-card-team-name">${aName}</span>
                </div>
            </div>
            <div class="m-card-score-box">
                <span class="m-card-score">${state.scoreHome} - ${state.scoreAway}</span>
                <span class="m-card-meta">${game.group} • ${matchTime}</span>
            </div>
            <span class="m-card-status-pill ${statusClass}">
                ${statusText}
            </span>
        `;

        card.addEventListener("click", () => {
            document.querySelectorAll(".live-match-card").forEach(c => c.classList.remove("active-selected"));
            card.classList.add("active-selected");
            selectLiveMatch(game);
        });

        if (isPriority) {
            priorityList.appendChild(card);
            priorityCount++;
        } else {
            generalList.appendChild(card);
            generalCount++;
        }
    });

    if (priorityCount === 0) {
        priorityList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px; font-size: 13px;">No fixtures involving your selected teams today.</div>`;
    }
    if (generalCount === 0) {
        generalList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px; font-size: 13px;">No other matchday fixtures today.</div>`;
    }
};

const selectLiveMatch = (game) => {
    selectedLiveMatchId = game.id;
    document.getElementById("console-empty-state").classList.add("hidden");
    document.getElementById("console-active-state").classList.remove("hidden");
    updateConsoleDetails(game);
    updateLiveStandings(); // Make sure standings refresh next to it
};

const updateConsoleDetails = (game) => {
    if (selectedLiveMatchId !== game.id) return;
    const state = liveStates[game.id];
    if (!state) return;

    document.getElementById("console-stadium-name").textContent = getStadiumName(game.stadium_id);
    document.getElementById("console-group-name").textContent = `Group ${game.group}`;

    document.getElementById("console-home-flag").innerHTML = getWcTeamFlagHTML(game.home_team_name_en, "console-flag");
    document.getElementById("console-home-name").textContent = game.home_team_name_en;
    document.getElementById("console-away-flag").innerHTML = getWcTeamFlagHTML(game.away_team_name_en, "console-flag");
    document.getElementById("console-away-name").textContent = game.away_team_name_en;

    document.getElementById("console-home-score").textContent = state.scoreHome;
    document.getElementById("console-away-score").textContent = state.scoreAway;

    const timeEl = document.getElementById("console-time");
    timeEl.className = "console-time-elapsed";
    if (state.finished) {
        timeEl.textContent = "Finished";
        timeEl.classList.add("status-finished");
    } else if (game.finished === "FALSE" && game.time_elapsed !== "notstarted") {
        timeEl.textContent = `Live - ${state.minute}'`;
        timeEl.classList.add("status-live");
    } else {
        timeEl.textContent = "Upcoming";
        timeEl.classList.add("status-upcoming");
    }

    // Populate scorers
    const homeScorersList = document.getElementById("console-home-scorers");
    const awayScorersList = document.getElementById("console-away-scorers");
    homeScorersList.innerHTML = "";
    awayScorersList.innerHTML = "";

    try {
        if (game.home_scorers && game.home_scorers !== "null") {
            const array = game.home_scorers.startsWith("{") ? JSON.parse(game.home_scorers.replace(/“|”/g, '"').replace(/{/g, '[').replace(/}/g, ']')) : [game.home_scorers];
            array.forEach(s => homeScorersList.innerHTML += `<div>${s}</div>`);
        }
        if (game.away_scorers && game.away_scorers !== "null") {
            const array = game.away_scorers.startsWith("{") ? JSON.parse(game.away_scorers.replace(/“|”/g, '"').replace(/{/g, '[').replace(/}/g, ']')) : [game.away_scorers];
            array.forEach(s => awayScorersList.innerHTML += `<div>${s}</div>`);
        }
    } catch (e) {
        // Fallback simple parsing
        homeScorersList.textContent = game.home_scorers !== "null" ? game.home_scorers.replace(/[{}"]/g, "") : "";
        awayScorersList.textContent = game.away_scorers !== "null" ? game.away_scorers.replace(/[{}"]/g, "") : "";
    }

    // Populate Stats Grid
    const statsGrid = document.getElementById("console-stats-grid");
    statsGrid.innerHTML = "";

    const buildConsoleStatBar = (title, valHome, valAway) => {
        const intHome = parseInt(valHome) || 0;
        const intAway = parseInt(valAway) || 0;
        const total = intHome + intAway;
        const pctHome = total > 0 ? (intHome / total) * 100 : 50;
        const pctAway = total > 0 ? (intAway / total) * 100 : 50;

        return `
            <div class="split-bar-metric" style="margin-bottom: 8px;">
                <div class="split-bar-col team1-side">
                    <span class="split-val" style="font-size: 13px;">${valHome}</span>
                    <div class="split-track" style="height: 6px; background: rgba(255,255,255,0.06);">
                        <div class="split-fill" style="width: ${pctHome}%; background: #10b981; margin-left: auto;"></div>
                    </div>
                </div>
                <div class="split-bar-label" style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-muted);">${title}</div>
                <div class="split-bar-col team2-side">
                    <div class="split-track" style="height: 6px; background: rgba(255,255,255,0.06);">
                        <div class="split-fill" style="width: ${pctAway}%; background: #60a5fa;"></div>
                    </div>
                    <span class="split-val" style="font-size: 13px;">${valAway}</span>
                </div>
            </div>
        `;
    };

    statsGrid.innerHTML = `
        ${buildConsoleStatBar("Possession", `${state.stats.possession}%`, `${100 - state.stats.possession}%`)}
        ${buildConsoleStatBar("Shots", state.stats.shotsHome, state.stats.shotsAway)}
        ${buildConsoleStatBar("Shots on Target", state.stats.shotsOnTargetHome, state.stats.shotsOnTargetAway)}
        ${buildConsoleStatBar("Fouls", state.stats.foulsHome, state.stats.foulsAway)}
        ${buildConsoleStatBar("Goalkeeper Saves", state.stats.savesHome, state.stats.savesAway)}
        ${buildConsoleStatBar("Corners", state.stats.cornersHome, state.stats.cornersAway)}
    `;

    // Populate Timeline Log
    const timelineLog = document.getElementById("console-timeline-log");
    timelineLog.innerHTML = "";

    if (state.timeline.length === 0) {
        state.timeline.push({
            min: 0,
            icon: "🚩",
            desc: `Kickoff at <strong>${getStadiumName(game.stadium_id)}</strong> under the night floodlights!`
        });
    }

    state.timeline.forEach(event => {
        const evCard = document.createElement("div");
        evCard.className = "timeline-event-card";
        evCard.innerHTML = `
            <span class="t-event-time">${event.min}'</span>
            <span class="t-event-icon">${event.icon}</span>
            <span class="t-event-desc">${event.desc}</span>
        `;
        timelineLog.appendChild(evCard);
    });

    timelineLog.scrollTop = timelineLog.scrollHeight;
};

// 3-Second Live Simulation Ticker
const tickLiveMatchesSimulation = () => {
    const todayMatches = getTodayMatches();
    let hasLiveUpdates = false;

    todayMatches.forEach(game => {
        const isLive = game.finished === "FALSE" && game.time_elapsed !== "notstarted";
        if (!isLive) return;

        const state = liveStates[game.id];
        if (!state || state.finished) return;

        // 1. Increment minutes slowly (e.g. 1 match minute every 4 ticks / 12 seconds)
        if (Math.random() < 0.25) {
            state.minute++;
            hasLiveUpdates = true;
            if (state.minute >= 90) {
                state.finished = true;
                state.timeline.push({
                    min: 90,
                    icon: "🏁",
                    desc: `<strong>Full Time!</strong> The referee blows the final whistle. The match ends.`
                });
                SoundEffects.playWhistle();
            }
        }

        // 2. Simulate random play-by-play events
        const rand = Math.random();
        if (rand < 0.25 && !state.finished) { // 25% chance of game play action event
            hasLiveUpdates = true;
            const sideHome = Math.random() < 0.5;
            const teamSelf = sideHome ? game.home_team_name_en : game.away_team_name_en;
            const teamOpp = sideHome ? game.away_team_name_en : game.home_team_name_en;

            const actionRand = Math.random();
            if (actionRand < 0.3) {
                // Midfield play / possession shift
                const comments = [
                    `<strong>${teamSelf}</strong> recovers the ball in the midfield circle, launching a build-up.`,
                    `Intense pressing sequence from <strong>${teamSelf}</strong> as they block pass channels.`,
                    `Nice tiki-taka sequence by <strong>${teamSelf}</strong> drawing defenders out.`,
                    `Tension rising as <strong>${teamSelf}</strong> dominates the middle, looking for gaps.`
                ];
                state.stats.possession = Math.max(30, Math.min(70, state.stats.possession + (sideHome ? 2 : -2)));
                state.timeline.push({
                    min: state.minute,
                    icon: "🏃‍♂️",
                    desc: comments[Math.floor(Math.random() * comments.length)]
                });
            } else if (actionRand < 0.6) {
                // Attack / Shot attempt
                if (sideHome) state.stats.shotsHome++; else state.stats.shotsAway++;
                const isTarget = Math.random() < 0.45;
                if (isTarget) {
                    if (sideHome) state.stats.shotsOnTargetHome++; else state.stats.shotsOnTargetAway++;
                    
                    const isGoal = Math.random() < 0.15; // 15% goal chance on shot on target
                    if (isGoal) {
                        if (sideHome) state.scoreHome++; else state.scoreAway++;
                        state.timeline.push({
                            min: state.minute,
                            icon: "⚽",
                            desc: `<strong>GOAL!</strong> A blistering shot fired by <strong>${teamSelf}</strong> splits the defense and lands in the net!`
                        });
                        SoundEffects.playWhistle();
                        SoundEffects.playCrowd(true);
                        updateLiveStandings(); // Refresh live points immediately
                    } else {
                        // Goalkeeper Save
                        if (sideHome) state.stats.savesAway++; else state.stats.savesHome++;
                        state.timeline.push({
                            min: state.minute,
                            icon: "🧤",
                            desc: `Close! A powerful volley from <strong>${teamSelf}</strong> is brilliantly parried by the goalkeeper of <strong>${teamOpp}</strong>!`
                        });
                        SoundEffects.playCrowd(false);
                    }
                } else {
                    // Shot off target
                    state.timeline.push({
                        min: state.minute,
                        icon: "💨",
                        desc: `Opportunity missed! <strong>${teamSelf}</strong> breaks into the box but curls the shot wide of the post.`
                    });
                }
            } else if (actionRand < 0.85) {
                // Foul or Offside
                const isCard = Math.random() < 0.25;
                if (sideHome) state.stats.foulsHome++; else state.stats.foulsAway++;
                if (isCard) {
                    state.timeline.push({
                        min: state.minute,
                        icon: "🟨",
                        desc: `Yellow Card shown to defensive midfielder of <strong>${teamSelf}</strong> for a tactical slide tackle.`
                    });
                    SoundEffects.playBoo();
                } else {
                    const isOffside = Math.random() < 0.5;
                    state.timeline.push({
                        min: state.minute,
                        icon: isOffside ? "🚩" : "💥",
                        desc: isOffside
                            ? `Offside flag raised. The forward line of <strong>${teamSelf}</strong> broke too early.`
                            : `Foul committed by <strong>${teamSelf}</strong>. The referee awards a free-kick.`
                    });
                }
            } else {
                // Corner kick
                if (sideHome) state.stats.cornersHome++; else state.stats.cornersAway++;
                state.timeline.push({
                    min: state.minute,
                    icon: "🎯",
                    desc: `Corner kick awarded to <strong>${teamSelf}</strong> after a defender blocks the cross.`
                });
                if (Math.random() < 0.35) SoundEffects.playChant();
            }
        }
    });

    if (hasLiveUpdates) {
        // Redraw lists and update active console display
        renderLiveMatches();
        const activeGame = todayMatches.find(g => g.id === selectedLiveMatchId);
        if (activeGame) {
            updateConsoleDetails(activeGame);
        }
    }
};

const getStadiumName = (stadiumId) => {
    const stadiums = {
        "1": "Azteca Stadium, Mexico City",
        "2": "Guadalajara Stadium, Zapopan",
        "3": "Monterrey Stadium, Guadalupe",
        "4": "Boston Stadium, Foxborough",
        "5": "Houston Stadium, Houston",
        "6": "Dallas Stadium, Arlington",
        "7": "Los Angeles Stadium, Inglewood",
        "8": "Miami Stadium, Gardens",
        "9": "New York Stadium, East Rutherford",
        "10": "Philadelphia Stadium, Philadelphia",
        "11": "San Francisco Stadium, Santa Clara",
        "12": "Seattle Stadium, Seattle",
        "13": "Atlanta Stadium, Atlanta",
        "14": "Kansas City Stadium, Kansas City",
        "15": "Toronto Stadium, Toronto",
        "16": "Vancouver Stadium, BC Place"
    };
    return stadiums[stadiumId] || "World Cup Stadium";
};

// Dynamic Standings Aggregator
const updateLiveStandings = () => {
    const container = document.getElementById("live-standings-container");
    if (!container) return;
    container.innerHTML = "";

    const activeGame = worldCupGames.find(g => g.id === selectedLiveMatchId);
    let groupsToRender = ["G", "H", "I"]; // Render these by default

    // If a game is active, prioritize its group at the top
    if (activeGame && activeGame.group && activeGame.group.length === 1) {
        groupsToRender = [activeGame.group, ...groupsToRender.filter(g => g !== activeGame.group)];
    }

    groupsToRender.forEach(groupName => {
        const groupTeams = aggregateGroupStandings(groupName);
        if (groupTeams.length === 0) return;

        const tableWrapper = document.createElement("div");
        tableWrapper.className = "standings-table-wrapper";
        tableWrapper.innerHTML = `
            <h4>Group ${groupName} Live Standings</h4>
            <table class="live-standings-tbl">
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Team</th>
                        <th style="text-align: center;">P</th>
                        <th style="text-align: center;">GD</th>
                        <th style="text-align: center;">Pts</th>
                    </tr>
                </thead>
                <tbody id="standings-body-${groupName}">
                    <!-- Loaded dynamically -->
                </tbody>
            </table>
        `;

        container.appendChild(tableWrapper);

        const tbody = document.getElementById(`standings-body-${groupName}`);
        groupTeams.forEach((team, idx) => {
            const tr = document.createElement("tr");
            if (idx < 2) tr.className = "advancing-pos"; // highlight top 2 advancing
            
            tr.innerHTML = `
                <td class="standings-num">${idx + 1}</td>
                <td class="standings-team-name">
                    ${getWcTeamFlagHTML(team.name, "standings-tbl-flag")}
                    <span>${team.name}</span>
                </td>
                <td style="text-align: center;">${team.p}</td>
                <td style="text-align: center; color: ${team.gd > 0 ? '#10b981' : team.gd < 0 ? '#ef4444' : 'var(--text-muted)'};">${team.gd > 0 ? '+' + team.gd : team.gd}</td>
                <td style="text-align: center; font-weight: 800;">${team.pts}</td>
            `;
            tbody.appendChild(tr);
        });
    });
};

const aggregateGroupStandings = (groupName) => {
    // Find all teams in the group
    const teamsMap = {};
    
    // Scan all games in the group stage to identify group members and aggregate scores
    worldCupGames.forEach(game => {
        if (game.group !== groupName || game.type !== "group") return;

        const h = game.home_team_name_en;
        const a = game.away_team_name_en;

        if (!teamsMap[h]) teamsMap[h] = { name: h, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
        if (!teamsMap[a]) teamsMap[a] = { name: a, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };

        // Get active live scores or final API scores
        const state = liveStates[game.id];
        let scoreH = 0;
        let scoreA = 0;
        let isPlayed = false;

        if (state) {
            scoreH = state.scoreHome;
            scoreA = state.scoreAway;
            isPlayed = game.finished === "TRUE" || (game.finished === "FALSE" && game.time_elapsed !== "notstarted");
        } else {
            scoreH = parseInt(game.home_score) || 0;
            scoreA = parseInt(game.away_score) || 0;
            isPlayed = game.finished === "TRUE";
        }

        if (isPlayed) {
            teamsMap[h].p++;
            teamsMap[a].p++;

            teamsMap[h].gf += scoreH;
            teamsMap[h].ga += scoreA;
            teamsMap[a].gf += scoreA;
            teamsMap[a].ga += scoreH;

            if (scoreH > scoreA) {
                teamsMap[h].w++;
                teamsMap[h].pts += 3;
                teamsMap[a].l++;
            } else if (scoreA > scoreH) {
                teamsMap[a].w++;
                teamsMap[a].pts += 3;
                teamsMap[h].l++;
            } else {
                teamsMap[h].d++;
                teamsMap[h].pts += 1;
                teamsMap[a].d++;
                teamsMap[a].pts += 1;
            }
        }
    });

    const result = Object.values(teamsMap);
    result.forEach(t => t.gd = t.gf - t.ga);

    // Sort: Points -> GD -> GF -> Alphabetical
    return result.sort((x, y) => {
        if (y.pts !== x.pts) return y.pts - x.pts;
        if (y.gd !== x.gd) return y.gd - x.gd;
        if (y.gf !== x.gf) return y.gf - x.gf;
        return x.name.localeCompare(y.name);
    });
};

// Full schedule explorer search/filters
const openExplorer = () => {
    document.getElementById("explorer-overlay").classList.add("open");
    document.getElementById("explorer-search").value = "";
    filterExplorerGames("all", "");
};

const closeExplorer = () => {
    document.getElementById("explorer-overlay").classList.remove("open");
};

const filterExplorerGames = (filter, searchVal) => {
    const grid = document.getElementById("explorer-games-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const query = searchVal.toLowerCase().trim();

    // Sort games by matchday or ID
    const sorted = [...worldCupGames].sort((x, y) => parseInt(x.id) - parseInt(y.id));

    sorted.forEach(game => {
        const hName = game.home_team_name_en;
        const aName = game.away_team_name_en;

        const matchesSearch = hName.toLowerCase().includes(query) || 
                              aName.toLowerCase().includes(query) || 
                              (game.group && game.group.toLowerCase().includes(query));

        let matchesFilter = true;
        if (filter === "finished") matchesFilter = game.finished === "TRUE";
        else if (filter === "upcoming") matchesFilter = game.finished === "FALSE" && game.time_elapsed === "notstarted";
        else if (filter === "knockout") matchesFilter = game.type !== "group";

        if (matchesSearch && matchesFilter) {
            const card = document.createElement("div");
            card.className = "live-match-card";
            card.style.cursor = "default"; // static details

            const scoreText = game.finished === "TRUE" ? `${game.home_score} - ${game.away_score}` : "vs";
            const dateStr = game.local_date ? game.local_date.split(" ")[0] : "";

            card.innerHTML = `
                <div class="m-card-teams">
                    <div class="m-card-team-row">
                        ${getWcTeamFlagHTML(hName, "m-card-flag")}
                        <span class="m-card-team-name">${hName}</span>
                    </div>
                    <div class="m-card-team-row">
                        ${getWcTeamFlagHTML(aName, "m-card-flag")}
                        <span class="m-card-team-name">${aName}</span>
                    </div>
                </div>
                <div class="m-card-score-box" style="width: 35%; align-items: flex-end;">
                    <span class="m-card-score" style="font-size: 15px;">${scoreText}</span>
                    <span class="m-card-meta">${game.group} • ${dateStr}</span>
                </div>
            `;
            grid.appendChild(card);
        }
    });

    if (grid.children.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px; font-size: 13.5px;">No matches found matching criteria.</div>`;
    }
};

// Wire up events on load
document.addEventListener("DOMContentLoaded", () => {
    // 1. Gateway switch theme button
    document.getElementById("unlock-live-btn")?.addEventListener("click", () => {
        const themeBtn = document.getElementById("theme-toggle");
        if (themeBtn && !document.body.classList.contains('dark-theme')) {
            themeBtn.click();
        }
        document.body.classList.add('world-cup-active');
        activateLiveArena();
    });

    // 1b. Gateway open archive button (Dark Mode option)
    document.getElementById("open-archive-btn")?.addEventListener("click", () => {
        document.body.classList.add('world-cup-active');
        activateLiveArena();
    });

    // 2. Return to comparison dashboard
    document.getElementById("arena-back-btn")?.addEventListener("click", () => {
        document.body.classList.remove('world-cup-active');
        deactivateLiveArena();
    });

    // 3. Explorer Overlay close/open bindings
    document.getElementById("explore-all-btn")?.addEventListener("click", openExplorer);
    document.getElementById("explorer-close")?.addEventListener("click", closeExplorer);
    document.getElementById("explorer-overlay")?.addEventListener("click", (e) => {
        if (e.target === document.getElementById("explorer-overlay")) closeExplorer();
    });

    // 4. Explorer Search filter keyup listener
    const searchInput = document.getElementById("explorer-search");
    searchInput?.addEventListener("input", (e) => {
        const activeTab = document.querySelector("#explorer-filter-tabs .filter-btn.active");
        const activeFilter = activeTab ? activeTab.dataset.filter : "all";
        filterExplorerGames(activeFilter, e.target.value);
    });

    // 5. Explorer Filter tabs click listener
    document.getElementById("explorer-filter-tabs")?.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        document.querySelectorAll("#explorer-filter-tabs .filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const query = document.getElementById("explorer-search").value;
        filterExplorerGames(btn.dataset.filter, query);
    });
});

