-- Master admin can update user roles/profiles within their tenant
create or replace function public.is_master_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'master_admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

grant execute on function public.is_master_admin() to authenticated;

drop policy if exists profiles_master_update on public.profiles;
create policy profiles_master_update on public.profiles
  for update
  using (
    tenant_id = public.current_tenant_id()
    and public.is_master_admin()
  )
  with check (
    tenant_id = public.current_tenant_id()
    and public.is_master_admin()
  );
