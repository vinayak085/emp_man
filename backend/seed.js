import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from './models/Employee.js';
import { connectDB, disconnectDB } from './config/db.js';

dotenv.config();

const sampleEmployees = [
  {
    name: 'Alexander Hayes',
    email: 'alexander.hayes@example.com',
    designation: 'Principal Solutions Architect',
  },
  {
    name: 'Sophia Patel',
    email: 'sophia.patel@example.com',
    designation: 'Lead Frontend Engineer',
  },
  {
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    designation: 'Senior Backend Developer',
  },
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    designation: 'Staff Product Designer',
  },
  {
    name: 'Liam Chen',
    email: 'liam.chen@example.com',
    designation: 'Engineering Manager',
  },
  {
    name: 'Aaliyah Khan',
    email: 'aaliyah.khan@example.com',
    designation: 'Senior DevOps Specialist',
  },
  {
    name: 'Lucas Silva',
    email: 'lucas.silva@example.com',
    designation: 'Full Stack Developer',
  },
  {
    name: 'Chloe Dubois',
    email: 'chloe.dubois@example.com',
    designation: 'Senior QA Automation Engineer',
  },
  {
    name: 'Noah Tanaka',
    email: 'noah.tanaka@example.com',
    designation: 'Product Operations Director',
  },
  {
    name: 'Grace O’Connor',
    email: 'grace.oconnor@example.com',
    designation: 'Data Platform Engineer',
  },
  {
    name: 'David Kim',
    email: 'david.kim@example.com',
    designation: 'Security & Compliance Analyst',
  },
  {
    name: 'Zoe Martinez',
    email: 'zoe.martinez@example.com',
    designation: 'Technical Program Manager',
  },
  {
    name: 'Ethan Becker',
    email: 'ethan.becker@example.com',
    designation: 'Site Reliability Engineer',
  },
  {
    name: 'Maya Lin',
    email: 'maya.lin@example.com',
    designation: 'UI/UX Visual Designer',
  },
  {
    name: 'Oliver Wright',
    email: 'oliver.wright@example.com',
    designation: 'Cloud Infrastructure Engineer',
  },
];

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Clearing existing employee records...');
    await Employee.deleteMany({});

    console.log(`[Seed] Inserting ${sampleEmployees.length} sample employee records...`);
    const created = await Employee.insertMany(sampleEmployees);

    console.log(`[Seed] Successfully seeded ${created.length} employees!`);
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Seeding failed:', error.message);
    await disconnectDB();
    process.exit(1);
  }
};

seedData();
