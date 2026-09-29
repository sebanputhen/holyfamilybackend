import fs from 'fs';
import path from 'path';

export interface ParsedDirectoryRecord {
  no: number;
  houseName: string;
  headOfFamily: string;
  group: string;
  page: string;
  phone1: string;
  phone2: string;
  matchQuality: string;
}

export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function loadParishDirectory(): ParsedDirectoryRecord[] {
  const csvPath = path.join(__dirname, 'parish_directory_raw.csv');
  if (!fs.existsSync(csvPath)) {
    console.warn('Parish directory CSV not found at:', csvPath);
    return [];
  }

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split(/\r?\n/);
  const records: ParsedDirectoryRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    // Check if we hit the second table header
    if (line.startsWith('Page,Entry#')) {
      break;
    }

    const fields = parseCSVLine(line);
    if (fields.length < 4) continue;

    const no = parseInt(fields[0], 10);
    if (isNaN(no)) continue;

    const houseName = fields[1]?.replace(/^"|"$/g, '').trim() || 'Unknown House';
    const headOfFamily = fields[2]?.replace(/^"|"$/g, '').trim() || 'Family Head';
    const group = fields[3]?.trim() || 'General';
    const page = fields[4]?.trim() || '';
    const phone1Raw = fields[5]?.trim() || '';
    const phone2Raw = fields[6]?.trim() || '';
    const matchQuality = fields[7]?.trim() || '';

    // Format phone with Indian country prefix if 10 digits
    const formatPhone = (p: string) => {
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
