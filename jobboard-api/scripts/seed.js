require('dotenv').config();

const bcrypt = require('bcrypt');
const User = require('../models/User');
const Job = require('../models/Job');
const { connectDB } = require('../db/service');
const generateJobNumber = require('../helpers/generateJobNumber');

const SALT_ROUNDS = 10;

const sampleUsers = [
  {
    name: { first: 'Admin', middle: '', last: 'User' },
    phone: '0501111111',
    email: process.env.ADMIN_EMAIL || 'admin@jobboard.local',
    password: process.env.ADMIN_PASSWORD || 'Admin1234!',
    address: {
      state: '',
      country: 'Israel',
      city: 'Tel Aviv',
      street: 'Rothschild',
      houseNumber: 1,
      zip: 6688101,
    },
    image: { url: '', alt: '' },
    isRecruiter: false,
    isAdmin: true,
  },
  {
    name: { first: 'Rina', middle: '', last: 'Recruiter' },
    phone: '0502222222',
    email: 'recruiter@jobboard.local',
    password: 'Recruiter1234!',
    address: {
      state: '',
      country: 'Israel',
      city: 'Herzliya',
      street: 'Maskit',
      houseNumber: 12,
      zip: 4673300,
    },
    image: { url: '', alt: '' },
    isRecruiter: true,
    isAdmin: false,
  },
  {
    name: { first: 'Dana', middle: '', last: 'Seeker' },
    phone: '0503333333',
    email: 'seeker@jobboard.local',
    password: 'Seeker1234!',
    address: {
      state: '',
      country: 'Israel',
      city: 'Haifa',
      street: 'Herzl',
      houseNumber: 8,
      zip: 3313102,
    },
    image: { url: '', alt: '' },
    isRecruiter: false,
    isAdmin: false,
  },
];

const sampleJobs = [
  {
    title: 'Full Stack Developer',
    company: 'Webify',
    description: 'Build and maintain React and Node.js features for a growing job marketplace used by recruiters and candidates.',
    category: 'Software',
    location: 'Tel Aviv',
    jobType: 'Full-Time',
    experienceLevel: 'Mid-Level',
    salary: { min: 22000, max: 32000 },
    phone: '0502222222',
    email: 'jobs@webify.local',
  },
  {
    title: 'Junior Frontend Engineer',
    company: 'Pixel Labs',
    description: 'Work with React, Bootstrap, and Vite to ship polished user interfaces. Mentorship and code reviews included.',
    category: 'Software',
    location: 'Remote',
    jobType: 'Full-Time',
    experienceLevel: 'Junior',
    salary: { min: 14000, max: 19000 },
    phone: '0504444444',
    email: 'hr@pixellabs.local',
  },
  {
    title: 'Senior Backend Engineer',
    company: 'DataNest',
    description: 'Design MongoDB schemas, Express APIs, and production-ready authentication flows for high-traffic services.',
    category: 'Software',
    location: 'Herzliya',
    jobType: 'Full-Time',
    experienceLevel: 'Senior',
    salary: { min: 32000, max: 42000 },
    phone: '0505555555',
    email: 'careers@datanest.local',
  },
  {
    title: 'Product Design Intern',
    company: 'North Studio',
    description: 'Support UX research and UI design for mobile and web products. A great first role for design students.',
    category: 'Design',
    location: 'Haifa',
    jobType: 'Internship',
    experienceLevel: 'Entry Level',
    salary: { min: 40, max: 50 },
    phone: '0506666666',
    email: 'hello@northstudio.local',
  },
  {
    title: 'Part-Time QA Tester',
    company: 'Quality First',
    description: 'Write test cases, reproduce bugs, and help the team keep the Job Board stable before each release.',
    category: 'QA',
    location: 'Jerusalem',
    jobType: 'Part-Time',
    experienceLevel: 'Junior',
    salary: { min: 80, max: 120 },
    phone: '0507777777',
    email: 'qa@qualityfirst.local',
  },
  {
    title: 'Freelance Technical Writer',
    company: 'Docs & Co',
    description: 'Create API documentation and onboarding guides for developers. Flexible hours and remote-friendly.',
    category: 'Content',
    location: 'Remote',
    jobType: 'Freelance',
    experienceLevel: 'Mid-Level',
    salary: { min: 150, max: 250 },
    phone: '0508888888',
    email: 'editors@docsco.local',
  },
  {
    title: 'Team Lead — Platform',
    company: 'Cloudway',
    description: 'Lead a small engineering team building recruiter tools. Mix of hands-on coding and people management.',
    category: 'Software',
    location: 'Tel Aviv',
    jobType: 'Full-Time',
    experienceLevel: 'Team Lead',
    salary: { min: 38000, max: 48000 },
    phone: '0509999999',
    email: 'talent@cloudway.local',
  },
  {
    title: 'Temporary Customer Success',
    company: 'HireHelp',
    description: 'Help new recruiters learn the platform during a busy hiring season. Three-month contract with option to extend.',
    category: 'Support',
    location: 'Beer Sheva',
    jobType: 'Temporary',
    experienceLevel: 'Entry Level',
    salary: { min: 9000, max: 11000 },
    phone: '0501010101',
    email: 'cs@hirehelp.local',
  },
];

async function seed() {
  await connectDB();

  await Job.deleteMany({});
  await User.deleteMany({});

  const createdUsers = [];
  for (const user of sampleUsers) {
    const created = await User.create({
      ...user,
      password: await bcrypt.hash(user.password, SALT_ROUNDS),
    });
    createdUsers.push(created);
    console.log(`Created user: ${user.email} (${user.isAdmin ? 'admin' : user.isRecruiter ? 'recruiter' : 'seeker'})`);
  }

  const recruiter = createdUsers.find((user) => user.isRecruiter);
  if (!recruiter) {
    throw new Error('Seed recruiter was not created');
  }

  for (const job of sampleJobs) {
    await Job.create({
      ...job,
      image: { url: process.env.DEFAULT_JOB_IMAGE_URL || '', alt: `${job.company} logo` },
      recruiterId: recruiter._id,
      savedBy: [],
      jobNumber: await generateJobNumber(),
    });
    console.log(`Created job: ${job.title}`);
  }

  console.log('\nSeed complete.');
  console.log('Admin:     ', sampleUsers[0].email, '/', sampleUsers[0].password);
  console.log('Recruiter: ', sampleUsers[1].email, '/', sampleUsers[1].password);
  console.log('Seeker:    ', sampleUsers[2].email, '/', sampleUsers[2].password);

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
