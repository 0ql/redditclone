import { query_new_posts, select_post_where_uuid, select_subreddit_where_name, type db_posts, type db_subreddits } from "src/app"
import type { RequestHandler } from "./__types/index"
import Joi from "joi"
import { post_uuid_pattern, subreddit_name_pattern } from "src/patterns"

export type get_subreddit_data = {
  name: string,
  desc: string
}

export type get_query_posts = {
  uuid: string,
  title: string,
  type: number,
  createdUtc: number,
  content: string,
  ups: number
  downs: number
  creator: number,
  subreddit: number,
}

type data = {
  postonly: boolean
  post?: get_query_posts
  get_subreddit_data?: get_subreddit_data
  get_query_posts?: get_query_posts[]
}

const params_schema = Joi.object({
  subreddit: Joi.string().min(4).max(20).regex(subreddit_name_pattern).required(),
  filter: Joi.string().length(8).allow("new").regex(post_uuid_pattern).required()
})

export const get: RequestHandler = async ({ params, url }) => {

  const res = params_schema.validate(params)
  if (res.error) {
    return {
      status: 400
    }
  }

  if (params.filter === "new") {
    const subreddit = <db_subreddits>select_subreddit_where_name.get({ name: params.subreddit })
    if (subreddit === undefined) {
      return {
        status: 404
      }
    }
    const query = {
      subreddit: params.subreddit,
      afterid: Infinity,
      limit: 10
    }

    const afteruuid: string | null = url.searchParams.get("after")
    if (afteruuid) {
      const post = <db_posts>select_post_where_uuid.get({ uuid: afteruuid })
      if (post === undefined) {
        return {
          status: 404
        }
      }
      query.afterid = post.id as number
    }

    const posts: db_posts[] = query_new_posts.all(query)
    for (let i = 0; i < posts.length; i++) {
      delete posts[i].id
    }

    const body: data = {
      postonly: false,
      get_subreddit_data: {
        name: subreddit.name,
        desc: subreddit.desc
      },
      get_query_posts: posts
    }
    return {
      body
    }
  }

  const post = <db_posts>select_post_where_uuid.get({ uuid: params.filter })
  if (post === undefined) {
    return {
      status: 404
    }
  }

  const body: data = {
    postonly: true,
    post: post // filter important data
  }

  return {
    body
  }
}
