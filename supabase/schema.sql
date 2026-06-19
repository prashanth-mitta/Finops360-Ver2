-- =============================================================================
-- FinOps 360 Connect — Canonical Database Schema (Full)
-- =============================================================================
--
-- Version     : 1.0.0
-- Database    : PostgreSQL 15+ (Supabase)
-- Purpose     : Single source-of-truth DDL for all 13 application modules.
--
-- HOW TO USE
-- ----------
-- Fresh Supabase project (SQL Editor — run top to bottom):
--   1. This file          → structure + security + storage
--   2. seed.sql           → demo tenants, users, sample data
--
-- Fresh local Postgres (structure only — no Auth/Storage):
--   Run sections marked [CORE] only; skip [SUPABASE-AUTH] and [SUPABASE-STORAGE].
--
-- Already migrated via CLI (`supabase db push`):
--   Do NOT re-run on production unless rebuilding from scratch.
--   Use supabase/migrations/*.sql for incremental changes going forward.
--
-- FILE LAYOUT
-- -----------
--   §0  Conventions & enums
--   §1  Extensions
--   §2  Core platform        (tenants, profiles)
--   §3  Module 2 — Clients
--   §4  Module 3 — Tickets
--   §5  Module 10 — Tasks
--   §6  Module 9 — Invoices
--   §7  Module 4 — HR
--   §8  Module 8 — Documents
--   §9  Module 12 — Compliance & audit
--   §10 Module 11 — Notifications
--   §11 Module 7 — Settings
--   §12 Helper functions     [SUPABASE-AUTH]
--   §13 Row Level Security
--   §14 Views & RPCs
--   §15 Storage              [SUPABASE-STORAGE]
--
-- MODULE → TABLE MAP
-- ------------------
--   M01 Auth/Dashboard  → tenants, profiles
--   M02 Clients         → clients, client_services
--   M03 Tickets         → tickets, ticket_comments
--   M04 HR              → associates, payroll, team_members
--   M08 Documents       → documents, document_versions, document_activity
--   M09 Invoices        → invoices, invoice_items
--   M10 Tasks           → projects, tasks, task_assignees, task_checklist, task_comments
--   M11 Notifications   → notifications, announcements, alert_settings, comm_log
--   M12 Compliance      → compliance_items, audit_logs
--   M13 Partners        → tenants (is_master=false), partner_stats view
--   M07 Settings        → firm_settings
--
-- DESIGN STANDARDS (all new tables MUST follow)
-- ---------------------------------------------
--   • snake_case table and column names
--   • Every business table has tenant_id → tenants(id) ON DELETE CASCADE
--   • Primary keys: text (gen_random_uuid()::text) or uuid for profiles
--   • Timestamps: created_at timestamptz NOT NULL DEFAULT now()
--   • Money: numeric(14,2) — store in rupees/paise as decimal, never float
--   • Status/role fields: text + CHECK constraint (document allowed values)
--   • Index: idx_<table>_tenant on tenant_id (required for RLS performance)
--   • RLS: enable + tenant_isolation policy (tenant_id = current_tenant_id())
--   • Never expose partner detail rows to master tenant — use partner_stats RPC
--
-- =============================================================================


-- =============================================================================
-- §0  ENUMS (CHECK constraints — portable, no custom TYPE required)
-- =============================================================================

-- Allowed values are enforced inline on each table below.
-- Canonical role values : master_admin | sales | hr | associate | client
-- Ticket stage          : maker | checker | approved
-- Task status           : todo | in_progress | review | done
-- Task priority         : low | medium | high | urgent
-- Invoice status        : draft | sent | partial | paid | overdue
-- Compliance status     : pending | in_progress | completed


-- =============================================================================
-- §1  EXTENSIONS [CORE]
-- =============================================================================

create extension if not exists pgcrypto;   -- gen_random_uuid(), crypt()


-- =============================================================================
-- §2  CORE PLATFORM [CORE]
-- =============================================================================

-- Master platform (finops) + partner CA firms (p001, p002, …)
create table if not exists public.tenants (
  id            text        primary key,
  firm_name     text        not null,
  tagline       text,
  logo_text     text,
  primary_color text        default '#6366f1',
  accent_color  text        default '#4f46e5',
  email         text,
  phone         text,
  address       text,
  gstin         text,
  is_active     boolean     not null default true,
  is_master     boolean     not null default false,
  plan          text        default 'starter'
                check (plan in ('starter', 'professional', 'master')),
  created_at    timestamptz not null default now()
);

comment on table public.tenants is
  'Registry of platform owner (finops) and partner CA firms. One row per tenant.';

-- 1:1 with auth.users — carries tenant_id + RBAC role for RLS
create table if not exists public.profiles (
  id         uuid        primary key references auth.users(id) on delete cascade,
  tenant_id  text        not null references public.tenants(id) on delete cascade,
  name       text        not null,
  email      text        unique not null,
  role       text        not null
             check (role in ('master_admin','sales','hr','associate','client')),
  avatar     text,
  phone      text,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_tenant   on public.profiles(tenant_id);
create index if not exists idx_profiles_tenant_role on public.profiles(tenant_id, role);

comment on table public.profiles is
  'Application user profile linked to Supabase Auth. Drives RBAC and tenant isolation.';


-- =============================================================================
-- §3  MODULE 2 — CLIENT MANAGEMENT [CORE]
-- =============================================================================

create table if not exists public.clients (
  id         text        primary key default gen_random_uuid()::text,
  tenant_id  text        not null references public.tenants(id) on delete cascade,
  name       text        not null,
  gstin      text,
  pan        text,
  contact    text,
  email      text,
  phone      text,
  city       text,
  address    text,
  state      text,
  state_code text,                          -- GST state code e.g. '36' Telangana
  status     text        default 'Active'
             check (status in ('Active','Onboarding','Inactive')),
  plan       text,
  since      date,
  manager    text,
  created_at timestamptz not null default now()
);

create index if not exists idx_clients_tenant        on public.clients(tenant_id);
create index if not exists idx_clients_tenant_status on public.clients(tenant_id, status);

create table if not exists public.client_services (
  id        text primary key default gen_random_uuid()::text,
  tenant_id text not null references public.tenants(id) on delete cascade,
  client_id text not null references public.clients(id) on delete cascade,
  service   text not null                   -- e.g. GST, ITR, Audit, Payroll
);

create index if not exists idx_client_services_tenant on public.client_services(tenant_id);
create index if not exists idx_client_services_client on public.client_services(client_id);


-- =============================================================================
-- §4  MODULE 3 — TICKETS (Maker → Checker → Approved) [CORE]
-- =============================================================================

create table if not exists public.tickets (
  id          text primary key default gen_random_uuid()::text,
  tenant_id   text not null references public.tenants(id) on delete cascade,
  code        text,                          -- human-readable e.g. TKT-001
  client_id   text references public.clients(id) on delete set null,
  client_name text,                          -- denormalized for list views
  type        text,                          -- GST Filing, ITR Filing, …
  title       text,
  priority    text default 'Medium'
              check (priority in ('Low','Medium','High')),
  status      text default 'In Progress',
  assignee    text,
  stage       text default 'maker'
              check (stage in ('maker','checker','approved')),
  created     date,
  due         date,
  created_at  timestamptz not null default now()
);

create index if not exists idx_tickets_tenant      on public.tickets(tenant_id);
create index if not exists idx_tickets_tenant_stage on public.tickets(tenant_id, stage);
create unique index if not exists idx_tickets_tenant_code
  on public.tickets(tenant_id, code) where code is not null;

create table if not exists public.ticket_comments (
  id        text primary key default gen_random_uuid()::text,
  tenant_id text not null references public.tenants(id) on delete cascade,
  ticket_id text not null references public.tickets(id) on delete cascade,
  user_id   text,
  text      text,
  at        timestamptz not null default now()
);

create index if not exists idx_ticket_comments_ticket on public.ticket_comments(ticket_id);


-- =============================================================================
-- §5  MODULE 10 — TASKS & WORK MANAGEMENT [CORE]
-- =============================================================================

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
  status      text default 'todo'
              check (status in ('todo','in_progress','review','done')),
  priority    text default 'medium'
              check (priority in ('low','medium','high','urgent')),
  category    text,
  due_date    date,
  tags        text[] default '{}',
  created_at  timestamptz not null default now()
);

create index if not exists idx_tasks_tenant        on public.tasks(tenant_id);
create index if not exists idx_tasks_tenant_status on public.tasks(tenant_id, status);

create table if not exists public.task_assignees (
  id        text primary key default gen_random_uuid()::text,
  tenant_id text not null references public.tenants(id) on delete cascade,
  task_id   text not null references public.tasks(id) on delete cascade,
  member_id text not null,
  unique (task_id, member_id)
);

create table if not exists public.task_checklist (
  id        text primary key default gen_random_uuid()::text,
  tenant_id text not null references public.tenants(id) on delete cascade,
  task_id   text not null references public.tasks(id) on delete cascade,
  label     text not null,
  done      boolean not null default false,
  position  int default 0
);

create table if not exists public.task_comments (
  id        text primary key default gen_random_uuid()::text,
  tenant_id text not null references public.tenants(id) on delete cascade,
  task_id   text not null references public.tasks(id) on delete cascade,
  user_id   text,
  text      text,
  at        timestamptz not null default now()
);

-- Lightweight staff directory for task/compliance assignee references
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


-- =============================================================================
-- §6  MODULE 9 — INVOICING & BILLING [CORE]
-- =============================================================================

create table if not exists public.invoices (
  id             text primary key default gen_random_uuid()::text,
  tenant_id      text not null references public.tenants(id) on delete cascade,
  client_id      text references public.clients(id) on delete set null,
  client_name    text,
  issue_date     date,
  due_date       date,
  status         text default 'draft'
                 check (status in ('draft','sent','partial','paid','overdue')),
  paid_date      date,
  paid_amount    numeric(14,2),
  notes          text,
  is_inter_state boolean not null default false,
  created_at     timestamptz not null default now()
);

create index if not exists idx_invoices_tenant        on public.invoices(tenant_id);
create index if not exists idx_invoices_tenant_status on public.invoices(tenant_id, status);

create table if not exists public.invoice_items (
  id          text primary key default gen_random_uuid()::text,
  tenant_id   text not null references public.tenants(id) on delete cascade,
  invoice_id  text not null references public.invoices(id) on delete cascade,
  description text,
  qty         numeric(12,2) default 1,
  rate        numeric(14,2) default 0,
  gst_rate    numeric(5,2)  default 18,
  position    int default 0
);

create index if not exists idx_invoice_items_invoice on public.invoice_items(invoice_id);


-- =============================================================================
-- §7  MODULE 4 — HR & ASSOCIATES [CORE]
-- =============================================================================

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
  month        text,                         -- e.g. '2025-06'
  amount       numeric(14,2),
  status       text default 'pending',
  created_at   timestamptz not null default now()
);

create index if not exists idx_payroll_tenant on public.payroll(tenant_id);


-- =============================================================================
-- §8  MODULE 8 — DOCUMENT MANAGEMENT [CORE]
-- =============================================================================

create table if not exists public.documents (
  id          text primary key default gen_random_uuid()::text,
  tenant_id   text not null references public.tenants(id) on delete cascade,
  name        text not null,
  type        text,                          -- PDF, XLSX, …
  category    text,                          -- Contracts, Tax, KYC, …
  status      text default 'active',
  client_id   text references public.clients(id) on delete set null,
  client_name text,
  uploaded_by text,
  file_path   text,                          -- Supabase Storage path: {tenant_id}/…
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

create table if not exists public.document_activity (
  id          text primary key default gen_random_uuid()::text,
  tenant_id   text not null references public.tenants(id) on delete cascade,
  document_id text references public.documents(id) on delete cascade,
  user_id     text,
  user_name   text,
  action      text,                          -- upload | download | view | sign | delete
  ip          text,
  device      text,
  at          timestamptz not null default now()
);


-- =============================================================================
-- §9  MODULE 12 — COMPLIANCE & AUDIT TRAIL [CORE]
-- =============================================================================

create table if not exists public.compliance_items (
  id          text primary key default gen_random_uuid()::text,
  tenant_id   text not null references public.tenants(id) on delete cascade,
  category    text,                          -- GST | Income Tax | TDS | ROC/MCA | Payroll
  title       text,
  description text,
  due_date    date,
  status      text default 'pending'
              check (status in ('pending','in_progress','completed')),
  priority    text default 'medium',
  assignee    text,
  client_id   text references public.clients(id) on delete set null,
  client_name text,
  recurring   text,                          -- monthly | quarterly | annual
  created_at  timestamptz not null default now()
);

create index if not exists idx_compliance_tenant    on public.compliance_items(tenant_id);
create index if not exists idx_compliance_due_date  on public.compliance_items(tenant_id, due_date);

create table if not exists public.audit_logs (
  id        text primary key default gen_random_uuid()::text,
  tenant_id text not null references public.tenants(id) on delete cascade,
  user_id   text,
  user_name text,
  role      text,
  action    text,                            -- create | update | delete | login | approve …
  module    text,                            -- clients | tickets | invoices | auth …
  detail    text,
  ip        text,
  at        timestamptz not null default now()
);

create index if not exists idx_audit_logs_tenant on public.audit_logs(tenant_id);
create index if not exists idx_audit_logs_at     on public.audit_logs(tenant_id, at desc);


-- =============================================================================
-- §10 MODULE 11 — NOTIFICATIONS & COMMUNICATIONS [CORE]
-- =============================================================================

create table if not exists public.notifications (
  id            text primary key default gen_random_uuid()::text,
  tenant_id     text not null references public.tenants(id) on delete cascade,
  type          text,                        -- ticket | invoice | document | task | system …
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
create index if not exists idx_notifications_unread on public.notifications(tenant_id, read)
  where read = false;

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

create table if not exists public.alert_settings (
  id        text primary key default gen_random_uuid()::text,
  tenant_id text not null references public.tenants(id) on delete cascade,
  user_id   uuid references auth.users(id) on delete cascade,
  event_key text not null,                   -- ticket_created | invoice_overdue | …
  email     boolean not null default false,
  sms       boolean not null default false,
  inapp     boolean not null default true,
  unique (user_id, event_key)
);

create table if not exists public.comm_log (
  id        text primary key default gen_random_uuid()::text,
  tenant_id text not null references public.tenants(id) on delete cascade,
  channel   text check (channel in ('email','sms')),
  to_addr   text,
  subject   text,
  status    text default 'pending'
            check (status in ('delivered','pending','failed')),
  trigger   text,
  sent_at   timestamptz not null default now()
);


-- =============================================================================
-- §11 MODULE 7 — FIRM SETTINGS [CORE]
-- =============================================================================

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


-- =============================================================================
-- §12 HELPER FUNCTIONS [SUPABASE-AUTH]
-- Requires: auth.users, auth.uid()
-- =============================================================================

create or replace function public.current_tenant_id()
returns text
language sql stable security definer
set search_path = public
as $$
  select tenant_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_master()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select coalesce(
    (select t.is_master
       from public.profiles p
       join public.tenants t on t.id = p.tenant_id
      where p.id = auth.uid()),
    false);
$$;

-- Auto-create profile row when a user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, tenant_id, name, email, role, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'tenant_id', 'finops'),
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    coalesce(new.raw_user_meta_data->>'avatar', upper(left(new.email, 2)))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- =============================================================================
-- §13 ROW LEVEL SECURITY [SUPABASE-AUTH]
-- Every business table: tenant_id = current_tenant_id()
-- =============================================================================

do $$
declare
  tbl text;
  tenant_tables text[] := array[
    'team_members','clients','client_services','tickets','ticket_comments',
    'projects','tasks','task_assignees','task_checklist','task_comments',
    'invoices','invoice_items','associates','payroll','documents',
    'document_versions','document_activity','compliance_items','audit_logs',
    'notifications','announcements','alert_settings','comm_log','firm_settings'
  ];
begin
  foreach tbl in array tenant_tables loop
    execute format('alter table public.%I enable row level security;', tbl);
    execute format('drop policy if exists tenant_isolation on public.%I;', tbl);
    execute format($p$
      create policy tenant_isolation on public.%I
        for all
        using  (tenant_id = public.current_tenant_id())
        with check (tenant_id = public.current_tenant_id());
    $p$, tbl);
  end loop;
end $$;

-- tenants: own row + master sees all partner registry rows
alter table public.tenants enable row level security;
drop policy if exists tenants_select on public.tenants;
create policy tenants_select on public.tenants
  for select using (id = public.current_tenant_id() or public.is_master());

drop policy if exists tenants_master_write on public.tenants;
create policy tenants_master_write on public.tenants
  for all using (public.is_master()) with check (public.is_master());

-- profiles: same tenant + always see own row
alter table public.profiles enable row level security;
drop policy if exists profiles_same_tenant on public.profiles;
create policy profiles_same_tenant on public.profiles
  for select using (tenant_id = public.current_tenant_id() or id = auth.uid());

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());


-- =============================================================================
-- §14 VIEWS & RPCs — Master aggregate (counts only, no partner detail) [CORE]
-- =============================================================================

create or replace view public.partner_stats as
select
  t.id       as tenant_id,
  t.firm_name,
  t.is_active,
  t.plan,
  (select count(*) from public.clients    c where c.tenant_id = t.id) as clients,
  (select count(*) from public.associates a where a.tenant_id = t.id) as associates,
  (select count(*) from public.tickets    k where k.tenant_id = t.id) as tickets
from public.tenants t
where t.is_master = false;

comment on view public.partner_stats is
  'Aggregate partner metrics for master admin. Never exposes client/ticket detail rows.';

create or replace function public.get_partner_stats()
returns setof public.partner_stats
language sql stable security definer
set search_path = public
as $$
  select * from public.partner_stats where public.is_master();
$$;

grant execute on function public.get_partner_stats()    to authenticated;
grant execute on function public.current_tenant_id()    to authenticated;
grant execute on function public.is_master()            to authenticated;


-- =============================================================================
-- §15 STORAGE — Documents bucket [SUPABASE-STORAGE]
-- Path convention: documents/{tenant_id}/{category}/{filename}
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

drop policy if exists documents_tenant_read   on storage.objects;
drop policy if exists documents_tenant_insert on storage.objects;
drop policy if exists documents_tenant_update on storage.objects;
drop policy if exists documents_tenant_delete on storage.objects;

create policy documents_tenant_read on storage.objects
  for select to authenticated
  using (bucket_id = 'documents'
         and (storage.foldername(name))[1] = public.current_tenant_id());

create policy documents_tenant_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'documents'
              and (storage.foldername(name))[1] = public.current_tenant_id());

create policy documents_tenant_update on storage.objects
  for update to authenticated
  using (bucket_id = 'documents'
         and (storage.foldername(name))[1] = public.current_tenant_id());

create policy documents_tenant_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'documents'
         and (storage.foldername(name))[1] = public.current_tenant_id());


-- =============================================================================
-- END OF SCHEMA — Run seed.sql next for demo data
-- =============================================================================
