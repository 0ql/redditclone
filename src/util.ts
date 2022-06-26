import { select_user_where_sessiontocken, type db_users } from "./app"

export const checksession = (sessionTocken: string): { status: number, user: db_users } => {
  const user = <db_users>select_user_where_sessiontocken.get({ sessionTocken: sessionTocken })
  if (user === undefined) {
    return { status: 400, user }
  }

  if (user.sessionCreatedUtc + 1000 * 60 * 60 * 24 * 7 < Date.now()) {
    return { status: 401, user }
  }

  return { status: 200, user }
}
