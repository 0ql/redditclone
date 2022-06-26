import type { RequestHandler } from "./__types/index"

export const get: RequestHandler = async ({ params }) => {
  return {
    status: 303,
    headers: {
      location: `${params.subreddit}/new`
    }
  }
}
