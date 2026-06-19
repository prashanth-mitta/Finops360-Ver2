-- =============================================================================
-- FinOps 360 - Seed data (mirrors the original in-memory mock data)
-- Run automatically by `supabase db reset`, or paste into the SQL editor.
-- Demo passwords are intentionally simple for UAT - change before production.
-- =============================================================================

-- ── Tenants ──────────────────────────────────────────────────────────────────
insert into public.tenants (id, firm_name, tagline, logo_text, primary_color, accent_color, email, phone, address, gstin, is_active, is_master, plan, created_at) values
  ('finops','FinOps 360','Finance & Accounting Platform','FO','#6366f1','#4f46e5','admin@finops360.in','+91 98765 00000','Unit 501, Skyview Tower, Madhapur, Hyderabad - 500081','36FINOP1234A1Z9',true,true,'master','2024-01-01'),
  ('p001','Mehta & Associates','Chartered Accountants','MA','#0ea5e9','#0284c7','admin@mehtaassociates.in','+91 98765 11111','Office 12, Nariman Point, Mumbai - 400021','27MEHTA5678B2Z1',true,false,'professional','2024-03-15'),
  ('p002','Reddy Tax Consultants','Tax & Compliance Experts','RT','#10b981','#059669','admin@reddytax.in','+91 98765 22222','Plot 88, Jubilee Hills, Hyderabad - 500033','36REDDY9012C3Z2',true,false,'professional','2024-05-20'),
  ('p003','Sharma & Co. CAs','Your Trusted Financial Partner','SC','#f59e0b','#d97706','admin@sharmaandco.in','+91 98765 33333','Tower B, DLF Cyber City, Gurugram - 122002','06SHARM3456D4Z3',false,false,'starter','2024-08-10')
on conflict (id) do nothing;

-- ── Auth users (profiles are auto-created by the handle_new_user trigger) ─────
do $$
declare u record;
begin
  for u in (
    select * from (values
      ('11111111-1111-1111-1111-111111111101'::uuid,'admin@finops360.in','admin123','Arjun Sharma','master_admin','finops','AS'),
      ('11111111-1111-1111-1111-111111111102'::uuid,'sales@finops360.in','sales123','Priya Reddy','sales','finops','PR'),
      ('11111111-1111-1111-1111-111111111103'::uuid,'hr@finops360.in','hr123','Kavya Nair','hr','finops','KN'),
      ('11111111-1111-1111-1111-111111111104'::uuid,'associate@finops360.in','assoc123','Rahul Mehta','associate','finops','RM'),
      ('11111111-1111-1111-1111-111111111105'::uuid,'client@example.com','client123','Rohan Gupta','client','finops','RG'),
      ('11111111-1111-1111-1111-111111111201'::uuid,'admin@mehtaassociates.in','mehta123','Vikram Mehta','master_admin','p001','VM'),
      ('11111111-1111-1111-1111-111111111202'::uuid,'sales@mehtaassociates.in','mehta123','Sneha Mehta','sales','p001','SM'),
      ('11111111-1111-1111-1111-111111111203'::uuid,'assoc@mehtaassociates.in','mehta123','Rohan Shah','associate','p001','RS'),
      ('11111111-1111-1111-1111-111111111301'::uuid,'admin@reddytax.in','reddy123','Anil Reddy','master_admin','p002','AR'),
      ('11111111-1111-1111-1111-111111111302'::uuid,'sales@reddytax.in','reddy123','Priya Reddy','sales','p002','PR'),
      ('11111111-1111-1111-1111-111111111303'::uuid,'assoc@reddytax.in','reddy123','Suresh Kumar','associate','p002','SK'),
      ('11111111-1111-1111-1111-111111111401'::uuid,'admin@sharmaandco.in','sharma123','Deepak Sharma','master_admin','p003','DS')
    ) as v(id,email,pwd,name,role,tenant,avatar)
  ) loop
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change, email_change_token_new
    ) values (
      '00000000-0000-0000-0000-000000000000', u.id, 'authenticated', 'authenticated',
      u.email, crypt(u.pwd, gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('name',u.name,'role',u.role,'tenant_id',u.tenant,'avatar',u.avatar),
      '', '', '', ''
    ) on conflict (id) do nothing;

    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), u.id, u.id::text,
      jsonb_build_object('sub', u.id::text, 'email', u.email),
      'email', now(), now(), now()
    ) on conflict do nothing;
  end loop;
end $$;

-- ── Staff directory (task/compliance/audit references) ───────────────────────
insert into public.team_members (id, tenant_id, name, role, avatar, color) values
  ('u1','finops','Arjun Sharma','Associate','AS','#6366f1'),
  ('u2','finops','Priya Nair','Associate','PN','#ec4899'),
  ('u3','finops','Rahul Mehta','Sales','RM','#f59e0b'),
  ('u4','finops','Sneha Reddy','HR','SR','#10b981'),
  ('u5','finops','Kiran Patel','Associate','KP','#3b82f6'),
  ('u6','finops','Divya Krishnan','Associate','DK','#8b5cf6')
