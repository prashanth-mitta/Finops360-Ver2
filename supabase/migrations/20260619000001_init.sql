-- =============================================================================
-- FinOps 360 - Initial schema (multi-tenant)
-- Every business table carries a tenant_id (text) referencing tenants(id).
-- Tenant isolation is enforced by RLS in 20260619000002_rls.sql.
-- =============================================================================

-- gen_random_uuid() is available in Supabase (pgcrypto). Ensure it exists.
create extension if not exists pgcrypto;

-- ── Core ─────────────────────────────────────────────────────────────────────
create table if not exists public.tenants (
  id            text primary key,                 -- 'finops', 'p001', ...
  firm_name     text not null,
  tagline       text,
  logo_text     text,
  primary_color text default '#6366f1',
  accent_color  text default '#4f46e5',
  email         text,
  phone         text,
  address       text,
  gstin         text,
  is_active     boolean not null default true,
  is_master     boolean not null default false,
  plan          text default 'starter',
  created_at    timestamptz not null default now()
);

-- Profiles are linked 1:1 with auth.users and carry the tenant + role.
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  tenant_id  text not null references public.tenants(id) on delete cascade,
  name       text not null,
  email      text unique not null,
  role       text not null,                       -- master_admin | sales | hr | associate | client
  avatar     text,
  phone      text,
  created_at timestamptz not null default now()
);
create index if not exists idx_profiles_tenant on public.profiles(tenant_id);

-- ── Staff directory (task/compliance/audit references like u1..u6) ────────────
create table if not exists public.team_members (
  id         text primary key default gen_random_uuid()::text,
  tenant_id  text not null references public.tenants(id) on delete cascade,
  name       text not null,
  role       text,
  avatar     text,
  color      text,
  email      text,
  created_at timestamptz not null default now()
);
create index if not exists idx_team_members_tenant on public.team_members(tenant_id);

-- ── Clients ──────────────────────────────────────────────────────────────────
create table if not exists public.clients (
  id         text primary key default gen_random_uuid()::text,
  tenant_id  text not null references public.tenants(id) on delete cascade,
  name       text not null,
  gstin      text,
  pan        text,
  contact    text,
  email      text,
  phone      text,
  city       text,
  address    text,
  state      text,
  state_code text,
  status     text default 'Active',
  plan       text,
  since      date,
  manager    text,
  created_at timestamptz not null default now()
);
create index if not exists idx_clients_tenant on public.clients(tenant_id);

create table if not exists public.client_services (
  id        text primary key default gen_random_uuid()::text,
  tenant_id text not null references public.tenants(id) on delete cascade,
  client_id text not null references public.clients(id) on delete cascade,
  service   text not null
);
create index if not exists idx_client_services_tenant on public.client_services(tenant_id);

-- ── Tickets (Maker -> Checker -> Approved) ───────────────────────────────────
create table if not exists public.tickets (
  id          text primary key default gen_random_uuid()::text,
  tenant_id   text not null references public.tenants(id) on delete cascade,
  code        text,                               -- e.g. TKT-001
  client_id   text references public.clients(id) on delete set null,
  client_name text,
  type        text,
  title       text,
  priority    text default 'Medium',
  status      text default 'In Progress',
  assignee    text,
  stage       text default 'maker',               -- maker | checker | approved
  created     date,
  due         date,
  created_at  timestamptz not null default now()
);
create index if not exists idx_tickets_tenant on public.tickets(tenant_id);

create table if not exists public.ticket_comments (
  id         text primary key default gen_random_uuid()::text,
  tenant_id  text not null references public.tenants(id) on delete cascade,
  ticket_id  text not null references public.tickets(id) on delete cascade,
  user_id    text,
  text       text,
  at         timestamptz not null default now()
);
create index if not exists idx_ticket_comments_tenant on public.ticket_comments(tenant_id);

-- ── Projects & Tasks ─────────────────────────────────────────────────────────
create table if not exists public.projects (
  id          text primary key default gen_random_uuid()::text,
  tenant_id   text not null references public.tenants(id) on delete cascade,
  name        text not null,
  color       text,
  client_id   text references public.clients(id) on delete set null,
  client_name text
);
create index if not exists idx_projects_tenant on public.projects(tenant_id);

