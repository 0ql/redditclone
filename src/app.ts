import Database from 'better-sqlite3';

export const db = new Database('database.db');

const create_users = db.prepare(`create table if not exists users
(id integer primary key,
name text,
uname text,
desc text,
pwd text,
sessionTocken text,
sessionCreatedUtc integer,
joinedUtc integer,
UNIQUE(uname))`)

export type db_users = {
  id?: number
  name: string
  uname: string
  desc: string
  pwd: string
  sessionTocken: string
  sessionCreatedUtc: number
  joinedUtc: number
}

const create_subreddits = db.prepare(`create table if not exists subreddits
(id integer primary key,
name text,
desc text,
creator integer,
owner integer,
foreign key(creator) references users(id),
foreign key(owner) references users(id),
UNIQUE(name));`)

export type db_subreddits = {
  id?: number
  name: string
  desc: string
  creator: number
  owner: number
}

const create_posts = db.prepare(`create table if not exists posts 
(id integer primary key,
uuid text,
title text,
type integer,
createdUtc integer,
content text,
ups integer,
downs integer,
creator integer,
subreddit integer,
UNIQUE(uuid),
foreign key(creator) references users(id),
foreign key(subreddit) references subreddits(id))`)

export type db_posts = {
  id?: number
  uuid: string
  title: string
  type: number
  createdUtc: number
  content: string
  ups: number
  downs: number
  creator: number
  subreddit: number
}

const create_votes = db.prepare(`create table if not exists votes
(id integer primary key,
vote integer,
postid integer,
voterid integer,
foreign key(postid) references posts(id)
foreign key(voterid) references users(id)
CONSTRAINT unq UNIQUE (postid, voterid))`)

export type db_votes = {
  id?: number,
  postid: number,
  voterid: number
}

create_users.run()
create_subreddits.run()
create_posts.run()
create_votes.run()

export const create_post = db.prepare<db_posts>(`
insert into posts
(uuid, title, type, createdUtc, content, creator, subreddit)
values
(@uuid, @title, @type, @createdUtc, @content, @creator, @subreddit)`)
export const create_subreddit = db.prepare<db_subreddits>(`
insert into subreddits
(name, desc, creator, owner)
values (@name, @desc, @creator, @owner)`)
export const create_user = db.prepare<db_users>(`
insert into users
(name, uname, desc, pwd, sessionTocken, sessionCreatedUtc, joinedUtc)
values
(@name, @uname, @desc, @pwd, @sessionTocken, @sessionCreatedUtc, @joinedUtc)`)
export const create_vote_postuuid = db.prepare<{ post_uuid: string, vote: number }>(`
insert or replace into votes
(vote, postid, voterid)
select @vote, posts.id, users.id
from posts join users
on posts.uuid = @post_uuid
and posts.creator = users.id`)

export const select_user_where_sessiontocken = db.prepare<{ sessionTocken: string }>(`select * from users where sessionTocken = @sessionTocken`)
export const select_subreddit_where_name = db.prepare<{ name: string }>(`select * from subreddits where name = @name`)
export const select_user_where_uname = db.prepare<{ uname: string }>(`select * from users where uname = @uname`)
export const select_post_where_uuid = db.prepare<{ uuid: string }>(`select * from posts where uuid = @uuid`)
export const query_new_posts = db.prepare<{ subreddit: string, afterid: number, limit: number }>(`
select * from posts
join subreddits
on subreddits.name = @subreddit
and posts.subreddit = subreddits.id
and posts.id < @afterid
order by createdutc desc
limit @limit
`)
export const count_upvotes_postid = db.prepare<{ postid: number }>(`select count(*) from votes where postid = @postid and vote = 2`)
export const count_downvotes_postid = db.prepare<{ postid: number }>(`select count(*) from votes where postid = @postid and vote = 0`)

const update_votes = db.prepare<{ ups: number, downs: number, postid: number }>(`update posts set ups = @ups, downs = @downs where id = @postid`)
const select_postids = db.prepare(`select id from posts`)
setInterval(() => {
  const posts: { id: number }[] = select_postids.all()

  for (let postid of posts) {
    const upvotes: { 'count(*)': number } = count_upvotes_postid.get({ postid: postid.id })
    const downvotes: { 'count(*)': number } = count_downvotes_postid.get({ postid: postid.id })
    update_votes.run({ ups: upvotes['count(*)'], downs: downvotes['count(*)'], postid: postid.id })
  }
}, 1000)
