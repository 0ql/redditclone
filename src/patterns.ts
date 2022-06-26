import Joi from "joi"

export const user_name_pattern = /^[a-zA-Z0-9_-]*$/
export const subreddit_name_pattern = /^[a-zA-Z0-9_-]*$/
export const post_name_pattern = /^[a-zA-Z0-9_-]*$/
export const post_uuid_pattern = /^[a-zA-Z0-9_-]*$/
export const session_tocken_pattern = /^[abcdef0-9-]*$/

export const joi_validate_sessionTocken = {
  sessionTocken: Joi.string().length(36).regex(session_tocken_pattern).required()
}
