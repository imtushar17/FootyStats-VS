import { teamData } from '../data/teams.js';
import { getStartingXI } from '../data/lineups.js';

let worldCupGames = [];
let selectedLiveMatchId = null;
const liveStates = {};

let currentLiveMatches = [];
let currentSelectedMatchDetails = null;
let dataFeedError = null;
let matchesListInterval = null;

const OFFICIAL_IST_MAP = {
    "1": { date: "Jun 12", dateFull: "Jun 12, 2026", dateLong: "Friday, June 12, 2026", time: "00:30 IST", full: "Jun 12, 2026 • 00:30 IST" },
    "2": { date: "Jun 12", dateFull: "Jun 12, 2026", dateLong: "Friday, June 12, 2026", time: "07:30 IST", full: "Jun 12, 2026 • 07:30 IST" },
    "3": { date: "Jun 13", dateFull: "Jun 13, 2026", dateLong: "Saturday, June 13, 2026", time: "03:30 IST", full: "Jun 13, 2026 • 03:30 IST" },
    "4": { date: "Jun 13", dateFull: "Jun 13, 2026", dateLong: "Saturday, June 13, 2026", time: "06:30 IST", full: "Jun 13, 2026 • 06:30 IST" },
    "5": { date: "Jun 14", dateFull: "Jun 14, 2026", dateLong: "Sunday, June 14, 2026", time: "06:30 IST", full: "Jun 14, 2026 • 06:30 IST" },
    "6": { date: "Jun 14", dateFull: "Jun 14, 2026", dateLong: "Sunday, June 14, 2026", time: "06:30 IST", full: "Jun 14, 2026 • 06:30 IST" },
    "7": { date: "Jun 14", dateFull: "Jun 14, 2026", dateLong: "Sunday, June 14, 2026", time: "06:30 IST", full: "Jun 14, 2026 • 06:30 IST" },
    "8": { date: "Jun 13", dateFull: "Jun 13, 2026", dateLong: "Saturday, June 13, 2026", time: "21:30 IST", full: "Jun 13, 2026 • 21:30 IST" },
    "9": { date: "Jun 15", dateFull: "Jun 15, 2026", dateLong: "Monday, June 15, 2026", time: "04:30 IST", full: "Jun 15, 2026 • 04:30 IST" },
    "10": { date: "Jun 14", dateFull: "Jun 14, 2026", dateLong: "Sunday, June 14, 2026", time: "22:30 IST", full: "Jun 14, 2026 • 22:30 IST" },
    "11": { date: "Jun 15", dateFull: "Jun 15, 2026", dateLong: "Monday, June 15, 2026", time: "00:30 IST", full: "Jun 15, 2026 • 00:30 IST" },
    "12": { date: "Jun 15", dateFull: "Jun 15, 2026", dateLong: "Monday, June 15, 2026", time: "07:30 IST", full: "Jun 15, 2026 • 07:30 IST" },
    "13": { date: "Jun 16", dateFull: "Jun 16, 2026", dateLong: "Tuesday, June 16, 2026", time: "06:30 IST", full: "Jun 16, 2026 • 06:30 IST" },
    "14": { date: "Jun 16", dateFull: "Jun 16, 2026", dateLong: "Tuesday, June 16, 2026", time: "00:30 IST", full: "Jun 16, 2026 • 00:30 IST" },
    "15": { date: "Jun 15", dateFull: "Jun 15, 2026", dateLong: "Monday, June 15, 2026", time: "22:30 IST", full: "Jun 15, 2026 • 22:30 IST" },
    "16": { date: "Jun 16", dateFull: "Jun 16, 2026", dateLong: "Tuesday, June 16, 2026", time: "03:30 IST", full: "Jun 16, 2026 • 03:30 IST" },
    "17": { date: "Jun 17", dateFull: "Jun 17, 2026", dateLong: "Wednesday, June 17, 2026", time: "03:30 IST", full: "Jun 17, 2026 • 03:30 IST" },
    "18": { date: "Jun 17", dateFull: "Jun 17, 2026", dateLong: "Wednesday, June 17, 2026", time: "03:30 IST", full: "Jun 17, 2026 • 03:30 IST" },
    "19": { date: "Jun 17", dateFull: "Jun 17, 2026", dateLong: "Wednesday, June 17, 2026", time: "06:30 IST", full: "Jun 17, 2026 • 06:30 IST" },
    "20": { date: "Jun 17", dateFull: "Jun 17, 2026", dateLong: "Wednesday, June 17, 2026", time: "06:30 IST", full: "Jun 17, 2026 • 06:30 IST" },
    "21": { date: "Jun 17", dateFull: "Jun 17, 2026", dateLong: "Wednesday, June 17, 2026", time: "22:30 IST", full: "Jun 17, 2026 • 22:30 IST" },
    "22": { date: "Jun 18", dateFull: "Jun 18, 2026", dateLong: "Thursday, June 18, 2026", time: "00:30 IST", full: "Jun 18, 2026 • 00:30 IST" },
    "23": { date: "Jun 18", dateFull: "Jun 18, 2026", dateLong: "Thursday, June 18, 2026", time: "07:30 IST", full: "Jun 18, 2026 • 07:30 IST" },
    "24": { date: "Jun 18", dateFull: "Jun 18, 2026", dateLong: "Thursday, June 18, 2026", time: "07:30 IST", full: "Jun 18, 2026 • 07:30 IST" },
    "25": { date: "Jun 19", dateFull: "Jun 19, 2026", dateLong: "Friday, June 19, 2026", time: "06:30 IST", full: "Jun 19, 2026 • 06:30 IST" },
    "26": { date: "Jun 19", dateFull: "Jun 19, 2026", dateLong: "Friday, June 19, 2026", time: "00:30 IST", full: "Jun 19, 2026 • 00:30 IST" },
    "27": { date: "Jun 19", dateFull: "Jun 19, 2026", dateLong: "Friday, June 19, 2026", time: "00:30 IST", full: "Jun 19, 2026 • 00:30 IST" },
    "28": { date: "Jun 19", dateFull: "Jun 19, 2026", dateLong: "Friday, June 19, 2026", time: "00:30 IST", full: "Jun 19, 2026 • 00:30 IST" },
    "29": { date: "Jun 20", dateFull: "Jun 20, 2026", dateLong: "Saturday, June 20, 2026", time: "06:30 IST", full: "Jun 20, 2026 • 06:30 IST" },
    "30": { date: "Jun 20", dateFull: "Jun 20, 2026", dateLong: "Saturday, June 20, 2026", time: "03:30 IST", full: "Jun 20, 2026 • 03:30 IST" },
    "31": { date: "Jun 19", dateFull: "Jun 19, 2026", dateLong: "Friday, June 19, 2026", time: "22:30 IST", full: "Jun 19, 2026 • 22:30 IST" },
    "32": { date: "Jun 20", dateFull: "Jun 20, 2026", dateLong: "Saturday, June 20, 2026", time: "05:30 IST", full: "Jun 20, 2026 • 05:30 IST" },
    "33": { date: "Jun 21", dateFull: "Jun 21, 2026", dateLong: "Sunday, June 21, 2026", time: "04:30 IST", full: "Jun 21, 2026 • 04:30 IST" },
    "34": { date: "Jun 21", dateFull: "Jun 21, 2026", dateLong: "Sunday, June 21, 2026", time: "05:30 IST", full: "Jun 21, 2026 • 05:30 IST" },
    "35": { date: "Jun 20", dateFull: "Jun 20, 2026", dateLong: "Saturday, June 20, 2026", time: "22:30 IST", full: "Jun 20, 2026 • 22:30 IST" },
    "36": { date: "Jun 21", dateFull: "Jun 21, 2026", dateLong: "Sunday, June 21, 2026", time: "09:30 IST", full: "Jun 21, 2026 • 09:30 IST" },
    "37": { date: "Jun 22", dateFull: "Jun 22, 2026", dateLong: "Monday, June 22, 2026", time: "00:30 IST", full: "Jun 22, 2026 • 00:30 IST" },
    "38": { date: "Jun 22", dateFull: "Jun 22, 2026", dateLong: "Monday, June 22, 2026", time: "03:30 IST", full: "Jun 22, 2026 • 03:30 IST" },
    "39": { date: "Jun 22", dateFull: "Jun 22, 2026", dateLong: "Monday, June 22, 2026", time: "00:30 IST", full: "Jun 22, 2026 • 00:30 IST" },
    "40": { date: "Jun 22", dateFull: "Jun 22, 2026", dateLong: "Monday, June 22, 2026", time: "03:30 IST", full: "Jun 22, 2026 • 03:30 IST" },
    "41": { date: "Jun 23", dateFull: "Jun 23, 2026", dateLong: "Tuesday, June 23, 2026", time: "02:30 IST", full: "Jun 23, 2026 • 02:30 IST" },
    "42": { date: "Jun 23", dateFull: "Jun 23, 2026", dateLong: "Tuesday, June 23, 2026", time: "08:30 IST", full: "Jun 23, 2026 • 08:30 IST" },
    "43": { date: "Jun 22", dateFull: "Jun 22, 2026", dateLong: "Monday, June 22, 2026", time: "21:30 IST", full: "Jun 22, 2026 • 21:30 IST" },
    "44": { date: "Jun 23", dateFull: "Jun 23, 2026", dateLong: "Tuesday, June 23, 2026", time: "05:30 IST", full: "Jun 23, 2026 • 05:30 IST" },
    "45": { date: "Jun 23", dateFull: "Jun 23, 2026", dateLong: "Tuesday, June 23, 2026", time: "22:30 IST", full: "Jun 23, 2026 • 22:30 IST" },
    "46": { date: "Jun 24", dateFull: "Jun 24, 2026", dateLong: "Wednesday, June 24, 2026", time: "07:30 IST", full: "Jun 24, 2026 • 07:30 IST" },
    "47": { date: "Jun 24", dateFull: "Jun 24, 2026", dateLong: "Wednesday, June 24, 2026", time: "07:30 IST", full: "Jun 24, 2026 • 07:30 IST" },
    "48": { date: "Jun 24", dateFull: "Jun 24, 2026", dateLong: "Wednesday, June 24, 2026", time: "01:30 IST", full: "Jun 24, 2026 • 01:30 IST" },
    "49": { date: "Jun 25", dateFull: "Jun 25, 2026", dateLong: "Thursday, June 25, 2026", time: "03:30 IST", full: "Jun 25, 2026 • 03:30 IST" },
    "50": { date: "Jun 25", dateFull: "Jun 25, 2026", dateLong: "Thursday, June 25, 2026", time: "06:30 IST", full: "Jun 25, 2026 • 06:30 IST" },
    "51": { date: "Jun 25", dateFull: "Jun 25, 2026", dateLong: "Thursday, June 25, 2026", time: "06:30 IST", full: "Jun 25, 2026 • 06:30 IST" },
    "52": { date: "Jun 25", dateFull: "Jun 25, 2026", dateLong: "Thursday, June 25, 2026", time: "06:30 IST", full: "Jun 25, 2026 • 06:30 IST" },
    "53": { date: "Jun 24", dateFull: "Jun 24, 2026", dateLong: "Wednesday, June 24, 2026", time: "22:30 IST", full: "Jun 24, 2026 • 22:30 IST" },
    "54": { date: "Jun 24", dateFull: "Jun 24, 2026", dateLong: "Wednesday, June 24, 2026", time: "21:30 IST", full: "Jun 24, 2026 • 21:30 IST" },
    "55": { date: "Jun 26", dateFull: "Jun 26, 2026", dateLong: "Friday, June 26, 2026", time: "01:30 IST", full: "Jun 26, 2026 • 01:30 IST" },
    "56": { date: "Jun 26", dateFull: "Jun 26, 2026", dateLong: "Friday, June 26, 2026", time: "04:30 IST", full: "Jun 26, 2026 • 04:30 IST" },
    "57": { date: "Jun 26", dateFull: "Jun 26, 2026", dateLong: "Friday, June 26, 2026", time: "04:30 IST", full: "Jun 26, 2026 • 04:30 IST" },
    "58": { date: "Jun 26", dateFull: "Jun 26, 2026", dateLong: "Friday, June 26, 2026", time: "07:30 IST", full: "Jun 26, 2026 • 07:30 IST" },
    "59": { date: "Jun 26", dateFull: "Jun 26, 2026", dateLong: "Friday, June 26, 2026", time: "03:30 IST", full: "Jun 26, 2026 • 03:30 IST" },
    "60": { date: "Jun 26", dateFull: "Jun 26, 2026", dateLong: "Friday, June 26, 2026", time: "04:30 IST", full: "Jun 26, 2026 • 04:30 IST" },
    "61": { date: "Jun 27", dateFull: "Jun 27, 2026", dateLong: "Saturday, June 27, 2026", time: "03:30 IST", full: "Jun 27, 2026 • 03:30 IST" },
    "62": { date: "Jun 27", dateFull: "Jun 27, 2026", dateLong: "Saturday, June 27, 2026", time: "00:30 IST", full: "Jun 27, 2026 • 00:30 IST" },
    "63": { date: "Jun 27", dateFull: "Jun 27, 2026", dateLong: "Saturday, June 27, 2026", time: "06:30 IST", full: "Jun 27, 2026 • 06:30 IST" },
    "64": { date: "Jun 27", dateFull: "Jun 27, 2026", dateLong: "Saturday, June 27, 2026", time: "05:30 IST", full: "Jun 27, 2026 • 05:30 IST" },
    "65": { date: "Jun 27", dateFull: "Jun 27, 2026", dateLong: "Saturday, June 27, 2026", time: "05:30 IST", full: "Jun 27, 2026 • 05:30 IST" },
    "66": { date: "Jun 27", dateFull: "Jun 27, 2026", dateLong: "Saturday, June 27, 2026", time: "05:30 IST", full: "Jun 27, 2026 • 05:30 IST" },
    "67": { date: "Jun 28", dateFull: "Jun 28, 2026", dateLong: "Sunday, June 28, 2026", time: "05:30 IST", full: "Jun 28, 2026 • 05:30 IST" },
    "68": { date: "Jun 28", dateFull: "Jun 28, 2026", dateLong: "Sunday, June 28, 2026", time: "02:30 IST", full: "Jun 28, 2026 • 02:30 IST" },
    "69": { date: "Jun 28", dateFull: "Jun 28, 2026", dateLong: "Sunday, June 28, 2026", time: "07:30 IST", full: "Jun 28, 2026 • 07:30 IST" },
    "70": { date: "Jun 28", dateFull: "Jun 28, 2026", dateLong: "Sunday, June 28, 2026", time: "06:30 IST", full: "Jun 28, 2026 • 06:30 IST" },
    "71": { date: "Jun 28", dateFull: "Jun 28, 2026", dateLong: "Sunday, June 28, 2026", time: "05:00 IST", full: "Jun 28, 2026 • 05:00 IST" },
    "72": { date: "Jun 28", dateFull: "Jun 28, 2026", dateLong: "Sunday, June 28, 2026", time: "08:00 IST", full: "Jun 28, 2026 • 08:00 IST" },
    "73": { date: "Jun 29", dateFull: "Jun 29, 2026", dateLong: "Monday, June 29, 2026", time: "00:30 IST", full: "Jun 29, 2026 • 00:30 IST" },
    "74": { date: "Jun 30", dateFull: "Jun 30, 2026", dateLong: "Tuesday, June 30, 2026", time: "02:00 IST", full: "Jun 30, 2026 • 02:00 IST" },
    "75": { date: "Jun 30", dateFull: "Jun 30, 2026", dateLong: "Tuesday, June 30, 2026", time: "06:30 IST", full: "Jun 30, 2026 • 06:30 IST" },
    "76": { date: "Jun 29", dateFull: "Jun 29, 2026", dateLong: "Monday, June 29, 2026", time: "22:30 IST", full: "Jun 29, 2026 • 22:30 IST" },
    "77": { date: "Jul 1", dateFull: "Jul 1, 2026", dateLong: "Wednesday, July 1, 2026", time: "02:30 IST", full: "Jul 1, 2026 • 02:30 IST" },
    "78": { date: "Jun 30", dateFull: "Jun 30, 2026", dateLong: "Tuesday, June 30, 2026", time: "22:30 IST", full: "Jun 30, 2026 • 22:30 IST" },
    "79": { date: "Jul 1", dateFull: "Jul 1, 2026", dateLong: "Wednesday, July 1, 2026", time: "06:30 IST", full: "Jul 1, 2026 • 06:30 IST" },
    "80": { date: "Jul 1", dateFull: "Jul 1, 2026", dateLong: "Wednesday, July 1, 2026", time: "21:30 IST", full: "Jul 1, 2026 • 21:30 IST" },
    "81": { date: "Jul 2", dateFull: "Jul 2, 2026", dateLong: "Thursday, July 2, 2026", time: "05:30 IST", full: "Jul 2, 2026 • 05:30 IST" },
    "82": { date: "Jul 2", dateFull: "Jul 2, 2026", dateLong: "Thursday, July 2, 2026", time: "01:30 IST", full: "Jul 2, 2026 • 01:30 IST" },
    "83": { date: "Jul 3", dateFull: "Jul 3, 2026", dateLong: "Friday, July 3, 2026", time: "04:30 IST", full: "Jul 3, 2026 • 04:30 IST" },
    "84": { date: "Jul 3", dateFull: "Jul 3, 2026", dateLong: "Friday, July 3, 2026", time: "00:30 IST", full: "Jul 3, 2026 • 00:30 IST" },
    "85": { date: "Jul 3", dateFull: "Jul 3, 2026", dateLong: "Friday, July 3, 2026", time: "08:30 IST", full: "Jul 3, 2026 • 08:30 IST" },
    "86": { date: "Jul 4", dateFull: "Jul 4, 2026", dateLong: "Saturday, July 4, 2026", time: "03:30 IST", full: "Jul 4, 2026 • 03:30 IST" },
    "87": { date: "Jul 4", dateFull: "Jul 4, 2026", dateLong: "Saturday, July 4, 2026", time: "07:00 IST", full: "Jul 4, 2026 • 07:00 IST" },
    "88": { date: "Jul 3", dateFull: "Jul 3, 2026", dateLong: "Friday, July 3, 2026", time: "23:30 IST", full: "Jul 3, 2026 • 23:30 IST" },
    "89": { date: "Jul 5", dateFull: "Jul 5, 2026", dateLong: "Sunday, July 5, 2026", time: "06:30 IST", full: "Jul 5, 2026 • 06:30 IST" },
    "90": { date: "Jul 5", dateFull: "Jul 5, 2026", dateLong: "Sunday, July 5, 2026", time: "03:30 IST", full: "Jul 5, 2026 • 03:30 IST" },
    "91": { date: "Jul 6", dateFull: "Jul 6, 2026", dateLong: "Monday, July 6, 2026", time: "01:30 IST", full: "Jul 6, 2026 • 01:30 IST" },
    "92": { date: "Jul 6", dateFull: "Jul 6, 2026", dateLong: "Monday, July 6, 2026", time: "05:30 IST", full: "Jul 6, 2026 • 05:30 IST" },
    "93": { date: "Jul 7", dateFull: "Jul 7, 2026", dateLong: "Tuesday, July 7, 2026", time: "00:30 IST", full: "Jul 7, 2026 • 00:30 IST" },
    "94": { date: "Jul 7", dateFull: "Jul 7, 2026", dateLong: "Tuesday, July 7, 2026", time: "05:30 IST", full: "Jul 7, 2026 • 05:30 IST" },
    "95": { date: "Jul 7", dateFull: "Jul 7, 2026", dateLong: "Tuesday, July 7, 2026", time: "21:30 IST", full: "Jul 7, 2026 • 21:30 IST" },
    "96": { date: "Jul 8", dateFull: "Jul 8, 2026", dateLong: "Wednesday, July 8, 2026", time: "01:30 IST", full: "Jul 8, 2026 • 01:30 IST" },
    "97": { date: "Jul 10", dateFull: "Jul 10, 2026", dateLong: "Friday, July 10, 2026", time: "01:30 IST", full: "Jul 10, 2026 • 01:30 IST" },
    "98": { date: "Jul 11", dateFull: "Jul 11, 2026", dateLong: "Saturday, July 11, 2026", time: "00:30 IST", full: "Jul 11, 2026 • 00:30 IST" },
    "99": { date: "Jul 12", dateFull: "Jul 12, 2026", dateLong: "Sunday, July 12, 2026", time: "02:30 IST", full: "Jul 12, 2026 • 02:30 IST" },
    "100": { date: "Jul 12", dateFull: "Jul 12, 2026", dateLong: "Sunday, July 12, 2026", time: "06:30 IST", full: "Jul 12, 2026 • 06:30 IST" },
    "101": { date: "Jul 15", dateFull: "Jul 15, 2026", dateLong: "Wednesday, July 15, 2026", time: "00:30 IST", full: "Jul 15, 2026 • 00:30 IST" },
    "102": { date: "Jul 16", dateFull: "Jul 16, 2026", dateLong: "Thursday, July 16, 2026", time: "00:30 IST", full: "Jul 16, 2026 • 00:30 IST" },
    "103": { date: "Jul 19", dateFull: "Jul 19, 2026", dateLong: "Sunday, July 19, 2026", time: "02:30 IST", full: "Jul 19, 2026 • 02:30 IST" },
    "104": { date: "Jul 20", dateFull: "Jul 20, 2026", dateLong: "Monday, July 20, 2026", time: "00:30 IST", full: "Jul 20, 2026 • 00:30 IST" },
};

