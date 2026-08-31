create table if not exists competition_settings (
  id text primary key,
  timer_minutes integer not null default 45,
  malpractice_policy text not null default 'terminate_after',
  malpractice_limit integer not null default 3,
  status text not null default 'open',
  questions_locked boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists questions (
  id text primary key,
  title text not null,
  language text not null,
  description text not null,
  buggy_code text not null,
  correct_code text not null,
  sort_order integer not null default 0,
  selected_slot integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists question_errors (
  id text primary key,
  question_id text not null references questions(id) on delete cascade,
  error_type text not null,
  description text not null,
  location text not null default '',
  expected_correction text not null default '',
  marks integer not null default 1,
  validation_rule text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create table if not exists test_cases (
  id text primary key,
  question_id text not null references questions(id) on delete cascade,
  visibility text not null default 'visible',
  stdin text not null default '',
  expected_stdout text not null default '',
  sort_order integer not null default 0
);

create table if not exists participants (
  id text primary key,
  full_name text not null,
  department text not null,
  year text not null,
  email text not null,
  phone text not null,
  college text not null,
  access_code_used text not null,
  status text not null default 'registered',
  started_at timestamptz,
  completed_at timestamptz,
  total_marks integer not null default 0,
  duration_ms integer,
  malpractice_count integer not null default 0,
  current_question integer not null default 1,
  created_at timestamptz not null default now()
);

create unique index if not exists participants_email_idx on participants (lower(email));

create table if not exists sessions (
  id text primary key,
  token_hash text not null unique,
  role text not null,
  participant_id text references participants(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists sessions_token_hash_idx on sessions (token_hash);

create table if not exists exam_answers (
  participant_id text not null references participants(id) on delete cascade,
  question_id text not null references questions(id) on delete cascade,
  current_code text not null,
  best_marks integer not null default 0,
  best_fixed text not null default '[]',
  status text not null default 'not_attempted',
  last_submitted_at timestamptz,
  last_compile text,
  last_runtime text,
  last_tests text,
  primary key (participant_id, question_id)
);

create table if not exists submissions (
  id text primary key,
  participant_id text not null references participants(id) on delete cascade,
  question_id text not null references questions(id) on delete cascade,
  submitted_code text not null,
  submitted_at timestamptz not null default now(),
  fixed_errors text not null default '[]',
  unfixed_errors text not null default '[]',
  marks_awarded integer not null default 0,
  compile_ok boolean,
  compile_output text,
  runtime_output text,
  test_results text not null default '[]'
);

create index if not exists submissions_participant_idx on submissions (participant_id, question_id, submitted_at desc);

create table if not exists malpractice_logs (
  id text primary key,
  participant_id text not null references participants(id) on delete cascade,
  violation_type text not null,
  occurred_at timestamptz not null default now(),
  question_slot integer,
  violation_count integer not null
);

create index if not exists malpractice_participant_idx on malpractice_logs (participant_id, occurred_at desc);

-- Spec mapping: profiles ≈ participants (id, full_name, department, year, email, phone,
-- college, access_code_used, started_at, completed_at, total_marks, duration_ms, status,
-- malpractice_count). Question error rules live in question_errors (errors_json equivalent).
create or replace view profiles as
select
  id,
  full_name,
  department,
  year,
  email,
  phone,
  college,
  access_code_used as access_code,
  started_at as start_time,
  completed_at as end_time,
  total_marks::float as total_score,
  case when duration_ms is null then null else (duration_ms / 1000)::int end as elapsed_seconds,
  upper(status) as status,
  malpractice_count as violation_count
from participants;

