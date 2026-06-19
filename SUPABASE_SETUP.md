# FinOps 360 - Supabase Setup & Production Migration Guide

This guide takes the app from the in-memory prototype to a real multi-tenant
database on **Supabase** (Postgres + Auth + Row-Level Security + Storage).

The app is built so it **keeps working on mock data** until you add the two
environment variables below. As soon as they are set, every module reads/writes
the live, RLS-protected database.

---

## What was added

| Area | Location |
|---|---|
| Supabase client | [`src/lib/supabaseClient.js`](src/lib/supabaseClient.js) |
| React Query client | [`src/lib/queryClient.js`](src/lib/queryClient.js) |
| Data-access layer (hooks + mappers + writes) | [`src/services/finops.js`](src/services/finops.js) |
| Auth (Supabase Auth + fallback) | [`src/context/AuthContext.js`](src/context/AuthContext.js) |
| Tenant context (driven by profile) | [`src/context/TenantContext.js`](src/context/TenantContext.js) |
| Schema | [`supabase/migrations/20260619000001_init.sql`](supabase/migrations/20260619000001_init.sql) |
| RLS + helpers + partner aggregate | [`supabase/migrations/20260619000002_rls.sql`](supabase/migrations/20260619000002_rls.sql) |
| Storage bucket + storage RLS | [`supabase/migrations/20260619000003_storage.sql`](supabase/migrations/20260619000003_storage.sql) |
| Seed data (mirrors the old mock data) | [`supabase/seed.sql`](supabase/seed.sql) |
| Env template | [`.env.example`](.env.example) |

---

## Step 1 - Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Pick a strong database password and a region close to your users (e.g. Mumbai / `ap-south-1`).
3. Wait for the project to finish provisioning.

## Step 2 - Apply the schema, RLS, storage and seed

**Option A - SQL editor (quickest):**
Open the project's SQL editor and run, in order:

1. `supabase/migrations/20260619000001_init.sql`
2. `supabase/migrations/20260619000002_rls.sql`
3. `supabase/migrations/20260619000003_storage.sql`
4. `supabase/seed.sql`

**Option B - Supabase CLI (recommended for repeatable deploys):**

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR-PROJECT-REF
supabase db push          # applies everything in supabase/migrations
# then run seed.sql once (paste into SQL editor, or):
supabase db reset         # LOCAL only: re-applies migrations + seed.sql
```

> The seed inserts demo `auth.users` rows directly (with bcrypt-hashed
> passwords) plus an `auth.identities` row each. If your Supabase version
> rejects a column, adjust the insert in `seed.sql` - the trigger
> `handle_new_user` will still create the matching `profiles` row from the
> user metadata.

## Step 3 - Configure the frontend

```bash
cp .env.example .env
```

Fill in from **Project Settings > API**:

```
REACT_APP_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```

Then:

```bash
npm install
npm start
```

Only the **anon** key goes in the frontend - it is safe to expose because
all access is gated by Row-Level Security. **Never** put the `service_role`
key in any frontend file.

## Step 4 - Deploy (Vercel)

Add the same two variables under **Vercel > Project > Settings > Environment
Variables** (`REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`) for the
Production (and Preview) environments, then redeploy.

---

## Demo logins (after seeding)

Master platform (tenant `finops`):

| Role | Email | Password |
|---|---|---|
| Master Admin | `admin@finops360.in` | `admin123` |
| Sales | `sales@finops360.in` | `sales123` |
| HR | `hr@finops360.in` | `hr123` |
| Associate | `associate@finops360.in` | `assoc123` |
| Client | `client@example.com` | `client123` |

Partner firms (each isolated): `admin@mehtaassociates.in` / `mehta123`,
`admin@reddytax.in` / `reddy123`, `admin@sharmaandco.in` / `sharma123`.

> Change all demo passwords before any real production use.

---

## How tenant isolation works

- Every business table has a `tenant_id`.
- `current_tenant_id()` reads the logged-in user's tenant from `profiles`.
- An RLS `tenant_isolation` policy on every table enforces
  `tenant_id = current_tenant_id()` for both reads and writes.
- The master platform (`finops`) only sees its own rows **plus** aggregate
  partner counts via the `get_partner_stats()` RPC (built on the
  `partner_stats` view) - it can never read a partner's client/ticket detail.

### Verifying isolation (do this before go-live)

1. Log in as `admin@mehtaassociates.in` (p001), note the clients you see.
2. Log in as `admin@reddytax.in` (p002) - you must NOT see any p001 clients.
3. Log in as `admin@finops360.in` (master) - the Partners module shows only
   counts per firm, never partner client/ticket rows.
4. (SQL editor) Confirm `select * from public.clients` returns only the
   current role's tenant rows when run via the API (RLS), and that
   `get_partner_stats()` returns rows only for the master.

---

## Partner "Launch Portal" decision (Phase 7)

**Default (shipped): partners self-login.** Each partner user has a real
Supabase account with `tenant_id` set on their profile, so they log into the
main app at the normal login screen and RLS scopes everything to their firm.
This is the production path and requires no special impersonation code.

The legacy master "Launch Portal" view in
[`PartnerAppShell.js`](src/pages/partners/PartnerAppShell.js) is retained only
as a demo preview. True master-to-partner impersonation (seeing live partner
data) is intentionally **not** enabled, because it would violate the
"master sees aggregates only" requirement. If you ever need it, implement it
as a Supabase **Edge Function** using the service-role key with full audit
logging - never from the browser.

---

## Notes & deviations

- The original mock files (`src/data/mockData.js` and the per-module
  `*Data.js`) are **kept** and now serve two purposes: the offline fallback
  (when env vars are absent) and the source for `supabase/seed.sql`. Rendered
  modules no longer import them directly - they go through
  `src/services/finops.js`.
- Roles are normalized to canonical snake_case (`master_admin`, `sales`, `hr`,
  `associate`, `client`). The Documents and Invoices modules expect display
  names internally, so `App.js` converts via `roleLabel()` at their boundary.
- Reports and Settings modules still render static figures; wire them to
  `src/services/finops.js` hooks when their backing tables are needed.
- Writes are wired for the highest-value flows (ticket promote, notification
  read/pin/delete, tenant create/update). Remaining create/edit flows update
  local state optimistically; extend `src/services/finops.js` with the
  matching `insert`/`update` calls as you productionize each module.