const STADIUM_OFFSETS = {
    "1": -6,  // Azteca Stadium, Mexico City (CST / UTC-6)
    "2": -6,  // Guadalajara Stadium (CST / UTC-6)
    "3": -6,  // Monterrey Stadium (CST / UTC-6)
    "4": -4,  // Boston Stadium (EDT / UTC-4)
    "5": -5,  // Houston Stadium (CDT / UTC-5)
    "6": -5,  // Dallas Stadium (CDT / UTC-5)
    "7": -7,  // Los Angeles Stadium (PDT / UTC-7)
    "8": -4,  // Miami Stadium (EDT / UTC-4)
    "9": -4,  // New York Stadium (EDT / UTC-4)
    "10": -4, // Philadelphia Stadium (EDT / UTC-4)
    "11": -7, // San Francisco Stadium (PDT / UTC-7)
    "12": -7, // Seattle Stadium (PDT / UTC-7)
    "13": -4, // Atlanta Stadium (EDT / UTC-4)
    "14": -5, // Kansas City Stadium (CDT / UTC-5)
    "15": -4, // Toronto Stadium (EDT / UTC-4)
    "16": -7  // Vancouver Stadium (PDT / UTC-7)
};

const formatToIST = (localDateStr, stadiumId = null, gameId = null) => {
    if (gameId && OFFICIAL_IST_MAP[gameId]) {
        return OFFICIAL_IST_MAP[gameId];
    }
    if (!localDateStr) return { date: "TBD", dateFull: "TBD", dateLong: "TBD", time: "TBD", full: "TBD" };
    try {
        const parts = localDateStr.split(" ");
        const datePart = parts[0];
        const timePart = parts[1] || "00:00";
        const [m, d, y] = datePart.split("/").map(Number);
        const [hr, min] = timePart.split(":").map(Number);
        
        const offset = STADIUM_OFFSETS[stadiumId] !== undefined ? STADIUM_OFFSETS[stadiumId] : -4;
        
        const localUTC = Date.UTC(y, m - 1, d, hr, min);
        const utcTime = localUTC - (offset * 60 * 60 * 1000);
        const istTime = new Date(utcTime + (5.5 * 60 * 60 * 1000));
        
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const monthsLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        const istWeekday = weekdays[istTime.getUTCDay()];
        const istMonthLong = monthsLong[istTime.getUTCMonth()];
        const istDay = istTime.getUTCDate();
        const istYear = istTime.getUTCFullYear();
        
        const dateStr = `${istMonthLong.slice(0, 3)} ${istDay}`;
        const dateStrFull = `${istMonthLong.slice(0, 3)} ${istDay}, ${istYear}`;
        const dateLong = `${istWeekday}, ${istMonthLong} ${istDay}, ${istYear}`;
        
        const hours = String(istTime.getUTCHours()).padStart(2, '0');
        const minutes = String(istTime.getUTCMinutes()).padStart(2, '0');
        const timeStr = `${hours}:${minutes} IST`;
        
        return {
            date: dateStr,
            dateFull: dateStrFull,
            dateLong: dateLong,
            time: timeStr,
            full: `${dateStrFull} • ${timeStr}`
        };
    } catch(e) {
        return { date: "TBD", dateFull: "TBD", dateLong: "TBD", time: "TBD", full: "TBD" };
    }
};