create table if not exists public.tasks (
  id          text primary key default gen_random_uuid()::text,
  tenant_id   text not null references public.tenants(id) on delete cascade,
  project_id  text references public.projects(id) on delete set null,
  title       text not null,
  description text,
  status      text default 'todo',                -- todo | in_progress | review | done
  priority    text default 'medium',              -- low | medium | high | urgent
  category    text,
  due_date    date,
  tags        text[] default '{}',
  created_at  timestamptz not null default now()
);
create index if not exists idx_tasks_tenant on public.tasks(tenant_id);

create table if not exists public.task_assignees (
  id        text primary key default gen_random_uuid()::text,
  tenant_id text not null references public.tenants(id) on delete cascade,
  task_id   text not null references public.tasks(id) on delete cascade,
  member_id text not null
);
create index if not exists idx_task_assignees_tenant on public.task_assignees(tenant_id);

create table if not exists public.task_checklist (
  id        text primary key default gen_random_uuid()::text,
  tenant_id text not null references public.tenants(id) on delete cascade,
  task_id   text not null references public.tasks(id) on delete cascade,
  label     text not null,
  done      boolean not null default false,
  position  int default 0
);
create index if not exists idx_task_checklist_tenant on public.task_checklist(tenant_id);

create table if not exists public.task_comments (
  id        text primary key default gen_random_uuid()::text,
  tenant_id text not null references public.tenants(id) on delete cascade,
  task_id   text not null references public.tasks(id) on delete cascade,
  user_id   text,
  text      text,
  at        timestamptz not null default now()
);
create index if not exists idx_task_comments_tenant on public.task_comments(tenant_id);

-- ── Invoices ─────────────────────────────────────────────────────────────────
create table if not exists public.invoices (
  id             text primary key default gen_random_uuid()::text,
  tenant_id      text not null references public.tenants(id) on delete cascade,
  client_id      text references public.clients(id) on delete set null,
  client_name    text,
  issue_date     date,
  due_date       date,
  status         text default 'draft',            -- draft | sent | partial | paid | overdue
  paid_date      date,
  paid_amount    numeric(14,2),
  notes          text,
  is_inter_state boolean not null default false,
  created_at     timestamptz not null default now()
);
create index if not exists idx_invoices_tenant on public.invoices(tenant_id);

create table if not exists public.invoice_items (
  id          text primary key default gen_random_uuid()::text,
  tenant_id   text not null references public.tenants(id) on delete cascade,
  invoice_id  text not null references public.invoices(id) on delete cascade,
  description text,
  qty         numeric(12,2) default 1,
  rate        numeric(14,2) default 0,
  gst_rate    numeric(5,2) default 18,
  position    int default 0
);
create index if not exists idx_invoice_items_tenant on public.invoice_items(tenant_id);

-- ── HR / Associates & Payroll ────────────────────────────────────────────────
create table if not exists public.associates (
  id            text primary key default gen_random_uuid()::text,
  tenant_id     text not null references public.tenants(id) on delete cascade,
  name          text not null,
  role          text,
  email         text,
  phone         text,
  department    text,
  status        text default 'Active',
  joined        date,
  clients_count int default 0,
  tickets_count int default 0,
  created_at    timestamptz not null default now()
);
create index if not exists idx_associates_tenant on public.associates(tenant_id);

create table if not exists public.payroll (
  id           text primary key default gen_random_uuid()::text,
  tenant_id    text not null references public.tenants(id) on delete cascade,
  associate_id text references public.associates(id) on delete cascade,
  month        text,
  amount       numeric(14,2),
  status       text default 'pending',
  created_at   timestamptz not null default now()
);
create index if not exists idx_payroll_tenant on public.payroll(tenant_id);

-- ── Documents ────────────────────────────────────────────────────────────────
create table if not exists public.documents (
  id          text primary key default gen_random_uuid()::text,
  tenant_id   text not null references public.tenants(id) on delete cascade,
  name        text not null,
  type        text,
  category    text,
  status      text default 'active',
  client_id   text references public.clients(id) on delete set null,
  client_name text,
  uploaded_by text,
  file_path   text,
  size_bytes  bigint,
  tags        text[] default '{}',
  created_at  timestamptz not null default now()
);
create index if not exists idx_documents_tenant on public.documents(tenant_id);

