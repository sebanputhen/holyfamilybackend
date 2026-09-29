"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeFamily = sanitizeFamily;
exports.sanitizePerson = sanitizePerson;
const Role_1 = require("../models/Role");
function sanitizeFamily(family, user) {
    const isSuperAdmin = user?.role === Role_1.UserRole.SUPER_ADMIN;
    const isAdmin = user?.role === Role_1.UserRole.ADMIN;
    const isLeaderOfThisKoottayma = user?.role === Role_1.UserRole.KOOTTAYMA_LEADER &&
        user?.assignedKoottayma?.toString() === family.koottaymaId?.toString();
    const isOwnFamily = user?.familyId?.toString() === family._id?.toString();
    const hasFullAccess = isSuperAdmin || isAdmin || isOwnFamily;
    const hasLeaderAccess = isLeaderOfThisKoottayma;
    // Directory Opt-out check for normal parishioners
    if (family.privacy?.optOutOfDirectory && !hasFullAccess && !hasLeaderAccess) {
        return null; // completely hidden from directory
    }
    const famObj = family.toObject ? family.toObject() : { ...family };
    // Masking based on privacy settings
    const phone1 = hasFullAccess || hasLeaderAccess || famObj.privacy?.isPhone1Visible
        ? famObj.phone1
        : (famObj.phone1 ? famObj.phone1.replace(/\d(?=\d{3})/g, '*') : '');
    const phone2 = hasFullAccess || hasLeaderAccess || famObj.privacy?.isPhone2Visible
        ? (famObj.phone2 || '')
        : (famObj.phone2 ? famObj.phone2.replace(/\d(?=\d{3})/g, '*') : '');
    const email = hasFullAccess || hasLeaderAccess || famObj.privacy?.isEmailVisible
        ? famObj.email
        : undefined;
    const address = hasFullAccess || hasLeaderAccess || famObj.privacy?.isAddressVisible
        ? famObj.address
        : undefined;
    const notes = hasFullAccess ? famObj.notes : undefined;
    return {
        _id: famObj._id,
        familyId: famObj.familyId,
        houseName: famObj.houseName,
        familyName: famObj.familyName,
        headOfFamily: famObj.headOfFamily,
        koottaymaId: famObj.koottaymaId,
        koottaymaName: famObj.koottaymaName,
        phone1: phone1 || '',
        phone2: phone2 || '',
        email,
        address,
        area: famObj.area,
        city: famObj.city,
        district: famObj.district,
        state: famObj.state,
        pincode: famObj.pincode,
        parish: famObj.parish,
        status: famObj.status,
        notes,
        members: famObj.members,
    };
}
function sanitizePerson(person, user) {
    const isSuperAdmin = user?.role === Role_1.UserRole.SUPER_ADMIN;
    const isAdmin = user?.role === Role_1.UserRole.ADMIN;
    const isLeaderOfThisKoottayma = user?.role === Role_1.UserRole.KOOTTAYMA_LEADER &&
        user?.assignedKoottayma?.toString() === person.koottaymaId?.toString();
    const isOwnPerson = user?.personId?.toString() === person._id?.toString();
    const hasFullAccess = isSuperAdmin || isAdmin || isOwnPerson;
    const hasLeaderAccess = isLeaderOfThisKoottayma;
    const pObj = person.toObject ? person.toObject() : { ...person };
    const phone = hasFullAccess || hasLeaderAccess || pObj.privacy?.isPhoneVisible
        ? pObj.phone
        : (pObj.phone ? pObj.phone.replace(/\d(?=\d{3})/g, '*') : '');
    const email = hasFullAccess || hasLeaderAccess || pObj.privacy?.isEmailVisible
        ? pObj.email
        : undefined;
    const dateOfBirth = hasFullAccess || hasLeaderAccess || pObj.privacy?.isDobVisible
        ? pObj.dateOfBirth
        : undefined;
    const occupation = hasFullAccess || hasLeaderAccess || pObj.privacy?.isOccupationVisible
        ? pObj.occupation
        : undefined;
    return {
        _id: pObj._id,
        name: pObj.name,
        baptismName: pObj.baptismName,
        gender: pObj.gender,
        relationship: pObj.relationship,
        familyId: pObj.familyId,
        familyName: pObj.familyName,
        koottaymaId: pObj.koottaymaId,
        parish: pObj.parish,
        status: pObj.status,
        phone: phone || '',
        email,
        dateOfBirth,
        occupation,
        education: hasFullAccess || hasLeaderAccess ? pObj.education : undefined,
        photoUrl: pObj.photoUrl,
    };
}
