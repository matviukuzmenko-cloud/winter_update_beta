alter table public.community_profiles
  add column if not exists avatar_path text;

alter table public.community_profiles
  drop constraint if exists community_profiles_avatar_owner;
alter table public.community_profiles
  add constraint community_profiles_avatar_owner
  check (avatar_path is null or avatar_path like user_id::text || '/%');

alter table public.community_posts
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_community_post_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists community_posts_set_updated_at on public.community_posts;
create trigger community_posts_set_updated_at
  before update on public.community_posts
  for each row execute function public.set_community_post_updated_at();
revoke all on function public.set_community_post_updated_at() from public, anon, authenticated;

drop policy if exists "Authors update their own posts" on public.community_posts;
create policy "Authors update their own posts"
  on public.community_posts for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);

drop policy if exists "Authors update their own comments" on public.community_comments;
create policy "Authors update their own comments"
  on public.community_comments for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);

create table if not exists public.community_saved_posts (
  post_id uuid not null references public.community_posts (id) on delete cascade,
  user_id uuid not null references public.community_profiles (user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table public.community_saved_posts enable row level security;

drop policy if exists "Users read their saved posts" on public.community_saved_posts;
create policy "Users read their saved posts"
  on public.community_saved_posts for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users save posts as themselves" on public.community_saved_posts;
create policy "Users save posts as themselves"
  on public.community_saved_posts for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users remove their saved posts" on public.community_saved_posts;
create policy "Users remove their saved posts"
  on public.community_saved_posts for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.community_saved_posts from public, anon, authenticated;
grant select, insert, delete on public.community_saved_posts to authenticated;
grant select on public.community_saved_posts to anon;
grant update on public.community_posts, public.community_comments to authenticated;

drop function if exists public.community_feed(text, integer, integer);
create function public.community_feed(
  p_sort text default 'new',
  p_limit integer default 30,
  p_offset integer default 0
)
returns table (
  id uuid,
  author_id uuid,
  author_nickname text,
  author_avatar_path text,
  body text,
  image_path text,
  created_at timestamptz,
  updated_at timestamptz,
  likes_count bigint,
  comments_count bigint,
  liked_by_me boolean,
  saved_by_me boolean
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
begin
  if p_sort is null or p_sort not in ('new', 'top', 'saved', 'mine') then
    raise exception 'Unsupported community feed sort';
  end if;
  if p_limit is null or p_limit < 1 or p_limit > 50 or
     p_offset is null or p_offset < 0 or p_offset > 10000 then
    raise exception 'Invalid community feed page';
  end if;

  if p_sort in ('saved', 'mine') and (select auth.uid()) is null then
    raise exception 'Authentication required for this feed';
  end if;

  return query
    select
      post.id,
      post.author_id,
      profile.nickname,
      profile.avatar_path,
      post.body,
      post.image_path,
      post.created_at,
      post.updated_at,
      (select count(*) from public.community_votes vote where vote.post_id = post.id),
      (select count(*) from public.community_comments reply where reply.post_id = post.id),
      exists (
        select 1
          from public.community_votes vote
         where vote.post_id = post.id
           and vote.user_id = (select auth.uid())
      ),
      exists (
        select 1
          from public.community_saved_posts saved
         where saved.post_id = post.id
           and saved.user_id = (select auth.uid())
      )
    from public.community_posts post
    join public.community_profiles profile on profile.user_id = post.author_id
    where (p_sort <> 'saved' or exists (
         select 1
           from public.community_saved_posts saved
          where saved.post_id = post.id
            and saved.user_id = (select auth.uid())
       ))
      and (p_sort <> 'mine' or post.author_id = (select auth.uid()))
    order by
      case when p_sort = 'top' then
        (select count(*) from public.community_votes vote where vote.post_id = post.id)
      else 0::bigint end desc,
      case when p_sort = 'top' then
        (select count(*) from public.community_comments reply where reply.post_id = post.id)
      else 0::bigint end desc,
      post.created_at desc
    limit p_limit
    offset p_offset;
end;
$$;

revoke all on function public.community_feed(text, integer, integer) from public;
grant execute on function public.community_feed(text, integer, integer) to anon, authenticated;
