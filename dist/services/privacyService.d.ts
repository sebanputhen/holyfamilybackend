import { IUser } from '../models/User';
export interface SanitizedFamily {
    _id: any;
    familyId: string;
    houseName: string;
    familyName: string;
    headOfFamily: string;
    koottaymaId: any;
    koottaymaName: string;
    phone1: string;
    phone2: string;
    email?: string;
    address?: string;
    area?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
    parish: string;
    status: string;
    notes?: string;
    members?: any[];
}
export declare function sanitizeFamily(family: any, user?: IUser): SanitizedFamily | null;
export declare function sanitizePerson(person: any, user?: IUser): any;
