import { createClient } from '@supabase/supabase-js';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  message: string;
  status: 'New' | 'Contacted' | 'Consultation Booked' | 'Client' | 'Closed/Lost';
  notes: string;
  created_at: string;
}

export interface CaseDocument {
  name: string;
  url: string;
  size: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  uploaded_at: string;
}

export interface Case {
  id: string;
  case_number?: string;
  access_key?: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  case_title: string;
  status: 'Open' | 'In Progress' | 'Awaiting Documents' | 'Complete';
  practice_area: string;
  key_dates: string;
  created_at: string;
  documents?: CaseDocument[];
}

export interface PopiaAuditLog {
  id: string;
  case_id: string;
  case_title: string;
  document_name: string;
  action: 'Viewed' | 'Approved' | 'Rejected' | 'Uploaded';
  user_email: string;
  created_at: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const db = {
  isMock: false,

  // Leads
  async getLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Supabase error getting leads:', error);
      throw new Error(`Supabase error getting leads: ${error.message}`);
    }
    return data as Lead[];
  },

  async insertLead(lead: Omit<Lead, 'id' | 'status' | 'notes' | 'created_at'>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        service_type: lead.service_type,
        message: lead.message,
        status: 'New',
        notes: ''
      })
      .select()
      .single();
    if (error) {
      console.error('Supabase error inserting lead:', error);
      throw new Error(`Supabase error inserting lead: ${error.message}`);
    }
    return data as Lead;
  },

  async updateLeadStatus(id: string, status: Lead['status'], notes?: string): Promise<Lead | null> {
    const updateData: Partial<Lead> = { status };
    if (notes !== undefined) updateData.notes = notes;
    
    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('Supabase error updating lead status:', error);
      throw new Error(`Supabase error updating lead status: ${error.message}`);
    }
    return data as Lead;
  },

  async deleteLead(id: string): Promise<boolean> {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) {
      console.error('Supabase error deleting lead:', error);
      throw new Error(`Supabase error deleting lead: ${error.message}`);
    }
    return true;
  },

  // Cases
  async getCases(): Promise<Case[]> {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Supabase error getting cases:', error);
      throw new Error(`Supabase error getting cases: ${error.message}`);
    }
    return data as Case[];
  },

  async insertCase(matter: Omit<Case, 'id' | 'created_at'>): Promise<Case> {
    const { data, error } = await supabase
      .from('cases')
      .insert(matter)
      .select()
      .single();
    if (error) {
      console.error('Supabase error inserting case:', error);
      throw new Error(`Supabase error inserting case: ${error.message}`);
    }
    return data as Case;
  },

  async getCaseByNumberAndKey(caseNumber: string, accessKey: string): Promise<Case | null> {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('case_number', caseNumber.trim())
      .eq('access_key', accessKey.trim())
      .maybeSingle();
    if (error) {
      console.error('Supabase error getting case by number and key:', error);
      throw new Error(`Supabase error getting case by number and key: ${error.message}`);
    }
    return data as Case | null;
  },

  async updateCase(id: string, fields: Partial<Omit<Case, 'id' | 'created_at'>>): Promise<Case | null> {
    const { data, error } = await supabase
      .from('cases')
      .update(fields)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('Supabase error updating case:', error);
      throw new Error(`Supabase error updating case: ${error.message}`);
    }
    return data as Case;
  },

  async deleteCase(id: string): Promise<boolean> {
    const { error } = await supabase.from('cases').delete().eq('id', id);
    if (error) {
      console.error('Supabase error deleting case:', error);
      throw new Error(`Supabase error deleting case: ${error.message}`);
    }
    return true;
  },

  // Storage Uploads
  async uploadFile(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `fica/${fileName}`;

    // Attempt programmatically to ensure bucket exists
    try {
      await supabase.storage.createBucket('fica-documents', { public: true });
    } catch {
      // Ignores error if bucket already exists
    }

    const { data, error } = await supabase.storage
      .from('fica-documents')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (error) {
      console.error('Supabase storage upload failed:', error);
      throw new Error(`Supabase storage upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('fica-documents')
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || null;
  },

  // POPIA Audit Logs
  async getPopiaLogs(): Promise<PopiaAuditLog[]> {
    const { data, error } = await supabase
      .from('popia_audit_logs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Supabase error getting POPIA logs:', error);
      throw new Error(`Supabase error getting POPIA logs: ${error.message}`);
    }
    return data as PopiaAuditLog[];
  },

  async insertPopiaLog(log: Omit<PopiaAuditLog, 'id' | 'created_at'>): Promise<PopiaAuditLog> {
    const { data, error } = await supabase
      .from('popia_audit_logs')
      .insert({
        case_id: log.case_id,
        case_title: log.case_title,
        document_name: log.document_name,
        action: log.action,
        user_email: log.user_email
      })
      .select()
      .single();
    if (error) {
      console.error('Supabase error inserting POPIA log:', error);
      throw new Error(`Supabase error inserting POPIA log: ${error.message}`);
    }
    return data as PopiaAuditLog;
  }
};
