import Joi from 'joi'
import { create_subreddit, select_subreddit_where_name } from 'src/app'
import { joi_validate_sessionTocken, subreddit_name_pattern } from 'src/patterns'
import { checksession } from 'src/util'
import type { RequestHandler } from './__types/subreddit'

export type subreddit_post_req_data = {
  name: string
  desc: string
  sessionTocken: string
}

const subreddit_schema = Joi.object({
  name: Joi.string().min(4).max(20).regex(subreddit_name_pattern).required(),
  desc: Joi.string().max(400).required(),
  ...joi_validate_sessionTocken
})

export const post: RequestHandler = async ({ request }) => {
  const jsn: subreddit_post_req_data = await request.json()

  const res = subreddit_schema.validate(jsn)
  if (res.error) {
    console.log(res.error)
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

  const subreddit = select_subreddit_where_name.get({ name: jsn.name })
  if (subreddit !== undefined) {
    return {
      status: 400
    }
  }

  create_subreddit.run({
    ...jsn,
    creator: session.user.id as number,
    owner: session.user.id as number
  })

  return {
    status: 200
  }
}
