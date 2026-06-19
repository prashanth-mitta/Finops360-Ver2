/* eslint-disable no-unused-vars */
// =============================================================================
// FinOps 360 - data-access layer
// Each module reads through the hooks below instead of importing mock data.
// When Supabase is configured, data comes from the live (RLS-protected)
// database; otherwise the bundled mock data is used so the demo keeps working.
// =============================================================================
import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured, getSupabaseCredentials } from '../lib/supabaseClient';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { queryClient } from '../lib/queryClient';
import { useAuth } from '../context/AuthContext';

// ── Fallback mock data (used only when Supabase is not configured) ───────────
import { CLIENTS, TICKETS, TEAM, NOTIFICATIONS } from '../data/mockData';
import { MOCK_TASKS, PROJECTS, TEAM_MEMBERS } from '../pages/tasks/taskData';
import { MOCK_INVOICES } from '../pages/invoices/invoiceData';
import { COMPLIANCE_DEADLINES, MOCK_AUDIT_LOGS } from '../pages/compliance/complianceData';
import { MOCK_NOTIFICATIONS, MOCK_ANNOUNCEMENTS, COMM_LOG } from '../pages/notifications/notificationData';
import { PARTNER_CLIENTS, PARTNER_TICKETS, PARTNER_ASSOCIATES } from '../pages/partners/partnerData';

const d10 = (v) => (v ? String(v).slice(0, 10) : v);

// ── Row mappers (DB snake_case -> app camelCase shapes) ──────────────────────
const mapClient = (r) => ({
  id: r.id, name: r.name, gstin: r.gstin, pan: r.pan, contact: r.contact,
  email: r.email, phone: r.phone, city: r.city, address: r.address,
  state: r.state, stateCode: r.state_code, status: r.status, plan: r.plan,
  since: d10(r.since), manager: r.manager,
});

const mapTicket = (r) => ({
  id: r.code || r.id, rowId: r.id, client: r.client_name, type: r.type,
  title: r.title, priority: r.priority, status: r.status, assignee: r.assignee,
  stage: r.stage, created: d10(r.created), due: d10(r.due),
});

const mapAssociate = (r) => ({
  id: r.id, name: r.name, role: r.role, email: r.email, phone: r.phone,
  department: r.department, status: r.status, joined: d10(r.joined),
  clients: r.clients_count ?? 0, tickets: r.tickets_count ?? 0,
});

const mapTask = (r) => ({
  id: r.id, projectId: r.project_id, title: r.title, desc: r.description,
  status: r.status, priority: r.priority, category: r.category,
  dueDate: d10(r.due_date), createdAt: d10(r.created_at), tags: r.tags || [],
  assignees: (r.task_assignees || []).map((a) => a.member_id),
  comments: (r.task_comments || []).map((c) => ({ id: c.id, userId: c.user_id, text: c.text, at: c.at })),
  checklist: (r.task_checklist || [])
    .slice()
    .sort((a, b) => (a.position || 0) - (b.position || 0))
    .map((c) => ({ id: c.id, label: c.label, done: c.done })),
});

const mapProject = (r) => ({ id: r.id, name: r.name, color: r.color, clientId: r.client_id, client: r.client_name });
const mapMember = (r) => ({ id: r.id, name: r.name, role: r.role, avatar: r.avatar, color: r.color });

const mapInvoice = (r) => ({
  id: r.id, clientId: r.client_id, clientName: r.client_name,
  issueDate: d10(r.issue_date), dueDate: d10(r.due_date), status: r.status,
  paidDate: d10(r.paid_date), paidAmount: r.paid_amount != null ? Number(r.paid_amount) : undefined,
  notes: r.notes, isInterState: r.is_inter_state,
  items: (r.invoice_items || [])
    .slice()
    .sort((a, b) => (a.position || 0) - (b.position || 0))
    .map((it) => ({ desc: it.description, qty: Number(it.qty), rate: Number(it.rate), gstRate: Number(it.gst_rate) })),
});

const mapCompliance = (r) => ({
  id: r.id, category: r.category, title: r.title, description: r.description,
  dueDate: d10(r.due_date), status: r.status, priority: r.priority,
  assignee: r.assignee, clientId: r.client_id, client: r.client_name, recurring: r.recurring,
});

const mapAudit = (r) => ({
  id: r.id, userId: r.user_id, userName: r.user_name, role: r.role,
  action: r.action, module: r.module, detail: r.detail, ip: r.ip, at: r.at,
});

const mapNotification = (r) => ({
  id: r.id, type: r.type, title: r.title, body: r.body, read: r.read, pinned: r.pinned,
  createdAt: r.created_at, targetRoles: r.target_roles || [], linkedId: r.linked_id, linkedModule: r.linked_module,
});

