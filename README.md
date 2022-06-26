# Reddit Clone

The purpose of this project was to create a RESTful API and routing only with SvelteKit.

## Stack

- SvelteKit
- Typescript
 - `Joi` for input validation
 - `joi-password-complexity` for good passwords
 - `Bcrypt` password salting and hashing
 - `nanoid` uuid gen
- Unocss
- Sqlite3
 - `better-sqlite3` orm

## Features

- [x] full SSR
- [x] Routing
  - [x] /new/user
  - [x] /new/post
  - [x] /new/subreddit
  - [x] /login
  - [x] /r/[subreddit]/[filter / uuid]
   - [x] filter = new
   - [ ] filter = hot
   - [ ] filter = best
   - [ ] filter = top
  - [x] /u/[uuid]
  - [x] /vote
- [x] Up / Downvoting
- [x] Input validation
