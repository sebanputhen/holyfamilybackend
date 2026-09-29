import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/database';
import { Koottayma, Family, Person, Parish } from '../models';
import { loadParishDirectory, ParsedDirectoryRecord } from './directoryParser';

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

  // 2. Ensure each Koottayma unit exists
  const koottaymaMap = new Map<string, any>();

  // Fetch existing Koottaymas
  const existingKoottaymas = await Koottayma.find({});
  for (const k of existingKoottaymas) {
    koottaymaMap.set(String(k.number), k);
  }

  for (const [groupName, groupRecords] of grouped.entries()) {
    let kDoc = koottaymaMap.get(groupName);
    if (!kDoc) {
      const firstHead = groupRecords[0]?.headOfFamily || 'Unit Coordinator';
      const firstPhone = groupRecords[0]?.phone1 || '+91 98000 00000';

      let displayName = `Koottayma Unit ${groupName}`;
      let patronSaint = "St. Mary";

      if (groupName === '1') {
        displayName = 'St. Thomas Koottayma (Unit 1)';
        patronSaint = 'St. Thomas the Apostle';
      } else if (groupName === '2') {
        displayName = 'St. Joseph Koottayma (Unit 2)';
        patronSaint = 'St. Joseph';
      } else if (groupName === '3A' || groupName === '3') {
        displayName = `Holy Family Koottayma (Unit ${groupName})`;
        patronSaint = 'Holy Family';
      } else if (groupName === '3B' || groupName === '4') {
        displayName = `St. Alphonsa Koottayma (Unit ${groupName})`;
        patronSaint = 'St. Alphonsa';
      } else if (groupName === '4A') {
        displayName = 'St. Antony Koottayma (Unit 4A)';
        patronSaint = 'St. Antony of Padua';
      } else if (groupName === '4B') {
        displayName = 'St. George Koottayma (Unit 4B)';
        patronSaint = 'St. George';
      } else if (groupName === '5A') {
        displayName = 'St. Jude Koottayma (Unit 5A)';
        patronSaint = 'St. Jude';
      } else if (groupName === '5B') {
        displayName = 'St. Sebastian Koottayma (Unit 5B)';
        patronSaint = 'St. Sebastian';
      } else if (groupName === '6A') {
        displayName = 'Mother Teresa Koottayma (Unit 6A)';
        patronSaint = 'St. Teresa of Calcutta';
      } else if (groupName === '6B') {
        displayName = 'Little Flower Koottayma (Unit 6B)';
        patronSaint = 'St. Therese of Lisieux';
      } else if (groupName === '7A') {
        displayName = 'St. Francis Koottayma (Unit 7A)';
        patronSaint = 'St. Francis of Assisi';
      } else if (groupName === '7B') {
        displayName = 'St. Paul Koottayma (Unit 7B)';
        patronSaint = 'St. Paul the Apostle';
      }

      kDoc = await Koottayma.create({
        name: displayName,
        number: groupName,
        unitCode: groupName,
        patronSaint,
        leader: firstHead,
        leaderPhone: firstPhone,
        meetingLocation: 'Rotating Family Residences',
        meetingDay: 'Sunday',
        meetingTime: '05:00 PM',
        description: `Koottayma prayer and pastoral unit for Group ${groupName}, St. Mary's Forane Parish.`,
        status: 'Active',
      });
      koottaymaMap.set(groupName, kDoc);
    }
  }

  // 3. Batch import / upsert Families
  console.log(`Upserting ${records.length} families into parish directory...`);
  let importedCount = 0;

  for (const r of records) {
    const kDoc = koottaymaMap.get(r.group);
    const familyId = `FAM-${String(r.no).padStart(4, '0')}`;

    const familyData: any = {
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
    };

    const famDoc = await Family.findOneAndUpdate(
      { familyId },
      { $set: familyData },
      { upsert: true, new: true }
    );

    // Create Head of Family Person record if not exists
    const pDoc = await Person.findOneAndUpdate(
      { familyId: famDoc._id, relationship: 'Head' },
      {
        $set: {
          familyId: famDoc._id,
          name: r.headOfFamily,
          gender: 'Male',
          relationship: 'Head',
          phone: r.phone1 || '',
          familyName: famDoc.familyName,
          koottaymaId: famDoc.koottaymaId,
          parish: famDoc.parish,
          status: 'Active',
          privacy: {
            isPhoneVisible: true,
            isEmailVisible: true,
            isDobVisible: true,
            isOccupationVisible: true,
          },
        },
      },
      { upsert: true, new: true }
    );

    if (!famDoc.headPersonId) {
      famDoc.headPersonId = pDoc._id as any;
      await famDoc.save();
    }

    importedCount++;
  }

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
