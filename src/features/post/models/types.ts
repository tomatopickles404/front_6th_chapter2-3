export interface PostsParams {
  skip: number
  limit: number
  search: string
  sortBy: string
  sortOrder: string
  tag: string
  [key: string]: string | number | boolean
}

export interface PostResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}