on conflict (id) do nothing;

-- ── Clients (finops) ─────────────────────────────────────────────────────────
insert into public.clients (id, tenant_id, name, gstin, pan, contact, email, phone, city, address, state, state_code, status, plan, since, manager) values
  ('c1','finops','Acme Corp','29ABCDE1234F1Z5','ABCDE1234F','Rohan Gupta','rohan@acmecorp.in','+91 98765 43210','Hyderabad','Plot 12, HITEC City, Hyderabad - 500081','Telangana','36','Active','Premium','2023-04-01','Rahul Mehta'),
  ('c2','finops','Redwood Tech','27FGHIJ5678K2Z6','FGHIJ5678K','Sneha Patel','sneha@redwood.com','+91 87654 32109','Mumbai','Level 4, BKC, Mumbai - 400051','Maharashtra','27','Active','Standard','2024-01-15','Priya Reddy'),
  ('c3','finops','Lighthouse Ltd','07KLMNO9012L3Z7','KLMNO9012L','Vikram Joshi','vikram@lighthouse.in','+91 76543 21098','Delhi','Tower B, Cyber Hub, Gurugram - 122002','Haryana','06','Onboarding','Basic','2025-05-01','Rahul Mehta'),
  ('c4','finops','Vertex Solutions','29PQRST3456U4Z8','PQRST3456U','Vertex Accounts','accounts@vertex.io','+91 90000 00004','Bengaluru','3rd Floor, Prestige, Bengaluru - 560025','Karnataka','29','Active','Standard','2024-02-01','Priya Reddy')
on conflict (id) do nothing;

-- ── Tickets (finops) ─────────────────────────────────────────────────────────
insert into public.tickets (id, tenant_id, code, client_id, client_name, type, priority, status, assignee, stage, created, due) values
  ('tk1','finops','TKT-001','c1','Acme Corp','GST Filing','High','In Progress','Rahul Mehta','maker','2025-05-20','2025-06-10'),
  ('tk2','finops','TKT-002','c2','Redwood Tech','ITR Filing','Medium','Pending Review','Priya Reddy','checker','2025-05-22','2025-07-31'),
  ('tk3','finops','TKT-003','c3','Lighthouse Ltd','Bookkeeping','Low','Approved','Rahul Mehta','approved','2025-05-18','2025-05-31'),
  ('tk4','finops','TKT-004','c1','Acme Corp','TDS Filing','High','In Progress','Rahul Mehta','maker','2025-05-25','2025-06-07')
on conflict (id) do nothing;

-- ── Associates (finops HR) ───────────────────────────────────────────────────
insert into public.associates (id, tenant_id, name, role, email, phone, department, status, joined, clients_count, tickets_count) values
  ('fa1','finops','Rahul Mehta','Associate','associate@finops360.in','+91 98765 11111','Tax','Active','2023-06-01',12,8),
  ('fa2','finops','Priya Reddy','Sales','sales@finops360.in','+91 98765 22222','Business Dev','Active','2023-08-15',8,3),
  ('fa3','finops','Kavya Nair','HR','hr@finops360.in','+91 98765 33333','HR','Active','2023-05-01',0,0),
  ('fa4','finops','Amit Singh','Associate','amit@finops360.in','+91 98765 44444','Audit','Active','2024-02-01',6,4)
on conflict (id) do nothing;

-- ── Projects (finops) ────────────────────────────────────────────────────────
insert into public.projects (id, tenant_id, name, color, client_id, client_name) values
  ('pr1','finops','Q1 GST Filing','#6366f1','c1','Acme Corp'),
  ('pr2','finops','Annual Audit FY25','#ec4899','c2','Redwood Tech'),
  ('pr3','finops','Payroll Revamp','#f59e0b',null,'Internal'),
  ('pr4','finops','ROC Compliance Pack','#10b981','c3','Lighthouse Ltd'),
  ('pr5','finops','MCA Filing - Jun 25','#3b82f6','c4','Vertex Solutions')
on conflict (id) do nothing;