create table if not exists public.document_versions (
  id          text primary key default gen_random_uuid()::text,
  tenant_id   text not null references public.tenants(id) on delete cascade,
  document_id text not null references public.documents(id) on delete cascade,
  version     int not null default 1,
  file_path   text,
  uploaded_by text,
  created_at  timestamptz not null default now()
);
create index if not exists idx_document_versions_tenant on public.document_versions(tenant_id);

create table if not exists public.document_activity (
  id          text primary key default gen_random_uuid()::text,
  tenant_id   text not null references public.tenants(id) on delete cascade,
  document_id text references public.documents(id) on delete cascade,
  user_id     text,
  user_name   text,
  action      text,
  ip          text,
  device      text,
  at          timestamptz not null default now()
);
create index if not exists idx_document_activity_tenant on public.document_activity(tenant_id);

-- ── Compliance & Audit ───────────────────────────────────────────────────────
create table if not exists public.compliance_items (
  id          text primary key default gen_random_uuid()::text,
  tenant_id   text not null references public.tenants(id) on delete cascade,
  category    text,
  title       text,
  description text,
  due_date    date,
  status      text default 'pending',             -- pending | in_progress | completed
  priority    text default 'medium',
  assignee    text,
  client_id   text references public.clients(id) on delete set null,
  client_name text,
  recurring   text,
  created_at  timestamptz not null default now()
);
create index if not exists idx_compliance_items_tenant on public.compliance_items(tenant_id);

create table if not exists public.audit_logs (
  id         text primary key default gen_random_uuid()::text,
  tenant_id  text not null references public.tenants(id) on delete cascade,
  user_id    text,
  user_name  text,
  role       text,
  action     text,
  module     text,
  detail     text,
  ip         text,
  at         timestamptz not null default now()
);
create index if not exists idx_audit_logs_tenant on public.audit_logs(tenant_id);

-- ── Notifications & Comms ────────────────────────────────────────────────────
create table if not exists public.notifications (
  id            text primary key default gen_random_uuid()::text,
  tenant_id     text not null references public.tenants(id) on delete cascade,
  type          text,
  title         text,
  body          text,
  read          boolean not null default false,
  pinned        boolean not null default false,
  target_roles  text[] default '{}',
  linked_id     text,
  linked_module text,
  created_at    timestamptz not null default now()
);
create index if not exists idx_notifications_tenant on public.notifications(tenant_id);

create table if not exists public.announcements (
  id           text primary key default gen_random_uuid()::text,
  tenant_id    text not null references public.tenants(id) on delete cascade,
  title        text,
  body         text,
  priority     text default 'normal',
  target_roles text[] default '{}',
  author       text,
  expires_at   date,
  created_at   timestamptz not null default now()
);
create index if not exists idx_announcements_tenant on public.announcements(tenant_id);

create table if not exists public.alert_settings (
  id        text primary key default gen_random_uuid()::text,
  tenant_id text not null references public.tenants(id) on delete cascade,
  user_id   uuid references auth.users(id) on delete cascade,
  event_key text not null,
  email     boolean not null default false,
  sms       boolean not null default false,
  inapp     boolean not null default true,
  unique (user_id, event_key)
);
create index if not exists idx_alert_settings_tenant on public.alert_settings(tenant_id);

create table if not exists public.comm_log (
  id         text primary key default gen_random_uuid()::text,
  tenant_id  text not null references public.tenants(id) on delete cascade,
  channel    text,                                -- email | sms
  to_addr    text,
  subject    text,
  status     text default 'pending',              -- delivered | pending | failed
  trigger    text,
  sent_at    timestamptz not null default now()
);
create index if not exists idx_comm_log_tenant on public.comm_log(tenant_id);

-- ── Firm settings (one row per tenant) ───────────────────────────────────────
create table if not exists public.firm_settings (
  tenant_id  text primary key references public.tenants(id) on delete cascade,
  name       text,
  gstin      text,
  pan        text,
  address    text,
  state      text,
  state_code text,
  email      text,
  phone      text,
  bank_name  text,
  account_no text,
  ifsc       text,
  updated_at timestamptz not null default now()
);
