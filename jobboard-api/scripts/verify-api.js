require('dotenv').config();

const BASE = process.env.VERIFY_API_URL || 'http://localhost:8181';

let passed = 0;
let failed = 0;

function assert(name, condition, extra = '') {
  if (condition) {
    passed += 1;
    console.log(`PASS  ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL  ${name}${extra ? ` — ${extra}` : ''}`);
  }
}

async function request(method, path, { body, token, expectStatus } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['x-auth-token'] = token;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (_err) {
    data = text;
  }

  if (expectStatus) {
    assert(`${method} ${path} -> ${expectStatus}`, res.status === expectStatus, `got ${res.status}`);
  }

  return { status: res.status, data };
}

async function login(email, password) {
  const { status, data } = await request('POST', '/users/login', { body: { email, password } });
  return { status, token: typeof data === 'string' ? data : data?.token };
}

async function run() {
  const jobsRes = await request('GET', '/jobs', { expectStatus: 200 });
  const jobs = Array.isArray(jobsRes.data) ? jobsRes.data : [];
  assert('GET /jobs returns array', jobs.length >= 8);
  assert('job has recruiter_id', Boolean(jobs[0]?.recruiter_id));
  assert('job has experienceLevel', Boolean(jobs[0]?.experienceLevel));
  assert('job has salary', jobs[0]?.salary?.min != null);

  await request('GET', `/jobs/${jobs[0]._id}`, { expectStatus: 200 });
  await request('GET', '/jobs/000000000000000000000000', { expectStatus: 404 });

  const seeker = await login('seeker@jobboard.local', 'Seeker1234!');
  const recruiter = await login('recruiter@jobboard.local', 'Recruiter1234!');
  const admin = await login('admin@jobboard.local', 'Admin1234!');
  assert('seeker login returns JWT', typeof seeker.token === 'string' && seeker.token.split('.').length === 3);
  assert('recruiter login returns JWT', typeof recruiter.token === 'string' && recruiter.token.split('.').length === 3);
  assert('admin login returns JWT', typeof admin.token === 'string' && admin.token.split('.').length === 3);

  await request('GET', '/jobs/my-jobs', { token: recruiter.token, expectStatus: 200 });
  await request('GET', '/jobs/my-jobs', { token: seeker.token, expectStatus: 403 });
  await request('GET', '/users?page=1&limit=10&search=admin', { token: admin.token, expectStatus: 200 });
  await request('GET', '/users', { token: seeker.token, expectStatus: 403 });

  const saved = await request('PATCH', `/jobs/${jobs[0]._id}`, { token: seeker.token, expectStatus: 200 });
  assert('PATCH save adds user id', Array.isArray(saved.data?.savedBy) && saved.data.savedBy.length >= 1);

  const createdJob = await request('POST', '/jobs', {
    token: recruiter.token,
    expectStatus: 201,
    body: {
      title: 'Verify Script Job',
      company: 'Verify Corp',
      description: 'Temporary job created by the API verification script.',
      category: 'Software',
      location: 'Remote',
      jobType: 'Full-Time',
      experienceLevel: 'Junior',
      salary: { min: 10000, max: 15000 },
      phone: '0502222222',
      email: 'jobs@verify.local',
      image: { url: '', alt: '' },
    },
  });
  assert('created job has jobNumber', Boolean(createdJob.data?.jobNumber));

  await request('PUT', `/jobs/${createdJob.data._id}`, {
    token: seeker.token,
    expectStatus: 403,
    body: {
      title: 'Hacked Title',
      company: 'Verify Corp',
      description: 'Should not be allowed to update someone else job.',
      category: 'Software',
      location: 'Remote',
      jobType: 'Full-Time',
      experienceLevel: 'Junior',
      salary: { min: 10000, max: 15000 },
      phone: '0502222222',
      email: 'jobs@verify.local',
      image: { url: '', alt: '' },
    },
  });

  await request('DELETE', `/jobs/${createdJob.data._id}`, { token: recruiter.token, expectStatus: 200 });

  const uniqueEmail = `verify${Date.now()}@jobboard.local`;
  const registered = await request('POST', '/users', {
    expectStatus: 201,
    body: {
      name: { first: 'Verify', middle: '', last: 'User' },
      phone: '0501234567',
      email: uniqueEmail,
      password: 'Aa1234!@',
      image: { url: '', alt: '' },
      address: {
        state: '',
        country: 'Israel',
        city: 'Tel Aviv',
        street: 'Dizengoff',
        houseNumber: 10,
        zip: 6100000,
      },
      isRecruiter: false,
    },
  });
  assert('register hides password', registered.data && !registered.data.password);
  assert('register cannot self-admin', registered.data?.isAdmin === false);

  let lastStatus = 0;
  for (let i = 0; i < 3; i += 1) {
    const fail = await login(uniqueEmail, 'WrongPass1!');
    lastStatus = fail.status;
  }
  assert('third failed login locks account', lastStatus === 403);

  const users = await request('GET', `/users?search=${encodeURIComponent(uniqueEmail)}`, { token: admin.token });
  const createdUser = users.data?.docs?.find((user) => user.email === uniqueEmail);
  if (createdUser) {
    await request('DELETE', `/users/${createdUser._id}`, { token: admin.token, expectStatus: 200 });
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Verify script crashed:', err.message);
  process.exit(1);
});