-- ── Tasks (finops) ───────────────────────────────────────────────────────────
insert into public.tasks (id, tenant_id, project_id, title, description, status, priority, category, due_date, tags, created_at) values
  ('t001','finops','pr1','Collect Apr-Jun purchase invoices','Reach out to client and collect all purchase invoices for Q1.','done','high','Filing','2025-07-03', array['GST','Client'], '2025-06-20'),
  ('t002','finops','pr1','Reconcile GSTR-2B vs purchase register','Download GSTR-2B from portal and reconcile with books.','in_progress','urgent','Filing','2025-07-10', array['GST','Reconciliation'], '2025-07-01'),
  ('t003','finops','pr1','File GSTR-1 for Q1','Prepare and file GSTR-1 after data validation.','todo','urgent','Filing','2025-07-11', array['GST'], '2025-07-01'),
  ('t004','finops','pr2','Prepare trial balance FY25','Extract and verify trial balance from Tally.','review','high','Audit','2025-07-08', array['Audit','Tally'], '2025-06-25'),
  ('t005','finops','pr2','Fixed assets schedule','Prepare FA schedule including additions, disposals, and depreciation.','todo','medium','Audit','2025-07-15', array['Audit'], '2025-07-02'),
  ('t006','finops','pr3','Map new salary structure','Design updated CTC breakup - Basic, HRA, Special Allowance etc.','done','medium','Payroll','2025-06-30', array['Internal','Payroll'], '2025-06-18'),
  ('t007','finops','pr3','Update payroll template in Excel','Reflect new salary structure in the monthly payroll master template.','in_progress','medium','Payroll','2025-07-12', array['Internal'], '2025-07-01'),
  ('t008','finops','pr4','Draft DIR-3 KYC for all directors','Collect DIN and KYC documents from all 4 directors.','in_progress','high','Compliance','2025-07-09', array['ROC','Compliance'], '2025-06-28'),
  ('t009','finops','pr4','File Form MGT-7 annual return','Prepare and file annual return for the FY.','todo','high','Compliance','2025-07-20', array['ROC','MCA'], '2025-07-03'),
  ('t010','finops','pr5','Prepare financial statements','BS, P&L, Cash flow for FY25 per Schedule III.','review','high','Filing','2025-07-07', array['MCA','FinStatements'], '2025-06-22'),
  ('t011','finops','pr5','Obtain Board resolution for filing','Draft and get signed board resolution authorising MCA filing.','todo','medium','Compliance','2025-07-14', array['MCA','Board'], '2025-07-02'),
  ('t012','finops','pr5','File AOC-4 on MCA portal','Attach financial statements and file AOC-4.','todo','urgent','Filing','2025-07-18', array['MCA'], '2025-07-03')
on conflict (id) do nothing;

insert into public.task_assignees (tenant_id, task_id, member_id) values
  ('finops','t001','u1'),('finops','t001','u2'),
  ('finops','t002','u1'),
  ('finops','t003','u1'),('finops','t003','u5'),
  ('finops','t004','u6'),
  ('finops','t005','u2'),('finops','t005','u6'),
  ('finops','t006','u4'),
  ('finops','t007','u4'),('finops','t007','u3'),
  ('finops','t008','u5'),
  ('finops','t009','u5'),('finops','t009','u1'),
  ('finops','t010','u2'),('finops','t010','u6'),
  ('finops','t011','u3'),
  ('finops','t012','u1'),('finops','t012','u5')
on conflict do nothing;

insert into public.task_checklist (tenant_id, task_id, label, done, position) values
  ('finops','t001','Send reminder email to client',true,1),('finops','t001','Upload to document vault',true,2),('finops','t001','Cross-verify count with client',true,3),
  ('finops','t002','Download GSTR-2B',true,1),('finops','t002','Compare with books',true,2),('finops','t002','Resolve mismatches',false,3),('finops','t002','Prepare reconciliation report',false,4),
  ('finops','t003','Validate output data',false,1),('finops','t003','Prepare GSTR-1 JSON',false,2),('finops','t003','Client sign-off',false,3),('finops','t003','File on portal',false,4),
  ('finops','t004','Export from Tally',true,1),('finops','t004','Verify closing balances',true,2),('finops','t004','Checker review',false,3),
  ('finops','t006','Draft salary breakup',true,1),('finops','t006','Management approval',true,2),
  ('finops','t008','Director 1 KYC',true,1),('finops','t008','Director 2 KYC',true,2),('finops','t008','Director 3 KYC',true,3),('finops','t008','Director 4 KYC',false,4),
  ('finops','t010','Balance Sheet',true,1),('finops','t010','P&L Statement',true,2),('finops','t010','Cash Flow Statement',false,3),('finops','t010','Notes to Accounts',false,4)
on conflict do nothing;

insert into public.task_comments (tenant_id, task_id, user_id, text, at) values
  ('finops','t001','u1','Collected 47 invoices. 3 pending from client.','2025-06-28 10:15'),
  ('finops','t001','u2','All 50 received. Uploading now.','2025-06-29 14:00'),
  ('finops','t002','u1','Rs. 1.2L mismatch found. Investigating.','2025-07-04 11:30'),
  ('finops','t004','u6','TB ready. Sent for checker review.','2025-07-06 16:45'),
  ('finops','t006','u4','New structure approved by management.','2025-06-28 09:00'),
  ('finops','t008','u5','Received docs from 3 directors. 1 pending.','2025-07-05 12:00'),
  ('finops','t010','u2','BS and P&L done. CF pending review.','2025-07-04 17:00')
on conflict do nothing;

