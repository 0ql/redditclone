import type { RequestHandler } from './__types/user'
import bcrypt from 'bcrypt'
import { create_user, select_user_where_uname, type db_users } from 'src/app'
import Joi from 'joi'
import pwdcomp from "joi-password-complexity"
import { user_name_pattern } from 'src/patterns'

export type user_post_req_data = {
  name: string
  desc: string
  uname: string
  nacked_pwd: string
}

const user_schema = Joi.object({
  name: Joi.string().min(1).max(30).required(),
  desc: Joi.string().max(400).required(),
  uname: Joi.string().min(4).max(20).regex(user_name_pattern).required(),
  nacked_pwd: pwdcomp({
    min: 8,
    max: 40,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
  }).required()
})

export const post: RequestHandler = async ({ request }) => {
  const jsn: user_post_req_data = await request.json()

  const res = user_schema.validate(jsn)
  if (res.error) {
    return {
      status: 400
    }
  }

  const user = <db_users>select_user_where_uname.get({ uname: jsn.uname })
  if (user !== undefined) {
    return {
      status: 400
    }
  }

  const salt = bcrypt.genSaltSync(5);
  const hash = bcrypt.hashSync(jsn.nacked_pwd, salt);
  const sessionTocken = crypto.randomUUID()

  create_user.run({
    ...jsn,
    pwd: hash,
    joinedUtc: Date.now(),
    sessionTocken,
    sessionCreatedUtc: Date.now()
  })

  return {
    status: 200,
    body: {
      sessionTocken
    }
  }
}
