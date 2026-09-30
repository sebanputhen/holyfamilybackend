import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Family } from '../models/Family';
import { Koottayma } from '../models/Koottayma';
import { Parish } from '../models/Parish';
import { runSeed } from '../seeds/seed';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

// GET /api/v1/setup/status - Inspect database health, collections, and record counts
router.get('/status', async (req: Request, res: Response) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    let counts = {
      families: 0,
      koottaymas: 0,
      users: 0,
      parishes: 0,
    };

    if (isConnected) {
      const [fCount, kCount, uCount, pCount] = await Promise.all([
        Family.countDocuments().catch(() => 0),
        Koottayma.countDocuments().catch(() => 0),
        User.countDocuments().catch(() => 0),
        Parish.countDocuments().catch(() => 0),
      ]);
      counts = {
        families: fCount,
        koottaymas: kCount,
        users: uCount,
        parishes: pCount,
      };
    }

    return sendSuccess(res, {
      database: isConnected ? 'connected' : 'disconnected',
      readyState: mongoose.connection.readyState,
      counts,
      isSeeded: counts.families >= 1000,
      instructions: counts.families < 1000
        ? 'Database is connected but directory is empty. Call POST or GET /api/v1/setup/seed to seed 1,173 families & 55 Koottaymas.'
        : 'Database is fully populated and production ready.',
    }, 'Database setup status retrieved');
  } catch (error: any) {
    return sendError(res, error.message, 'SETUP_STATUS_FAILED', 500);
  }
});

// GET & POST /api/v1/setup/seed - One-click seed for cloud deployments (Vercel / MongoDB Atlas)
const handleSeed = async (req: Request, res: Response) => {
  try {
    const userCount = await User.countDocuments();
    const familyCount = await Family.countDocuments();

    // Allow seed if database is empty or force parameter provided
    const force = req.query.force === 'true' || req.body?.force === true;

    if (userCount > 0 && familyCount >= 1000 && !force) {
      return sendSuccess(res, {
        families: familyCount,
        users: userCount,
        message: 'Database is already seeded with authentic parish directory. Use ?force=true to re-seed.',
      }, 'Database already seeded');
    }

    console.log('--- Triggering Web/Serverless Database Seeding ---');
    await runSeed();

    const newFamilyCount = await Family.countDocuments();
    const newKoottaymaCount = await Koottayma.countDocuments();
    const newUserCount = await User.countDocuments();

    return sendSuccess(res, {
      families: newFamilyCount,
      koottaymas: newKoottaymaCount,
      users: newUserCount,
      sampleLogins: {
        superadmin: 'phone: +919800000001 | password: Password@123',
        admin: 'phone: +919800000002 | password: Password@123',
        leader: 'phone: +919800000003 | password: Password@123',
        parishioner: 'phone: +919800000004 | password: Password@123',
      },
    }, 'Catholic Forane Parish database seeded successfully with 1,173 families across 55 Koottaymas!');
  } catch (error: any) {
    console.error('Web/Serverless Seed Failed:', error);
    return sendError(res, `Seeding failed: ${error.message}`, 'SEED_FAILED', 500);
  }
};

// GET & POST /api/v1/setup/seed-koottaymas - Fast 55-unit metadata sync (under 2 seconds)
const handleSeedKoottaymas = async (req: Request, res: Response) => {
  try {
    const { AUTHENTIC_KOOTTAYMAS } = await import('../seeds/koottaymaDirectoryData');
    console.log('--- Fast-Syncing 55 Authentic Koottaymas ---');
    const updatedUnits = [];

    for (const [unitCode, meta] of Object.entries(AUTHENTIC_KOOTTAYMAS)) {
      const doc = await Koottayma.findOneAndUpdate(
        { number: unitCode },
        {
          $set: {
            name: meta.nameEn,
            nameMl: meta.nameMl,
            number: unitCode,
            unitCode: unitCode,
            patronSaint: meta.patronSaint,
            feastDate: meta.feastDate,
            location: meta.location,
            zone: meta.zone,
            totalHouses: meta.totalHouses,
            description: `${meta.zone} • ${meta.location} • Feast: ${meta.feastDate}`,
            meetingLocation: meta.location || 'Rotating Family Residences',
            meetingDay: 'Sunday',
            meetingTime: '05:00 PM',
            status: 'Active',
          },
          $setOnInsert: {
            leader: 'Unit Coordinator',
            leaderPhone: '+91 98000 00000',
          },
        },
        { upsert: true, new: true }
      );
      updatedUnits.push({
        unit: unitCode,
        name: doc.name,
        nameMl: doc.nameMl,
        patronSaint: doc.patronSaint,
        zone: doc.zone,
        location: doc.location,
        feastDate: doc.feastDate,
        houses: doc.totalHouses,
      });
    }

    // Update family records with new authentic Koottayma names
    const koottaymaDocs = await Koottayma.find({});
    const bulkFamilyOps = koottaymaDocs.map((k) => ({
      updateMany: {
        filter: { koottaymaId: k._id },
        update: { $set: { koottaymaName: k.name } },
      },
    }));
    if (bulkFamilyOps.length > 0) {
      await Family.bulkWrite(bulkFamilyOps);
    }

    return sendSuccess(res, {
      count: updatedUnits.length,
      units: updatedUnits,
    }, 'All 55 authentic Koottaymas successfully updated with Malayalam names, patron saints, feast dates, and biblical zones!');
  } catch (error: any) {
    console.error('Koottayma Seed Failed:', error);
    return sendError(res, `Koottayma fast seed failed: ${error.message}`, 'SEED_KOOTTAYMAS_FAILED', 500);
  }
};

router.get('/seed', handleSeed);
router.post('/seed', handleSeed);
router.get('/seed-koottaymas', handleSeedKoottaymas);
router.post('/seed-koottaymas', handleSeedKoottaymas);

export default router;
