const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env file
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      // Remove surrounding quotes if any
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase credentials in .env file!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
  console.log('Connecting to Supabase at:', supabaseUrl);
  
  try {
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .limit(1);

    if (leadsError) {
      console.error('❌ Error querying "leads" table:', leadsError.message, `(Code: ${leadsError.code})`);
    } else {
      console.log('✅ "leads" table verified successfully! Found records:', leads.length);
    }

    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select('*')
      .limit(1);

    if (casesError) {
      console.error('❌ Error querying "cases" table:', casesError.message, `(Code: ${casesError.code})`);
    } else {
      console.log('✅ "cases" table verified successfully! Found records:', cases.length);
    }
  } catch (err) {
    console.error('❌ Connection or verification crashed:', err);
  }
}

verify();
