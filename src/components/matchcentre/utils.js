import { teamData } from '../data/teams.js';

export const OFFICIAL_IST_MAP = {
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

export const formatToIST = (localDateStr, stadiumId = null, gameId = null) => {
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

export const normalizeTeamName = (name) => {
    if (!name) return "";
    const clean = name.trim();
    if (clean === "United States") return "USA";
    if (clean === "Czech Republic") return "Czechia";
    if (clean === "Democratic Republic of the Congo") return "DR Congo";
    return clean;
};

export const getTeamData = (name) => {
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

export const ADDITIONAL_FLAGS = {
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

export const getStadiumName = (stadiumId) => {
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