-- ── Invoices (finops) ────────────────────────────────────────────────────────
insert into public.invoices (id, tenant_id, client_id, client_name, issue_date, due_date, status, paid_date, paid_amount, notes, is_inter_state) values
  ('INV-2025-047','finops','c1','Acme Corp','2025-05-30','2025-06-14','paid','2025-06-05',null,'Payment received via NEFT. Thank you for your business.',false),
  ('INV-2025-046','finops','c2','Redwood Tech','2025-05-25','2025-06-09','overdue',null,null,'Please transfer within due date to avoid late fees.',true),
  ('INV-2025-045','finops','c3','Lighthouse Ltd','2025-05-20','2025-06-04','sent',null,null,'',true),
  ('INV-2025-044','finops','c1','Acme Corp','2025-04-30','2025-05-15','paid','2025-05-10',null,'',false),
  ('INV-2025-043','finops','c4','Vertex Solutions','2025-04-25','2025-05-10','paid','2025-05-08',null,'',false),
  ('INV-2025-042','finops','c2','Redwood Tech','2025-04-20','2025-05-05','partial',null,15000,'Partial payment of Rs. 15,000 received on 01 May 2025.',true),
  ('INV-2025-041','finops','c3','Lighthouse Ltd','2025-04-15','2025-04-30','draft',null,null,'',true)
on conflict (id) do nothing;

insert into public.invoice_items (tenant_id, invoice_id, description, qty, rate, gst_rate, position) values
  ('finops','INV-2025-047','GST Filing - Monthly (Apr 2025)',1,3500,18,1),('finops','INV-2025-047','TDS Filing - Q4',1,2000,18,2),('finops','INV-2025-047','Bookkeeping - Monthly (Apr 2025)',1,5000,18,3),
  ('finops','INV-2025-046','ITR Filing - Company FY2024-25',1,15000,18,1),('finops','INV-2025-046','Balance Sheet Preparation',1,8000,18,2),('finops','INV-2025-046','P&L Statement',1,5000,18,3),
  ('finops','INV-2025-045','GST Filing - Quarterly (Q4)',1,4500,18,1),('finops','INV-2025-045','Payroll Processing - May 2025',1,3000,18,2),
  ('finops','INV-2025-044','GST Filing - Monthly (Mar 2025)',1,3500,18,1),('finops','INV-2025-044','Bookkeeping - Monthly (Mar 2025)',1,5000,18,2),
  ('finops','INV-2025-043','Audit Services - FY2024-25',1,25000,18,1),('finops','INV-2025-043','ROC Filing',1,5000,18,2),
  ('finops','INV-2025-042','Consultation - Tax Advisory (Q4)',1,12000,18,1),('finops','INV-2025-042','MCA Compliance Filing',1,8000,18,2),('finops','INV-2025-042','Bookkeeping - Monthly (Mar 2025)',1,5000,18,3),
  ('finops','INV-2025-041','Financial Projections - FY2026',1,20000,18,1)
on conflict do nothing;

-- ── Compliance items (finops) ────────────────────────────────────────────────
insert into public.compliance_items (id, tenant_id, category, title, description, due_date, status, priority, assignee, client_id, client_name, recurring) values
  ('cd001','finops','GST','GSTR-1 Filing (Monthly)','Outward supplies return for June 2025','2025-07-11','pending','urgent','u1','c1','Acme Corp','monthly'),
  ('cd002','finops','GST','GSTR-3B Filing (Monthly)','Summary return & tax payment for June 2025','2025-07-20','pending','urgent','u1','c1','Acme Corp','monthly'),
  ('cd003','finops','GST','GSTR-1 Filing (Monthly)','Outward supplies return for June 2025','2025-07-11','completed','urgent','u2','c2','Redwood Tech','monthly'),
  ('cd004','finops','GST','GSTR-2B Reconciliation','Match purchase register with GSTR-2B for June 2025','2025-07-14','in_progress','high','u5','c3','Lighthouse Ltd','monthly'),
  ('cd005','finops','GST','GSTR-9 Annual Return','Annual GST return for FY 2024-25','2025-12-31','pending','medium','u6','c4','Vertex Solutions','annual'),
  ('cd006','finops','Income Tax','Advance Tax - Q1 Installment','15% of estimated tax for FY25-26','2025-06-15','completed','high','u1','c1','Acme Corp','quarterly'),
  ('cd007','finops','Income Tax','Advance Tax - Q2 Installment','45% of estimated tax for FY25-26','2025-09-15','pending','high','u1','c1','Acme Corp','quarterly'),
  ('cd008','finops','Income Tax','ITR Filing - Company (FY24-25)','Income tax return for FY 2024-25','2025-10-31','pending','high','u6','c2','Redwood Tech','annual'),
  ('cd009','finops','Income Tax','ITR Filing - Company (FY24-25)','Income tax return for FY 2024-25','2025-10-31','pending','high','u2','c4','Vertex Solutions','annual'),
  ('cd010','finops','TDS','TDS Payment - June 2025','Deposit TDS deducted during June 2025','2025-07-07','completed','urgent','u5','c1','Acme Corp','monthly'),
  ('cd011','finops','TDS','TDS Return Q1 - Form 24Q','Salary TDS return for Apr-Jun 2025','2025-07-31','pending','high','u5','c2','Redwood Tech','quarterly'),
  ('cd012','finops','TDS','TDS Return Q1 - Form 26Q','Non-salary TDS return for Apr-Jun 2025','2025-07-31','pending','high','u1','c3','Lighthouse Ltd','quarterly'),
  ('cd013','finops','TDS','TDS Certificate - Form 16','Issue Form 16 to employees for FY24-25','2025-06-15','completed','high','u4',null,'Internal','annual'),
  ('cd014','finops','ROC/MCA','AOC-4 - Financial Statements','File audited financials with MCA for FY24-25','2025-10-29','in_progress','high','u2','c4','Vertex Solutions','annual'),
  ('cd015','finops','ROC/MCA','MGT-7 - Annual Return','File annual return with MCA for FY24-25','2025-11-29','pending','medium','u5','c3','Lighthouse Ltd','annual'),
  ('cd016','finops','ROC/MCA','DIR-3 KYC for Directors','Director KYC renewal on MCA portal','2025-09-30','in_progress','medium','u5','c4','Vertex Solutions','annual'),
  ('cd017','finops','Payroll','PF Contribution - June 2025','Deposit employee & employer PF contribution','2025-07-15','pending','high','u4',null,'Internal','monthly'),
  ('cd018','finops','Payroll','ESI Contribution - June 2025','Deposit ESI contribution for June 2025','2025-07-15','pending','high','u4',null,'Internal','monthly'),
  ('cd019','finops','Payroll','PT Return - Q1 2025','Professional Tax return for Apr-Jun 2025','2025-07-20','pending','medium','u4',null,'Internal','quarterly')