const mapAnnouncement = (r) => ({
  id: r.id, title: r.title, body: r.body, priority: r.priority,
  targetRoles: r.target_roles || [], author: r.author, createdAt: r.created_at, expiresAt: d10(r.expires_at),
});

const mapComm = (r) => ({ id: r.id, channel: r.channel, to: r.to_addr, subject: r.subject, status: r.status, sentAt: r.sent_at, trigger: r.trigger });

const mapProfile = (r) => ({
  id: r.id,
  tenantId: r.tenant_id,
  name: r.name,
  email: r.email,
  role: r.role,
  avatar: r.avatar,
  phone: r.phone,
  createdAt: r.created_at,
});

// ── Generic loader: run a Supabase query, else return the fallback ───────────
async function load(fallback, queryFn) {
  if (!isSupabaseConfigured) return fallback;
  const { data, error } = await queryFn();
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[FinOps360] query failed:', error.message);
    throw new Error(error.message);
  }
  return data ?? fallback;
}

function useList(key, fallback, queryFn) {
  const { currentUser } = useAuth();
  const live = isSupabaseConfigured && Boolean(currentUser);

  const query = useQuery({
    queryKey: [...key, currentUser?.tenantId],
    queryFn: () => load(fallback, queryFn),
    enabled: live || !isSupabaseConfigured,
    initialData: isSupabaseConfigured ? undefined : fallback,
    refetchOnMount: 'always',
    retry: 2,
  });

  if (!isSupabaseConfigured) return { data: fallback, loading: false, error: null };
  return {
    data: query.data ?? (query.isFetched ? [] : undefined),
    loading: live && !query.isFetched && query.isLoading,
    error: query.error?.message || null,
  };
}

function useData(key, fallback, queryFn) {
  const { data } = useList(key, fallback, queryFn);
  if (!isSupabaseConfigured) return fallback;
  return data ?? [];
}

// ── Read hooks ───────────────────────────────────────────────────────────────
export function useClients() {
  return useData(['clients'], CLIENTS, async () => {
    const r = await supabase.from('clients').select('*').order('name');
    return { data: (r.data || []).map(mapClient), error: r.error };
  });
}

export function useClientsQuery() {
  const result = useList(['clients'], CLIENTS, async () => {
    const r = await supabase.from('clients').select('*').order('name');
    return { data: (r.data || []).map(mapClient), error: r.error };
  });
  return { ...result, items: result.data ?? [] };
}

export function useTickets() {
  const fallback = TICKETS.map((t) => ({ ...t, rowId: t.id }));
  return useData(['tickets'], fallback, async () => {
    const r = await supabase.from('tickets').select('*').order('created', { ascending: false });
    return { data: (r.data || []).map(mapTicket), error: r.error };
  });
}

export function useTicketsQuery() {
  const fallback = TICKETS.map((t) => ({ ...t, rowId: t.id }));
  const result = useList(['tickets'], fallback, async () => {
    const r = await supabase.from('tickets').select('*').order('created', { ascending: false });
    return { data: (r.data || []).map(mapTicket), error: r.error };
  });
  return { ...result, items: result.data ?? [] };
}

export function useProfiles() {
  return useData(['profiles'], [], async () => {
    const r = await supabase.from('profiles').select('*').order('name');
    return { data: (r.data || []).map(mapProfile), error: r.error };
  });
}

export function useProfilesQuery() {
  const result = useList(['profiles'], [], async () => {
    const r = await supabase.from('profiles').select('*').order('name');
    return { data: (r.data || []).map(mapProfile), error: r.error };
  });
  return { ...result, items: result.data ?? [] };
}

export function useTeam() {
  return useData(['associates'], TEAM, async () => {
    const r = await supabase.from('associates').select('*').order('name');
    return { data: (r.data || []).map(mapAssociate), error: r.error };
  });
}

export function useTeamQuery() {
  const result = useList(['associates'], TEAM, async () => {
    const r = await supabase.from('associates').select('*').order('name');
    return { data: (r.data || []).map(mapAssociate), error: r.error };
  });
  return { ...result, items: result.data ?? [] };
}

export function useTasks() {
  return useData(['tasks'], MOCK_TASKS, async () => {
    const r = await supabase
      .from('tasks')
      .select('*, task_assignees(member_id), task_checklist(id,label,done,position), task_comments(id,user_id,text,at)')
      .order('created_at', { ascending: false });
    return { data: (r.data || []).map(mapTask), error: r.error };
  });
}

export function useProjects() {
  return useData(['projects'], PROJECTS, async () => {
    const r = await supabase.from('projects').select('*').order('name');
    return { data: (r.data || []).map(mapProject), error: r.error };
  });
}

