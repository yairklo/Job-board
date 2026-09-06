const Job = require('../models/Job');

const MIN = 1000000;
const MAX = 9999999;

function randomJobNumber() {
  return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

async function generateJobNumber() {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const jobNumber = randomJobNumber();
    const exists = await Job.exists({ jobNumber });
    if (!exists) {
      return jobNumber;
    }
  }
  throw new Error('Could not generate a unique job number');
}

module.exports = generateJobNumber;