on conflict (id) do nothing;

-- ── Audit logs (finops) ──────────────────────────────────────────────────────
insert into public.audit_logs (id, tenant_id, user_id, user_name, role, action, module, detail, ip, at) values
  ('al001','finops','u1','Arjun Sharma','master_admin','approve','tickets','Approved ticket TKT-0039 - ITR Filing, Vertex Solutions','49.37.12.88','2025-07-06 17:45:12'),
  ('al002','finops','u2','Priya Nair','associate','upload','documents','Uploaded 12 documents to Redwood Tech shared folder','103.21.58.11','2025-07-06 16:10:05'),
  ('al003','finops','u1','Arjun Sharma','master_admin','create','invoices','Created invoice INV-2025-051 - Rs. 32,400 for Vertex Solutions','49.37.12.88','2025-07-06 15:30:44'),
  ('al004','finops','u5','Kiran Patel','associate','update','tasks','Updated task t002 status: todo to in_progress','14.99.201.55','2025-07-06 14:22:31'),
  ('al005','finops','u3','Rahul Mehta','sales','view','clients','Viewed client profile - Acme Corp','27.56.88.201','2025-07-06 13:55:20'),
  ('al006','finops','u1','Arjun Sharma','master_admin','login','auth','Logged in successfully from Hyderabad','49.37.12.88','2025-07-06 09:01:03'),
  ('al007','finops','u6','Divya Krishnan','associate','upload','documents','Uploaded trial balance FY25 to Document Vault','182.71.22.9','2025-07-06 09:15:47'),
  ('al008','finops','u4','Sneha Reddy','hr','update','hr','Updated payroll record for Kiran Patel - June 2025','117.55.9.33','2025-07-05 17:30:00'),
  ('al009','finops','u1','Arjun Sharma','master_admin','send','invoices','Sent invoice INV-2025-047 reminder to Acme Corp','49.37.12.88','2025-07-05 16:00:11'),
  ('al010','finops','u2','Priya Nair','associate','update','tickets','Moved ticket TKT-0042 to Review stage','103.21.58.11','2025-07-05 15:45:22'),
  ('al011','finops','u5','Kiran Patel','associate','create','tickets','Created ticket TKT-0043 for Redwood Tech','14.99.201.55','2025-07-05 14:10:33'),
  ('al012','finops','u3','Rahul Mehta','sales','create','clients','Onboarded new client - Lighthouse Ltd','27.56.88.201','2025-07-05 11:30:05'),
  ('al013','finops','u1','Arjun Sharma','master_admin','approve','invoices','Marked INV-2025-044 as paid - Rs. 18,290 received','49.37.12.88','2025-07-05 14:21:08'),
  ('al014','finops','u6','Divya Krishnan','associate','create','tasks','Created task: Prepare trial balance FY25','182.71.22.9','2025-07-04 10:45:00'),
  ('al015','finops','u4','Sneha Reddy','hr','update','compliance','Marked TDS Payment June 2025 as completed','117.55.9.33','2025-07-04 09:00:55'),
  ('al016','finops','u1','Arjun Sharma','master_admin','update','settings','Updated firm profile - added new bank account details','49.37.12.88','2025-07-03 17:15:00'),
  ('al017','finops','u2','Priya Nair','associate','download','documents','Downloaded GSTR-2B reconciliation report - Acme Corp','103.21.58.11','2025-07-03 15:00:44'),
  ('al018','finops','u5','Kiran Patel','associate','update','compliance','Updated GSTR-1 deadline status to in_progress','14.99.201.55','2025-07-03 13:22:10'),
  ('al019','finops','u3','Rahul Mehta','sales','login','auth','Logged in successfully from Mumbai','27.56.88.201','2025-07-03 09:05:00'),
  ('al020','finops','u1','Arjun Sharma','master_admin','delete','documents','Deleted duplicate document - old_MOU_draft.pdf','49.37.12.88','2025-07-02 16:45:00')