const normalizeTeamName = (name) => {
    if (!name) return "";
    const clean = name.trim();
    if (clean === "United States") return "USA";
    if (clean === "Czech Republic") return "Czechia";
    if (clean === "Democratic Republic of the Congo") return "DR Congo";
    return clean;
};

const getTeamData = (name) => {
    const norm = normalizeTeamName(name);
    return teamData[norm] || { 
        fifaRanking: 50, 
        rankingPoints: 1400, 
        primaryColor: "#94a3b8", 
        starPlayer: "Key Player",
        playerCard: { rating: 85, pos: "MID" },
        squad: []
    };
};

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
    "Australia": "au",
    "United States": "us"
};

export const getWcTeamFlagHTML = (teamName, className = "") => {
    const localTeam = getTeamData(teamName);
    if (localTeam && localTeam.code) {
        return `<img src="https://flagcdn.com/${localTeam.code}.svg" class="flag-icon-img ${className}" alt="${teamName} Flag" />`;
    }
    const code = ADDITIONAL_FLAGS[teamName];
    if (code) {
        return `<img src="https://flagcdn.com/${code}.svg" class="flag-icon-img ${className}" alt="${teamName} Flag" />`;
    }
    return `<span class="flag-placeholder">🏳️</span>`;
};

const fetchMatchesList = async () => {
    try {
        dataFeedError = null;
        console.log("Fetching matches list from Vercel proxy...");
        const res = await fetch("/api/matches");
        if (!res.ok) {
            throw new Error(`HTTP Error ${res.status}`);
        }
        const data = await res.json();
        
        if (data && Array.isArray(data.matches)) {
            currentLiveMatches = data.matches;
            worldCupGames = data.matches;
            console.log(`Successfully fetched ${currentLiveMatches.length} matches from proxy.`);
        } else if (data && Array.isArray(data.games)) {
            currentLiveMatches = data.games;
            worldCupGames = data.games;
        } else {
            throw new Error("Invalid response format from matches proxy");
        }
    } catch (err) {
        console.error("Failed to fetch matches list:", err.message);
        dataFeedError = "Data Feed Temporarily Unavailable";
        showDataFeedErrorBanner(dataFeedError);
    }
};

const fetchMatchDetails = async (matchId) => {
    try {
        dataFeedError = null;
        console.log(`Fetching match details for ID ${matchId} from Vercel proxy...`);
        const res = await fetch(`/api/matches?matchId=${matchId}`);
        if (!res.ok) {
            throw new Error(`HTTP Error ${res.status}`);
        }
        const data = await res.json();
        currentSelectedMatchDetails = data;
        console.log(`Successfully fetched details for match ID ${matchId}.`);
        return data;
    } catch (err) {
        console.error(`Failed to fetch details for match ID ${matchId}:`, err.message);
        dataFeedError = "Data Feed Temporarily Unavailable";
        showDataFeedErrorBanner(dataFeedError);
        return null;
    }
};

const showDataFeedErrorBanner = (message) => {
    const errorBanner = document.getElementById("data-feed-error-banner");
    if (errorBanner) {
        errorBanner.textContent = message;
        errorBanner.style.display = "block";
    } else {
        const banner = document.createElement("div");
        banner.id = "data-feed-error-banner";
        banner.className = "calendar-toast-alert data-feed-error";
        banner.style.background = "#ef4444";
        banner.style.color = "#ffffff";
        banner.style.position = "fixed";
        banner.style.bottom = "20px";
        banner.style.right = "20px";
        banner.style.padding = "12px 20px";
        banner.style.borderRadius = "8px";
        banner.style.fontSize = "12px";
        banner.style.fontWeight = "bold";
        banner.style.zIndex = "30000";
        banner.textContent = message;
        document.body.appendChild(banner);
        
        setTimeout(() => {
            banner.remove();
        }, 3000);
    }
};

export const activateLiveArena = async () => {
    deactivateLiveArena();

    await fetchMatchesList();
    renderLiveMatches();
    updateLiveStandings();

    const todayMatches = getTodayMatches();
    if (todayMatches.length > 0 && !selectedLiveMatchId) {
        const liveGame = todayMatches.find(g => g.finished === "FALSE" && g.time_elapsed !== "notstarted") || todayMatches[0];
        selectLiveMatch(liveGame);
    }

    // Strict poll interval once every 60000ms
    matchesListInterval = setInterval(async () => {
        await fetchMatchesList();
        renderLiveMatches();
        updateLiveStandings();
    }, 60000);
};

export const deactivateLiveArena = () => {
    if (matchesListInterval) {
        clearInterval(matchesListInterval);
        matchesListInterval = null;
    }
};

const getTodayMatches = () => {
    if (!worldCupGames || worldCupGames.length === 0) return [];

    const now = new Date();
    const todayStartOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const parseDate = (game) => {
        if (game.utcDate) return new Date(game.utcDate);
        if (game.local_date) {
            const [datePart, timePart] = game.local_date.split(' ');
            const [m, d, y] = datePart.split('/').map(Number);
            const [hr, min] = (timePart || '00:00').split(':').map(Number);
            return new Date(y, m - 1, d, hr, min);
        }
        return new Date(0);
    };

    const getDateString = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const todayStr = getDateString(now);
    const matchesToday = worldCupGames.filter(game => {
        const gameDate = parseDate(game);
        return getDateString(gameDate) === todayStr;
    });

    if (matchesToday.length > 0) {
        return matchesToday;
    }

    const upcomingGames = worldCupGames.filter(game => {
        const gameDate = parseDate(game);
        return gameDate >= todayStartOfDay;
    });

    if (upcomingGames.length > 0) {
        upcomingGames.sort((a, b) => parseDate(a) - parseDate(b));
        const earliestUpcomingDateStr = getDateString(parseDate(upcomingGames[0]));
        return worldCupGames.filter(game => getDateString(parseDate(game)) === earliestUpcomingDateStr);
    }

    const sortedGames = [...worldCupGames].sort((a, b) => parseDate(a) - parseDate(b));
    const latestDateStr = getDateString(parseDate(sortedGames[sortedGames.length - 1]));
    return worldCupGames.filter(game => getDateString(parseDate(game)) === latestDateStr);
};

