import Joi from "joi"
import { select_user_where_uname } from "src/app"
import { user_name_pattern } from "src/patterns"
import type { RequestHandler } from "./__types/index"

const user_schema = Joi.object({
  username: Joi.string().min(3).max(20).regex(user_name_pattern).required()
})

export const get: RequestHandler = async ({ params }) => {

  const res = user_schema.validate(params)
  if (res.error) {
    return {
      status: 400
    }
  }

  const user = select_user_where_uname.get({ uname: params.username })
  if (user === undefined) {
    return {
      status: 404
    }
  }

  return {
    body: { user }
  }
}