on conflict (id) do nothing;

-- ── Notifications (finops) ───────────────────────────────────────────────────
insert into public.notifications (id, tenant_id, type, title, body, read, pinned, target_roles, linked_id, linked_module, created_at) values
  ('n001','finops','ticket','Ticket #TKT-0042 moved to Review','GST Filing for Acme Corp has been submitted by Arjun Sharma and is awaiting checker approval.',false,false,array['master_admin','associate'],'TKT-0042','tickets','2025-07-06 09:15'),
  ('n002','finops','ticket','New ticket raised by Redwood Tech','Client has raised a new support ticket: GSTR-2B mismatch for May 2025. Assigned to Priya Nair.',false,false,array['master_admin','sales'],'TKT-0043','tickets','2025-07-06 08:30'),
  ('n003','finops','ticket','Ticket #TKT-0039 approved & closed','ITR filing for Vertex Solutions has been approved by the checker and marked complete.',true,false,array['master_admin','associate','client'],'TKT-0039','tickets','2025-07-05 17:45'),
  ('n004','finops','invoice','Invoice INV-2025-047 is overdue','Invoice of Rs. 24,780 sent to Acme Corp on 30 May is now 7 days overdue. Please follow up.',false,true,array['master_admin','sales'],'INV-2025-047','invoices','2025-07-06 10:00'),
  ('n005','finops','invoice','Payment received - Lighthouse Ltd','Rs. 18,290 received from Lighthouse Ltd against Invoice INV-2025-044. Marked as paid.',false,false,array['master_admin','sales'],'INV-2025-044','invoices','2025-07-05 14:20'),
  ('n006','finops','invoice','New invoice generated for Vertex Solutions','Invoice INV-2025-051 of Rs. 32,400 has been created and is ready to send.',true,false,array['master_admin'],'INV-2025-051','invoices','2025-07-04 11:00'),
  ('n007','finops','document','Document pending e-sign: Acme Corp MOU','MOU for Acme Corp is awaiting digital signature from the client. Reminder sent automatically.',false,false,array['master_admin','associate'],'DOC-109','documents','2025-07-06 07:00'),
  ('n008','finops','document','Client uploaded 12 new documents','Redwood Tech has uploaded 12 documents to the shared folder. Review and categorise.',true,false,array['master_admin','associate'],'DOC-FOLDER-RW','documents','2025-07-05 16:10'),
  ('n009','finops','task','Task overdue: File GSTR-1 for Q1','Task assigned to Arjun Sharma & Kiran Patel was due on 11 Jul. No update received.',false,true,array['master_admin','associate'],'t003','tasks','2025-07-06 09:00'),
  ('n010','finops','task','Task completed: Map new salary structure','Sneha Reddy has marked the salary structure mapping task as complete. Ready for review.',true,false,array['master_admin','hr'],'t006','tasks','2025-07-05 09:45'),
  ('n011','finops','payroll','Payroll processing due in 3 days','June 2025 payroll for 8 associates is due for processing by 10 July. Please review and approve.',false,false,array['master_admin','hr'],null,null,'2025-07-06 08:00'),
  ('n012','finops','payroll','TDS deduction summary ready','Monthly TDS summary for June 2025 has been auto-generated. Verify and file by 7th July.',true,false,array['master_admin','hr'],null,null,'2025-07-04 10:30'),
  ('n013','finops','system','Scheduled maintenance - 8 Jul 2:00 AM','FinOps 360 Connect will be down for maintenance on 8 July from 2:00 AM to 4:00 AM IST. Please save your work.',false,false,array['master_admin','sales','hr','associate','client'],null,null,'2025-07-05 12:00'),
  ('n014','finops','system','Security alert: New login from Bengaluru','A new login was detected from Bengaluru (IP 49.37.x.x) on your account. If this was not you, change your password immediately.',false,true,array['master_admin'],null,'settings','2025-07-06 06:45'),
  ('n015','finops','announcement','Office closed - 9 July (Public Holiday)','The office will remain closed on 9 July 2025 on account of a public holiday. All deadlines falling on this date are moved to 10 July.',false,false,array['master_admin','sales','hr','associate','client'],null,null,'2025-07-05 10:00'),
  ('n016','finops','announcement','New feature: Invoice bulk download','You can now download multiple invoices as a zip file from the Invoices module. Click the Bulk Download button to try it out.',true,false,array['master_admin','sales','hr','associate','client'],null,null,'2025-07-03 09:00'),
  ('n017','finops','announcement','Q2 target: 95% on-time filing rate','The firm has set a Q2 target of 95% on-time filing rate across all clients. Associates, please ensure timely submissions and flag blockers early.',true,false,array['master_admin','associate','sales'],null,null,'2025-07-01 10:00')
on conflict (id) do nothing;

