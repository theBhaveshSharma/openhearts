-- OpenHearts schema for Supabase
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run

-- Anonymous auth must be enabled:
-- Authentication → Providers → Anonymous → Enable

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  anonymous_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles (id) on delete set null,
  author_name text not null,
  content text not null check (char_length(content) > 0 and char_length(content) <= 2000),
  mood text not null check (
    mood in (
      'anxious',
      'sad',
      'lonely',
      'overwhelmed',
      'grateful',
      'hopeful',
      'angry',
      'confused'
    )
  ),
  heart_count integer not null default 0 check (heart_count >= 0),
  hug_count integer not null default 0 check (hug_count >= 0),
  strength_count integer not null default 0 check (strength_count >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  author_name text not null,
  content text not null check (char_length(content) > 0 and char_length(content) <= 500),
  created_at timestamptz not null default now()
);

create table if not exists public.support_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null check (type in ('heart', 'hug', 'strength')),
  created_at timestamptz not null default now(),
  unique (post_id, user_id, type)
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists comments_post_id_idx on public.comments (post_id, created_at);
create index if not exists support_reactions_post_id_idx on public.support_reactions (post_id);

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.support_reactions enable row level security;

drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Posts are publicly readable" on public.posts;
create policy "Posts are publicly readable"
  on public.posts for select
  using (true);

drop policy if exists "Authenticated users can create posts" on public.posts;
create policy "Authenticated users can create posts"
  on public.posts for insert
  with check (auth.uid() = author_id);

drop policy if exists "Comments are publicly readable" on public.comments;
create policy "Comments are publicly readable"
  on public.comments for select
  using (true);

drop policy if exists "Authenticated users can create comments" on public.comments;
create policy "Authenticated users can create comments"
  on public.comments for insert
  with check (auth.uid() = author_id);

drop policy if exists "Support reactions are publicly readable" on public.support_reactions;
create policy "Support reactions are publicly readable"
  on public.support_reactions for select
  using (true);

drop policy if exists "Authenticated users can give support" on public.support_reactions;
create policy "Authenticated users can give support"
  on public.support_reactions for insert
  with check (auth.uid() = user_id);

create or replace function public.handle_support_reaction()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.type = 'heart' then
    update public.posts set heart_count = heart_count + 1 where id = new.post_id;
  elsif new.type = 'hug' then
    update public.posts set hug_count = hug_count + 1 where id = new.post_id;
  elsif new.type = 'strength' then
    update public.posts set strength_count = strength_count + 1 where id = new.post_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_support_reaction on public.support_reactions;
create trigger on_support_reaction
  after insert on public.support_reactions
  for each row execute function public.handle_support_reaction();

-- Seed community posts (shared globally)
insert into public.posts (author_name, content, mood, heart_count, hug_count, strength_count, created_at)
select * from (
  values
    (
      'QuietRiver742',
      'Had a really rough day at work. Felt invisible in every meeting. Just needed to say that out loud to someone who might understand.',
      'lonely',
      12, 8, 5,
      now() - interval '45 minutes'
    ),
    (
      'BraveHeart391',
      'Small win today: I actually got out of bed, made coffee, and went for a 10-minute walk. It doesn''t sound like much but it felt huge.',
      'hopeful',
      24, 6, 18,
      now() - interval '2 hours'
    ),
    (
      'GentleSpirit558',
      'Does anyone else feel like they''re pretending to be okay all the time? I''m exhausted from holding it together.',
      'overwhelmed',
      31, 22, 14,
      now() - interval '3 hours'
    ),
    (
      'WarmBreeze204',
      'Grateful for this space. Reading other people''s stories makes me feel less alone. Thank you all for being here.',
      'grateful',
      19, 11, 7,
      now() - interval '5 hours'
    )
) as seed(author_name, content, mood, heart_count, hug_count, strength_count, created_at)
where not exists (select 1 from public.posts limit 1);
