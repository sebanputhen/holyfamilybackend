"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeed = runSeed;
const database_1 = require("../config/database");
const models_1 = require("../models");
const seedData_1 = require("./seedData");
const importDirectory_1 = require("./importDirectory");
async function runSeed() {
    console.log('--- Starting Comprehensive Catholic Forane Parish Database Seeding ---');
    // 1. Roles
    console.log('Seeding Roles & Permissions...');
    for (const r of seedData_1.rolesSeed) {
        await models_1.Role.findOneAndUpdate({ name: r.name }, { $set: r }, { upsert: true, new: true });
    }
    // 2. Parish
    console.log('Seeding Parish Identity...');
    await models_1.Parish.deleteMany({});
    const parish = await models_1.Parish.create(seedData_1.parishSeed);
    // 3. Koottaymas
    console.log('Seeding Koottaymas...');
    await models_1.Koottayma.deleteMany({});
    const createdKoottaymas = [];
    for (const k of seedData_1.koottaymasSeed) {
        const doc = await models_1.Koottayma.create(k);
        createdKoottaymas.push(doc);
    }
    // 4. Families (Primary fields strictly: Family (House Name) | Head of Family | Koottayma | Phone 1 | Phone 2)
    console.log('Seeding 12 Families...');
    await models_1.Family.deleteMany({});
    await models_1.Person.deleteMany({});
    const familiesData = [
        {
            familyId: 'FAM-1001',
            houseName: 'Pulivelil House',
            familyName: 'Pulivelil',
            headOfFamily: 'Baby John Pulivelil',
            address: 'Pulivelil, Church Road, Panampilly Nagar, Kochi',
            phone1: '+91 98470 11001',
            phone2: '+91 94470 11002',
            email: 'baby.pulivelil@gmail.com',
            koottaymaId: createdKoottaymas[0]._id,
            koottaymaName: createdKoottaymas[0].name,
            status: 'Active',
            privacy: { isPhone1Visible: true, isPhone2Visible: true, isEmailVisible: true, isAddressVisible: true, optOutOfDirectory: false },
            members: [
                { name: 'Baby John Pulivelil', baptismName: 'Yohannan', gender: 'Male', relationship: 'Head', occupation: 'Chartered Accountant', phone: '+91 98470 11001', dateOfBirth: new Date('1968-04-12') },
                { name: 'Rosily Baby', baptismName: 'Rosa', gender: 'Female', relationship: 'Spouse', occupation: 'High School Teacher', phone: '+91 94470 11002', dateOfBirth: new Date('1972-08-25') },
                { name: 'Alwin John', baptismName: 'Alphonse', gender: 'Male', relationship: 'Son', occupation: 'Software Engineer', phone: '+91 98470 11003', dateOfBirth: new Date('1998-11-04') },
                { name: 'Anu Mary', baptismName: 'Mariam', gender: 'Female', relationship: 'Daughter', occupation: 'Medical Student (MBBS)', phone: '+91 98470 11004', dateOfBirth: new Date('2002-06-18') },
            ],
        },
        {
            familyId: 'FAM-1002',
            houseName: 'Thoppil House',
            familyName: 'Thoppil',
            headOfFamily: 'Dominic Thoppil',
            address: 'Thoppil Villa, Metro Pillar 812, Girinagar, Kochi',
            phone1: '+91 98470 44001',
            phone2: '+91 94470 44002',
            email: 'thoppildominic@outlook.com',
            koottaymaId: createdKoottaymas[3]._id,
            koottaymaName: createdKoottaymas[3].name,
            status: 'Active',
            privacy: { isPhone1Visible: true, isPhone2Visible: true, isEmailVisible: false, isAddressVisible: true, optOutOfDirectory: false },
            members: [
                { name: 'Dominic Thoppil', baptismName: 'Dominic Savio', gender: 'Male', relationship: 'Head', occupation: 'Civil Contractor', phone: '+91 98470 44001', dateOfBirth: new Date('1965-01-15') },
                { name: 'Annamma Dominic', baptismName: 'Anna', gender: 'Female', relationship: 'Spouse', occupation: 'Homemaker', phone: '+91 94470 44002', dateOfBirth: new Date('1970-03-30') },
                { name: 'Fr. George Thoppil', baptismName: 'Geevarghese', gender: 'Male', relationship: 'Son', occupation: 'Catholic Priest', phone: '+91 98470 44005', dateOfBirth: new Date('1995-09-12') },
            ],
        },
        {
            familyId: 'FAM-1003',
            houseName: 'Puthussery House',
            familyName: 'Puthussery',
            headOfFamily: 'Antony Puthussery',
            address: 'Puthussery, Subash Chandra Bose Road, Kadavanthra',
            phone1: '+91 98470 22001',
            phone2: '+91 94470 22003',
            email: 'puthussery.antony@gmail.com',
            koottaymaId: createdKoottaymas[1]._id,
            koottaymaName: createdKoottaymas[1].name,
            status: 'Active',
            privacy: { isPhone1Visible: true, isPhone2Visible: true, isEmailVisible: true, isAddressVisible: true, optOutOfDirectory: false },
            members: [
                { name: 'Antony Puthussery', baptismName: 'Anto', gender: 'Male', relationship: 'Head', occupation: 'Bank Manager (Retd)', phone: '+91 98470 22001', dateOfBirth: new Date('1958-10-20') },
                { name: 'Gracy Antony', baptismName: 'Thresia', gender: 'Female', relationship: 'Spouse', occupation: 'Homemaker', phone: '+91 94470 22003', dateOfBirth: new Date('1962-12-05') },
            ],
        },
        {
            familyId: 'FAM-1004',
            houseName: 'Manjooran House',
            familyName: 'Manjooran',
            headOfFamily: 'George Varghese Manjooran',
            address: 'Manjooran Gardens, Canal Road, Elamkulam, Kochi',
            phone1: '+91 98470 33001',
            phone2: '+91 94470 33004',
            email: 'george.manjooran@yahoo.com',
            koottaymaId: createdKoottaymas[2]._id,
            koottaymaName: createdKoottaymas[2].name,
            status: 'Active',
            privacy: { isPhone1Visible: true, isPhone2Visible: false, isEmailVisible: false, isAddressVisible: true, optOutOfDirectory: false },
            members: [
                { name: 'George Varghese Manjooran', baptismName: 'Varkey', gender: 'Male', relationship: 'Head', occupation: 'Architect', phone: '+91 98470 33001', dateOfBirth: new Date('1975-07-08') },
                { name: 'Jini George', baptismName: 'Mary', gender: 'Female', relationship: 'Spouse', occupation: 'Professor', phone: '+91 94470 33004', dateOfBirth: new Date('1978-02-14') },
                { name: 'Kevin George', baptismName: 'Joseph', gender: 'Male', relationship: 'Son', occupation: 'High School Student', phone: '', dateOfBirth: new Date('2010-05-19') },
            ],
        },
        {
            familyId: 'FAM-1005',
            houseName: 'Alappatt House',
            familyName: 'Alappatt',
            headOfFamily: 'Devassy Alappatt',
            address: 'Alappatt Nivas, Near St. Mary Church, Kadavanthra',
            phone1: '+91 98470 55001',
            phone2: '+91 94470 55002',
            email: 'alappatt.devassy@gmail.com',
            koottaymaId: createdKoottaymas[0]._id,
            koottaymaName: createdKoottaymas[0].name,
            status: 'Active',
            privacy: { isPhone1Visible: true, isPhone2Visible: true, isEmailVisible: false, isAddressVisible: true, optOutOfDirectory: false },
            members: [
                { name: 'Devassy Alappatt', baptismName: 'Devassia', gender: 'Male', relationship: 'Head', occupation: 'Senior Citizen / Planter', phone: '+91 98470 55001', dateOfBirth: new Date('1945-03-11') },
                { name: 'Mariakutty Devassy', baptismName: 'Mariam', gender: 'Female', relationship: 'Spouse', occupation: 'Senior Citizen', phone: '+91 94470 55002', dateOfBirth: new Date('1950-09-22') },
                { name: 'Thomas Devassy', baptismName: 'Thomas', gender: 'Male', relationship: 'Son', occupation: 'Business Executive', phone: '+91 98470 55003', dateOfBirth: new Date('1976-11-05') },
            ],
        },
        {
            familyId: 'FAM-1006',
            houseName: 'Kaniyanparambil House',
            familyName: 'Kaniyanparambil',
            headOfFamily: 'Mathew Kaniyanparambil',
            address: 'Kaniyanparambil, Pipeline Road, Kadavanthra',
            phone1: '+91 98470 66001',
            phone2: '+91 94470 66002',
            email: 'mathew.kaniyan@gmail.com',
            koottaymaId: createdKoottaymas[1]._id,
            koottaymaName: createdKoottaymas[1].name,
            status: 'Active',
            privacy: { isPhone1Visible: true, isPhone2Visible: true, isEmailVisible: true, isAddressVisible: true, optOutOfDirectory: false },
            members: [
                { name: 'Mathew Kaniyanparambil', baptismName: 'Mathai', gender: 'Male', relationship: 'Head', occupation: 'Pharmacist', phone: '+91 98470 66001', dateOfBirth: new Date('1972-04-18') },
                { name: 'Shobha Mathew', baptismName: 'Thresia', gender: 'Female', relationship: 'Spouse', occupation: 'Nursing Officer', phone: '+91 94470 66002', dateOfBirth: new Date('1975-08-20') },
            ],
        },
        {
            familyId: 'FAM-1007',
            houseName: 'Thekkekara House',
            familyName: 'Thekkekara',
            headOfFamily: 'Varghese Thekkekara',
            address: 'Thekkekara Bhavan, Kaloor-Kadavanthra Road, Kochi',
            phone1: '+91 98470 77001',
            phone2: '+91 94470 77002',
            email: 'thekkekara.v@gmail.com',
            koottaymaId: createdKoottaymas[2]._id,
            koottaymaName: createdKoottaymas[2].name,
            status: 'Active',
            privacy: { isPhone1Visible: true, isPhone2Visible: true, isEmailVisible: false, isAddressVisible: true, optOutOfDirectory: false },
            members: [
                { name: 'Varghese Thekkekara', baptismName: 'Geevarghese', gender: 'Male', relationship: 'Head', occupation: 'Automobile Merchant', phone: '+91 98470 77001', dateOfBirth: new Date('1969-06-14') },
                { name: 'Mercy Varghese', baptismName: 'Mariam', gender: 'Female', relationship: 'Spouse', occupation: 'Teacher', phone: '+91 94470 77002', dateOfBirth: new Date('1973-10-10') },
            ],
        },
        {
            familyId: 'FAM-1008',
            houseName: 'Palathingal House',
            familyName: 'Palathingal',
            headOfFamily: 'Joseph Palathingal',
            address: 'Palathingal, GCDA Complex, Kadavanthra',
            phone1: '+91 98470 88001',
            phone2: '+91 94470 88002',
            email: 'palathingal.joseph@gmail.com',
            koottaymaId: createdKoottaymas[3]._id,
            koottaymaName: createdKoottaymas[3].name,
            status: 'Active',
            privacy: { isPhone1Visible: true, isPhone2Visible: true, isEmailVisible: true, isAddressVisible: true, optOutOfDirectory: false },
            members: [
                { name: 'Joseph Palathingal', baptismName: 'Ouseph', gender: 'Male', relationship: 'Head', occupation: 'Advocate, High Court', phone: '+91 98470 88001', dateOfBirth: new Date('1963-12-01') },
                { name: 'Lilly Joseph', baptismName: 'Elisabeth', gender: 'Female', relationship: 'Spouse', occupation: 'Homemaker', phone: '+91 94470 88002', dateOfBirth: new Date('1967-05-15') },
            ],
        },
        {
            familyId: 'FAM-1009',
            houseName: 'Kurisingal House',
            familyName: 'Kurisingal',
            headOfFamily: 'Francis Kurisingal',
            address: 'Kurisingal, Janatha Road, Vyttila-Kadavanthra',
            phone1: '+91 98470 99001',
            phone2: '',
            email: 'kurisingal.francis@gmail.com',
            koottaymaId: createdKoottaymas[0]._id,
            koottaymaName: createdKoottaymas[0].name,
            status: 'Active',
            privacy: { isPhone1Visible: true, isPhone2Visible: false, isEmailVisible: false, isAddressVisible: true, optOutOfDirectory: false },
            members: [
                { name: 'Francis Kurisingal', baptismName: 'Francis Xavier', gender: 'Male', relationship: 'Head', occupation: 'Marine Surveyor', phone: '+91 98470 99001', dateOfBirth: new Date('1970-07-21') },
            ],
        },
        {
            familyId: 'FAM-1010',
            houseName: 'Chittilappilly House',
            familyName: 'Chittilappilly',
            headOfFamily: 'Paul Chittilappilly',
            address: 'Chittilappilly, South Janatha, Kadavanthra',
            phone1: '+91 98471 00001',
            phone2: '+91 94471 00002',
            email: 'paul.chittilappilly@gmail.com',
            koottaymaId: createdKoottaymas[1]._id,
            koottaymaName: createdKoottaymas[1].name,
            status: 'Active',
            privacy: { isPhone1Visible: true, isPhone2Visible: true, isEmailVisible: false, isAddressVisible: true, optOutOfDirectory: false },
            members: [
                { name: 'Paul Chittilappilly', baptismName: 'Paulose', gender: 'Male', relationship: 'Head', occupation: 'Electrical Engineer', phone: '+91 98471 00001', dateOfBirth: new Date('1980-02-18') },
            ],
        },
        {
            familyId: 'FAM-1011',
            houseName: 'Vattakkunnel House',
            familyName: 'Vattakkunnel',
            headOfFamily: 'Cyriac Vattakkunnel',
            address: 'Vattakkunnel Villa, Gandhi Nagar, Kadavanthra',
            phone1: '+91 98471 11001',
            phone2: '+91 94471 11002',
            email: 'cyriac.v@gmail.com',
            koottaymaId: createdKoottaymas[2]._id,
            koottaymaName: createdKoottaymas[2].name,
            status: 'Active',
            privacy: { isPhone1Visible: true, isPhone2Visible: true, isEmailVisible: true, isAddressVisible: true, optOutOfDirectory: false },
            members: [
                { name: 'Cyriac Vattakkunnel', baptismName: 'Kuriakose', gender: 'Male', relationship: 'Head', occupation: 'Retired College Principal', phone: '+91 98471 11001', dateOfBirth: new Date('1952-08-14') },
            ],
        },
        {
            familyId: 'FAM-1012',
            houseName: 'Cherianparampil House',
            familyName: 'Cherianparampil',
            headOfFamily: 'Cherian Cherianparampil',
            address: 'Cherianparampil, Near Giri Nagar Park, Kochi',
            phone1: '+91 98471 22001',
            phone2: '+91 94471 22002',
            email: 'cherianparampil@gmail.com',
            koottaymaId: createdKoottaymas[3]._id,
            koottaymaName: createdKoottaymas[3].name,
            status: 'Active',
            privacy: { isPhone1Visible: true, isPhone2Visible: true, isEmailVisible: false, isAddressVisible: true, optOutOfDirectory: false },
            members: [
                { name: 'Cherian Cherianparampil', baptismName: 'Cherian', gender: 'Male', relationship: 'Head', occupation: 'Hardware Merchant', phone: '+91 98471 22001', dateOfBirth: new Date('1974-01-29') },
            ],
        },
    ];
    const createdFamilies = [];
    let sampleHeadPersonId = null;
    let sampleFamilyId = null;
    for (const f of familiesData) {
        const { members, ...famFields } = f;
        const famDoc = await models_1.Family.create(famFields);
        createdFamilies.push(famDoc);
        if (!sampleFamilyId)
            sampleFamilyId = famDoc._id;
        for (const m of members) {
            const pDoc = await models_1.Person.create({
                ...m,
                familyId: famDoc._id,
                familyName: famDoc.familyName,
                koottaymaId: famDoc.koottaymaId,
                parish: famDoc.parish,
                status: 'Active',
            });
            if (m.relationship === 'Head' && !famDoc.headPersonId) {
                famDoc.headPersonId = pDoc._id;
                await famDoc.save();
                if (!sampleHeadPersonId)
                    sampleHeadPersonId = pDoc._id;
            }
        }
    }
    // 4b. Import Authentic Parish Directory (1,173 real families & 55 Koottayma units)
    console.log('Importing 1,173 authentic Parish Directory families and Koottaymas...');
    await (0, importDirectory_1.importParishDirectory)();
    // 5. Users (Requirement 58: Super Admin, Admin, Koottayma Leader, Parishioner)
    console.log('Seeding Users...');
    await models_1.User.deleteMany({});
    const rawPassword = 'Password@123';
    // Super Admin
    const superAdmin = await models_1.User.create({
        name: 'Rev. Fr. Joseph Pulivelil (Super Admin)',
        phone: '+919800000001',
        email: 'superadmin@stmarysforane.org',
        password: rawPassword,
        role: models_1.UserRole.SUPER_ADMIN,
        isActive: true,
    });
    // Admin
    const admin = await models_1.User.create({
        name: 'Fr. Mathew Vadakkedath (Admin)',
        phone: '+919800000002',
        email: 'admin@stmarysforane.org',
        password: rawPassword,
        role: models_1.UserRole.ADMIN,
        isActive: true,
    });
    // Koottayma Leader (Unit 1: St. Thomas Koottayma)
    const leaderUser = await models_1.User.create({
        name: 'Baby John Pulivelil (Koottayma Leader)',
        phone: '+919800000003',
        email: 'leader@stmarysforane.org',
        password: rawPassword,
        role: models_1.UserRole.KOOTTAYMA_LEADER,
        assignedKoottayma: createdKoottaymas[0]._id,
        familyId: sampleFamilyId,
        personId: sampleHeadPersonId,
        isActive: true,
    });
    // Associate unit leader user in Koottayma
    createdKoottaymas[0].assignedLeaderUserId = leaderUser._id;
    await createdKoottaymas[0].save();
    // Parishioner
    await models_1.User.create({
        name: 'Alwin John (Parishioner)',
        phone: '+919800000004',
        email: 'parishioner@stmarysforane.org',
        password: rawPassword,
        role: models_1.UserRole.PARISHIONER,
        familyId: sampleFamilyId,
        isActive: true,
    });
    // 6. Mass & Services Schedules
    console.log('Seeding Mass & Services...');
    await models_1.MassSchedule.deleteMany({});
    const massList = [
        { serviceType: 'Holy Mass', dayOfWeek: 'Sunday', time: '06:00 AM', language: 'Malayalam', celebrant: 'Rev. Fr. Mathew', churchVenue: 'Main Church', specialIntention: 'For deceased parishioners', isRecurring: true },
        { serviceType: 'Holy Mass', dayOfWeek: 'Sunday', time: '07:30 AM', language: 'Malayalam', celebrant: 'Very Rev. Fr. Joseph', churchVenue: 'Main Church', specialIntention: 'Solemn High Mass for Parish Community', isRecurring: true },
        { serviceType: 'Holy Mass', dayOfWeek: 'Sunday', time: '09:30 AM', language: 'English', celebrant: 'Guest Priest', churchVenue: 'Main Church', specialIntention: 'For youth and students', isRecurring: true },
        { serviceType: 'Holy Mass', dayOfWeek: 'Sunday', time: '05:30 PM', language: 'Malayalam', celebrant: 'Rev. Fr. Mathew', churchVenue: 'Chapel of St. Jude', specialIntention: 'General Thanksgiving', isRecurring: true },
        { serviceType: 'Holy Mass', dayOfWeek: 'Daily', time: '06:30 AM', language: 'Malayalam', celebrant: 'Parish Priest', churchVenue: 'Main Church', specialIntention: 'Daily parish intention', isRecurring: true },
        { serviceType: 'Holy Mass', dayOfWeek: 'Daily', time: '05:30 PM', language: 'Malayalam', celebrant: 'Assistant Vicar', churchVenue: 'Main Church', specialIntention: 'Evening Mass & Rosary', isRecurring: true },
        { serviceType: 'Adoration', dayOfWeek: 'Friday', time: '04:30 PM', language: 'Malayalam', celebrant: 'All Priests', churchVenue: 'Main Church', specialIntention: 'Eucharistic Adoration & Benediction', isRecurring: true },
        { serviceType: 'Novena', dayOfWeek: 'Saturday', time: '06:30 AM', language: 'Malayalam', celebrant: 'Parish Priest', churchVenue: 'Main Church', specialIntention: 'Novena to Our Lady of Perpetual Help', isRecurring: true },
        { serviceType: 'Confession', dayOfWeek: 'Saturday', time: '04:30 PM', language: 'Malayalam & English', celebrant: 'All Priests', churchVenue: 'Confessionals', specialIntention: 'Sacrament of Reconciliation', isRecurring: true },
    ];
    await models_1.MassSchedule.insertMany(massList);
    // 7. Prayer Meetings
    console.log('Seeding Prayer Meetings...');
    await models_1.PrayerMeeting.deleteMany({});
    await models_1.PrayerMeeting.create([
        {
            koottaymaId: createdKoottaymas[0]._id,
            koottaymaName: createdKoottaymas[0].name,
            date: new Date(Date.now() + 3 * 24 * 3600 * 1000),
            time: '05:00 PM',
            venue: 'Pulivelil House, Church Road',
            hostFamily: 'Pulivelil Family (Baby John)',
            leader: 'Baby John Pulivelil',
            theme: 'United in Christ: Growing in Family Prayer',
            bibleReading: 'Colossians 3: 12-17',
            prayerIntention: 'For elderly sick members and youth preparing for exams',
            attendanceCount: 22,
            attendeeNames: ['Baby John', 'Rosily', 'Alwin', 'Devassy', 'Mariakutty', 'Francis'],
            status: 'Scheduled',
        },
        {
            koottaymaId: createdKoottaymas[1]._id,
            koottaymaName: createdKoottaymas[1].name,
            date: new Date(Date.now() + 4 * 24 * 3600 * 1000),
            time: '05:30 PM',
            venue: 'Puthussery Villa, Subash Bose Road',
            hostFamily: 'Puthussery Family (Antony)',
            leader: 'Antony Puthussery',
            theme: 'St. Joseph: Guardian of Families',
            bibleReading: 'Matthew 1: 18-24',
            prayerIntention: 'For peaceful coexistence and harmony in our neighborhood',
            attendanceCount: 18,
            attendeeNames: ['Antony', 'Gracy', 'Mathew', 'Shobha', 'Paul'],
            status: 'Scheduled',
        },
    ]);
    // 8. Events
    console.log('Seeding Events...');
    await models_1.Event.deleteMany({});
    await models_1.Event.create([
        {
            title: 'Annual Forane Parish Feast of the Assumption',
            description: 'Grand celebration of the Assumption of Our Lady with Flag Hoisting, Solemn Raza Mass, and Candlelight Procession through Kadavanthra town.',
            date: new Date('2026-08-15'),
            startTime: '06:00 AM',
            endTime: '10:00 PM',
            venue: 'St. Mary Forane Church Grounds',
            organizer: 'Parish Pastoral Council & General Convener',
            category: 'Feast',
            featured: true,
            posterUrl: 'https://images.unsplash.com/photo-1548625361-195feeed7c5a?auto=format&fit=crop&w=600&q=80',
            contactInformation: 'Parish Office: 0484-2200112',
            status: 'Upcoming',
        },
        {
            title: 'Parish Bible Convention & Charismatic Retreat',
            description: 'Three-day spiritual renewal led by renowned preachers. Special sessions for youth and families with confessions and counseling.',
            date: new Date(Date.now() + 14 * 24 * 3600 * 1000),
            startTime: '04:30 PM',
            endTime: '08:30 PM',
            venue: 'St. Mary Parish Auditorium',
            organizer: 'Spiritual Renewal Ministry',
            category: 'Retreat',
            featured: true,
            posterUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
            status: 'Upcoming',
        },
        {
            title: 'Catechism Annual Day & Bible Quiz Finals',
            description: 'Celebration of faith education for Sunday school students with cultural programs, Bible skit finals, and prize distributions.',
            date: new Date(Date.now() + 21 * 24 * 3600 * 1000),
            startTime: '09:30 AM',
            endTime: '01:30 PM',
            venue: 'School Auditorium',
            organizer: 'Sunday School Department',
            category: 'Sunday School',
            status: 'Upcoming',
        },
    ]);
    // 9. Announcements
    console.log('Seeding Announcements...');
    await models_1.Announcement.deleteMany({});
    await models_1.Announcement.create([
        {
            title: 'Feast Committee General Body Meeting on Sunday',
            content: 'A general body meeting of all Koottayma Leaders, Organization Presidents, and Parish Council members will convene immediately after the 7:30 AM Mass in the Parish Hall to finalize committees for the Annual Parish Feast.',
            priority: 'Important',
            category: 'Feast',
            targetAudience: 'All',
            isPinned: true,
            isActive: true,
        },
        {
            title: 'Emergency: Blood Donation Drive for General Hospital',
            content: 'KCYM Youth wing is organizing an urgent blood donation drive this Tuesday from 9:00 AM to 1:00 PM in the Parish Dispensary. Healthy parishioners aged 18-50 are kindly urged to register.',
            priority: 'Urgent',
            category: 'Youth',
            targetAudience: 'All',
            isActive: true,
        },
        {
            title: 'First Holy Communion & Confirmation Preparation',
            content: 'Catechism classes for candidates preparing for First Holy Communion and Confirmation will begin next Saturday at 3:00 PM. Parents are requested to submit Baptism certificates.',
            priority: 'Normal',
            category: 'Sunday School',
            targetAudience: 'Parishioners',
            isActive: true,
        },
    ]);
    // 10. Daily Readings (English & Malayalam)
    console.log('Seeding Liturgical Readings...');
    await models_1.DailyReading.deleteMany({});
    const todayStr = new Date().toISOString().split('T')[0];
    await models_1.DailyReading.create({
        date: todayStr,
        feastOfTheDay: {
            en: 'Memorial of St. Vincent de Paul / Liturgical Monday',
            ml: 'വിശുദ്ധ വിൻസെന്റ് ഡി പോളിന്റെ തിരുനാൾ',
        },
        saintOfTheDay: {
            en: 'St. Vincent de Paul, Priest & Apostle of Charity',
            ml: 'വിശുദ്ധ വിൻസെന്റ് ഡി പോൾ, കാരുണ്യത്തിന്റെ അപ്പസ്തോലൻ',
        },
        firstReading: {
            reference: 'Job 1: 6-22',
            text: {
                en: 'The Lord gave and the Lord has taken away; may the name of the Lord be praised. In all this Job did not sin or charge God with wrong.',
                ml: 'കർത്താവു തന്നു, കർത്താവെടുത്തു; കർത്താവിന്റെ നാമം സ്തുതിക്കപ്പെടട്ടെ. ഇതിലെല്ലാം ഇയ്യോബ് പാപം ചെയ്യുകയോ ദൈവത്തെ കുറ്റപ്പെടുത്തുകയോ ചെയ്തില്ല.',
            },
        },
        psalm: {
            reference: 'Psalm 17: 1-3, 6-7',
            text: {
                en: 'Hear a just cause, O Lord; attend to my cry! Give ear to my prayer from lips free of deceit.',
                ml: 'കർത്താവേ, നീതിപൂർവ്വകമായ എന്റെ അപേക്ഷ കേൾക്കണമേ; എന്റെ നിലവിളി ശ്രദ്ധിക്കണമേ. വ്യാജമില്ലാത്ത അധരങ്ങളിൽ നിന്നുള്ള പ്രാർത്ഥന കൈക്കൊള്ളണമേ.',
            },
            response: {
                en: 'Incline your ear to me, O Lord, and hear my words.',
                ml: 'കർത്താവേ, എന്നിലേക്കു ചെവി ചായ്ച്ചു എന്റെ വാക്കു കേൾക്കണമേ.',
            },
        },
        secondReading: {
            reference: '1 Corinthians 1: 26-31',
            text: {
                en: 'God chose what is foolish in the world to shame the wise; God chose what is weak in the world to shame the strong.',
                ml: 'ജ്ഞാനികളെ ലജ്ജിപ്പിക്കാൻ ലോകത്തിൽ ഭോഷന്മാരായവരെ ദൈവം തിരഞ്ഞെടുത്തു; ശക്തമായതിനെ ലജ്ജിപ്പിക്കാൻ ലോകത്തിൽ ദുർബലമായവയെ അവൻ തിരഞ്ഞെടുത്തു.',
            },
        },
        gospel: {
            reference: 'Luke 9: 46-50',
            text: {
                en: 'Jesus said to them: Whoever welcomes this little child in my name welcomes me, and whoever welcomes me welcomes the one who sent me.',
                ml: 'യേശു അവരോടു പറഞ്ഞു: ഈ ശിശുവിനെ എന്റെ നാമത്തിൽ സ്വീകരിക്കുന്നവൻ എന്നെ സ്വീകരിക്കുന്നു; എന്നെ സ്വീകരിക്കുന്നവൻ എന്നെ അയച്ചവനെ സ്വീകരിക്കുന്നു.',
            },
        },
        prayerOfTheDay: {
            en: 'O Lord Jesus Christ, grant us the grace to serve our poorest brothers and sisters with burning charity and deep humility, as modeled by St. Vincent de Paul.',
            ml: 'കർത്താവായ യേശുവേ, എളിയവരിലും ദരിദ്രരിലും അങ്ങയെ ദർശിച്ചു വിനയത്തോടും തീക്ഷ്ണതയോടും കൂടെ അവരെ ശുശ്രൂഷിക്കാൻ ഞങ്ങളെ അനുഗ്രഹിക്കണമേ.',
        },
        parishPrayer: {
            en: 'Mother Mary of Assumption, Queen of our Parish, intercede for our families, protect our children, and keep our community rooted in holy faith.',
            ml: 'ഞങ്ങളുടെ ഇടവക മധ്യസ്ഥയായ പരിശുദ്ധ ദൈവമാതാവേ, ഞങ്ങളുടെ കുടുംബങ്ങളെ അങ്ങേ മാതൃവാത്സല്യത്തിൽ കാത്തുപാലിക്കണമേ.',
        },
    });
    // 11. Priests (Current, Previously Served, From Our Parish)
    console.log('Seeding Priests...');
    await models_1.Priest.deleteMany({});
    await models_1.Priest.create([
        {
            category: 'Current',
            name: 'Very Rev. Fr. Joseph Pulivelil',
            designation: 'Forane Vicar & Parish Priest',
            photographUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
            biography: 'Ordained in 1994. Has served as Chancellor and Vicar in key parishes. Dedicated to youth empowerment and spiritual renewal.',
            ordinationDate: new Date('1994-12-28'),
            diocese: 'Archdiocese of Ernakulam-Angamaly',
            servicePeriod: '2022 - Present',
            serviceStartDate: new Date('2022-05-15'),
            phone: '+91 94471 23456',
            order: 1,
        },
        {
            category: 'Current',
            name: 'Rev. Fr. Mathew Vadakkedath',
            designation: 'Assistant Parish Priest',
            photographUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            biography: 'Ordained in 2021. Actively directs Sunday School Catechism and Youth Ministry programs.',
            ordinationDate: new Date('2021-01-04'),
            diocese: 'Archdiocese of Ernakulam-Angamaly',
            servicePeriod: '2024 - Present',
            serviceStartDate: new Date('2024-05-10'),
            phone: '+91 94472 34567',
            order: 2,
        },
        {
            category: 'Previously Served',
            name: 'Rev. Fr. George Kottoor',
            designation: 'Former Vicar',
            servicePeriod: '2018 - 2022',
            biography: 'Supervised the construction of the new Jubilee Parish Hall and established unit prayer manuals.',
            photographUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
            order: 1,
        },
        {
            category: 'Previously Served',
            name: 'Rev. Fr. Antony Vattoly',
            designation: 'Former Vicar',
            servicePeriod: '2013 - 2018',
            biography: 'Introduced computerization of parish census records and launched the Karuna Medical Aid outreach.',
            photographUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
            order: 2,
        },
        {
            category: 'From Our Parish',
            name: 'Rev. Fr. George Thoppil',
            baptismName: 'Geevarghese',
            designation: 'Diocesan Priest',
            ordinationDate: new Date('2020-12-30'),
            diocese: 'Archdiocese of Ernakulam-Angamaly',
            currentMinistry: 'Director, Diocesan Youth Apostolate',
            biography: 'Born and brought up in St. Mary Forane Parish (Thoppil family). Active in KCYM during his school years.',
            photographUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
            order: 1,
        },
    ]);
    // 12. Religious Sisters From Our Parish
    console.log('Seeding Religious Sisters...');
    await models_1.ReligiousSister.deleteMany({});
    await models_1.ReligiousSister.create([
        {
            name: 'Rev. Sr. Philomina CMC',
            baptismName: 'Thresia Pulivelil',
            religiousCongregation: 'Congregation of the Mother of Carmel (CMC)',
            professionDate: new Date('1990-05-24'),
            currentMinistry: 'Headmistress, Sacred Heart High School, Thevara',
            dioceseOrCongregation: 'CMC St. Joseph Province, Ernakulam',
            biography: 'Proud vocation from Pulivelil family of St. Mary Forane Parish. Over 30 years in education ministry.',
            photographUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
            homeFamilyName: 'Pulivelil',
            order: 1,
        },
        {
            name: 'Rev. Sr. Mary Rose FCC',
            baptismName: 'Mariam Puthussery',
            religiousCongregation: 'Franciscan Clarist Congregation (FCC)',
            professionDate: new Date('2005-08-11'),
            currentMinistry: 'Nurse Superior, St. Joseph Mission Hospital, Wayanad',
            dioceseOrCongregation: 'FCC Portiuncula Province',
            biography: 'Vocation from Puthussery family. Dedicated missionary nurse serving underprivileged tribal communities.',
            photographUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
            homeFamilyName: 'Puthussery',
            order: 2,
        },
    ]);
    // 13. Organizations
    console.log('Seeding Organizations & Ministries...');
    await models_1.Organization.deleteMany({});
    await models_1.Organization.create([
        {
            name: 'Sunday School / Faith Formation',
            description: 'Catering to spiritual growth and catechism of 450+ children from Grade 1 to 12.',
            leader: 'Rev. Fr. Mathew Vadakkedath (Director)',
            leaderPhone: '+91 94472 34567',
            secretary: 'Dominic Thoppil (Headmaster)',
            meetingSchedule: 'Every Sunday 08:45 AM - 10:30 AM',
            activities: ['Catechism Classes', 'Bible Quiz', 'Annual Retreat', 'Faith Day'],
            membersCount: 450,
            status: 'Active',
        },
        {
            name: 'KCYM (Kerala Catholic Youth Movement)',
            description: 'Empowering young men and women in Catholic leadership, social action, and community service.',
            leader: 'Alwin John (President)',
            leaderPhone: '+91 98470 11003',
            secretary: 'Anu Mary (Secretary)',
            meetingSchedule: 'Every 2nd & 4th Sunday after 9:30 AM Mass',
            activities: ['Blood Donation Drives', 'Youth Conventions', 'Ecological Cleanups', 'Carol Singing'],
            membersCount: 85,
            status: 'Active',
        },
        {
            name: 'St. Vincent de Paul Society',
            description: 'Dedicated to charitable visitation, medical aid, education scholarships, and housing assistance for the needy.',
            leader: 'Devassy Alappatt (President)',
            leaderPhone: '+91 98470 55001',
            secretary: 'Antony Puthussery',
            meetingSchedule: 'Every Sunday 10:30 AM',
            activities: ['Family Adoption', 'Medical Subsidies', 'Food Kit Distribution'],
            membersCount: 24,
            status: 'Active',
        },
        {
            name: 'Parish Liturgical Choir',
            description: 'Leading solemn liturgical singing and sacred music during Holy Masses, feasts, and ceremonies.',
            leader: 'George Varghese Manjooran (Choir Master)',
            meetingSchedule: 'Saturday 06:30 PM & Sunday 06:30 AM',
            activities: ['Feast Choirs', 'Easter & Christmas Concerts', 'Voice Training'],
            membersCount: 35,
            status: 'Active',
        },
    ]);
    // 14. Parish History Timeline
    console.log('Seeding Parish History Timeline...');
    await models_1.ParishHistory.deleteMany({});
    await models_1.ParishHistory.create([
        {
            year: 1894,
            event: 'Parish Foundation & First Chapel',
            description: 'A modest thatched chapel dedicated to Our Lady of the Assumption was consecrated by Vicar Apostolic of Trichur, fulfilling the spiritual needs of 45 Catholic families in Kadavanthra.',
            category: 'Establishment',
            photos: ['https://images.unsplash.com/photo-1548625361-195feeed7c5a?auto=format&fit=crop&w=600&q=80'],
            order: 1,
        },
        {
            year: 1928,
            event: 'Establishment of St. Mary Lower Primary School',
            description: 'To bring quality education to local agrarian families regardless of caste or creed, the church established its first parish school.',
            category: 'Development',
            order: 2,
        },
        {
            year: 1954,
            event: 'Diamond Jubilee & Construction of Tower Belfry',
            description: 'On the 60th anniversary, a grand 95-foot stone bell tower and European cast-bronze bells were imported and blessed.',
            category: 'Milestone',
            order: 3,
        },
        {
            year: 1982,
            event: 'Elevation to Forane Church Status',
            description: 'In recognition of its vital spiritual growth and pastoral care, the Archdiocese elevated St. Mary Church to the status of a Forane Church.',
            category: 'Historical Event',
            order: 4,
        },
        {
            year: 2010,
            event: 'Consecration of New Forane Cathedral Structure',
            description: 'A magnificent modern Syrian-Gothic sanctuary seating over 1,500 faithful was consecrated by the Major Archbishop.',
            category: 'Milestone',
            order: 5,
        },
    ]);
    // 15. Gallery Albums
    console.log('Seeding Gallery Albums...');
    await models_1.GalleryAlbum.deleteMany({});
    await models_1.GalleryAlbum.create([
        {
            title: 'Annual Parish Feast Celebrations',
            description: 'Highlights of the Assumption Feast, Solemn Raza Mass, and Candlelight Procession.',
            category: 'Parish Feast',
            coverImageUrl: 'https://images.unsplash.com/photo-1548625361-195feeed7c5a?auto=format&fit=crop&w=600&q=80',
            items: [
                { title: 'Flag Hoisting Ceremony', mediaType: 'image', url: 'https://images.unsplash.com/photo-1548625361-195feeed7c5a?auto=format&fit=crop&w=800&q=80', caption: 'Solemn Kodiyettam by Vicar' },
                { title: 'Solemn Feast Mass', mediaType: 'image', url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80', caption: 'High Mass concelebrated by visiting priests' },
            ],
            isPublic: true,
            order: 1,
        },
        {
            title: 'First Holy Communion & Confirmation 2026',
            description: 'Sacrament day for 42 Sunday School children receiving Jesus for the first time.',
            category: 'Sunday School',
            coverImageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
            items: [
                { title: 'Communicants at Altar', mediaType: 'image', url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80', caption: 'White robed children around the sanctuary' },
            ],
            isPublic: true,
            order: 2,
        },
    ]);
    // 16. Settings
    console.log('Seeding Centralized Settings...');
    await models_1.Setting.deleteMany({});
    await models_1.Setting.create({
        key: 'global_settings',
        general: {
            parishName: "St. Mary's Forane Church",
            defaultLanguage: 'en',
            timeZone: 'Asia/Kolkata',
            contactEmail: 'office@stmarysforane.org',
            contactPhone: '+91 484 2200112',
        },
        privacy: {
            directoryOptOutAllowed: true,
            defaultPhoneVisible: true,
            defaultEmailVisible: false,
            defaultAddressVisible: true,
            defaultDobVisible: false,
        },
        notifications: {
            pushNotificationsEnabled: true,
            eventRemindersEnabled: true,
            massRemindersEnabled: true,
            prayerMeetingRemindersEnabled: true,
        },
        security: {
            sessionTimeoutMinutes: 60,
            maxLoginAttempts: 5,
            passwordMinLength: 6,
            requireOtp: false,
        },
        application: {
            maintenanceMode: false,
            maintenanceMessage: 'System is temporarily undergoing scheduled maintenance.',
            appVersion: '1.0.0',
            minSupportedVersion: '1.0.0',
        },
    });
    console.log('--- Catholic Forane Parish Database Seeding Complete! ---');
    console.log('Sample Logins:');
    console.log('  Super Admin:      phone: +919800000001 | password: Password@123 | email: superadmin@stmarysforane.org');
    console.log('  Admin:            phone: +919800000002 | password: Password@123 | email: admin@stmarysforane.org');
    console.log('  Koottayma Leader: phone: +919800000003 | password: Password@123 | email: leader@stmarysforane.org (St. Thomas Koottayma)');
    console.log('  Parishioner:      phone: +919800000004 | password: Password@123 | email: parishioner@stmarysforane.org');
}
// If executed directly via CLI
if (require.main === module) {
    (0, database_1.connectDB)()
        .then(runSeed)
        .then(() => (0, database_1.disconnectDB)())
        .then(() => process.exit(0))
        .catch((err) => {
        console.error('Seeding failed:', err);
        process.exit(1);
    });
}
