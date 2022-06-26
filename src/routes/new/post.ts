import { create_post, select_subreddit_where_name, type db_posts, type db_subreddits } from 'src/app'
import type { RequestHandler } from './__types/post'
import { nanoid } from 'nanoid'
import { checksession } from 'src/util'
import Joi from 'joi'
import { joi_validate_sessionTocken, subreddit_name_pattern } from 'src/patterns'

export type post_post_req_data = {
  title: string
  type: number
  content: string
  subredditname: string
  sessionTocken: string
}

const post_schema = Joi.object({
  title: Joi.string().min(1).max(50).required(),
  type: Joi.number().max(0).required(),
  content: Joi.string().min(1).max(2000).required(),
  subredditname: Joi.string().min(4).max(20).regex(subreddit_name_pattern).required(),
  ...joi_validate_sessionTocken
})

export const post: RequestHandler = async ({ request }) => {
  const jsn: post_post_req_data = await request.json()

  const res = post_schema.validate(jsn)
  if (res.error) {
    return {
      status: 400
    }
  }

  const session = checksession(jsn.sessionTocken)
  if (session.status !== 200) {
    return {
      status: session.status
    }
  }

  const subreddit = <db_subreddits>select_subreddit_where_name.get({ name: jsn.subredditname })
  if (subreddit === undefined) {
    return {
      status: 404
    }
  }

  const db_entry: db_posts = {
    ...jsn,
    ups: 0,
    downs: 0,
    uuid: nanoid(8), // collisions are possible though very unlikely
    createdUtc: Date.now(),
    creator: session.user.id as number,
    subreddit: subreddit.id as number
  }
  create_post.run(db_entry)

  return {
    status: 200
  }
}
