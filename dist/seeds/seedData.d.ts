import { UserRole } from '../models/Role';
export declare const rolesSeed: {
    name: UserRole;
    description: string;
    permissions: string[];
}[];
export declare const parishSeed: {
    name: string;
    logoUrl: string;
    patronSaint: string;
    diocese: string;
    forane: string;
    address: string;
    establishedYear: number;
    parishFeast: string;
    currentParishPriest: {
        name: string;
        phone: string;
        photoUrl: string;
        serviceStartDate: Date;
    };
    assistantPriests: {
        name: string;
        phone: string;
        photoUrl: string;
        serviceStartDate: Date;
    }[];
    totalFamiliesCount: number;
    totalParishionersCount: number;
    totalKoottaymasCount: number;
    institutions: {
        name: string;
        type: string;
        description: string;
    }[];
    officeInfo: {
        phone: string;
        email: string;
        officeHours: string;
        address: string;
        mapLocation: {
            latitude: number;
            longitude: number;
            googleMapsUrl: string;
        };
        website: string;
        socialMedia: {
            facebook: string;
            youtube: string;
            instagram: string;
            whatsapp: string;
        };
    };
    welcomeMessage: {
        en: string;
        ml: string;
    };
};
export declare const koottaymasSeed: {
    name: string;
    number: number;
    patronSaint: string;
    leader: string;
    leaderPhone: string;
    assistantLeader: string;
    assistantLeaderPhone: string;
    meetingLocation: string;
    meetingDay: string;
    meetingTime: string;
    description: string;
    status: string;
}[];
