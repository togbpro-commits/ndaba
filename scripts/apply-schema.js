const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Try regional IPv4 connection poolers to bypass IPv6 and firewall limitations
const REGIONS = [
  'eu-west-1',     // Ireland (Default Europe)
  'us-east-1',     // N. Virginia (Default US)
  'eu-central-1',  // Frankfurt
  'ap-southeast-1' // Singapore
];

const PORTS = [5432, 6543]; // Try session port 5432 first, then transaction port 6543

async function run() {
  const schemaPath = path.resolve(process.cwd(), 'supabase_schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error('❌ supabase_schema.sql not found!');
    process.exit(1);
  }
  console.log('📖 Reading supabase_schema.sql...');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  let success = false;

  for (const region of REGIONS) {
    for (const port of PORTS) {
      const poolerHost = `aws-0-${region}.pooler.supabase.com`;
      const poolerUser = 'postgres.mmlwbgbtcznfsqtpujjp';
      const poolerPass = 'Reepermwangi10';
      const connectionString = `postgresql://${poolerUser}:${poolerPass}@${poolerHost}:${port}/postgres`;

      console.log(`🔌 Attempting IPv4 Pooler connection: Region=${region}, Port=${port}...`);

      const client = new Client({
        connectionString,
        connectionTimeoutMillis: 15000, // 15 second timeout to be safe
        ssl: {
          rejectUnauthorized: false
        }
      });

      try {
        await client.connect();
        console.log(`✅ Connected successfully to ${region} pooler on port ${port}!`);
        
        console.log('⚡ Executing schema on the database (this may take a few seconds)...');
        await client.query(sql);
        console.log('🎉 SCHEMA APPLIED SUCCESSFULLY!');
        
        await client.end();
        success = true;
        break;
      } catch (err) {
        console.log(`⚠️ Connection to ${region}:${port} failed or timed out:`, err.message || err);
        try {
          await client.end();
        } catch (_) {}
      }
    }
    if (success) break;
  }

  if (!success) {
    console.error('❌ Failed to connect to any regional database connection poolers. Please verify your internet connection or database status.');
    process.exit(1);
  }
}

run();
