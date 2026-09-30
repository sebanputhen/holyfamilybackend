import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/database';
import { Koottayma, Family, Person, Parish } from '../models';
import { loadParishDirectory, ParsedDirectoryRecord } from './directoryParser';

import { AUTHENTIC_KOOTTAYMAS } from './koottaymaDirectoryData';

export async function importParishDirectory(): Promise<{ importedCount: number; groupsCount: number }> {
  console.log('--- Importing Authentic Parish Directory Records ---');
  const records = loadParishDirectory();
  if (records.length === 0) {
    console.warn('No directory records found in CSV.');
    return { importedCount: 0, groupsCount: 0 };
  }

  // 1. Group records by unit
  const grouped = new Map<string, ParsedDirectoryRecord[]>();
  for (const r of records) {
    const list = grouped.get(r.group) || [];
    list.push(r);
    grouped.set(r.group, list);
  }

  console.log(`Found ${records.length} family entries across ${grouped.size} Koottayma units.`);

  // 2. Ensure each Koottayma unit exists with authentic directory names
  const koottaymaMap = new Map<string, any>();

  // Fetch existing Koottaymas
  const existingKoottaymas = await Koottayma.find({});
  for (const k of existingKoottaymas) {
    koottaymaMap.set(String(k.number), k);
  }

  for (const [groupName, groupRecords] of grouped.entries()) {
    const meta = AUTHENTIC_KOOTTAYMAS[groupName];
    const firstHead = groupRecords[0]?.headOfFamily || 'Unit Coordinator';
    const firstPhone = groupRecords[0]?.phone1 || '+91 98000 00000';

    const displayName = meta ? meta.nameEn : `Koottayma Unit ${groupName}`;
    const nameMl = meta ? meta.nameMl : `കൂട്ടായ്മ ${groupName}`;
    const patronSaint = meta ? meta.patronSaint : 'St. Mary';
    const feastDate = meta ? meta.feastDate : '';
    const location = meta ? meta.location : 'Rotating Family Residences';
    const zone = meta ? meta.zone : 'Parish Zone';
    const totalHouses = meta ? meta.totalHouses : groupRecords.length;

    let kDoc = koottaymaMap.get(groupName);
    if (!kDoc) {
      kDoc = await Koottayma.create({
        name: displayName,
        nameMl,
        number: groupName,
        unitCode: groupName,
        patronSaint,
        feastDate,
        location,
        zone,
        totalHouses,
        leader: firstHead,
        leaderPhone: firstPhone,
        meetingLocation: location || 'Rotating Family Residences',
        meetingDay: 'Sunday',
        meetingTime: '05:00 PM',
        description: `${zone} • ${location} • Feast: ${feastDate}`,
        status: 'Active',
      });
      koottaymaMap.set(groupName, kDoc);
    } else {
      kDoc.name = displayName;
      kDoc.nameMl = nameMl;
      kDoc.patronSaint = patronSaint;
      kDoc.feastDate = feastDate;
      kDoc.location = location;
      kDoc.zone = zone;
      kDoc.totalHouses = totalHouses;
      kDoc.description = `${zone} • ${location} • Feast: ${feastDate}`;
      await kDoc.save();
      koottaymaMap.set(groupName, kDoc);
    }
  }

  // 3. High-performance batch upsert of Families via bulkWrite (under 1 second)
  console.log(`Bulk writing ${records.length} families into parish directory...`);
  const bulkOps = records.map((r) => {
    const kDoc = koottaymaMap.get(r.group);
    const familyId = `FAM-${String(r.no).padStart(4, '0')}`;

    return {
      updateOne: {
        filter: { familyId },
        update: {
          $set: {
            familyId,
            houseName: r.houseName,
            familyName: r.houseName,
            headOfFamily: r.headOfFamily,
            address: `${r.houseName}, Unit ${r.group}${r.page ? ', Page ' + r.page : ''}, St. Mary's Forane Parish`,
            phone1: r.phone1 || '+91 90000 00000',
            phone2: r.phone2 || '',
            email: '',
            koottaymaId: kDoc ? kDoc._id : existingKoottaymas[0]?._id,
            koottaymaName: kDoc ? kDoc.name : (existingKoottaymas[0]?.name || 'General Unit'),
            status: 'Active',
            notes: `Match: ${r.matchQuality || 'Standard'}${r.page ? ' | Directory Page: ' + r.page : ''}`,
            privacy: {
              isPhone1Visible: true,
              isPhone2Visible: true,
              isEmailVisible: true,
              isAddressVisible: true,
              optOutOfDirectory: false,
            },
          },
        },
        upsert: true,
      },
    };
  });

  await Family.bulkWrite(bulkOps as any, { ordered: false });
  const importedCount = records.length;

  // Update parish statistics
  const totalFamilies = await Family.countDocuments();
  const totalKoottaymas = await Koottayma.countDocuments();
  await Parish.findOneAndUpdate(
    {},
    {
      $set: {
        totalFamiliesCount: totalFamilies,
        totalKoottaymasCount: totalKoottaymas,
      },
    }
  );

  console.log(`Directory Import Complete: ${importedCount} families imported across ${koottaymaMap.size} Koottaymas.`);
  return { importedCount, groupsCount: koottaymaMap.size };
}

// Standalone execution wrapper
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      const res = await importParishDirectory();
      console.log('Result:', res);
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('Directory Import Failed:', err);
      process.exit(1);
    }
  })();
}
