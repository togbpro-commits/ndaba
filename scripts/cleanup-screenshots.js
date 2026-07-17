const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'pitch-screenshots');

// 1. Rename files from first run if they exist
const renames = [
  { old: 'homepage-full.png', new: '1-homepage-full.png' },
  { old: 'services.png', new: '2-services-overview.png' }
];

renames.forEach(r => {
  const oldPath = path.join(dir, r.old);
  const newPath = path.join(dir, r.new);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: ${r.old} -> ${r.new}`);
  }
});

// 2. Remove redundant duplicates
const duplicates = [
  'about.png',
  'admin-login.png',
  'case-tracking-portal.png',
  'digital-onboarding.png',
  'fees-calculator.png',
  'dashboard-home.png',
  'feature-case-tracker.png',
  'feature-compliance-hub.png',
  'feature-fica-planner.png',
  'feature-lifecycle-map.png',
  'feature-practice-areas.png'
];

duplicates.forEach(f => {
  const filePath = path.join(dir, f);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Removed duplicate: ${f}`);
  }
});

console.log('Screenshots cleanup completed successfully!');
