import type { RequestHandler } from './__types/login'
import bcrypt from 'bcrypt'
import { select_user_where_uname, type db_users } from 'src/app'
import Joi from 'joi'
import { user_name_pattern } from 'src/patterns'
import pwdcomp from "joi-password-complexity"

export type login_post_req_data = {
  uname: string
  nacked_pwd: string
}

const login_schema = Joi.object({
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
  const jsn: login_post_req_data = await request.json()

  const res = login_schema.validate(jsn)
  if (res.error) {
    return {
      status: 400
    }
  }

  const user = <db_users>select_user_where_uname.get({ uname: jsn.uname })
  if (user === undefined) {
    return {
      status: 404
    }
  }

  if (!bcrypt.compareSync(jsn.nacked_pwd, user.pwd)) {
    return {
      status: 400
    }
  }

  user.sessionTocken = crypto.randomUUID()
  user.sessionCreatedUtc = Date.now()

  return {
    status: 200,
    body: {
      sessionTocken: user.sessionTocken
    }
  }
}
