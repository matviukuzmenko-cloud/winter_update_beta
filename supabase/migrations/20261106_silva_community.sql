create table if not exists public.community_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null check (length(btrim(nickname)) between 3 and 24),
  created_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.community_profiles (user_id) on delete cascade,
  body text not null check (length(btrim(body)) between 1 and 3000),
  image_path text,
  created_at timestamptz not null default now(),
  constraint community_posts_image_owner check (
    image_path is null or image_path like author_id::text || '/%'
  )
);

create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts (id) on delete cascade,
  author_id uuid not null references public.community_profiles (user_id) on delete cascade,
  body text not null check (length(btrim(body)) between 1 and 1000),
  created_at timestamptz not null default now()
);

create table if not exists public.community_votes (
  post_id uuid not null references public.community_posts (id) on delete cascade,
  user_id uuid not null references public.community_profiles (user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.community_posts (id) on delete cascade,
  comment_id uuid references public.community_comments (id) on delete cascade,
  reporter_id uuid not null references public.community_profiles (user_id) on delete cascade,
  reason text not null check (length(btrim(reason)) between 3 and 500),
  created_at timestamptz not null default now(),
  constraint community_reports_one_target check ((post_id is null) <> (comment_id is null))
);

create unique index if not exists community_reports_post_reporter_idx
  on public.community_reports (post_id, reporter_id)
  where post_id is not null;
create unique index if not exists community_reports_comment_reporter_idx
  on public.community_reports (comment_id, reporter_id)
  where comment_id is not null;
create index if not exists community_posts_created_at_idx
  on public.community_posts (created_at desc);
create index if not exists community_comments_post_created_idx
  on public.community_comments (post_id, created_at);
create index if not exists community_votes_post_idx
  on public.community_votes (post_id);

alter table public.community_profiles enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_votes enable row level security;
alter table public.community_reports enable row level security;

drop policy if exists "Community profiles are public" on public.community_profiles;
create policy "Community profiles are public"
  on public.community_profiles for select
  to anon, authenticated
  using (true);

drop policy if exists "Users create their community profile" on public.community_profiles;
create policy "Users create their community profile"
  on public.community_profiles for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users update their community profile" on public.community_profiles;
create policy "Users update their community profile"
  on public.community_profiles for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Community posts are public" on public.community_posts;
create policy "Community posts are public"
  on public.community_posts for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users create their own posts" on public.community_posts;
create policy "Authenticated users create their own posts"
  on public.community_posts for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

drop policy if exists "Authors delete their own posts" on public.community_posts;
create policy "Authors delete their own posts"
  on public.community_posts for delete
  to authenticated
  using ((select auth.uid()) = author_id);

drop policy if exists "Community comments are public" on public.community_comments;
create policy "Community comments are public"
  on public.community_comments for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users create their own comments" on public.community_comments;
create policy "Authenticated users create their own comments"
  on public.community_comments for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

drop policy if exists "Authors delete their own comments" on public.community_comments;
create policy "Authors delete their own comments"
  on public.community_comments for delete
  to authenticated
  using ((select auth.uid()) = author_id);

drop policy if exists "Community likes are public" on public.community_votes;
create policy "Community likes are public"
  on public.community_votes for select
  to anon, authenticated
  using (true);

drop policy if exists "Users like posts as themselves" on public.community_votes;
create policy "Users like posts as themselves"
  on public.community_votes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users remove their own likes" on public.community_votes;
create policy "Users remove their own likes"
  on public.community_votes for delete
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Authenticated users submit reports" on public.community_reports;
create policy "Authenticated users submit reports"
  on public.community_reports for insert
  to authenticated
  with check ((select auth.uid()) = reporter_id);

revoke all on public.community_profiles, public.community_posts,
  public.community_comments, public.community_votes, public.community_reports
  from public, anon, authenticated;
grant select on public.community_profiles, public.community_posts,
  public.community_comments, public.community_votes to anon, authenticated;
grant insert, update on public.community_profiles to authenticated;
grant insert, delete on public.community_posts, public.community_comments,
  public.community_votes to authenticated;
grant insert on public.community_reports to authenticated;
grant all on public.community_profiles, public.community_posts,
  public.community_comments, public.community_votes, public.community_reports
  to service_role;

create or replace function public.community_feed(
  p_sort text default 'new',
  p_limit integer default 30,
  p_offset integer default 0
)
returns table (
  id uuid,
  author_id uuid,
  author_nickname text,
  body text,
  image_path text,
  created_at timestamptz,
  likes_count bigint,
  comments_count bigint,
  liked_by_me boolean
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
begin
  if p_sort not in ('new', 'top') then
    raise exception 'Unsupported community feed sort';
  end if;
  if p_limit is null or p_limit < 1 or p_limit > 50 or
     p_offset is null or p_offset < 0 or p_offset > 10000 then
    raise exception 'Invalid community feed page';
  end if;

  return query
    select
      post.id,
      post.author_id,
      profile.nickname,
      post.body,
      post.image_path,
      post.created_at,
      (select count(*) from public.community_votes vote where vote.post_id = post.id),
      (select count(*) from public.community_comments reply where reply.post_id = post.id),
      exists (
        select 1
          from public.community_votes vote
         where vote.post_id = post.id
           and vote.user_id = (select auth.uid())
      )
    from public.community_posts post
    join public.community_profiles profile on profile.user_id = post.author_id
    order by
      case when p_sort = 'top' then
        (select count(*) from public.community_votes vote where vote.post_id = post.id)
      else 0::bigint end desc,
      post.created_at desc
    limit p_limit
    offset p_offset;
end;
$$;

revoke all on function public.community_feed(text, integer, integer) from public;
grant execute on function public.community_feed(text, integer, integer) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'silva-community',
  'silva-community',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "Community photos are public" on storage.objects;
create policy "Community photos are public"
  on storage.objects for select
  to public
  using (bucket_id = 'silva-community');

drop policy if exists "Users upload their own community photos" on storage.objects;
create policy "Users upload their own community photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'silva-community'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Users delete their own community photos" on storage.objects;
create policy "Users delete their own community photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'silva-community'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