export function useTeamMembers() {
  return useData(['team_members'], TEAM_MEMBERS, async () => {
    const r = await supabase.from('team_members').select('*').order('name');
    return { data: (r.data || []).map(mapMember), error: r.error };
  });
}

export function useInvoices() {
  return useData(['invoices'], MOCK_INVOICES, async () => {
    const r = await supabase.from('invoices').select('*, invoice_items(*)').order('issue_date', { ascending: false });
    return { data: (r.data || []).map(mapInvoice), error: r.error };
  });
}

export function useCompliance() {
  return useData(['compliance'], COMPLIANCE_DEADLINES, async () => {
    const r = await supabase.from('compliance_items').select('*').order('due_date');
    return { data: (r.data || []).map(mapCompliance), error: r.error };
  });
}

export function useAuditLogs() {
  return useData(['audit_logs'], MOCK_AUDIT_LOGS, async () => {
    const r = await supabase.from('audit_logs').select('*').order('at', { ascending: false });
    return { data: (r.data || []).map(mapAudit), error: r.error };
  });
}

export function useNotifications() {
  return useData(['notifications'], MOCK_NOTIFICATIONS, async () => {
    const r = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    return { data: (r.data || []).map(mapNotification), error: r.error };
  });
}

export function useAnnouncements() {
  return useData(['announcements'], MOCK_ANNOUNCEMENTS, async () => {
    const r = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    return { data: (r.data || []).map(mapAnnouncement), error: r.error };
  });
}

export function useCommLog() {
  return useData(['comm_log'], COMM_LOG, async () => {
    const r = await supabase.from('comm_log').select('*').order('sent_at', { ascending: false });
    return { data: (r.data || []).map(mapComm), error: r.error };
  });
}

// Master-only aggregate stats per partner (counts only - no detail rows).
export function usePartnerStats() {
  const fallback = null; // partners module derives counts from mock when null
  return useData(['partner_stats'], fallback, async () => {
    const r = await supabase.rpc('get_partner_stats');
    return { data: r.data || [], error: r.error };
  });
}

// Small notifications list for the top Header bell.
export function useHeaderNotifications() {
  return useData(['header_notifications'], NOTIFICATIONS, async () => {
    const r = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(8);
    const tone = { invoice: 'warning', payroll: 'warning', system: 'warning', ticket: 'info', document: 'info', task: 'success', announcement: 'info' };
    const data = (r.data || []).map((n) => ({ id: n.id, text: n.title, type: tone[n.type] || 'info', time: d10(n.created_at), read: n.read }));
    return { data, error: r.error };
  });
}

async function refetchKeys(tenantId, ...keys) {
  await Promise.all(
    keys.map((key) =>
      queryClient.refetchQueries({
        queryKey: tenantId ? [key, tenantId] : [key],
        type: 'active',
      }),
    ),
  );
}

async function nextTicketCode(tenantId) {
  const { data } = await supabase
    .from('tickets')
    .select('code')
    .eq('tenant_id', tenantId)
    .not('code', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1);
  const last = data?.[0]?.code;
  const num = last ? (parseInt(String(last).replace(/\D/g, ''), 10) || 0) + 1 : 1;
  return `TKT-${String(num).padStart(3, '0')}`;
}

// ── Write helpers (best-effort; safe no-ops when Supabase is not configured) ──
export async function createClient(tenantId, payload, services = []) {
  if (!tenantId) throw new Error('Missing tenant. Log out and sign in again.');

  const row = {
    tenant_id: tenantId,
    name: payload.name,
    gstin: payload.gstin || null,
    pan: payload.pan || null,
    contact: payload.contact || null,
    email: payload.email || null,
    phone: payload.phone || null,
    city: payload.city || null,
    address: payload.address || null,
    state: payload.state || null,
    state_code: payload.stateCode || null,
    status: payload.status || 'Active',
    plan: payload.plan || 'Standard',
    since: payload.since || new Date().toISOString().slice(0, 10),
    manager: payload.manager || null,
  };

  if (!isSupabaseConfigured) {
    await refetchKeys(tenantId, 'clients');
    return { id: `c${Date.now()}`, ...row };
  }

  const { data, error } = await supabase.from('clients').insert(row).select('*').single();
  if (error) throw new Error(error.message);

  if (services.length) {
    const { error: svcErr } = await supabase.from('client_services').insert(
      services.map((service) => ({ tenant_id: tenantId, client_id: data.id, service })),
    );
    if (svcErr) throw new Error(svcErr.message);
  }

  const mapped = mapClient(data);
  queryClient.setQueryData(['clients', tenantId], (old) => [...(old || []), mapped]);
  await refetchKeys(tenantId, 'clients');
  return mapped;
}

