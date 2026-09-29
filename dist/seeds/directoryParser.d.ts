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
export declare function parseCSVLine(line: string): string[];
export declare function loadParishDirectory(): ParsedDirectoryRecord[];
