
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Students & Admins)
create table profiles (
  id text primary key, -- Text to allow 's1', 'admin_main' format from migration
  email text unique not null,
  name text not null,
  avatar text,
  role text default 'student',
  points integer default 0,
  rank integer default 0,
  joined_date timestamp with time zone default timezone('utc'::text, now())
);

-- 2. COURSES
create table courses (
  id text primary key,
  title text not null,
  category text not null,
  duration_hours integer,
  mastery_points integer,
  description text,
  instructor text,
  thumbnail text,
  level text,
  video_url text,
  resources jsonb default '[]',
  learning_points jsonb default '[]',
  prerequisites jsonb default '[]',
  curriculum jsonb default '[]',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. ENROLLMENTS
create table enrollments (
  id uuid default uuid_generate_v4() primary key,
  student_id text references profiles(id) on delete cascade,
  course_id text references courses(id) on delete cascade,
  progress integer default 0,
  planned_hours integer default 5,
  start_date text,
  target_date text,
  xp_earned integer default 0,
  unique(student_id, course_id)
);

-- 4. PROJECTS
create table projects (
  id text primary key,
  title text not null,
  description text,
  category text,
  tags text[],
  thumbnail text,
  author_id text references profiles(id) on delete cascade,
  author_name text,
  author_avatar text,
  likes integer default 0,
  status text check (status in ('Idea', 'Prototype', 'Launched')),
  github_url text,
  demo_url text,
  blog_url text,
  docs_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. SOCIAL POSTS
create table social_posts (
  id text primary key,
  source text,
  source_url text,
  author_avatar text,
  content text,
  image text,
  likes integer default 0,
  comments integer default 0,
  shares integer default 0,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. LABS
create table labs (
  id text primary key,
  name text not null,
  type text,
  description text,
  icon text,
  capacity integer,
  location text,
  consumables jsonb default '[]'
);

-- 7. ASSETS
create table assets (
  id text primary key,
  lab_id text references labs(id) on delete cascade,
  name text not null,
  model text,
  sub_category text,
  status text default 'Available',
  certification_required text,
  image text,
  specs text[]
);

-- 8. BOOKINGS
create table bookings (
  id text primary key,
  asset_id text references assets(id) on delete cascade,
  student_id text references profiles(id) on delete cascade,
  date text,
  start_time text,
  duration_hours integer,
  purpose text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 9. DIGITAL ASSETS
create table digital_assets (
  id text primary key,
  lab_id text references labs(id) on delete cascade,
  title text,
  type text,
  description text,
  url text,
  author_name text,
  downloads integer default 0,
  size text
);

-- DATA SEEDING (Optional: Adds the Admin user)
insert into profiles (id, email, name, role, points, avatar)
values 
('admin_main', 'frehun.demissie@gmail.com', 'Frehun Demissie', 'admin', 0, 'https://ui-avatars.com/api/?name=Frehun+Demissie&background=0D8ABC&color=fff');

-- POLICIES (Simple Public Access for transition phase)
-- In production, you would enable RLS and strictly limit access.
alter table profiles enable row level security;
create policy "Public profiles" on profiles for all using (true);

alter table courses enable row level security;
create policy "Public courses" on courses for all using (true);

alter table enrollments enable row level security;
create policy "Public enrollments" on enrollments for all using (true);

alter table projects enable row level security;
create policy "Public projects" on projects for all using (true);

alter table social_posts enable row level security;
create policy "Public posts" on social_posts for all using (true);

alter table labs enable row level security;
create policy "Public labs" on labs for all using (true);

alter table assets enable row level security;
create policy "Public assets" on assets for all using (true);

alter table bookings enable row level security;
create policy "Public bookings" on bookings for all using (true);

alter table digital_assets enable row level security;
create policy "Public digital assets" on digital_assets for all using (true);