-- ── Announcements (finops) ───────────────────────────────────────────────────
insert into public.announcements (id, tenant_id, title, body, priority, target_roles, author, expires_at, created_at) values
  ('a001','finops','Office closed - 9 July (Public Holiday)','The office will remain closed on 9 July 2025 on account of a public holiday. All deadlines falling on this date are moved to 10 July.','normal',array['master_admin','sales','hr','associate','client'],'Arjun Sharma','2025-07-10','2025-07-05 10:00'),
  ('a002','finops','Q2 Target: 95% On-Time Filing Rate','The firm has set a Q2 target of 95% on-time filing rate across all clients. Associates, please ensure timely submissions and flag any blockers early to the team lead.','high',array['master_admin','associate','sales'],'Arjun Sharma','2025-09-30','2025-07-01 10:00'),
  ('a003','finops','New Feature: Invoice Bulk Download','You can now download multiple invoices as a zip file directly from the Invoices module. Select invoices using the checkboxes and click Bulk Download.','normal',array['master_admin','sales','hr','associate','client'],'Arjun Sharma','2025-07-31','2025-07-03 09:00'),
  ('a004','finops','Mandatory: Update KYC Documents by 15 Jul','All associates must upload updated KYC documents (Aadhaar + PAN) to the HR portal by 15 July 2025. Non-compliance will affect payroll processing.','urgent',array['associate','hr'],'Sneha Reddy','2025-07-15','2025-07-04 11:00')
on conflict (id) do nothing;

-- ── Communication log (finops) ───────────────────────────────────────────────
insert into public.comm_log (id, tenant_id, channel, to_addr, subject, status, trigger, sent_at) values
  ('l001','finops','email','accounts@acmecorp.in','Invoice INV-2025-047 - Payment Overdue','delivered','invoice_overdue','2025-07-06 10:01'),
  ('l002','finops','sms','+91 98765 11111','Payment overdue: Rs. 24,780 - FinOps 360','delivered','invoice_overdue','2025-07-06 10:01'),
  ('l003','finops','email','arjun@finops360.in','Task overdue: File GSTR-1 for Q1','delivered','task_overdue','2025-07-06 09:01'),
  ('l004','finops','email','finance@redwoodtech.com','New ticket raised - TKT-0043','delivered','ticket_created','2025-07-06 08:31'),
  ('l005','finops','email','all@finops360.in','Announcement: Office closed 9 July','delivered','announcement','2025-07-05 10:01'),
  ('l006','finops','sms','+91 98765 22222','Payroll due in 3 days - FinOps 360','failed','payroll_reminder','2025-07-06 08:01'),
  ('l007','finops','email','billing@lighthouse.in','Payment confirmed - INV-2025-044','delivered','invoice_paid','2025-07-05 14:21'),
  ('l008','finops','email','kiran@finops360.in','Task due tomorrow: DIR-3 KYC','delivered','task_due','2025-07-05 09:00'),
  ('l009','finops','sms','+91 98765 33333','E-sign pending: Acme Corp MOU','pending','document_esign','2025-07-06 07:01'),
  ('l010','finops','email','accounts@vertex.io','Invoice INV-2025-051 - Rs. 32,400','delivered','invoice_due','2025-07-04 11:01')
on conflict (id) do nothing;

-- ── Documents (finops sample) ────────────────────────────────────────────────
insert into public.documents (id, tenant_id, name, type, category, status, client_id, client_name, uploaded_by, tags, created_at) values
  ('doc1','finops','Client Services Agreement','PDF','Contracts','signed','c1','Acme Corp','Rahul Mehta', array['MOU'], '2025-05-28'),
  ('doc2','finops','GST Returns Q4 FY2024-25','PDF','Tax','approved','c1','Acme Corp','Rahul Mehta', array['GST'], '2025-05-20'),
  ('doc3','finops','Invoice INV-2025-047','PDF','Invoices','approved','c1','Acme Corp','Arjun Sharma', array['Invoice'], '2025-05-30')
on conflict (id) do nothing;

-- ── Firm settings (finops) ───────────────────────────────────────────────────
insert into public.firm_settings (tenant_id, name, gstin, pan, address, state, state_code, email, phone, bank_name, account_no, ifsc) values
  ('finops','FinOps 360 Consulting LLP','36FINOP1234A1Z9','FINOP1234A','Unit 501, Skyview Tower, Madhapur, Hyderabad - 500081','Telangana','36','billing@finops360.in','+91 98765 00000','HDFC Bank','XXXX XXXX 4521','HDFC0001234')
on conflict (tenant_id) do nothing;

-- =============================================================================
-- PARTNER DATA (isolated per tenant - finops/master can never read these rows)
-- =============================================================================

