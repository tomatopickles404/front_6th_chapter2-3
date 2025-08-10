export interface PostsParams {
  skip: number
  limit: number
  search: string
  sortBy: string
  sortOrder: string
  tag: string
  [key: string]: string | number | boolean
}