export async function createTicket(tenantId, payload) {
  if (!tenantId) throw new Error('Missing tenant. Log out and sign in again.');

  const today = new Date().toISOString().slice(0, 10);
  const title = payload.title || [payload.type, payload.period, payload.ay].filter(Boolean).join(' · ');

  if (!isSupabaseConfigured) {
    await refetchKeys(tenantId, 'tickets');
    return { id: `tk${Date.now()}`, code: 'TKT-MOCK', title };
  }

  let code = `TKT-${Date.now()}`;
  try {
    code = await nextTicketCode(tenantId);
  } catch {
    // fallback code if sequence lookup fails
  }

  const row = {
    tenant_id: tenantId,
    code,
    client_id: payload.clientId || null,
    client_name: payload.clientName || null,
    type: payload.type,
    title,
    priority: payload.priority || 'Medium',
    status: 'In Progress',
    assignee: payload.assignee || null,
    stage: 'maker',
    created: today,
    due: payload.due || null,
  };

  const { data, error } = await supabase.from('tickets').insert(row).select('*').single();
  if (error) throw new Error(error.message);

  const mapped = mapTicket(data);
  queryClient.setQueryData(['tickets', tenantId], (old) => [mapped, ...(old || [])]);
  await refetchKeys(tenantId, 'tickets');
  return mapped;
}

export async function createAssociate(tenantId, payload) {
  const row = {
    tenant_id: tenantId,
    name: payload.name,
    role: payload.role || 'Associate',
    email: payload.email || null,
    phone: payload.phone || null,
    department: payload.department || null,
    status: payload.status || 'Active',
    joined: payload.joined || new Date().toISOString().slice(0, 10),
    clients_count: 0,
    tickets_count: 0,
  };

  if (!isSupabaseConfigured) {
    await refetchKeys(tenantId, 'associates');
    return { id: `fa${Date.now()}`, ...row };
  }

  const { data, error } = await supabase.from('associates').insert(row).select('id').single();
  if (error) throw new Error(error.message);

  await refetchKeys(tenantId, 'associates');
  return data;
}

export async function updateAssociate(id, updates, tenantId) {
  const row = {};
  if (updates.name != null) row.name = updates.name;
  if (updates.role != null) row.role = updates.role;
  if (updates.email != null) row.email = updates.email;
  if (updates.phone != null) row.phone = updates.phone;
  if (updates.department != null) row.department = updates.department;
  if (updates.status != null) row.status = updates.status;
  if (updates.joined != null) row.joined = updates.joined;

  if (!isSupabaseConfigured || !id) return;
  const { error } = await supabase.from('associates').update(row).eq('id', id);
  if (error) throw new Error(error.message);
  await refetchKeys(tenantId, 'associates');
}

export async function updateProfile(id, updates, tenantId) {
  const row = {};
  if (updates.name != null) row.name = updates.name;
  if (updates.role != null) row.role = updates.role;
  if (updates.phone != null) row.phone = updates.phone;

  if (!isSupabaseConfigured || !id) return;
  const { error } = await supabase.from('profiles').update(row).eq('id', id);
  if (error) throw new Error(error.message);
  await refetchKeys(tenantId, 'profiles');
}

export async function inviteUser(tenantId, { email, password, name, role }) {
  if (!tenantId) throw new Error('Missing tenant. Log out and sign in again.');
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured on this deployment.');

  const { url, anonKey } = getSupabaseCredentials();
  const inviteClient = createSupabaseClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const avatar = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const { data, error } = await inviteClient.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { name, role, tenant_id: tenantId, avatar },
    },
  });
  if (error) throw new Error(error.message);

  await refetchKeys(tenantId, 'profiles');
  return {
    ...data,
    emailConfirmationRequired: Boolean(data.user && !data.session),
  };
}

export async function promoteTicket(rowId, nextStage, tenantId) {
  if (!isSupabaseConfigured || !rowId) return;
  const { error } = await supabase.from('tickets').update({ stage: nextStage }).eq('id', rowId);
  if (error) throw new Error(error.message);
  await refetchKeys(tenantId, 'tickets');
}

export async function setComplianceStatus(id, status) {
  if (!isSupabaseConfigured) return;
  await supabase.from('compliance_items').update({ status }).eq('id', id);
}

export async function setNotificationRead(id, read = true) {
  if (!isSupabaseConfigured) return;
  await supabase.from('notifications').update({ read }).eq('id', id);
}

export async function setNotificationPinned(id, pinned) {
  if (!isSupabaseConfigured) return;
  await supabase.from('notifications').update({ pinned }).eq('id', id);
}

export async function deleteNotification(id) {
  if (!isSupabaseConfigured) return;
  await supabase.from('notifications').delete().eq('id', id);
}
