"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCSVLine = parseCSVLine;
exports.loadParishDirectory = loadParishDirectory;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        }
        else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        }
        else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}
function loadParishDirectory() {
    const csvPath = path_1.default.join(__dirname, 'parish_directory_raw.csv');
    if (!fs_1.default.existsSync(csvPath)) {
        console.warn('Parish directory CSV not found at:', csvPath);
        return [];
    }
    const content = fs_1.default.readFileSync(csvPath, 'utf8');
    const lines = content.split(/\r?\n/);
    const records = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line)
            continue;
        // Check if we hit the second table header
        if (line.startsWith('Page,Entry#')) {
            break;
        }
        const fields = parseCSVLine(line);
        if (fields.length < 4)
            continue;
        const no = parseInt(fields[0], 10);
        if (isNaN(no))
            continue;
        const houseName = fields[1]?.replace(/^"|"$/g, '').trim() || 'Unknown House';
        const headOfFamily = fields[2]?.replace(/^"|"$/g, '').trim() || 'Family Head';
        const group = fields[3]?.trim() || 'General';
        const page = fields[4]?.trim() || '';
        const phone1Raw = fields[5]?.trim() || '';
        const phone2Raw = fields[6]?.trim() || '';
        const matchQuality = fields[7]?.trim() || '';
        // Format phone with Indian country prefix if 10 digits
        const formatPhone = (p) => {
            const clean = p.replace(/\D/g, '');
            if (clean.length === 10) {
                return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
            }
            return p;
        };
        records.push({
            no,
            houseName,
            headOfFamily,
            group,
            page,
            phone1: formatPhone(phone1Raw),
            phone2: phone2Raw ? formatPhone(phone2Raw) : '',
            matchQuality,
        });
    }
    return records;
}
