import { api, httpClient } from "shared/utils/http"
import { PostsParams } from "../models"
import { POST_API_PATH } from "entities/post"

const getEndpoint = (search: string | undefined, tag: string | undefined) => {
  if (search) return POST_API_PATH.search
  if (tag && tag !== "all") return POST_API_PATH.tag
  return POST_API_PATH.posts
}

const getQueryParams = (search: string | undefined, restParams: Partial<PostsParams>) => {
  if (search) return { ...restParams, q: search }
  return restParams
}

export const fetchPosts = async (params: Partial<PostsParams> = {}) => {
  const { search, tag, ...restParams } = params

  // 쿼리 파라미터 구성

  const endpoint = getEndpoint(search, tag)
  const queryParams = getQueryParams(search, restParams)
  const query = httpClient.buildQuery(queryParams)

  return api.get(`${endpoint}?${query}`)
}

// 게시물 CRUD
export const createPost = async (post: { title: string; body: string; userId: number }) => {
  return api.post(POST_API_PATH.posts, post)
}

export const updatePost = async (id: number, post: { title: string; body: string }) => {
  return api.put(POST_API_PATH.id(id), post)
}

export const deletePost = async (id: number) => {
  return api.delete(POST_API_PATH.id(id))
}
