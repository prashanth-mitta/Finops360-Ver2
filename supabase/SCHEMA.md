# FinOps 360 — Database Schema Reference

## Files (what to use when)

| File | Purpose | When to use |
|---|---|---|
| **[`schema-full.sql`](schema-full.sql)** | **Canonical full schema** — all tables, indexes, RLS, views, storage | New project rebuild, documentation, backup reference |
| [`migrations/20260619000001_init.sql`](migrations/20260619000001_init.sql) | Tables only (incremental v1) | Already applied via `supabase db push` |
| [`migrations/20260619000002_rls.sql`](migrations/20260619000002_rls.sql) | RLS + functions + views | Already applied |
| [`migrations/20260619000003_storage.sql`](migrations/20260619000003_storage.sql) | Storage bucket + policies | Already applied |
| [`seed.sql`](seed.sql) | Demo tenants, users, sample data | After schema — **not** part of structure |

> **Rule:** Change structure in new `migrations/YYYYMMDD_description.sql` files going forward.  
> Keep `schema-full.sql` updated when you add tables so it stays the single readable reference.

---

## Quick start (fresh Supabase project)

```text
1. Run schema-full.sql   (SQL Editor — entire file)
2. Run seed.sql          (demo data + auth users)
3. Set .env              (REACT_APP_SUPABASE_URL + ANON_KEY)
4. npm start
```

---

## Entity relationship (simplified)

```text
tenants (1) ──< profiles          (auth.users 1:1 profiles)
tenants (1) ──< clients           (1) ──< client_services
tenants (1) ──< tickets           (1) ──< ticket_comments
tenants (1) ──< projects
tenants (1) ──< tasks             (1) ──< task_assignees, task_checklist, task_comments
tenants (1) ──< invoices          (1) ──< invoice_items
tenants (1) ──< associates        (1) ──< payroll
tenants (1) ──< documents         (1) ──< document_versions, document_activity
tenants (1) ──< compliance_items
tenants (1) ──< audit_logs
tenants (1) ──< notifications, announcements, alert_settings, comm_log
tenants (1) ──  firm_settings     (1:1 per tenant)
tenants (1) ──< team_members
```

Every child table includes **`tenant_id`** → `tenants(id)` for multi-tenant isolation.

---

## Standards for new tables

When adding a feature, every new table must:

1. Include `tenant_id text not null references public.tenants(id) on delete cascade`
2. Use `snake_case` names
3. Add `created_at timestamptz not null default now()` where rows are append-only
4. Use `numeric(14,2)` for money (never `float` / `real`)
5. Add `check (...)` constraints for status/enum columns
6. Create `create index idx_<table>_tenant on <table>(tenant_id)`
7. Enable RLS + `tenant_isolation` policy (copy pattern from `schema-full.sql` §13)
8. Add a new incremental file under `migrations/` — do not edit old migration files on production

---

## Module → table map

| App module | Tables |
|---|---|
| Auth / Dashboard | `tenants`, `profiles` |
| Clients (M02) | `clients`, `client_services` |
| Tickets (M03) | `tickets`, `ticket_comments` |
| HR (M04) | `associates`, `payroll`, `team_members` |
| Settings (M07) | `firm_settings` |
| Documents (M08) | `documents`, `document_versions`, `document_activity` |
| Invoices (M09) | `invoices`, `invoice_items` |
| Tasks (M10) | `projects`, `tasks`, `task_*` |
| Notifications (M11) | `notifications`, `announcements`, `alert_settings`, `comm_log` |
| Compliance (M12) | `compliance_items`, `audit_logs` |
| Partners (M13) | `tenants` (partners), `partner_stats` view |

---

## Security model

- **RLS** enforces `tenant_id = current_tenant_id()` on all business tables
- **Master admin** (`tenants.is_master = true`) sees partner **counts only** via `get_partner_stats()` RPC
- **Storage** path must start with `{tenant_id}/` inside the `documents` bucket
- Frontend uses **anon key only** — never `service_role` in React

---

## Local / disaster recovery

| Scenario | Action |
|---|---|
| Supabase project lost | Create new project → run `schema-full.sql` → `seed.sql` → update `.env` |
| Need local copy | `supabase start` + `supabase db reset` (uses migrations + seed) |
| Plain PostgreSQL | Run `schema-full.sql` but skip `[SUPABASE-AUTH]` and `[SUPABASE-STORAGE]` sections |