export const renderLiveMatches = () => {
    const priorityList = document.getElementById("priority-matches-list");
    const generalList = document.getElementById("general-matches-list");

    if (!priorityList || !generalList) return;

    priorityList.innerHTML = "";
    generalList.innerHTML = "";

    const selectedT1 = document.getElementById("team1")?.value || "";
    const selectedT2 = document.getElementById("team2")?.value || "";

    const todayMatches = getTodayMatches();
    let matchDateStr = "";
    if (todayMatches[0]) {
        if (todayMatches[0].utcDate) {
            matchDateStr = new Date(todayMatches[0].utcDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
        } else if (todayMatches[0].local_date) {
            const ist = formatToIST(todayMatches[0].local_date, todayMatches[0].stadium_id, todayMatches[0].id);
            matchDateStr = ist.dateFull;
        }
    }
    
    const priorityTitle = document.querySelector(".prioritized-card .card-section-title");
    const generalTitle = document.querySelector(".general-matches-card .card-section-title");
    if (matchDateStr) {
        if (priorityTitle) priorityTitle.textContent = `⭐ Your Teams' Fixtures (${matchDateStr})`;
        if (generalTitle) generalTitle.textContent = `📅 Other Matchday Fixtures (${matchDateStr})`;
    } else {
        if (priorityTitle) priorityTitle.textContent = `⭐ Your Teams' Fixtures`;
        if (generalTitle) generalTitle.textContent = `📅 Other Matchday Fixtures`;
    }

    let priorityCount = 0;
    let generalCount = 0;

    todayMatches.forEach(game => {
        const hName = game.homeTeam?.name || game.home_team_name_en || "TBD";
        const aName = game.awayTeam?.name || game.away_team_name_en || "TBD";

        const isPriority = (selectedT1 && (hName === selectedT1 || aName === selectedT1)) ||
                           (selectedT2 && (hName === selectedT2 || aName === selectedT2));

        const card = document.createElement("div");
        card.className = "live-match-card";
        if (selectedLiveMatchId === game.id) {
            card.classList.add("active-selected");
        }

        if (!liveStates[game.id]) {
            const isLive = game.status === "IN_PLAY" || game.status === "PAUSED" || (game.finished === "FALSE" && game.time_elapsed !== "notstarted");
            const isFinished = game.status === "FINISHED" || game.finished === "TRUE";
            let initialMin = 0;
            if (isLive) {
                const parsed = parseInt(game.time_elapsed);
                initialMin = isNaN(parsed) ? 40 : parsed;
            } else if (isFinished) {
                initialMin = 90;
            }
            
            const initialScoreHome = game.score?.fullTime?.home !== null && game.score?.fullTime?.home !== undefined ? game.score.fullTime.home : (parseInt(game.home_score) || 0);
            const initialScoreAway = game.score?.fullTime?.away !== null && game.score?.fullTime?.away !== undefined ? game.score.fullTime.away : (parseInt(game.away_score) || 0);

            const state = {
                minute: initialMin,
                scoreHome: initialScoreHome,
                scoreAway: initialScoreAway,
                finished: isFinished,
                loadedAt: Date.now(),
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
            liveStates[game.id] = state;
        }

        const state = liveStates[game.id];

        let scoreText = "vs";
        if (game.score?.fullTime?.home !== null && game.score?.fullTime?.home !== undefined) {
            scoreText = `${game.score.fullTime.home} - ${game.score.fullTime.away}`;
        } else if (state && state.scoreHome !== undefined) {
            scoreText = `${state.scoreHome} - ${state.scoreAway}`;
        }

        let statusText = "Upcoming";
        let statusClass = "status-upcoming";
        
        const status = game.status;
        if (status === "FINISHED") {
            statusText = "Finished";
            statusClass = "status-finished";
        } else if (status === "IN_PLAY" || status === "PAUSED") {
            statusText = status === "PAUSED" ? "HT" : "Live";
            statusClass = "status-live";
        } else if (state && state.finished) {
            statusText = "Finished";
            statusClass = "status-finished";
        }

        let matchTime = "";
        if (game.utcDate) {
            matchTime = new Date(game.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (game.local_date) {
            const istTime = formatToIST(game.local_date, game.stadium_id, game.id);
            matchTime = istTime.time;
        }

        const groupLabel = game.group ? game.group.replace("GROUP_", "Group ") : "";

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
                <span class="m-card-score">${scoreText}</span>
                <span class="m-card-meta">${groupLabel} • ${matchTime}</span>
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

export const selectLiveMatch = async (game) => {
    selectedLiveMatchId = game.id;
    document.getElementById("console-empty-state")?.classList.add("hidden");
    document.getElementById("console-active-state")?.classList.remove("hidden");
    
    document.querySelectorAll(".console-tab-btn").forEach(b => {
        if (b.dataset.tab === "stats") b.classList.add("active");
        else b.classList.remove("active");
    });
    
    await fetchMatchDetails(game.id);
    updateConsoleDetails(game);
    updateLiveStandings();
};

// initializeMatchHistory removed during Segment 1 match engine overhaul

const drawPreMatchHub = (game) => {
    const hub = document.getElementById("console-prematch-hub");
    if (!hub) return;

    const t1 = game.home_team_name_en;
    const t2 = game.away_team_name_en;
    const teamH = getTeamData(t1);
    const teamA = getTeamData(t2);

    const rH = teamH.rankingPoints || 1400;
    const rA = teamA.rankingPoints || 1400;
    const totalR = rH + rA;
    const drawPct = 26;
    const remainingPct = 100 - drawPct;
    const homeWinPct = Math.round((rH / totalR) * remainingPct);
    const awayWinPct = 100 - drawPct - homeWinPct;

    const getAvgRating = (teamObj) => {
        if (!teamObj.squad || teamObj.squad.length === 0) return 75;
        const sum = teamObj.squad.reduce((acc, p) => acc + p.rating, 0);
        return Math.round(sum / teamObj.squad.length);
    };
    
    const hOvr = getAvgRating(teamH);
    const aOvr = getAvgRating(teamA);
    
    const getPosRating = (teamObj, posType) => {
        if (!teamObj.squad) return 75;
        const players = teamObj.squad.filter(p => p.pos === posType || (posType === "FWD" && p.pos === "ST"));
        if (players.length === 0) return getAvgRating(teamObj);
        return Math.round(players.reduce((acc, p) => acc + p.rating, 0) / players.length);
    };

    const hAtt = getPosRating(teamH, "FWD");
    const aAtt = getPosRating(teamA, "FWD");
    const hMid = getPosRating(teamH, "MID");
    const aMid = getPosRating(teamA, "MID");
    const hDef = getPosRating(teamH, "DEF");
    const aDef = getPosRating(teamA, "DEF");

    const getWorldCupForm = (teamName) => {
        const playedGames = worldCupGames.filter(g => {
            if (g.finished !== "TRUE") return false;
            const normH = normalizeTeamName(g.home_team_name_en);
            const normA = normalizeTeamName(g.away_team_name_en);
            const normTarget = normalizeTeamName(teamName);
            return normH === normTarget || normA === normTarget;
        }).sort((a, b) => {
            const parseDate = (dStr) => {
                if (!dStr) return 0;
                const [datePart, timePart] = dStr.split(" ");
                const [m, d, y] = datePart.split("/").map(Number);
                const [h, min] = timePart.split(":").map(Number);
                return new Date(y, m - 1, d, h, min).getTime();
            };
            return parseDate(a.local_date) - parseDate(b.local_date);
        });

        const pills = [];
        let wins = 0;
        let draws = 0;
        let losses = 0;
        let points = 0;
        let goalsScored = 0;
        let goalsConceded = 0;

        playedGames.forEach(g => {
            const normH = normalizeTeamName(g.home_team_name_en);
            const normTarget = normalizeTeamName(teamName);
            const isHome = normH === normTarget;

            const scoreHome = parseInt(g.home_score) || 0;
            const scoreAway = parseInt(g.away_score) || 0;

            const goalsFor = isHome ? scoreHome : scoreAway;
            const goalsAgainst = isHome ? scoreAway : scoreHome;

            goalsScored += goalsFor;
            goalsConceded += goalsAgainst;

            const penH = g.home_penalty_score !== undefined && g.home_penalty_score !== null && g.home_penalty_score !== "" && g.home_penalty_score !== "null" ? parseInt(g.home_penalty_score) || 0 : null;
            const penA = g.away_penalty_score !== undefined && g.away_penalty_score !== null && g.away_penalty_score !== "" && g.away_penalty_score !== "null" ? parseInt(g.away_penalty_score) || 0 : null;

            if (goalsFor > goalsAgainst) {
                pills.push("w");
                wins++;
                points += 3;
            } else if (goalsFor < goalsAgainst) {
                pills.push("l");
                losses++;
            } else {
                if (penH !== null && penA !== null) {
                    const homeWonPen = penH > penA;
                    const targetWonPen = isHome ? homeWonPen : !homeWonPen;
                    if (targetWonPen) {
                        pills.push("w");
                        wins++;
                        points += 3;
                    } else {
                        pills.push("l");
                        losses++;
                    }
                } else {
                    pills.push("d");
                    draws++;
                    points += 1;
                }
            }
        });

        const gd = goalsScored - goalsConceded;
        const parts = [];
        if (wins > 0) parts.push(`${wins} Win${wins > 1 ? "s" : ""}`);
        if (draws > 0) parts.push(`${draws} Draw${draws > 1 ? "s" : ""}`);
        if (losses > 0) parts.push(`${losses} Loss${losses > 1 ? "es" : ""}`);

        const statsSummary = parts.length > 0 ? parts.join(", ") : "0 Wins, 0 Draws, 0 Losses";
        const gdStr = `, ${gd > 0 ? '+' : ''}${gd} GD`;
        const text = `${statsSummary} (${points} pts${gdStr})`;

        return { pills, text };
    };
    const formH = getWorldCupForm(t1);
    const formA = getWorldCupForm(t2);

    const starH = teamH.starPlayer || "Key Player";
    const starA = teamA.starPlayer || "Key Player";
    const ratingH = teamH.playerCard?.rating || 85;
    const ratingA = teamA.playerCard?.rating || 85;
    const posH = teamH.playerCard?.pos || "MID";
    const posA = teamA.playerCard?.pos || "MID";

    hub.innerHTML = `
        <div class="prematch-hub">
            <div class="prematch-section">
                <span class="prematch-section-title">🔮 Win Probability Predictor</span>
                <div class="win-predictor-track">
                    <div class="win-fill home" style="width: ${homeWinPct}%;">${homeWinPct}%</div>
                    <div class="win-fill draw" style="width: ${drawPct}%;">${drawPct}%</div>
                    <div class="win-fill away" style="width: ${awayWinPct}%;">${awayWinPct}%</div>
                </div>
                <div class="win-labels-grid">
                    <span class="win-label home">${t1} Win</span>
                    <span class="win-label draw">Draw</span>
                    <span class="win-label away">${t2} Win</span>
                </div>
            </div>

            <div class="prematch-section">
                <span class="prematch-section-title">📊 Team Rating Comparison</span>
                <div class="strength-compare-box">
                    <div class="strength-bar-row">
                        <span class="strength-team-val home">${hAtt}</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill home" style="width: ${hAtt}%; background: #10b981;"></div>
                        </div>
                        <span class="strength-bar-label">ATTACK</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill away" style="width: ${aAtt}%; background: #3b82f6;"></div>
                        </div>
                        <span class="strength-team-val away">${aAtt}</span>
                    </div>
                    <div class="strength-bar-row">
                        <span class="strength-team-val home">${hMid}</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill home" style="width: ${hMid}%; background: #10b981;"></div>
                        </div>
                        <span class="strength-bar-label">MIDFIELD</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill away" style="width: ${aMid}%; background: #3b82f6;"></div>
                        </div>
                        <span class="strength-team-val away">${aMid}</span>
                    </div>
                    <div class="strength-bar-row">
                        <span class="strength-team-val home">${hDef}</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill home" style="width: ${hDef}%; background: #10b981;"></div>
                        </div>
                        <span class="strength-bar-label">DEFENSE</span>
                        <div class="strength-track-wrapper">
                            <div class="strength-fill away" style="width: ${aDef}%; background: #3b82f6;"></div>
                        </div>
                        <span class="strength-team-val away">${aDef}</span>
                    </div>
                </div>
            </div>

            <div class="prematch-section">
                <span class="prematch-section-title">📈 World Cup Form</span>
                <div class="form-row">
                    <div class="form-team-info">
                        ${getWcTeamFlagHTML(t1, "standings-tbl-flag")}
                        <span>${t1}</span>
                    </div>
                    <div class="form-pills">
                        ${formH.pills.map(p => `<span class="form-pill ${p}">${p.toUpperCase()}</span>`).join('')}
                    </div>
                    <span class="form-stats-text">${formH.text}</span>
                </div>
                <div class="form-row">
                    <div class="form-team-info">
                        ${getWcTeamFlagHTML(t2, "standings-tbl-flag")}
                        <span>${t2}</span>
                    </div>
                    <div class="form-pills">
                        ${formA.pills.map(p => `<span class="form-pill ${p}">${p.toUpperCase()}</span>`).join('')}
                    </div>
                    <span class="form-stats-text">${formA.text}</span>
                </div>
            </div>

            <div class="prematch-section">
                <span class="prematch-section-title">⭐ Key Star Player Matchup</span>
                <div class="matchup-cards-row">
                    <div class="matchup-card">
                        <span class="player-ovr">${ratingH}</span>
                        <span class="player-name">${starH}</span>
                        <span class="player-meta">${posH}</span>
                    </div>
                    <span class="matchup-vs-badge">VS</span>
                    <div class="matchup-card">
                        <span class="player-ovr">${ratingA}</span>
                        <span class="player-name">${starA}</span>
                        <span class="player-meta">${posA}</span>
                    </div>
                </div>
            </div>

            <div class="prematch-section">
                <span class="prematch-section-title">🏟️ Match Information</span>
                <div class="prematch-info-box">
                    <div class="info-item">
                        <span class="info-label">Venue Stadium</span>
                        <span class="info-value">${getStadiumName(game.stadium_id)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Group/Stage</span>
                        <span class="info-value">Group ${game.group}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Scheduled Date</span>
                        <span class="info-value">${formatToIST(game.local_date, game.stadium_id, game.id).dateFull}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Scheduled Time</span>
                        <span class="info-value">${formatToIST(game.local_date, game.stadium_id, game.id).time}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
};



const drawLineupPitch = (game, selectedTeamName) => {
    const flagsContainer = document.getElementById("lineups-team-flags");
    if (!flagsContainer) return;

    const t1 = game.homeTeam?.name || game.home_team_name_en || "TBD";
    const t2 = game.awayTeam?.name || game.away_team_name_en || "TBD";
    const isAwaySelected = (selectedTeamName === t2);

    flagsContainer.innerHTML = `
        <button type="button" class="lineup-flag-btn ${selectedTeamName === t1 ? 'active' : ''}" id="lineup-btn-t1" data-team="${t1}">
            ${getWcTeamFlagHTML(t1, "tactics-flag-img")}
            <span class="t-flag-name">${t1}</span>
        </button>
        <div class="lineups-vs-text">VS</div>
        <button type="button" class="lineup-flag-btn ${selectedTeamName === t2 ? 'active' : ''}" id="lineup-btn-t2" data-team="${t2}">
            ${getWcTeamFlagHTML(t2, "tactics-flag-img")}
            <span class="t-flag-name">${t2}</span>
        </button>
    `;

    document.getElementById("lineup-btn-t1")?.addEventListener("click", () => {
        drawLineupPitch(game, t1);
    });
    document.getElementById("lineup-btn-t2")?.addEventListener("click", () => {
        drawLineupPitch(game, t2);
    });

    const activeTeamObj = getTeamData(selectedTeamName);
    const titleEl = document.getElementById("lineups-active-team-title");
    const subEl = document.getElementById("lineups-active-team-sub");
    const jerseysContainer = document.getElementById("lineups-jerseys-container");

    // Finished matches with API lineup data: generate text-based list view
    const matchStatus = currentSelectedMatchDetails?.status || game.status;
    const hLineup = currentSelectedMatchDetails?.homeTeam?.lineup;
    const aLineup = currentSelectedMatchDetails?.awayTeam?.lineup;
    const hForm = currentSelectedMatchDetails?.homeTeam?.formation;
    const aForm = currentSelectedMatchDetails?.awayTeam?.formation;

    if (matchStatus === "FINISHED" && hLineup && aLineup) {
        const selectedLineup = isAwaySelected ? aLineup : hLineup;
        const selectedFormation = isAwaySelected ? aForm : hForm;
        
        if (titleEl) titleEl.textContent = `${selectedTeamName} Starting XI`;
        if (subEl) subEl.innerHTML = `Formation: <strong>${selectedFormation || "N/A"}</strong> | Finished Match Feed`;
        
        if (jerseysContainer) {
            let listHTML = `<div class="finished-lineup-list" style="padding: 16px; color: var(--text-light); width: 100%; box-sizing: border-box; overflow-y: auto; height: 100%;">`;
            listHTML += `<ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">`;
            
            selectedLineup.forEach(player => {
                const shirt = player.shirtNumber || player.shirt || "-";
                const name = player.name || "Player";
                const pos = player.position || player.pos || "-";
                listHTML += `
                    <li style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; padding: 8px 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 10px;">
                          <span style="font-weight: 900; color: #10b981; min-width: 24px;">#${shirt}</span>
                          <span>${name}</span>
                        </div>
                        <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">${pos}</span>
                    </li>
                `;
            });
            listHTML += `</ul></div>`;
            jerseysContainer.innerHTML = listHTML;
        }
        return;
    }

    // Default visual lineups pitch fallback
    const startingXI = getStartingXI(selectedTeamName);

    const gkList = startingXI.filter(p => p.pos === "GK");
    const defList = startingXI.filter(p => p.pos === "DEF");
    const midList = startingXI.filter(p => p.pos === "MID");
    const fwdList = startingXI.filter(p => p.pos === "FWD" || p.pos === "ST");

    const formationText = `${defList.length}-${midList.length}-${fwdList.length}`;
    
    if (titleEl) titleEl.textContent = `${selectedTeamName} Lineup`;
    if (subEl) subEl.innerHTML = `Formation: ${formationText} | Coach: ${activeTeamObj.coach}`;

    if (!jerseysContainer) return;
    jerseysContainer.innerHTML = "";

    const primaryColor = activeTeamObj.primaryColor || "#3b82f6";
    const secondaryColor = activeTeamObj.secondaryColor || "#ffffff";

    const appendLineupJersey = (player, leftPct, topPct) => {
        const node = document.createElement("div");
        node.className = "player-node";
        node.style.left = `${leftPct}%`;
        node.style.top = `${topPct}%`;
        
        const safePlayerId = player.name.replace(/\s+/g, '-').toLowerCase();

        node.innerHTML = `
            <div class="jersey-wrapper">
                <svg class="player-jersey-svg" viewBox="0 0 100 100">
                    <filter id="lineup-jersey-shadow-${safePlayerId}" x="-15%" y="-15%" width="130%" height="130%">
                        <feDropShadow dx="0" dy="5" stdDeviation="3.5" flood-opacity="0.35"/>
                    </filter>
                    <defs>
                        <linearGradient id="lineup-jersey-grad-${safePlayerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="${primaryColor}"/>
                            <stop offset="100%" stop-color="color-mix(in srgb, ${primaryColor} 65%, #000000)"/>
                        </linearGradient>
                    </defs>
                    <g filter="url(#lineup-jersey-shadow-${safePlayerId})">
                        <path d="M 12,38 L 28,22 L 40,32 L 28,50 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="2.5"/>
                        <path d="M 88,38 L 72,22 L 60,32 L 72,50 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="2.5"/>
                        <path d="M 28,32 L 72,32 L 72,88 L 28,88 Z" fill="url(#lineup-jersey-grad-${safePlayerId})" stroke="${secondaryColor}" stroke-width="3" stroke-linejoin="round"/>
                        <path d="M 40,32 A 10,10 0 0,0 60,32 Z" fill="${secondaryColor}"/>
                    </g>
                    <text class="jersey-number" x="50" y="66" fill="${secondaryColor}" font-size="24" font-family="var(--font-heading)" font-weight="900" text-anchor="middle">${player.shirt}</text>
                </svg>
            </div>
            <div class="player-node-label-container" style="margin-top: 4px;">
                <span class="player-node-pos-pill" style="font-size: 8px; padding: 1px 3px;">${player.pos}</span>
                <span class="player-node-label" style="font-size: 9px; padding: 1px 4px; white-space: nowrap;">${player.name.split(" ").pop()}</span>
            </div>
        `;
        jerseysContainer.appendChild(node);
    };

    if (gkList.length > 0) {
        appendLineupJersey(gkList[0], 8, 50);
    }

    const defCount = defList.length;
    defList.forEach((player, idx) => {
        const topPct = defCount === 1 ? 50 : (15 + (idx / (defCount - 1)) * 70);
        appendLineupJersey(player, 28, topPct);
    });

    const midCount = midList.length;
    midList.forEach((player, idx) => {
        const topPct = midCount === 1 ? 50 : (18 + (idx / (midCount - 1)) * 64);
        appendLineupJersey(player, 55, topPct);
    });

    const fwdCount = fwdList.length;
    fwdList.forEach((player, idx) => {
        const topPct = fwdCount === 1 ? 50 : (20 + (idx / (fwdCount - 1)) * 60);
        appendLineupJersey(player, 82, topPct);
    });
};

const updateConsoleDetails = (game) => {
    if (selectedLiveMatchId !== game.id) return;
    const state = liveStates[game.id];
    if (!state) return;

    const isUpcoming = (game.status === "TIMED" || game.status === "SCHEDULED" || (game.finished === "FALSE" && game.time_elapsed === "notstarted"));
    const navTabs = document.getElementById("console-tabs-nav");
    const prematchHub = document.getElementById("console-prematch-hub");

    if (isUpcoming) {
        if (navTabs) navTabs.classList.add("hidden");
        document.querySelectorAll(".console-tab-content").forEach(c => {
            if (c.id === "console-prematch-hub") {
                c.classList.remove("hidden");
                c.classList.add("active");
            } else {
                c.classList.add("hidden");
                c.classList.remove("active");
            }
        });
        drawPreMatchHub(game);
    } else {
        if (navTabs) navTabs.classList.remove("hidden");
        if (prematchHub) {
            prematchHub.classList.add("hidden");
            prematchHub.classList.remove("active");
        }
        
        let activeTabBtn = document.querySelector(".console-tab-btn.active");
        if (!activeTabBtn) {
            const defaultBtn = document.querySelector(".console-tab-btn[data-tab='stats']");
            if (defaultBtn) {
                defaultBtn.classList.add("active");
                activeTabBtn = defaultBtn;
            }
        }
        
        if (activeTabBtn) {
            const tabName = activeTabBtn.dataset.tab;
            document.querySelectorAll(".console-tab-content").forEach(c => {
                if (c.id === `console-tab-${tabName}`) {
                    c.classList.remove("hidden");
                    c.classList.add("active");
                } else {
                    c.classList.add("hidden");
                    c.classList.remove("active");
                }
            });
        }

        // Draw lineups pitch initially
        const hName = game.homeTeam?.name || game.home_team_name_en || "TBD";
        drawLineupPitch(game, hName);
    }

    const stadiumEl = document.getElementById("console-stadium-name");
    const groupEl = document.getElementById("console-group-name");
    const hFlagEl = document.getElementById("console-home-flag");
    const hNameEl = document.getElementById("console-home-name");
    const aFlagEl = document.getElementById("console-away-flag");
    const aNameEl = document.getElementById("console-away-name");
    const hScoreEl = document.getElementById("console-home-score");
    const aScoreEl = document.getElementById("console-away-score");

    // Render Venue and Referee
    if (stadiumEl) {
        const venueStr = currentSelectedMatchDetails?.venue || getStadiumName(game.stadium_id);
        const referees = currentSelectedMatchDetails?.referees || [];
        const mainReferee = referees.find(r => r.role === "REFEREE")?.name || referees[0]?.name || "";
        stadiumEl.textContent = mainReferee ? `${venueStr} (Ref: ${mainReferee})` : venueStr;
    }

    // Render Group and UTC kickoff date formatted to user local time
    if (groupEl) {
        const groupText = game.group ? `Group ${game.group.replace("GROUP_", "")}` : "";
        let dateText = "";
        const targetUtc = currentSelectedMatchDetails?.utcDate || game.utcDate;
        if (targetUtc) {
            dateText = ` | Kickoff: ${new Date(targetUtc).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}`;
        }
        groupEl.textContent = `${groupText}${dateText}`;
    }

    const homeTeamDisplayName = game.homeTeam?.name || game.home_team_name_en || "TBD";
    const awayTeamDisplayName = game.awayTeam?.name || game.away_team_name_en || "TBD";

    if (hFlagEl) hFlagEl.innerHTML = getWcTeamFlagHTML(homeTeamDisplayName, "console-flag");
    if (hNameEl) hNameEl.textContent = homeTeamDisplayName;
    if (aFlagEl) aFlagEl.innerHTML = getWcTeamFlagHTML(awayTeamDisplayName, "console-flag");
    if (aNameEl) aNameEl.textContent = awayTeamDisplayName;

    // Scores display
    const apiHomeScore = currentSelectedMatchDetails?.score?.fullTime?.home;
    const apiAwayScore = currentSelectedMatchDetails?.score?.fullTime?.away;
    const displayHomeScore = apiHomeScore !== null && apiHomeScore !== undefined ? apiHomeScore : (state ? state.scoreHome : "-");
    const displayAwayScore = apiAwayScore !== null && apiAwayScore !== undefined ? apiAwayScore : (state ? state.scoreAway : "-");

    if (hScoreEl) hScoreEl.textContent = displayHomeScore;
    if (aScoreEl) aScoreEl.textContent = displayAwayScore;

    const timeEl = document.getElementById("console-time");
    if (timeEl) {
        timeEl.className = "console-time-elapsed";
        const status = currentSelectedMatchDetails?.status || game.status;
        if (status === "FINISHED") {
            timeEl.textContent = "Finished";
            timeEl.classList.add("status-finished");
        } else if (status === "IN_PLAY" || status === "PAUSED") {
            timeEl.textContent = status === "PAUSED" ? "HT" : "Live";
            timeEl.classList.add("status-live");
        } else {
            timeEl.textContent = "Upcoming";
            timeEl.classList.add("status-upcoming");
        }
    }

    // Goal Scorers List
    const homeScorersList = document.getElementById("console-home-scorers");
    const awayScorersList = document.getElementById("console-away-scorers");
    if (homeScorersList) homeScorersList.innerHTML = "";
    if (awayScorersList) awayScorersList.innerHTML = "";

    try {
        const events = currentSelectedMatchDetails?.events || [];
        const goalEvents = events.filter(e => e.type === "GOAL");
        if (goalEvents.length > 0) {
            goalEvents.forEach(evt => {
                const scorerName = evt.player?.name || "Goal";
                const min = evt.minute || "";
                const isHome = evt.team?.id === currentSelectedMatchDetails?.homeTeam?.id;
                const list = isHome ? homeScorersList : awayScorersList;
                if (list) list.innerHTML += `<div>${scorerName} ${min}'</div>`;
            });
        } else {
            if (game.home_scorers && game.home_scorers !== "null") {
                const array = game.home_scorers.startsWith("{") ? JSON.parse(game.home_scorers.replace(/“|”/g, '"').replace(/{/g, '[').replace(/}/g, ']')) : [game.home_scorers];
                array.forEach(s => {
                    if (homeScorersList) homeScorersList.innerHTML += `<div>${s}</div>`;
                });
            }
            if (game.away_scorers && game.away_scorers !== "null") {
                const array = game.away_scorers.startsWith("{") ? JSON.parse(game.away_scorers.replace(/“|”/g, '"').replace(/{/g, '[').replace(/}/g, ']')) : [game.away_scorers];
                array.forEach(s => {
                    if (awayScorersList) awayScorersList.innerHTML += `<div>${s}</div>`;
                });
            }
        }
    } catch (e) {
        console.warn("Error rendering scorers list:", e);
    }

    // Stats Grid
    const statsGrid = document.getElementById("console-stats-grid");
    if (statsGrid) {
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

        const homePossession = state.stats?.possession || 50;
        const awayPossession = 100 - homePossession;

        statsGrid.innerHTML = `
            ${buildConsoleStatBar("Possession", `${homePossession}%`, `${awayPossession}%`)}
            ${buildConsoleStatBar("Shots", state.stats?.shotsHome || 0, state.stats?.shotsAway || 0)}
            ${buildConsoleStatBar("Shots on Target", state.stats?.shotsOnTargetHome || 0, state.stats?.shotsOnTargetAway || 0)}
            ${buildConsoleStatBar("Fouls", state.stats?.foulsHome || 0, state.stats?.foulsAway || 0)}
            ${buildConsoleStatBar("Goalkeeper Saves", state.stats?.savesHome || 0, state.stats?.savesAway || 0)}
            ${buildConsoleStatBar("Corners", state.stats?.cornersHome || 0, state.stats?.cornersAway || 0)}
        `;
    }

    // Timeline Event Log
    const timelineLog = document.getElementById("console-timeline-log");
    if (timelineLog) {
        timelineLog.innerHTML = "";

        const events = currentSelectedMatchDetails?.events || [];
        if (events.length > 0) {
            // Sort events chronologically by minute
            const sortedEvents = [...events].sort((a, b) => (a.minute || 0) - (b.minute || 0));
            sortedEvents.forEach(evt => {
                let icon = "❓";
                const typeText = evt.type || "";
                if (typeText.includes("GOAL")) icon = "⚽";
                else if (typeText.includes("YELLOW")) icon = "🟨";
                else if (typeText.includes("RED")) icon = "🟥";
                else if (typeText.includes("SUBST")) icon = "🔄";
                
                const teamName = evt.team?.name || "";
                const playerName = evt.player?.name || "Player";
                const desc = `<strong>${typeText.replace(/_/g, " ")}</strong> - ${playerName} (${teamName})`;

                const evCard = document.createElement("div");
                evCard.className = "timeline-event-card";
                evCard.innerHTML = `
                    <span class="t-event-time">${evt.minute || 0}'</span>
                    <span class="t-event-icon">${icon}</span>
                    <span class="t-event-desc">${desc}</span>
                `;
                timelineLog.appendChild(evCard);
            });
            timelineLog.scrollTop = timelineLog.scrollHeight;
        } else {
            // Fallback to legacy simulated history array
            if (state.timeline && state.timeline.length > 0) {
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
            } else {
                timelineLog.innerHTML = `<div class="timeline-empty" style="text-align: center; color: var(--text-muted); padding: 24px; font-size: 12px;">No match commentary available.</div>`;
            }
        }
    }
};

// tickLiveMatchesSimulation removed during Segment 1 match engine overhaul

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

export const updateLiveStandings = () => {
    // Removed from main screen per request
};

const aggregateGroupStandings = (groupName) => {
    const teamsMap = {};
    
    worldCupGames.forEach(game => {
        if (game.group !== groupName || game.type !== "group") return;

        const h = game.home_team_name_en;
        const a = game.away_team_name_en;

        if (!teamsMap[h]) teamsMap[h] = { name: h, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
        if (!teamsMap[a]) teamsMap[a] = { name: a, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };

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

    return result.sort((x, y) => {
        if (y.pts !== x.pts) return y.pts - x.pts;
        if (y.gd !== x.gd) return y.gd - x.gd;
        if (y.gf !== x.gf) return y.gf - x.gf;
        return x.name.localeCompare(y.name);
    });
};

/* ==========================================================================
   Overlay Drawer Triggers
   ========================================================================== */
export const openExplorer = () => {
    document.getElementById("explorer-overlay")?.classList.add("open");
    const searchInput = document.getElementById("explorer-search");
    if (searchInput) searchInput.value = "";

    const searchWrapper = document.getElementById("explorer-search-wrapper");
    if (searchWrapper) {
        searchWrapper.style.display = "none";
        delete searchWrapper.dataset.randomized;
    }
    
    // Default to Calendar tab active
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

export const closeMatchDetail = () => {
    document.getElementById("match-detail-overlay")?.classList.remove("open");
};

/* ==========================================================================
   Match Detail Popup with Goalscorers List
   ========================================================================== */
const getScorersHTML = (game) => {
    const parseScorers = (scorersStr) => {
        if (!scorersStr || scorersStr === "null") return [];
        try {
            if (scorersStr.startsWith("{")) {
                return JSON.parse(scorersStr.replace(/“|”/g, '"').replace(/{/g, '[').replace(/}/g, ']'));
            }
            return [scorersStr];
        } catch(e) {
            return [String(scorersStr).replace(/[{}"]/g, "")];
        }
    };

    const parseList = (str) => {
        if (!str || str === "null") return [];
        try {
            if (str.startsWith("{")) {
                return JSON.parse(str.replace(/“|”/g, '"').replace(/{/g, '[').replace(/}/g, ']'));
            }
            return [str];
        } catch(e) {
            return [String(str).replace(/[{}"]/g, "")];
        }
    };

    const homeList = parseScorers(game.home_scorers);
    const awayList = parseScorers(game.away_scorers);

    const state = liveStates[game.id];
    let scoreHome = game.finished === "TRUE" ? (parseInt(game.home_score) || 0) : 0;
    let scoreAway = game.finished === "TRUE" ? (parseInt(game.away_score) || 0) : 0;

    if (state) {
        scoreHome = state.scoreHome;
        scoreAway = state.scoreAway;
    }

    const finalHomeList = [...homeList];
    while (finalHomeList.length < scoreHome) {
        finalHomeList.push("Goal");
    }

    const finalAwayList = [...awayList];
    while (finalAwayList.length < scoreAway) {
        finalAwayList.push("Goal");
    }

    if (finalHomeList.length === 0 && finalAwayList.length === 0) {
        return `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); font-size: 11px; padding: 10px 0;">No goals scored</div>`;
    }

    return `
        <div class="popup-scorers-col home">
            ${finalHomeList.map(s => `<div>⚽ ${s}</div>`).join("")}
        </div>
        <div class="popup-scorers-divider">|</div>
        <div class="popup-scorers-col away">
            ${finalAwayList.map(s => `<div>⚽ ${s}</div>`).join("")}
        </div>
    `;
};

const parseList = (str) => {
    if (!str || str === "null") return [];
    try {
        if (str.startsWith("{")) {
            return JSON.parse(str.replace(/“|”/g, '"').replace(/{/g, '[').replace(/}/g, ']'));
        }
        return [str];
    } catch(e) {
        return [String(str).replace(/[{}"]/g, "")];
    }
};

export const openMatchDetailPopup = (game) => {
    const popup = document.getElementById("match-detail-overlay");
    const body = document.getElementById("match-detail-popup-body");
    if (!popup || !body) return;

    popup.classList.add("open");

    const state = liveStates[game.id];
    let scoreHome = game.home_score;
    let scoreAway = game.away_score;
    let isLive = game.finished === "FALSE" && game.time_elapsed !== "notstarted";
    let isFinished = game.finished === "TRUE";

    if (state) {
        scoreHome = state.scoreHome;
        scoreAway = state.scoreAway;
        isLive = !state.finished && game.finished === "FALSE" && game.time_elapsed !== "notstarted";
        isFinished = state.finished;
    }

    const scoreText = (isLive || isFinished) ? `${scoreHome} - ${scoreAway}` : "vs";
    const statusText = isLive ? `Live - ${state ? state.minute : game.time_elapsed}'` : isFinished ? "Finished" : "Upcoming";

    const istTime = formatToIST(game.local_date, game.stadium_id, game.id);
    const dateStr = istTime.full;

    const hasPenalties = game.home_penalty_score !== undefined && 
                         game.home_penalty_score !== null && 
                         game.home_penalty_score !== "" && 
                         game.home_penalty_score !== "null" &&
                         game.away_penalty_score !== undefined &&
                         game.away_penalty_score !== null &&
                         game.away_penalty_score !== "" &&
                         game.away_penalty_score !== "null";
    let penaltiesHTML = "";
    if (hasPenalties) {
        const homePenaltyScorers = parseList(game.home_penalty_scorers);
        const awayPenaltyScorers = parseList(game.away_penalty_scorers);
        const homePenaltyMisses = parseList(game.home_penalty_misses);
        const awayPenaltyMisses = parseList(game.away_penalty_misses);

        penaltiesHTML = `
            <div class="popup-scorers-box" style="margin-top: 8px;">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #ef4444; margin-bottom: 6px; text-align: center;">Penalty Shootout (${game.home_penalty_score} - ${game.away_penalty_score})</div>
                <div style="font-size: 10.5px; color: var(--text-main); line-height: 1.5; text-align: center;">
                    <strong>${game.home_team_name_en}</strong>: ${homePenaltyScorers.length ? homePenaltyScorers.join(", ") : "None"} ${homePenaltyMisses.length ? `<span style="color: var(--text-muted);">(Missed: ${homePenaltyMisses.join(", ")})</span>` : ""}
                    <br>
                    <strong>${game.away_team_name_en}</strong>: ${awayPenaltyScorers.length ? awayPenaltyScorers.join(", ") : "None"} ${awayPenaltyMisses.length ? `<span style="color: var(--text-muted);">(Missed: ${awayPenaltyMisses.join(", ")})</span>` : ""}
                </div>
            </div>
        `;
    }

    body.innerHTML = `
        <div class="popup-scoreboard">
            <div class="popup-team">
                ${getWcTeamFlagHTML(game.home_team_name_en, "popup-team-flag")}
                <span class="popup-team-name">${game.home_team_name_en}</span>
            </div>
            <div class="popup-score-box">
                <span class="popup-score-text">${scoreText}</span>
                <span class="popup-meta-text">${statusText}</span>
            </div>
            <div class="popup-team">
                ${getWcTeamFlagHTML(game.away_team_name_en, "popup-team-flag")}
                <span class="popup-team-name">${game.away_team_name_en}</span>
            </div>
        </div>

        <div class="popup-scorers-box">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px; text-align: center;">Goalscorers</div>
            <div class="popup-scorers-list">
                ${getScorersHTML(game)}
            </div>
        </div>

        ${penaltiesHTML}

        <div style="font-size: 10.5px; color: var(--text-muted); text-align: center; margin-top: 6px; line-height: 1.4;">
            🏟️ ${getStadiumName(game.stadium_id || game.stadium)}<br>Group ${game.group || "Knockout"} | ${dateStr}
        </div>

        <button type="button" class="explore-all-btn" id="popup-load-console-btn" style="width: 100%; justify-content: center; margin: 14px 0 0 0; background: #10b981 !important; color: #ffffff !important; font-weight: 800 !important; border: none !important; box-shadow: var(--shadow-sm) !important;">
            ⚽ View Live Arena Hub
        </button>
    `;

    document.getElementById("popup-load-console-btn")?.addEventListener("click", () => {
        popup.classList.remove("open");
        closeExplorer();
        closeBracket();
        closeGroups();
        selectLiveMatch(game);
    });
};

/* ==========================================================================
   Groups Standings Explorer Drawer (Fixtures lists deleted)
   ========================================================================== */
export const renderGroupsExplorer = (container) => {
    if (!container) return;
    container.innerHTML = "";

    const groupsList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

    groupsList.forEach(groupName => {
        const groupTeams = aggregateGroupStandings(groupName);
        if (groupTeams.length === 0) return;

        const cardBox = document.createElement("div");
        cardBox.className = "group-card-box";

        const title = document.createElement("div");
        title.className = "group-card-title";
        title.textContent = `Group ${groupName}`;
        cardBox.appendChild(title);

        const table = document.createElement("table");
        table.className = "live-standings-tbl";
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Pos</th>
                    <th>Team</th>
                    <th style="text-align: center;">P</th>
                    <th style="text-align: center;">GD</th>
                    <th style="text-align: center;">Pts</th>
                </tr>
            </thead>
            <tbody>
                ${groupTeams.map((team, idx) => `
                    <tr class="${idx < 2 ? 'advancing-pos' : ''}">
                        <td class="standings-num">${idx + 1}</td>
                        <td class="standings-team-name">
                            ${getWcTeamFlagHTML(team.name, "standings-tbl-flag")}
                            <span>${team.name}</span>
                        </td>
                        <td style="text-align: center;">${team.p}</td>
                        <td style="text-align: center; color: ${team.gd > 0 ? '#10b981' : team.gd < 0 ? '#ef4444' : 'var(--text-muted)'};">${team.gd > 0 ? '+' + team.gd : team.gd}</td>
                        <td style="text-align: center; font-weight: 800;">${team.pts}</td>
                    </tr>
                `).join("")}
            </tbody>
        `;
        cardBox.appendChild(table);
        container.appendChild(cardBox);
    });
};

/* ==========================================================================
   Group stage Results explorer
   ========================================================================== */
export const filterExplorerGames = (activeTab, searchVal) => {
    const grid = document.getElementById("explorer-games-grid");
    const searchWrapper = document.getElementById("explorer-search-wrapper");
    if (!grid) return;
    grid.innerHTML = "";

    if (activeTab === "calendar") {
        if (searchWrapper) searchWrapper.style.display = "none";
        grid.style.display = "block";
        grid.style.maxHeight = "55vh";

        // Render calendar grid interface
        drawCalendarGrid(grid);
    } else {
        if (searchWrapper) {
            searchWrapper.style.display = "flex";
            // Randomize suggestion every time the search bar appears
            if (!searchWrapper.dataset.randomized) {
                const teamKeys = Object.keys(teamData);
                const randomTeam = teamKeys[Math.floor(Math.random() * teamKeys.length)];
                const searchInput = document.getElementById("explorer-search");
                if (searchInput) {
                    searchInput.placeholder = `e.g. ${randomTeam}`;
                    searchInput.value = ""; // Clear on switch
                }
                searchWrapper.dataset.randomized = "true";
            }
        }
        grid.style.display = "grid";
        grid.style.maxHeight = "45vh";

        const query = searchVal.toLowerCase().trim();
        const sorted = [...worldCupGames].sort((x, y) => parseInt(x.id) - parseInt(y.id));
        let matchedCount = 0;

        sorted.forEach(game => {
            const hName = game.home_team_name_en;
            const aName = game.away_team_name_en;

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
    
    // Reset state & show
    toast.classList.remove("visible");
    toast.offsetHeight; // Reflow
    toast.classList.add("visible");
    
    // Fade out after exactly 2100ms so it is completely gone in 2500ms
    setTimeout(() => {
        toast.classList.remove("visible");
    }, 2100);
};

const drawCalendarGrid = (container) => {
    const wrapper = document.createElement("div");
    wrapper.className = "calendar-wrapper";

    wrapper.innerHTML = `
        <div class="calendar-month-title">June 2026 (IST)</div>
        <div class="calendar-grid">
            <div class="calendar-day-header">Sun</div>
            <div class="calendar-day-header">Mon</div>
            <div class="calendar-day-header">Tue</div>
            <div class="calendar-day-header">Wed</div>
            <div class="calendar-day-header">Thu</div>
            <div class="calendar-day-header">Fri</div>
            <div class="calendar-day-header">Sat</div>
            
            <!-- Week 1: June 1st is Monday, so Sunday is empty -->
            <div class="calendar-day-cell empty"></div>
            ${Array.from({ length: 30 }, (_, i) => {
                const day = i + 1;
                let classes = "calendar-day-cell";
                if (day < 12) {
                    classes += " inactive-date";
                } else {
                    // Check if there are matches played on this day in IST
                    const dateFullStr = `Jun ${day}, 2026`;
                    const hasMatches = worldCupGames.some(game => {
                        if (!game.local_date) return false;
                        const ist = formatToIST(game.local_date, game.stadium_id, game.id);
                        return ist.dateFull === dateFullStr;
                    });
                    if (hasMatches) {
                        classes += " active-matchday";
                    }
                }
                return `<div class="${classes}" data-day="${day}">${day}</div>`;
            }).join("")}
        </div>
    `;

    container.appendChild(wrapper);

    // Day cell click events
    wrapper.querySelectorAll(".calendar-day-cell:not(.empty)").forEach(cell => {
        cell.addEventListener("click", () => {
            const day = parseInt(cell.dataset.day);
            if (day < 12) {
                showWrongDateToast();
            } else {
                wrapper.querySelectorAll(".calendar-day-cell").forEach(c => c.classList.remove("selected-date"));
                cell.classList.add("selected-date");
                drawDayMatchesView(container, day);
            }
        });
    });
};

const drawDayMatchesView = (container, day) => {
    container.innerHTML = "";

    const dayMatchesWrapper = document.createElement("div");
    dayMatchesWrapper.className = "day-matches-wrapper";

    const dateFullStr = `Jun ${day}, 2026`;
    const displayDateStr = `June ${day}, 2026`;

    dayMatchesWrapper.innerHTML = `
        <div class="day-matches-header">
            <button type="button" class="day-back-btn" id="calendar-day-back-btn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                <span>Back to Calendar</span>
            </button>
            <span class="day-matches-title">Matches on ${displayDateStr}</span>
        </div>
        <div class="day-matches-list" style="display: flex; flex-direction: column; gap: 12px; overflow-y: auto; max-height: 40vh; padding-right: 4px;">
            <!-- Populated dynamically -->
        </div>
    `;

    container.appendChild(dayMatchesWrapper);
    const listContainer = dayMatchesWrapper.querySelector(".day-matches-list");

    // Filter matches played on this day in IST
    const dayMatches = worldCupGames.filter(game => {
        if (!game.local_date) return false;
        const ist = formatToIST(game.local_date, game.stadium_id, game.id);
        return ist.dateFull === dateFullStr;
    });

    if (dayMatches.length === 0) {
        listContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 30px; font-size: 13.5px;">No matches scheduled on this day.</div>`;
    } else {
        dayMatches.forEach(game => {
            const card = createExplorerMatchCard(game);
            listContainer.appendChild(card);
        });
    }

    document.getElementById("calendar-day-back-btn")?.addEventListener("click", () => {
        container.innerHTML = "";
        drawCalendarGrid(container);
    });
};

const createExplorerMatchCard = (game) => {
    const card = document.createElement("div");
    card.className = "live-match-card";
    card.style.cursor = "pointer";

    const state = liveStates[game.id];
    let scoreHome = game.home_score;
    let scoreAway = game.away_score;
    let isLive = game.finished === "FALSE" && game.time_elapsed !== "notstarted";
    let isFinished = game.finished === "TRUE";
    
    if (state) {
        scoreHome = state.scoreHome;
        scoreAway = state.scoreAway;
        isLive = !state.finished && game.finished === "FALSE" && game.time_elapsed !== "notstarted";
        isFinished = state.finished;
    }

    const scoreText = (isLive || isFinished) ? `${scoreHome} - ${scoreAway}` : "vs";
    const istTime = formatToIST(game.local_date, game.stadium_id || game.stadium, game.id);
    const timeDisplay = istTime.time;

    let badgeHTML = "";
    if (isLive) {
        const minVal = state ? state.minute : game.time_elapsed;
        badgeHTML = `<span class="match-status-badge live">Live - ${minVal}'</span>`;
    } else if (isFinished) {
        badgeHTML = `<span class="match-status-badge finished">Finished</span>`;
    } else {
        badgeHTML = `<span class="match-status-badge upcoming">Upcoming - ${timeDisplay}</span>`;
    }

    const hName = game.home_team_name_en;
    const aName = game.away_team_name_en;

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
        <div class="m-card-score-box" style="width: 50%; align-items: flex-end; justify-content: center; gap: 4px;">
            <span class="m-card-score" style="font-size: 15px;">${scoreText}</span>
            <span class="m-card-meta" style="margin-top: 2px; text-align: right; line-height: 1.3;">
                Group ${game.group || "Knockout"} • ${timeDisplay}<br>
                <small style="color: var(--text-muted); font-size: 8.5px;">🏟️ ${getStadiumName(game.stadium_id || game.stadium)}</small>
            </span>
            ${badgeHTML}
        </div>
    `;

    card.addEventListener("click", () => {
        openMatchDetailPopup(game);
    });

    return card;
};

const getBracketPlaceholderName = (matchId, isAway) => {
    const mappings = {
        "89": ["W74", "W77"],
        "90": ["W73", "W75"],
        "91": ["W76", "W78"],
        "92": ["W79", "W80"],
        "93": ["W83", "W84"], // Corrected pairings
        "94": ["W81", "W82"], // Corrected pairings
        "95": ["W85", "W86"],
        "96": ["W87", "W88"],
        "97": ["W89", "W90"],
        "98": ["W91", "W92"],
        "99": ["W93", "W94"],
        "100": ["W95", "W96"],
        "101": ["W97", "W98"],
        "102": ["W99", "W100"],
        "104": ["W101", "W102"],
        "103": ["L101", "L102"]
    };
    const pair = mappings[matchId];
    if (pair) return pair[isAway ? 1 : 0];
    return isAway ? "TBD" : "TBD";
};

const renderKnockoutBracket = (container) => {
    container.innerHTML = "";

    const bracketWrapper = document.createElement("div");
    bracketWrapper.className = "bracket-wrapper";

    const columnRounds = [
        { key: "r32", title: "Round of 32", className: "column-r32", ids: ["74", "77", "73", "75", "76", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88"] },
        { key: "r16", title: "Round of 16", className: "column-r16", ids: ["89", "90", "91", "92", "94", "93", "95", "96"] }, // Swapped 93 and 94 for visual alignment
        { key: "qf", title: "Quarter-finals", className: "column-qf", ids: ["97", "98", "99", "100"] },
        { key: "sf", title: "Semi-finals", className: "column-sf", ids: ["101", "102"] },
        { key: "final", title: "Finals", className: "column-final", ids: ["104"] } // Draw only 104 in standard list for centered connection lines
    ];

    const gamesMap = {};
    worldCupGames.forEach(g => {
        gamesMap[g.id] = g;
    });

    const buildNode = (game, index, customClass = "") => {
        const nodeClass = customClass || ((index % 2 === 0) ? "odd-node" : "even-node");
        const hName = game.home_team_name_en;
        const aName = game.away_team_name_en;

        const hasHome = hName && hName !== "undefined" && hName !== "null";
        const hasAway = aName && aName !== "undefined" && aName !== "null";
        const isUnresolved = !hasHome || !hasAway;

        const homeDisplayName = hasHome ? hName : getBracketPlaceholderName(game.id, false);
        const awayDisplayName = hasAway ? aName : getBracketPlaceholderName(game.id, true);

        let headerDate = "TBD";
        let headerStatus = "Upcoming";
        let statusClass = "";
        let upcomingFooterHTML = "";

        if (game.local_date) {
            const istTime = formatToIST(game.local_date, game.stadium_id, game.id);
            headerDate = istTime.date;
            headerStatus = istTime.time;
        }

        const state = liveStates[game.id];
        let scoreHome = "";
        let scoreAway = "";
        let isPlayed = false;
        let isLive = false;

        if (state) {
            scoreHome = state.scoreHome;
            scoreAway = state.scoreAway;
            isPlayed = state.finished;
            isLive = !state.finished && game.finished === "FALSE" && game.time_elapsed !== "notstarted";
        } else {
            scoreHome = game.finished === "TRUE" ? (parseInt(game.home_score) || 0) : "";
            scoreAway = game.finished === "TRUE" ? (parseInt(game.away_score) || 0) : "";
            isPlayed = game.finished === "TRUE";
        }

        if (isLive) {
            headerStatus = `Live - ${state ? state.minute : game.time_elapsed}'`;
            statusClass = "live-text";
        } else if (isPlayed) {
            headerStatus = "FT";
        } else {
            upcomingFooterHTML = `<div class="bracket-node-footer">Upcoming</div>`;
        }

        const hasPenalties = game.home_penalty_score !== undefined && 
                             game.home_penalty_score !== null && 
                             game.home_penalty_score !== "" && 
                             game.home_penalty_score !== "null" &&
                             game.away_penalty_score !== undefined &&
                             game.away_penalty_score !== null &&
                             game.away_penalty_score !== "" &&
                             game.away_penalty_score !== "null";
        const homeScoreText = isPlayed ? (hasPenalties ? `${scoreHome} (${game.home_penalty_score})` : scoreHome) : "";
        const awayScoreText = isPlayed ? (hasPenalties ? `${scoreAway} (${game.away_penalty_score})` : scoreAway) : "";

        let homeClass = "";
        let awayClass = "";
        if (isPlayed) {
            const intHome = parseInt(scoreHome) || 0;
            const intAway = parseInt(scoreAway) || 0;
            if (intHome > intAway) {
                homeClass = "winner";
                awayClass = "loser";
            } else if (intAway > intHome) {
                awayClass = "winner";
                homeClass = "loser";
            } else if (hasPenalties) {
                const penH = parseInt(game.home_penalty_score) || 0;
                const penA = parseInt(game.away_penalty_score) || 0;
                if (penH > penA) {
                    homeClass = "winner";
                    awayClass = "loser";
                } else {
                    awayClass = "winner";
                    homeClass = "loser";
                }
            }
        }

        const shieldIcon = `<svg class="flag-placeholder-shield" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
        const homeFlagHTML = hasHome ? getWcTeamFlagHTML(hName, "bracket-team-flag") : shieldIcon;
        const awayFlagHTML = hasAway ? getWcTeamFlagHTML(aName, "bracket-team-flag") : shieldIcon;

        const node = document.createElement("div");
        node.className = `bracket-match-node ${nodeClass}`;
        node.dataset.matchId = game.id;
        node.dataset.unresolved = isUnresolved;

        node.innerHTML = `
            <div class="bracket-match-header">
                <span class="bracket-header-date">${headerDate}</span>
                <span class="bracket-header-status ${statusClass}">${headerStatus}</span>
            </div>
            <div class="bracket-match-teams">
                <div class="bracket-team-row ${homeClass}">
                    <div class="bracket-team-info">
                        ${homeFlagHTML}
                        <span>${homeDisplayName}</span>
                    </div>
                    <span class="bracket-team-score">${homeScoreText}</span>
                </div>
                <div class="bracket-team-row ${awayClass}">
                    <div class="bracket-team-info">
                        ${awayFlagHTML}
                        <span>${awayDisplayName}</span>
                    </div>
                    <span class="bracket-team-score">${awayScoreText}</span>
                </div>
            </div>
            ${upcomingFooterHTML}
        `;

        return node;
    };

    columnRounds.forEach(round => {
        const col = document.createElement("div");
        col.className = `bracket-column ${round.className}`;

        const colHeader = document.createElement("div");
        colHeader.className = "bracket-round-title";
        colHeader.textContent = round.title;
        col.appendChild(colHeader);

        round.ids.forEach((matchId, index) => {
            const game = gamesMap[matchId];
            if (!game) return;
            const node = buildNode(game, index);
            col.appendChild(node);
        });

        if (round.key === "final") {
            const game103 = gamesMap["103"];
            if (game103) {
                const divider = document.createElement("div");
                divider.className = "bracket-third-place-title";
                divider.textContent = "Third Place Match";
                col.appendChild(divider);

                const node103 = buildNode(game103, 1, "third-place-node");
                col.appendChild(node103);
            }
        }

        bracketWrapper.appendChild(col);
    });

    container.appendChild(bracketWrapper);
};

export const setupLiveArenaListeners = () => {
    // Actions stack buttons
    document.getElementById("explore-all-btn")?.addEventListener("click", openExplorer);
    document.getElementById("explore-bracket-btn")?.addEventListener("click", openBracket);
    document.getElementById("explore-standings-btn")?.addEventListener("click", openGroups);

    // Explorer Results Overlay
    document.getElementById("explorer-close")?.addEventListener("click", closeExplorer);
    document.getElementById("explorer-overlay")?.addEventListener("click", (e) => {
        if (e.target === document.getElementById("explorer-overlay")) closeExplorer();
    });

    const searchInput = document.getElementById("explorer-search");
    searchInput?.addEventListener("input", (e) => {
        const activeTab = document.querySelector("#explorer-filter-tabs .filter-btn.active");
        const activeTabName = activeTab ? activeTab.dataset.tab : "calendar";
        filterExplorerGames(activeTabName, e.target.value);
    });

    document.getElementById("explorer-filter-tabs")?.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        document.querySelectorAll("#explorer-filter-tabs .filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const tabName = btn.dataset.tab;
        
        const searchWrapper = document.getElementById("explorer-search-wrapper");
        if (searchWrapper) {
            delete searchWrapper.dataset.randomized;
        }

        const query = document.getElementById("explorer-search")?.value || "";
        filterExplorerGames(tabName, query);
    });

    // Dedicated Bracket Overlay
    document.getElementById("bracket-close")?.addEventListener("click", closeBracket);
    document.getElementById("bracket-overlay")?.addEventListener("click", (e) => {
        if (e.target === document.getElementById("bracket-overlay")) closeBracket();
    });

    document.getElementById("bracket-games-grid")?.addEventListener("click", (e) => {
        const node = e.target.closest(".bracket-match-node");
        if (!node) return;

        const matchId = node.dataset.matchId;
        const isUnresolved = node.dataset.unresolved === "true";
        const game = worldCupGames.find(g => g.id === matchId);

        if (isUnresolved) {
            node.classList.add("shake-node");
            node.querySelectorAll(".bracket-tooltip").forEach(t => t.remove());

            const tooltip = document.createElement("div");
            tooltip.className = "bracket-tooltip";
            tooltip.textContent = "Match Not Set";
            node.appendChild(tooltip);

            setTimeout(() => {
                node.classList.remove("shake-node");
            }, 350);

            setTimeout(() => {
                tooltip.remove();
            }, 1500);
        } else {
            if (game) {
                openMatchDetailPopup(game);
            }
        }
    });

    // Dedicated Standings Overlay
    document.getElementById("groups-close")?.addEventListener("click", closeGroups);
    document.getElementById("groups-overlay")?.addEventListener("click", (e) => {
        if (e.target === document.getElementById("groups-overlay")) closeGroups();
    });

    // Match Detail Popup Close
    document.getElementById("match-detail-close")?.addEventListener("click", closeMatchDetail);
    document.getElementById("match-detail-overlay")?.addEventListener("click", (e) => {
        if (e.target === document.getElementById("match-detail-overlay")) closeMatchDetail();
    });

    // Live Center Tab Switcher
    document.getElementById("console-tabs-nav")?.addEventListener("click", (e) => {
        const btn = e.target.closest(".console-tab-btn");
        if (!btn) return;
        document.querySelectorAll(".console-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const activeTab = btn.dataset.tab;
        document.querySelectorAll(".console-tab-content").forEach(c => {
            if (c.id === `console-tab-${activeTab}`) {
                c.classList.remove("hidden");
                c.classList.add("active");
            } else {
                c.classList.add("hidden");
                c.classList.remove("active");
            }
        });
    });
};
