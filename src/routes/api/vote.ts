import type { RequestHandler } from './__types/vote'
import Joi from "joi";
import { joi_validate_sessionTocken, post_uuid_pattern } from "src/patterns";
import { checksession } from "src/util";
import { create_vote_postuuid } from 'src/app';

export type vote_post_req_data = {
  vote: number // 0 downvote; 1 nothin; 2 upvote
  post_uuid: string
  sessionTocken: string
}

const post_schema = Joi.object({
  vote: Joi.number().min(0).max(2).required(),
  post_uuid: Joi.string().length(8).regex(post_uuid_pattern).required(),
  ...joi_validate_sessionTocken
})

export const post: RequestHandler = async ({ request }) => {
  const jsn: vote_post_req_data = await request.json()

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

  create_vote_postuuid.run({ post_uuid: jsn.post_uuid, vote: jsn.vote })

  return {
    status: 200
  }
}
