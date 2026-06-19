-- =============================================================================
-- FinOps 360 - Storage bucket for the Documents module
-- Files are stored under a per-tenant prefix:  <tenant_id>/<path>
-- Storage RLS ensures a user can only touch objects under their own tenant.
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Helper: the first path segment is the tenant_id.
-- e.g. object name 'p001/contracts/mou.pdf' -> tenant 'p001'.

drop policy if exists documents_tenant_read on storage.objects;
create policy documents_tenant_read on storage.objects
  for select to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = public.current_tenant_id()
  );

drop policy if exists documents_tenant_insert on storage.objects;
create policy documents_tenant_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = public.current_tenant_id()
  );

drop policy if exists documents_tenant_update on storage.objects;
create policy documents_tenant_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = public.current_tenant_id()
  );

drop policy if exists documents_tenant_delete on storage.objects;
create policy documents_tenant_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = public.current_tenant_id()
  );
