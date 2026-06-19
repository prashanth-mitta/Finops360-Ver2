-- =============================================================================
-- FinOps 360 - Row Level Security (tenant isolation)
-- =============================================================================

-- ── Helper functions ─────────────────────────────────────────────────────────
-- The current user's tenant, read from their profile. SECURITY DEFINER so the
-- function can read profiles regardless of the caller's own RLS.
create or replace function public.current_tenant_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select tenant_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_master()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select t.is_master
       from public.profiles p
       join public.tenants t on t.id = p.tenant_id
      where p.id = auth.uid()),
    false);
$$;

-- ── Auto-provision a profile when a new auth user is created ──────────────────
-- tenant_id / role / name are read from the signup metadata. Defaults to the
-- 'finops' tenant + 'client' role when not provided.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
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

-- ── Enable RLS + standard tenant-isolation policy on every table ─────────────
-- A small helper to apply the same policy everywhere keeps this readable.
do $$
declare
  t text;
  tenant_tables text[] := array[
    'team_members','clients','client_services','tickets','ticket_comments',
    'projects','tasks','task_assignees','task_checklist','task_comments',
    'invoices','invoice_items','associates','payroll','documents',
    'document_versions','document_activity','compliance_items','audit_logs',
    'notifications','announcements','alert_settings','comm_log','firm_settings'
  ];
begin
  foreach t in array tenant_tables loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists tenant_isolation on public.%I;', t);
    execute format($f$
      create policy tenant_isolation on public.%I
        for all
        using (tenant_id = public.current_tenant_id())
        with check (tenant_id = public.current_tenant_id());
    $f$, t);
  end loop;
end $$;

-- ── tenants: own tenant always visible; master can see all ───────────────────
alter table public.tenants enable row level security;
drop policy if exists tenants_select on public.tenants;
create policy tenants_select on public.tenants
  for select
  using (id = public.current_tenant_id() or public.is_master());

-- Only the master platform can create / modify tenants (partner onboarding).
drop policy if exists tenants_master_write on public.tenants;
create policy tenants_master_write on public.tenants
  for all
  using (public.is_master())
  with check (public.is_master());

-- ── profiles: visible within the same tenant ─────────────────────────────────
alter table public.profiles enable row level security;
drop policy if exists profiles_same_tenant on public.profiles;
create policy profiles_same_tenant on public.profiles
  for select
  using (tenant_id = public.current_tenant_id() or id = auth.uid());

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- =============================================================================
-- Master aggregate view: counts per partner ONLY. No detail rows are exposed.
-- =============================================================================
create or replace view public.partner_stats as
  select
    t.id          as tenant_id,
    t.firm_name,
    t.is_active,
    t.plan,
    (select count(*) from public.clients    c where c.tenant_id = t.id) as clients,
    (select count(*) from public.associates a where a.tenant_id = t.id) as associates,
    (select count(*) from public.tickets    k where k.tenant_id = t.id) as tickets
  from public.tenants t
  where t.is_master = false;

-- Exposed via a SECURITY DEFINER RPC callable only by the master platform.
create or replace function public.get_partner_stats()
returns setof public.partner_stats
language sql
stable
security definer
set search_path = public
as $$
  select * from public.partner_stats where public.is_master();
$$;

grant execute on function public.get_partner_stats() to authenticated;
grant execute on function public.current_tenant_id() to authenticated;
grant execute on function public.is_master() to authenticated;