-- p001 Mehta & Associates
insert into public.clients (id, tenant_id, name, gstin, email, status, since) values
  ('p001-c1','p001','TechNova Pvt Ltd','27TECHNO123A1Z1','accounts@technova.in','Active','2024-04-01'),
  ('p001-c2','p001','Bright Traders','27BRIGHT456B2Z2','finance@brighttr.in','Active','2024-05-10'),
  ('p001-c3','p001','Horizon Exports','27HORIZO789C3Z3','accounts@horizon.in','Inactive','2024-06-15'),
  ('p001-c4','p001','Metro Constructions','27METROC012D4Z4','billing@metro.in','Active','2024-07-01'),
  ('p002-c1','p002','Sunrise Hotels','36SUNRIS123E1Z1','accounts@sunrise.in','Active','2024-06-01'),
  ('p002-c2','p002','Green Valley Farms','36GREENV456F2Z2','finance@greenvalley.in','Active','2024-07-15'),
  ('p002-c3','p002','Pearl Jewellers','36PEARLS789G3Z3','accounts@pearl.in','Active','2024-08-01'),
  ('p003-c1','p003','Rapid Logistics','06RAPIDL123H1Z1','accounts@rapid.in','Active','2024-09-01'),
  ('p003-c2','p003','Capital Investments','06CAPINV456I2Z2','finance@capital.in','Inactive','2024-10-01')
on conflict (id) do nothing;

insert into public.client_services (tenant_id, client_id, service) values
  ('p001','p001-c1','GST'),('p001','p001-c1','ITR'),('p001','p001-c1','Audit'),
  ('p001','p001-c2','GST'),('p001','p001-c2','TDS'),
  ('p001','p001-c3','ITR'),
  ('p001','p001-c4','GST'),('p001','p001-c4','Payroll'),
  ('p002','p002-c1','GST'),('p002','p002-c1','ITR'),
  ('p002','p002-c2','ITR'),('p002','p002-c2','TDS'),
  ('p002','p002-c3','GST'),('p002','p002-c3','Audit'),
  ('p003','p003-c1','GST'),('p003','p003-c1','ITR'),
  ('p003','p003-c2','ITR')
on conflict do nothing;

insert into public.tickets (id, tenant_id, client_id, client_name, title, status, priority, assignee, due) values
  ('p001-t1','p001','p001-c1','TechNova Pvt Ltd','GSTR-1 Filing May 2025','open','high','Rohan Shah','2025-07-11'),
  ('p001-t2','p001','p001-c2','Bright Traders','TDS Return Q1 FY26','in_progress','medium','Rohan Shah','2025-07-31'),
  ('p001-t3','p001','p001-c4','Metro Constructions','Payroll Processing June 2025','review','urgent','Rohan Shah','2025-07-05'),
  ('p001-t4','p001','p001-c1','TechNova Pvt Ltd','Annual Audit FY2024-25','closed','high','Rohan Shah','2025-06-30'),
  ('p002-t1','p002','p002-c1','Sunrise Hotels','GSTR-3B Filing June 2025','open','urgent','Suresh Kumar','2025-07-20'),
  ('p002-t2','p002','p002-c2','Green Valley Farms','ITR Filing FY2024-25','in_progress','high','Suresh Kumar','2025-07-31'),
  ('p002-t3','p002','p002-c3','Pearl Jewellers','GST Reconciliation May 2025','review','medium','Suresh Kumar','2025-07-14'),
  ('p003-t1','p003','p003-c1','Rapid Logistics','GST Filing June 2025','open','high','Deepak Sharma','2025-07-20'),
  ('p003-t2','p003','p003-c2','Capital Investments','ITR Filing FY2024-25','in_progress','medium','Deepak Sharma','2025-07-31')
on conflict (id) do nothing;

insert into public.associates (id, tenant_id, name, role, email, joined, status, tickets_count) values
  ('p001-a1','p001','Rohan Shah','associate','assoc@mehtaassociates.in','2024-03-20','active',12),
  ('p001-a2','p001','Nisha Kapoor','associate','nisha@mehtaassociates.in','2024-04-01','active',9),
  ('p001-a3','p001','Amit Joshi','associate','amit@mehtaassociates.in','2024-05-15','active',7),
  ('p002-a1','p002','Suresh Kumar','associate','assoc@reddytax.in','2024-06-01','active',8),
  ('p002-a2','p002','Lakshmi Rao','associate','lakshmi@reddytax.in','2024-07-10','active',6),
  ('p003-a1','p003','Rahul Gupta','associate','assoc@sharmaandco.in','2024-09-01','active',4)
on conflict (id) do nothing;

-- Firm settings for partners (so their Settings module has a profile row)
insert into public.firm_settings (tenant_id, name, gstin, email, phone, address) values
  ('p001','Mehta & Associates','27MEHTA5678B2Z1','admin@mehtaassociates.in','+91 98765 11111','Office 12, Nariman Point, Mumbai - 400021'),
  ('p002','Reddy Tax Consultants','36REDDY9012C3Z2','admin@reddytax.in','+91 98765 22222','Plot 88, Jubilee Hills, Hyderabad - 500033'),
  ('p003','Sharma & Co. CAs','06SHARM3456D4Z3','admin@sharmaandco.in','+91 98765 33333','Tower B, DLF Cyber City, Gurugram - 122002')
on conflict (tenant_id) do nothing;
